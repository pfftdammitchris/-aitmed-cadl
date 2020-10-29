import _ from 'lodash'
import axios from 'axios'
import YAML from 'yaml'
import { EventEmitter } from 'events'
import produce, { setAutoFreeze } from 'immer'
setAutoFreeze(false)

import store from '../common/store'
import {
  UnableToParseYAML,
  UnableToRetrieveYAML,
  UnableToExecuteFn,
  UnableToLoadConfig,
} from './errors'
import { CADL_OBJECT, CADLARGS } from './types'
import {
  populateObject,
  populateString,
  attachFns,
  populateKeys,
  populateVals,
  replaceUint8ArrayWithBase64,
  replaceEvalObject,
} from './utils'
import { isObject, asyncForEach, mergeDeep } from '../utils'
import builtInFns from './services/builtIn'
// import SignIn from './__mocks__/SignIn'
// import SignUp from './__mocks__/SignUp'
// import MeetingLobby from './__mocks__/MeetingLobby'
// import EditProfile from './__mocks__/EditProfile'
import UploadDocuments from './__mocks__/UploadDocuments'

export default class CADL extends EventEmitter {
  private _cadlVersion: 'test' | 'stable'
  private _cadlEndpoint: CADL_OBJECT
  private _cadlBaseUrl: string | undefined
  private _baseUrl: string
  private _myBaseUrl: string
  private _assetsUrl: string
  private _root: Record<string, any> = this.initRoot({})
  private _initCallQueue: any[]
  private _designSuffix: Record<string, any>
  private _aspectRatio: number
  public verificationRequest = {
    timer: 0,
    phoneNumber: '',
  }

  /**
   *
   * @param CADLARGS
   * @param CADLARGS.configUrl
   * @param CADLARGS.cadlVersion 'test' | 'stable'
   */
  constructor({ configUrl, cadlVersion, aspectRatio }: CADLARGS) {
    super()
    //replace default arguments
    store.env = cadlVersion
    store.configUrl = configUrl
    store.noodlInstance = this
    this.cadlVersion = cadlVersion
    if (aspectRatio) {
      this.aspectRatio = aspectRatio
    }
  }

  /**
   * @param InitArgs
   * @param InitArgs.BaseDataModel
   * @param InitArgs.BaseCSS
   * @param InitArgs.BasePage
   * @throws {UnableToRetrieveYAML} -if unable to retrieve noodlYAML
   * @throws {UnableToParseYAML} -if unable to parse yaml file
   * @throws {UnableToLoadConfig} -if unable to load config data
   *
   * -loads config if not already loaded
   * -sets CADL version, baseUrl, assetsUrl, and root
   */
  public async init({
    BaseDataModel,
    BaseCSS,
    BasePage,
  }: {
    BaseDataModel?: Record<string, any>
    BaseCSS?: Record<string, any>
    BasePage?: Record<string, any>
  } = {}): Promise<void> {
    //load config
    let config: any
    try {
      config = await store.level2SDK.loadConfigData()
    } catch (error) {
      throw new UnableToLoadConfig(
        'An error occured while trying to load the config',
        error
      )
    }

    const {
      web = { cadlVersion: '' },
      cadlBaseUrl = '',
      cadlMain = '',
      designSuffix = '',
      myBaseUrl = '',
    } = config
    //set cadlVersion
    this.cadlVersion = web.cadlVersion[this.cadlVersion]
    this.designSuffix = designSuffix
    this.cadlBaseUrl = cadlBaseUrl

    //set myBaseUrl
    this.myBaseUrl = myBaseUrl

    //set cadlEndpoint
    let cadlEndpointUrl = `${this.cadlBaseUrl}${cadlMain}`
    let cadlEndpoint = await this.defaultObject(cadlEndpointUrl)

    this.cadlEndpoint = cadlEndpoint

    const { baseUrl, assetsUrl, preload } = this.cadlEndpoint

    //set baseUrl and assets Url
    this.baseUrl = baseUrl
    this.assetsUrl = assetsUrl

    //set overrides of Base Objects
    if (BaseDataModel) {
      const processedBaseDataModel = this.processPopulate({
        source: BaseDataModel,
        lookFor: ['.', '..', '=', '~'],
      })
      this.newDispatch({
        type: 'SET_ROOT_PROPERTIES',
        payload: {
          properties: processedBaseDataModel,
        },
      })
    }
    if (BaseCSS) {
      const processedBaseCSS = this.processPopulate({
        source: BaseCSS,
        lookFor: ['.', '..', '=', '~'],
      })
      this.newDispatch({
        type: 'SET_ROOT_PROPERTIES',
        payload: { properties: processedBaseCSS },
      })
    }
    if (BasePage) {
      const processedBasePage = this.processPopulate({
        source: BasePage,
        lookFor: ['.', '..', '=', '~'],
      })
      this.newDispatch({
        type: 'SET_ROOT_PROPERTIES',
        payload: { properties: processedBasePage },
      })
    }

    if (preload && preload.length) {
      for (let pageName of preload) {
        switch (pageName) {
          case 'BaseDataModel': {
            if (BaseDataModel) break
            const rawBaseDataModel = await this.getPage('BaseDataModel')
            const processedBaseDataModel = this.processPopulate({
              source: rawBaseDataModel,
              lookFor: ['.', '..', '=', '~'],
            })
            this.newDispatch({
              type: 'SET_ROOT_PROPERTIES',
              payload: {
                properties: processedBaseDataModel,
              },
            })
            break
          }
          case 'BaseCSS': {
            if (BaseCSS) break
            const rawBaseCSS = await this.getPage('BaseCSS')
            const processedBaseCSS = this.processPopulate({
              source: rawBaseCSS,
              lookFor: ['.', '..', '=', '~'],
            })
            this.newDispatch({
              type: 'SET_ROOT_PROPERTIES',
              payload: { properties: processedBaseCSS },
            })
            break
          }
          case 'BasePage': {
            if (BasePage) break
            const rawBasePage = await this.getPage('BasePage')
            const processedBasePage = this.processPopulate({
              source: rawBasePage,
              lookFor: ['.', '..', '=', '~'],
            })
            this.newDispatch({
              type: 'SET_ROOT_PROPERTIES',
              payload: { properties: processedBasePage },
            })
            break
          }
          default: {
            const rawPage = await this.getPage(pageName)
            const processedRawPage = this.processPopulate({
              source: rawPage,
              lookFor: ['.', '..', '=', '~'],
            })
            this.newDispatch({
              type: 'SET_ROOT_PROPERTIES',
              payload: { properties: processedRawPage },
            })
            break
          }
        }
      }
    }

    let localStorageGlobal = localStorage.getItem('Global')
    let localStorageGlobalParsed: Record<string, any> | null = null
    if (localStorageGlobal) {
      try {
        localStorageGlobalParsed = JSON.parse(localStorageGlobal)
      } catch (error) {
        console.log(error)
      }
      if (localStorageGlobalParsed) {
        this.newDispatch({
          type: 'SET_ROOT_PROPERTIES',
          payload: {
            properties: {
              Global: localStorageGlobalParsed,
            },
          },
        })
        await this.dispatch({
          type: 'update-data',
          //TODO: handle case for data is an array or an object
          payload: {
            pageName: 'builtIn',
            dataKey: 'builtIn.UserVertex',
            data: localStorageGlobalParsed.currentUser.vertex,
          },
        })
      }
    }
    this.emit('stateChanged', {
      name: 'update',
      path: '.',
      prevVal: {},
      newVal: this.root,
    })
  }

  /**
   *
   * @param pageName
   * @param skip Denotes the keys to skip in the population process
   * @param options Object that takes in set of options for the page
   *
   * @throws {UnableToRetrieveYAML} -When unable to retrieve noodlYAML
   * @throws {UnableToParseYAML} -When unable to parse yaml file
   * @throws {UnableToExecuteFn} -When something goes wrong while executing any init function
   *
   * - initiates cadlObject for page specified
   */
  //TODO: extract init functionality to use only runInit()
  async initPage(
    pageName: string,
    skip: string[] = [],
    options: { evolve?: boolean; builtIn?: Record<string, any> } = {}
  ): Promise<void> {
    if (!this.cadlEndpoint) await this.init()
    if (options.evolve === undefined) {
      options.evolve = true
    }
    if (options.evolve === false) return

    const { builtIn } = options
    if (builtIn && isObject(builtIn)) {
      this.newDispatch({
        type: 'ADD_BUILTIN_FNS',
        payload: { builtInFns: { ...builtIn } },
      })
    }
    let pageCADL = await this.getPage(pageName)
    let prevVal = {}
    //FOR FORMDATA
    //process formData
    if (this.root[pageName] && options.evolve) {
      this.newDispatch({
        type: 'DELETE_PAGE',
        payload: { pageName },
      })
    }
    const processedFormData = this.processPopulate({
      source: pageCADL,
      lookFor: ['.', '..', '~'],
      skip: ['update', 'save', 'check', 'init', 'components', ...skip],
      withFns: true,
      pageName,
    })

    //FOR FNS
    const processedWithFns = this.processPopulate({
      source: processedFormData,
      lookFor: ['.', '..', '_', '~'],
      skip: [
        'update',
        // 'save',
        'check',
        'init',
        'formData',
        'components',
        ...skip,
      ],
      withFns: true,
      pageName,
    })

    //replace updateObj with Fn
    const boundDispatch = this.dispatch.bind(this)

    let processedPage = processedWithFns
    this.newDispatch({
      type: 'SET_ROOT_PROPERTIES',
      payload: { properties: processedPage },
    })

    //run init commands if any
    let init = Object.values(processedPage)[0].init
    if (init) {
      await this.runInit(processedPage).then((page) => {
        //FOR COMPONENTS
        //process components
        const processedComponents = this.processPopulate({
          source: page,
          lookFor: ['.', '..', '_', '~'],
          skip: [
            'update',
            'check',
            'init',
            // 'listObject',
            'formData',
            'dataIn',
            ...skip,
          ],
          withFns: true,
          pageName,
        })
        //process components again to fill in new values
        const processedComponentsAgain = this.processPopulate({
          source: processedComponents,
          lookFor: ['.', '..', '_', '~', '='],
          skip: [
            'update',
            'check',
            'edge',
            'document',
            'vertex',
            'init',
            'formData',
            'dataIn',
            ...skip,
          ],
          withFns: true,
          pageName,
        })
        let replaceUpdateJob2 = replaceEvalObject({
          pageName,
          cadlObject: processedComponentsAgain,
          dispatch: boundDispatch,
        })

        this.newDispatch({
          type: 'SET_ROOT_PROPERTIES',
          payload: { properties: replaceUpdateJob2 },
        })
        this.emit('stateChanged', {
          name: 'update',
          path: `${pageName}`,
          prevVal,
          newVal: this.root,
        })
      })
    } else {
      //FOR COMPONENTS
      //process components
      const processedComponents = this.processPopulate({
        source: processedPage,
        lookFor: ['.', '..', '_', '~'],
        skip: [
          'update',
          'check',
          'init',
          // 'listObject',
          'formData',
          'dataIn',
          ...skip,
        ],
        withFns: true,
        pageName,
      })
      //process components again to fill in new values
      const processedComponentsAgain = this.processPopulate({
        source: processedComponents,
        lookFor: ['.', '..', '_', '~', '='],
        skip: [
          'update',
          'check',
          'edge',
          'document',
          'vertex',
          'init',
          'formData',
          'dataIn',
          ...skip,
        ],
        withFns: true,
        pageName,
      })
      let replaceUpdateJob2 = replaceEvalObject({
        pageName,
        cadlObject: processedComponentsAgain,
        dispatch: boundDispatch,
      })

      this.newDispatch({
        type: 'SET_ROOT_PROPERTIES',
        payload: { properties: replaceUpdateJob2 },
      })
      this.emit('stateChanged', {
        name: 'update',
        path: `${pageName}`,
        prevVal,
        newVal: this.root,
      })
    }
  }

  /**
   * @param pageName
   * @returns CADL_OBJECT
   * @throws {UnableToRetrieveYAML} -When unable to retrieve cadlYAML
   * @throws {UnableToParseYAML} -When unable to parse yaml file
   */
  public async getPage(pageName: string): Promise<CADL_OBJECT> {
    //TODO: remove after testing
    //TODO used for local testing
    // if (pageName === 'SignIn') return SignIn
    // if (pageName === 'CreateNewAccount') return SignUp
    // if (pageName === 'MeetingLobby') return MeetingLobby
    // if (pageName === 'EditProfile') return EditProfile
    if (pageName === 'UploadDocuments') return UploadDocuments

    let pageCADL
    let pageUrl
    if (pageName.startsWith('~')) {
      pageUrl = this.myBaseUrl
      pageName = pageName.substring(2)
    } else {
      pageUrl = this.baseUrl
    }
    try {
      let url = `${pageUrl}${pageName}_en.yml`
      pageCADL = await this.defaultObject(url)
    } catch (error) {
      throw error
    }
    return pageCADL
  }

  /**
   * Retrieves and parses cadl yaml file.
   *
   * @param url
   * @returns The raw object version of the noodl file
   * @throws {UnableToRetrieveYAML} -When unable to retrieve cadlYAML
   * @throws {UnableToParseYAML} -When unable to parse yaml file
   *
   */
  private async defaultObject(url: string): Promise<Record<string, any>> {
    let cadlYAML, cadlObject
    try {
      const { data } = await axios.get(url)
      cadlYAML = data
    } catch (error) {
      throw new UnableToRetrieveYAML(
        `Unable to retrieve yaml for ${url}`,
        error
      )
    }

    try {
      cadlObject = YAML.parse(cadlYAML)
    } catch (error) {
      throw new UnableToParseYAML(`Unable to parse yaml for ${url}`, error)
    }

    return cadlObject
  }

  /**
   *
   * Returns data associated with given pageName and dataKey.
   *
   * @param pageName
   * @param dataKey
   * @returns The data that is assigned to the given path.
   *
   */
  public getData(pageName: string, dataKey: string): any {
    const firstCharacter = dataKey[0]
    const pathArr = dataKey.split('.')
    let currentVal
    if (firstCharacter === firstCharacter.toUpperCase()) {
      currentVal = _.get(this.root, pathArr)
    } else {
      currentVal = _.get(this.root[pageName], pathArr)
    }
    if (currentVal) return currentVal
    return dataKey
  }

  /**
   * Used to populate the references of the noodl files.
   *
   * @param ProcessPopulateArgs
   * @param ProcessPopulateArgs.source  The item being de-referenced.
   * @param ProcessPopulateArgs.lookFor  Reference tokens to look for e.g ['.','..'].
   * @param ProcessPopulateArgs.pageName
   * @param ProcessPopulateArgs.skip Keys that should not be de-referenced e.g ['name','country'].
   * @param ProcessPopulateArgs.withFns Choose to attach ecos functions to the source
   *
   * @returns The processed/de-referenced object.
   *
   */
  private processPopulate({
    source,
    lookFor,
    skip,
    pageName,
    withFns = false,
  }: {
    source: Record<string, any>
    lookFor: string[]
    pageName?: string
    skip?: string[]
    withFns?: boolean
  }): Record<string, any> {
    let sourceCopy = _.cloneDeep(source)
    let localRoot = pageName ? sourceCopy[pageName] : sourceCopy
    const sourceCopyWithRootKeys = populateKeys({
      source: sourceCopy,
      lookFor: '.',
      locations: [this.root, sourceCopy],
    })
    //populate the keys from the local page object
    const sourceCopyWithLocalKeys = populateKeys({
      source: sourceCopyWithRootKeys,
      lookFor: '..',
      locations: [localRoot],
    })
    const boundDispatch = this.dispatch.bind(this)

    localRoot = pageName
      ? sourceCopyWithLocalKeys[pageName]
      : sourceCopyWithLocalKeys
    const sourceCopyWithVals = populateVals({
      source: sourceCopyWithLocalKeys,
      lookFor,
      skip,
      locations: [this, this.root, localRoot],
      pageName,
      dispatch: boundDispatch,
    })
    localRoot = pageName
      ? sourceCopyWithVals[pageName]
      : sourceCopyWithLocalKeys
    let populatedResponse = sourceCopyWithVals
    if (withFns) {
      populatedResponse = attachFns({
        cadlObject: sourceCopyWithVals,
        dispatch: boundDispatch,
      })
    }
    return populatedResponse
  }

  /**
   *
   * @param action
   */
  private async dispatch(action: { type: string; payload?: any }) {
    switch (action.type) {
      case 'populate': {
        const { pageName } = action.payload
        const pageObjectCopy = _.cloneDeep(this.root[pageName])
        const boundDispatch = this.dispatch.bind(this)

        const populateWithRoot = populateObject({
          source: pageObjectCopy,
          lookFor: '.',
          locations: [this.root, this.root[pageName]],
        })
        const populateWithSelf = populateObject({
          source: populateWithRoot,
          lookFor: '..',
          locations: [this.root, this.root[pageName]],
        })
        // const populateAfterInheriting = populateObject({
        //   source: populateWithSelf,
        //   lookFor: '=',
        //   locations: [this.root, this.root[pageName]],
        // })
        const populateMyBaseUrl = populateObject({
          source: populateWithSelf,
          lookFor: '~',
          locations: [this],
        })

        const withFNs = attachFns({
          cadlObject: populateMyBaseUrl,
          dispatch: boundDispatch,
        })

        this.newDispatch({
          type: 'SET_ROOT_PROPERTIES',
          payload: { properties: { [pageName]: withFNs } },
        })
        await this.dispatch({ type: 'update-localStorage' })
        break
      }
      case 'populate-object': {
        const { pageName, object } = action.payload
        const populatedObject = populateObject({
          source: object,
          lookFor: '=',
          locations: [this.root, this.root[pageName]],
        })
        return populatedObject
      }
      case 'update-data': {
        const { pageName, dataKey, data: rawData } = action.payload
        let data = replaceUint8ArrayWithBase64(rawData)
        const firstCharacter = dataKey ? dataKey[0] : ''
        const pathArr = dataKey ? dataKey.split('.') : ''
        if (pageName === 'builtIn') {
          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              dataKey: pathArr,
              value: data,
            },
          })
        } else if (!dataKey) {
          return
        } else if (firstCharacter === firstCharacter.toUpperCase()) {
          const currentVal = _.get(this.root, pathArr)
          let mergedVal
          if (Array.isArray(currentVal)) {
            if (Array.isArray(data)) {
              mergedVal = data
            } else {
              mergedVal = [data]
            }
          } else {
            if (Array.isArray(data)) {
              mergedVal = data[0]
            } else {
              mergedVal = data
            }
          }
          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              dataKey: pathArr,
              value: mergedVal,
            },
          })
        } else {
          const currentVal = _.get(this.root[pageName], pathArr)
          let mergedVal
          //TODO:unit test for data response shape
          if (Array.isArray(currentVal)) {
            if (Array.isArray(data)) {
              mergedVal = data
            } else {
              mergedVal = [data]
            }
          } else if (isObject(currentVal) && Array.isArray(data)) {
            if (!data.length) {
              mergedVal = currentVal
            } else if (data.length === 1) {
              mergedVal = data[0]
            }
          } else {
            mergedVal = data
          }

          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              pageName,
              dataKey: pathArr,
              value: mergedVal,
            },
          })
        }

        await this.dispatch({ type: 'update-localStorage' })

        break
      }
      case 'get-data': {
        const { pageName, dataKey } = action.payload
        if (!dataKey) return
        const pathArr = dataKey.split('.')
        const currentVal =
          _.get(this.root[pageName], pathArr) || _.get(this.root, pathArr)
        return currentVal
      }
      case 'if-object': {
        const { pageName, updateObject } = action.payload
        const res = await this.handleIfCommand({
          pageName,
          ifCommand: updateObject,
        })
        if (res) return res
        break
      }
      case 'eval-object': {
        const { pageName, updateObject } = action.payload
        if (isObject(updateObject)) {
          const command = updateObject

          const objectKeys = Object.keys(command)
          asyncForEach(objectKeys, async (key) => {
            const populatedCommand = await this.dispatch({
              type: 'populate-object',
              payload: {
                pageName,
                object: command,
              },
            })
            if (key === 'if') {
              const result = await this.handleIfCommand({
                pageName,
                ifCommand: populatedCommand[key],
              })
              if (isObject(result)) return result
            } else if (!key.startsWith('=')) {
              let trimPath, val
              val = populatedCommand[key]
              if (key.startsWith('..')) {
                trimPath = key.substring(2, key.length - 1)
                const pathArr = trimPath.split('.')

                const currValue = _.get(this.root, [pageName, ...pathArr]) || ''
                if (isObject(currValue)) {
                  val = mergeDeep(currValue, val)
                }
                this.newDispatch({
                  type: 'SET_VALUE',
                  payload: {
                    pageName,
                    dataKey: pathArr,
                    value: val,
                  },
                })
                this.emit('stateChanged', {
                  name: 'update',
                  path: `${pageName}.${trimPath}`,
                  newVal: val,
                })
              } else if (key.startsWith('.')) {
                trimPath = key.substring(1, key.length - 1)
                const pathArr = trimPath.split('.')

                const currValue = _.get(this.root, [...pathArr]) || ''

                if (isObject(currValue)) {
                  val = mergeDeep(currValue, val)
                }
                this.newDispatch({
                  type: 'SET_VALUE',
                  payload: {
                    dataKey: pathArr,
                    value: val,
                  },
                })
                this.emit('stateChanged', {
                  name: 'update',
                  path: `${trimPath}`,
                  newVal: val,
                })
              }
            } else if (key.startsWith('=')) {
              const trimPath = key.substring(2, key.length)
              const pathArr = trimPath.split('.')
              let func =
                _.get(this.root, pathArr) || _.get(this.root[pageName], pathArr)

              if (isObject(func)) {
                const populateWithRoot = populateObject({
                  source: func,
                  lookFor: '.',
                  locations: [this.root, this.root[pageName]],
                })

                const populateWithSelf = populateObject({
                  source: populateWithRoot,
                  lookFor: '..',
                  locations: [this.root, this.root[pageName]],
                })

                const populateAfterInheriting = populateObject({
                  source: populateWithSelf,
                  lookFor: '=',
                  locations: [this.root, this.root[pageName]],
                })
                const populateAfterAttachingMyBaseUrl = populateObject({
                  source: populateAfterInheriting,
                  lookFor: '~',
                  locations: [this],
                })

                const boundDispatch = this.dispatch.bind(this)
                func = attachFns({
                  cadlObject: populateAfterAttachingMyBaseUrl,
                  dispatch: boundDispatch,
                })
              }
              if (typeof func === 'function') {
                if (isObject(populatedCommand[key])) {
                  const { dataIn, dataOut } = populatedCommand[key]
                  const result = await func(dataIn)
                  if (dataOut) {
                    const pathArr = dataOut.split('.')
                    this.newDispatch({
                      type: 'SET_VALUE',
                      payload: {
                        dataKey: pathArr,
                        value: result,
                      },
                    })
                    this.emit('stateChanged', {
                      name: 'update',
                      path: `${dataOut}`,
                      newVal: result,
                    })
                  }
                } else {
                  await func()
                }
              } else if (Array.isArray(func)) {
                func = func[1]
                await func()
              }
            }
          })
        } else if (Array.isArray(updateObject)) {
          await asyncForEach(updateObject, async (command) => {
            const populatedCommand = await this.dispatch({
              type: 'populate-object',
              payload: {
                pageName,
                object: command,
              },
            })
            const commandKeys = Object.keys(populatedCommand)
            await asyncForEach(commandKeys, async (key) => {
              if (key === 'if') {
                const result = await this.handleIfCommand({
                  pageName,
                  ifCommand: populatedCommand,
                })
                if (isObject(result)) return result
              } else if (!key.startsWith('=')) {
                let trimPath, val
                val = populatedCommand[key]
                if (key.startsWith('..')) {
                  trimPath = key.substring(2, key.length - 1)
                  const pathArr = trimPath.split('.')

                  const currValue =
                    _.get(this.root, [pageName, ...pathArr]) || ''
                  if (isObject(currValue)) {
                    val = mergeDeep(currValue, val)
                  }
                  this.newDispatch({
                    type: 'SET_VALUE',
                    payload: {
                      pageName,
                      dataKey: pathArr,
                      value: val,
                    },
                  })
                  this.emit('stateChanged', {
                    name: 'update',
                    path: `${pageName}.${trimPath}`,
                    newVal: val,
                  })
                } else if (key.startsWith('.')) {
                  trimPath = key.substring(1, key.length - 1)
                  const pathArr = trimPath.split('.')

                  const currValue = _.get(this.root, [...pathArr]) || ''
                  if (isObject(currValue)) {
                    val = mergeDeep(currValue, val)
                  }
                  this.newDispatch({
                    type: 'SET_VALUE',
                    payload: {
                      dataKey: pathArr,
                      value: val,
                    },
                  })
                  this.emit('stateChanged', {
                    name: 'update',
                    path: `${trimPath}`,
                    newVal: val,
                  })
                }
              } else if (key.startsWith('=')) {
                const trimPath = key.substring(2, key.length)
                const pathArr = trimPath.split('.')
                let func =
                  _.get(this.root, pathArr) ||
                  _.get(this.root[pageName], pathArr)

                if (isObject(func)) {
                  const populateWithRoot = populateObject({
                    source: func,
                    lookFor: '.',
                    locations: [this.root, this.root[pageName]],
                  })

                  const populateWithSelf = populateObject({
                    source: populateWithRoot,
                    lookFor: '..',
                    locations: [this.root, this.root[pageName]],
                  })

                  const populateAfterInheriting = populateObject({
                    source: populateWithSelf,
                    lookFor: '=',
                    locations: [this.root, this.root[pageName]],
                  })
                  const populateAfterAttachingMyBaseUrl = populateObject({
                    source: populateAfterInheriting,
                    lookFor: '~',
                    locations: [this],
                  })

                  const boundDispatch = this.dispatch.bind(this)
                  func = attachFns({
                    cadlObject: populateAfterAttachingMyBaseUrl,
                    dispatch: boundDispatch,
                  })
                }
                if (typeof func === 'function') {
                  if (isObject(populatedCommand[key])) {
                    const { dataIn, dataOut } = populatedCommand[key]
                    const result = await func(dataIn)

                    if (dataOut) {
                      const pathArr = dataOut.split('.')
                      this.newDispatch({
                        type: 'SET_VALUE',
                        payload: {
                          dataKey: pathArr,
                          value: result,
                        },
                      })
                      this.emit('stateChanged', {
                        name: 'update',
                        path: `${dataOut}`,
                        newVal: result,
                      })
                    }
                  } else {
                    await func()
                  }
                } else if (Array.isArray(func)) {
                  func = func[1]
                  await func()
                }
              }
            })
          })
        }
        //populates Global because this object is instantiated once
        //unlike pages that are instantiated multiple times and can be repopulated
        //when they are loaded again
        await this.dispatch({
          type: 'populate',
          payload: { pageName: 'Global' },
        })

        //update the localStorage root
        await this.dispatch({
          type: 'update-localStorage',
        })
        break
      }
      case 'update-localStorage': {
        localStorage.setItem('Global', JSON.stringify(this.root?.Global))
        break
      }
      case 'add-fn': {
        //actions for page currently used for signIn
        const { pageName, fn } = action.payload
        if (this.root.actions[pageName]) {
          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              dataKey: `actions.${pageName}.update`,
              value: fn,
            },
          })
        } else {
          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              dataKey: `actions.${pageName}`,
              value: { update: fn },
            },
          })
        }
        break
      }
      case 'emit-update': {
        const { pageName, dataKey, newVal } = action.payload
        this.emit('stateChanged', {
          name: 'update',
          path: `${pageName}.${dataKey}`,
          newVal,
        })
      }

      default: {
        return
      }
    }
  }

  private async handleIfCommand({ pageName, ifCommand }) {
    const [condExpression, ifTrueEffect, ifFalseEffect] = ifCommand['if']
    let condResult
    if (typeof condExpression === 'function') {
      condResult = await condExpression()
    } else if (
      condExpression.startsWith('.') ||
      condExpression.startsWith('=') ||
      condExpression.startsWith('..')
    ) {
      let lookFor
      if (condExpression.startsWith('..')) {
        lookFor = '..'
      } else if (condExpression.startsWith('.')) {
        lookFor = '.'
      } else if (condExpression.startsWith('=')) {
        lookFor = '='
      }
      let res = populateString({
        source: condExpression,
        locations: [this.root, this.root[pageName]],
        lookFor,
      })
      if (typeof res === 'function') {
        condResult = await res()
      } else if (res && res !== condExpression) {
        condResult = true
      } else {
        condResult = false
      }
    }
    if (condResult === true) {
      let lookFor
      if (
        isObject(ifTrueEffect) &&
        'goto' in ifTrueEffect &&
        typeof ifTrueEffect['goto'] === 'string'
      ) {
        await this.root.builtIn['goto'](ifTrueEffect['goto'])
        return
      } else if (
        isObject(ifTrueEffect) &&
        Object.keys(ifTrueEffect)?.[0]?.includes('@')
      ) {
        await this.dispatch({
          type: 'eval-object',
          payload: { pageName, updateObject: { ...ifTrueEffect } },
        })
        return
      } else if (isObject(ifTrueEffect) && 'actionType' in ifTrueEffect) {
        return ifTrueEffect
      } else if (ifTrueEffect.startsWith('..')) {
        lookFor = '..'
      } else if (ifTrueEffect.startsWith('.')) {
        lookFor = '.'
      } else if (ifTrueEffect.startsWith('=')) {
        lookFor = '='
      }
      if (lookFor) {
        let res = populateString({
          source: ifTrueEffect,
          locations: [this.root, this.root[pageName]],
          lookFor,
        })
        if (typeof res === 'function') {
          await res()
        } else if (isObject(res)) {
          const boundDispatch = this.dispatch.bind(this)
          const withFns = attachFns({
            cadlObject: res,
            dispatch: boundDispatch,
          })
          //@ts-ignore
          const { dataIn, dataOut } = Object.values(ifTrueEffect)[0]
          if (typeof withFns === 'function') {
            let result
            if (dataIn) {
              result = await withFns(dataIn)
            } else {
              result = await withFns()
            }
            if (dataOut) {
              const pathArr = dataOut.split('.')
              this.newDispatch({
                type: 'SET_VALUE',
                payload: {
                  dataKey: pathArr,
                  value: result,
                },
              })
            }
            return result
          } else if (
            Array.isArray(withFns) &&
            typeof withFns[1] === 'function'
          ) {
            let result
            if (dataIn) {
              result = await withFns[1](dataIn)
            } else {
              result = await withFns[1]()
            }
            if (dataOut) {
              const pathArr = dataOut.split('.')
              this.newDispatch({
                type: 'SET_VALUE',
                payload: {
                  dataKey: pathArr,
                  value: result,
                },
              })
            }
            return result
          }
        } else if (Array.isArray(res) && typeof res?.[1] === 'function') {
          let result
          result = await res[1]()
          return result
        } else {
          return res
        }
      } else {
        return ifTrueEffect
      }
    } else if (condResult === false) {
      let lookFor
      if (
        isObject(ifFalseEffect) &&
        'goto' in ifFalseEffect &&
        typeof ifFalseEffect['goto'] === 'string'
      ) {
        if (
          'goto' in this.root.builtIn &&
          typeof this.root.builtIn['goto'] === 'function'
        ) {
          await this.root.builtIn['goto'](ifFalseEffect['goto'])
          return
        }
      } else if (typeof ifFalseEffect === 'function') {
        await ifFalseEffect()
        return
      } else if (
        isObject(ifFalseEffect) &&
        Object.keys(ifFalseEffect)?.[0]?.includes('@')
      ) {
        await this.dispatch({
          type: 'eval-object',
          payload: { pageName, updateObject: { ...ifFalseEffect } },
        })
        return
      } else if (isObject(ifFalseEffect) && 'actionType' in ifFalseEffect) {
        return ifFalseEffect
      } else if (ifFalseEffect.startsWith('..')) {
        lookFor = '..'
      } else if (ifFalseEffect.startsWith('.')) {
        lookFor = '.'
      } else if (ifFalseEffect.startsWith('=')) {
        lookFor = '='
      }
      if (lookFor) {
        let res = populateString({
          source: ifFalseEffect,
          locations: [this.root, this.root[pageName]],
          lookFor,
        })

        if (typeof res === 'function') {
          await res()
        } else if (isObject(res)) {
          const boundDispatch = this.dispatch.bind(this)
          const withFns = attachFns({
            cadlObject: res,
            dispatch: boundDispatch,
          })
          //@ts-ignore

          const { dataIn, dataOut } = Object.values(ifFalseEffect)[0]
          if (typeof withFns === 'function') {
            let result
            if (dataIn) {
              result = await withFns(dataIn)
            } else {
              result = await withFns()
            }
            if (dataOut) {
              const pathArr = dataOut.split('.')
              this.newDispatch({
                type: 'SET_VALUE',
                payload: {
                  dataKey: pathArr,
                  value: result,
                },
              })
            }
            return result
          } else if (
            Array.isArray(withFns) &&
            typeof withFns[1] === 'function'
          ) {
            let result
            if (dataIn) {
              result = await withFns[1](dataIn)
            } else {
              result = await withFns[1]()
            }
            if (dataOut) {
              const pathArr = dataOut.split('.')
              this.newDispatch({
                type: 'SET_VALUE',
                payload: {
                  dataKey: pathArr,
                  value: result,
                },
              })
            }
            return result
          }
        } else if (Array.isArray(res) && typeof res?.[1] === 'function') {
          let result
          result = await res[1]()
          return result
        } else {
          return res
        }
      } else {
        return ifFalseEffect
      }
    }
  }
  /**
   * Used for the actionType 'updateObject'. It updates the value of an object at the given path.
   *
   * @param UpdateObjectArgs
   * @param UpdateObjectArgs.dataKey The path to the property being changed.
   * @param UpdateObjectArgs.dataObject The object that will be updated.
   * @param UpdateObjectArgs.dataObjectKey The specific key of the dataObject to be used as the new value.
   * @emits CADL#stateChanged
   *
   */
  public async updateObject({
    dataKey,
    dataObject,
    dataObjectKey,
  }: {
    dataKey: string
    dataObject: any
    dataObjectKey?: string
  }) {
    let path
    if (dataKey.startsWith('.')) {
      path = dataKey.substring(1, dataKey.length)
    } else {
      path = dataKey
    }
    const pathArr = path.split('.')
    const newVal = dataObjectKey ? dataObject[dataObjectKey] : dataObject

    this.newDispatch({
      type: 'SET_VALUE',
      payload: {
        dataKey: pathArr,
        value: newVal,
      },
    })

    await this.dispatch({
      type: 'update-localStorage',
    })

    this.emit('stateChanged', {
      name: 'update',
      path: dataKey,
      newVal: dataObject,
    })
  }

  /**
   * Runs the init functions of the page matching the pageName.
   *
   * @param pageObject
   */
  public async runInit(
    pageObject: Record<string, any>
  ): Promise<Record<string, any>> {
    return new Promise(async (resolve) => {
      const boundDispatch = this.dispatch.bind(this)

      let page = { ...pageObject }
      const pageName = Object.keys(page)[0]
      let init = Object.values(page)[0].init

      if (init) {
        this.initCallQueue = init.map((_command, index) => index)
        while (this.initCallQueue.length > 0) {
          const currIndex = this.initCallQueue.shift()
          const command: any = init[currIndex]
          if (typeof command === 'function') {
            try {
              //TODO: check dispatch function/ side effects work accordingly
              await command()
            } catch (error) {
              throw new UnableToExecuteFn(
                `An error occured while executing ${pageName}.init`,
                error
              )
            }
          } else if (isObject(command) && 'actionType' in command) {
            const {
              actionType,
              dataKey,
              dataObject,
              object,
              funcName,
            }: any = command
            switch (actionType) {
              case 'updateObject': {
                await this.updateObject({ dataKey, dataObject })
                break
              }
              case 'builtIn': {
                if (funcName === 'videoChat') {
                  if (
                    funcName in this.root.builtIn &&
                    typeof this.root.builtIn[funcName] === 'function'
                  ) {
                    await this.root.builtIn[funcName](command)
                  }
                }
                break
              }
              case 'evalObject': {
                await this.dispatch({
                  type: 'eval-object',
                  payload: { pageName, updateObject: object },
                })
                break
              }
              default: {
                return
              }
            }
          } else if (isObject(command) && 'if' in command) {
            //TODO: add the then condition
            await this.handleIfCommand({ pageName, ifCommand: command })
          } else if (Array.isArray(command)) {
            if (typeof command[0][1] === 'function') {
              try {
                await command[0][1]()
              } catch (error) {
                throw new UnableToExecuteFn(
                  `An error occured while executing ${pageName}.init`,
                  error
                )
              }
            }
          }
          //updating page after command has been called
          const updatedPage = this.root[pageName]

          //populateObject again to populate any data that was dependant on the command call
          let populatedUpdatedPage = populateObject({
            source: updatedPage,
            lookFor: '..',
            skip: ['update', 'check', 'components'],
            locations: [this.root[pageName]],
          })
          //populateObject again to populate any data that was dependant on the command call
          let populatedUpdatedPage2 = populateObject({
            source: populatedUpdatedPage,
            lookFor: '.',
            skip: ['update', 'check', 'components'],
            locations: [this.root],
          })

          const populatedUpdatedPageWithFns = attachFns({
            cadlObject: { [pageName]: populatedUpdatedPage2 },
            dispatch: boundDispatch,
          })

          page = populatedUpdatedPageWithFns

          init = Object.values(populatedUpdatedPageWithFns)[0].init

          this.newDispatch({
            type: 'SET_LOCAL_PROPERTIES',
            payload: {
              pageName,
              properties: Object.values(populatedUpdatedPageWithFns)[0],
            },
          })
        }
        resolve(page)
      }
    })
  }

  /**
   * Sets either the user or meetroom value from localStorage to the corresponding root value in memory
   *
   * @param key "user" | "meetroom"
   *
   */
  //TODO: ask Chris if he uses this
  public setFromLocalStorage(key: 'user' | 'meetroom') {
    let localStorageGlobal
    try {
      const Global = localStorage.getItem('Global')
      if (Global) {
        localStorageGlobal = JSON.parse(Global)
      }
    } catch (error) {
      console.log(error)
    }
    if (localStorageGlobal) {
      switch (key) {
        case 'user': {
          let user = localStorageGlobal.currentUser.vertex

          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              dataKey: 'Global.currentUser.vertex',
              value: user,
            },
          })
          break
        }
        case 'meetroom': {
          let currMeetroom = localStorageGlobal.meetroom.edge
          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              dataKey: 'Global.meetroom.edge',
              value: currMeetroom,
            },
          })
          break
        }
        default: {
          return
        }
      }
    }
  }

  /**
   * Set a new value at a given path. Assume the path begins at the root.
   *
   * @param SetValueArgs
   * @param SetValueArgs.path The path to the property being changed.
   * @param SetValueArgs.value The new value being set at the given path
   *
   */
  public setValue({ path, value }: { path: string; value: any }): void {
    let pathArr = path.split('.')

    this.newDispatch({
      type: 'SET_VALUE',
      payload: { dataKey: pathArr, value },
    })
    return
  }

  /**
   * Add a value to an array at a given path. Assume the path begins at root.
   *
   * @param AddValueArgs
   * @param AddValueArgs.path Path to an array from the root.
   * @param AddValueArgs.value Value that will be added to the array at the given path.
   *
   */
  public addValue({ path, value }: { path: string; value: any }): void {
    let pathArr = path.split('.')
    let currVal = _.get(this.root, pathArr)
    if (typeof currVal === 'undefined') {
      currVal = [value]
    } else if (Array.isArray(currVal)) {
      currVal.push(value)
    }

    this.newDispatch({
      type: 'SET_VALUE',
      payload: { dataKey: pathArr, value: currVal },
    })
    return
  }

  /**
   * Remove a value from an array at a given path. Assume the path begins at the root.
   *
   * @param RemoveValue
   * @param RemoveValue.path Path to the array being altered.
   * @param RemoveValue.Predicate The condition to be met for items being deleted from the array e.g {id:'123'}
   *
   */
  public removeValue({
    path,
    predicate,
  }: {
    path: string
    predicate: Record<string, number | string>
  }): void {
    let pathArr = path.split('.')
    let currVal = _.get(this.root, pathArr)
    if (currVal && Array.isArray(currVal)) {
      let newVal = currVal.filter((elem) => {
        let passes = true
        for (let [key, val] of Object.entries(predicate)) {
          if (elem[key] === val) {
            passes = false
          }
        }
        return passes
      })

      this.newDispatch({
        type: 'SET_VALUE',
        payload: { dataKey: pathArr, value: newVal },
      })
    }
  }

  /**
   * Replace value at a given path. Assume the path begins at the root.
   *
   * @param ReplaceValueArgs
   * @param ReplaceValueArgs.path Path to an array beginning from the root level.
   * @param ReplaceValueArgs.predicate Condition to be met for value being replaced.
   * @param ReplaceValueArgs.value Value that will replace the value in question.
   *
   */
  public replaceValue({
    path,
    predicate,
    value,
  }: {
    path: string
    predicate: Record<string, number | string>
    value: any
  }): void {
    let pathArr = path.split('.')
    let currVal = _.get(this.root, pathArr)
    if (currVal && Array.isArray(currVal)) {
      let currValCopy = [...currVal]
      let valIndex = -1
      for (let i = 0; i < currValCopy.length; i++) {
        for (let [key, val] of Object.entries(predicate)) {
          //TODO:refac to account for multiple conditions
          if (currValCopy[i][key] === val) {
            valIndex = i
          }
        }
      }
      if (valIndex >= 0) {
        currValCopy.splice(valIndex, 1, value)

        this.newDispatch({
          type: 'SET_VALUE',
          payload: {
            dataKey: pathArr,
            value: currValCopy,
          },
        })
      }
    }
    return
  }

  /**
   * Used to mutate the draft state.
   *
   * @param callback Function used to update the state
   */
  public editDraft(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function')
    }
    this.newDispatch({
      type: 'EDIT_DRAFT',
      payload: { callback },
    })
  }

  public editListDraft({ list, index, dataKey, value }) {
    list[index][dataKey] = value
  }

  private initRoot(root) {
    return produce(root, (draft) => {
      draft.actions = {}
      draft.builtIn = builtInFns(this.dispatch.bind(this))
    })
  }

  public newDispatch(action) {
    if (!isObject(action)) {
      throw new Error('Actions must be plain objects')
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Action types cannot be undefined.')
    }

    //TODO: add is Dispatching
    this.root = this.reducer(this.root, action)

    return action
  }

  private reducer(state = this.root, action) {
    return produce(state, (draft) => {
      switch (action.type) {
        case 'SET_VALUE': {
          const { pageName, dataKey, value } = action.payload
          if (typeof pageName === 'undefined') {
            _.set(draft, dataKey, value)
          } else {
            _.set(draft[pageName], dataKey, value)
          }
          break
        }
        case 'SET_ROOT_PROPERTIES': {
          const { properties } = action.payload
          for (let [key, val] of Object.entries(properties)) {
            _.set(draft, key, val)
          }
          break
        }
        case 'SET_LOCAL_PROPERTIES': {
          const { properties, pageName } = action.payload
          for (let [key, val] of Object.entries(properties)) {
            _.set(draft[pageName], key, val)
          }
          break
        }
        case 'ADD_BUILTIN_FNS': {
          const { builtInFns } = action.payload
          for (let [key, val] of Object.entries(builtInFns)) {
            _.set(draft['builtIn'], key, val)
          }
          break
        }
        case 'DELETE_PAGE': {
          const { pageName } = action.payload
          delete draft[pageName]
          break
        }
        case 'EDIT_DRAFT': {
          const { callback } = action.payload
          callback(draft)
        }
      }
    })
  }
  public get cadlVersion() {
    return this._cadlVersion
  }

  public set cadlVersion(cadlVersion) {
    this._cadlVersion = cadlVersion
  }
  public get cadlEndpoint() {
    return this._cadlEndpoint
  }

  public set cadlEndpoint(cadlEndpoint) {
    this._cadlEndpoint = cadlEndpoint
  }
  private get baseUrl() {
    return this._baseUrl
  }

  private set baseUrl(baseUrl) {
    if (this.cadlBaseUrl) {
      this._baseUrl = baseUrl.replace('${cadlBaseUrl}', this.cadlBaseUrl)
    }
  }
  public get myBaseUrl() {
    return this._myBaseUrl
  }

  public set myBaseUrl(myBaseUrl) {
    this._myBaseUrl = myBaseUrl
  }

  public get cadlBaseUrl() {
    if (!this._cadlBaseUrl) return undefined
    let baseUrlWithVersion = this._cadlBaseUrl
    if (baseUrlWithVersion.includes('cadlVersion')) {
      baseUrlWithVersion = baseUrlWithVersion.replace(
        '${cadlVersion}',
        this.cadlVersion
      )
    }
    if (baseUrlWithVersion.includes('designSuffix')) {
      baseUrlWithVersion = baseUrlWithVersion.replace(
        '${designSuffix}',
        this.designSuffix
      )
    }
    return baseUrlWithVersion
  }

  public set cadlBaseUrl(cadlBaseUrl) {
    this._cadlBaseUrl = cadlBaseUrl
  }

  public get assetsUrl() {
    return this._assetsUrl
  }

  public set assetsUrl(assetsUrl) {
    if (this.cadlBaseUrl) {
      this._assetsUrl = assetsUrl.replace('${cadlBaseUrl}', this.cadlBaseUrl)
    }
  }

  public get designSuffix() {
    const { greaterEqual, less, widthHeightRatioThreshold } = this._designSuffix
    return this.aspectRatio >= widthHeightRatioThreshold ? greaterEqual : less
  }
  public set designSuffix(designSuffix) {
    this._designSuffix = designSuffix
  }
  public get aspectRatio() {
    return this._aspectRatio
  }
  public set aspectRatio(aspectRatio) {
    this._aspectRatio = aspectRatio
  }

  public get root() {
    return this._root
  }

  public set root(root) {
    this._root = root || {}
  }

  set apiVersion(apiVersion) {
    store.apiVersion = apiVersion
  }

  get apiVersion() {
    return store.apiVersion
  }

  set initCallQueue(initCallQueue) {
    this._initCallQueue = initCallQueue
  }

  get initCallQueue() {
    return this._initCallQueue
  }

  public getConfig() {
    return store.getConfig()
  }
}
