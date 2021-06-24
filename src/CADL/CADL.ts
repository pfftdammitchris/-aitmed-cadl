import _ from 'lodash'
import axios from 'axios'
import YAML from 'yaml'
import { EventEmitter } from 'events'
import produce, { setAutoFreeze } from 'immer'
import moment from 'moment'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
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
  populateArray,
  replaceUint8ArrayWithBase64,
  replaceEvalObject,
  replaceVars,
  isPopulated,
  isNoodlFunction,
} from './utils'
import { isObject, asyncForEach, mergeDeep } from '../utils'
import dot from 'dot-object'
import builtInFns from './services/builtIn'
// import AddDocuments from './__mocks__/AddDocuments'
// import BaseDataModel from './__mocks__/BaseDataModel'

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
  private _map: Record<string, any>
  private _config: Record<string, any>
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
   * -loads noodl config if not already loaded
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
    //load noodl config
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
    this._config = this.processPopulate({
      source: config,
      lookFor: ['.', '..', '=', '~'],
    })

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

    //set Global object from localStorage
    //used to retain user data in case of browser reload
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
              Global: {
                ...localStorageGlobalParsed,
                globalRegister: this.root.Global.globalRegister,
              },
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
    this.dispatch({ type: 'update-map' })
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
  async initPage(
    pageName: string,
    skip: string[] = [],
    options: {
      reload?: boolean //if true then the pageObject is replaced
      builtIn?: Record<string, any>
      done?: Function
    } = {}
  ): Promise<void> {
    if (!this.cadlEndpoint) await this.init()

    const { builtIn, reload } = options
    if (reload === undefined) {
      options.reload = true
    }

    if (builtIn && isObject(builtIn)) {
      this.newDispatch({
        type: 'ADD_BUILTIN_FNS',
        payload: {
          builtInFns: {
            ...builtIn,
          },
        },
      })
    }
    let pageCADL
    if (reload === false && this.root[pageName]) {
      //keep the current pageObject
      return
    } else {
      //refresh the pageObject
      pageCADL = await this.getPage(pageName)
    }

    if (this.root[pageName] && reload) {
      //delete old pageObject if refreshing
      this.newDispatch({
        type: 'DELETE_PAGE',
        payload: { pageName },
      })
    }

    let prevVal = {}

    //the pageObject requires multiple processes
    //in order to dereference references that are dependent on other references
    /**
     * e.g =..pageName.object.edge.refid ---> =..pageName.object2.edge.id
     * here the reference "=..pageName.object.edge.refid" references
     * another reference "=..pageName.object2.edge.id"
     * to avoid this we process the object multiple times to make sure that
     * all references that exist are accounted for
     */

    const FIRST_process = this.processPopulate({
      source: pageCADL,
      lookFor: ['.', '..', '~'],
      skip: ['update', 'save', 'check', 'init', 'components', ...skip],
      withFns: true,
      pageName,
    })

    const SECOND_process = this.processPopulate({
      source: FIRST_process,
      lookFor: ['.', '..', '_', '~'],
      skip: ['update', 'check', 'init', 'formData', 'components', ...skip],
      withFns: true,
      pageName,
    })

    //used to call the dispatch function from service modules
    const boundDispatch = this.dispatch.bind(this)

    //sets processed pageObject to the root
    /**
     * shape of processed Page
     * {
     *  MeetingRoom:{
     *    init:[],
     *    components:[]
     *    ...
     *  }
     * }
     */
    let processedPage = SECOND_process
    this.newDispatch({
      type: 'SET_ROOT_PROPERTIES',
      payload: { properties: processedPage },
    })

    //run init commands of page if any
    let init = Object.values(processedPage)[0].init
    if (init) {
      await this.runInit(processedPage).then((page) => {
        //FOR COMPONENTS
        //process components
        const FIRST_processComponents = this.processPopulate({
          source: page,
          lookFor: ['.', '..', '_', '~'],
          skip: ['update', 'check', 'init', 'formData', 'dataIn', ...skip],
          withFns: true,
          pageName,
        })
        //process components again to fill in new values
        const SECOND_processComponents = this.processPopulate({
          source: FIRST_processComponents,
          lookFor: ['.', '..', '_', '~'],
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

        //populate the components slice of the pageObject
        const evolveComponentVals = populateArray({
          source: SECOND_processComponents[pageName].components,
          lookFor: '=',
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
          pageName,
          locations: [SECOND_processComponents[pageName], this.root],
        })
        SECOND_processComponents[pageName].components = evolveComponentVals
        let replaceUpdateJob = replaceEvalObject({
          pageName,
          cadlObject: SECOND_processComponents,
          dispatch: boundDispatch,
        })

        this.newDispatch({
          type: 'SET_ROOT_PROPERTIES',
          payload: { properties: replaceUpdateJob },
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
      const FIRST_processComponents = this.processPopulate({
        source: processedPage,
        lookFor: ['.', '..', '_', '~'],
        skip: ['update', 'check', 'init', 'formData', 'dataIn', ...skip],
        withFns: true,
        pageName,
      })
      //process components again to fill in new values
      const SECOND_processComponents = this.processPopulate({
        source: FIRST_processComponents,
        lookFor: ['.', '..', '_', '~'],
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

      const evolveComponentVals = populateArray({
        source: SECOND_processComponents[pageName].components,
        lookFor: '=',
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
        pageName,
        locations: [SECOND_processComponents[pageName], this.root],
      })
      SECOND_processComponents[pageName].components = evolveComponentVals
      let replaceUpdateJob = replaceEvalObject({
        pageName,
        cadlObject: SECOND_processComponents,
        dispatch: boundDispatch,
      })

      this.newDispatch({
        type: 'SET_ROOT_PROPERTIES',
        payload: { properties: replaceUpdateJob },
      })
      this.emit('stateChanged', {
        name: 'update',
        path: `${pageName}`,
        prevVal,
        newVal: this.root,
      })
    }
    this.dispatch({ type: 'update-map' })

    if (options.done) {
      options.done()
    }
  }

  /**
   * @param pageName
   * @returns CADL_OBJECT
   * @throws {UnableToRetrieveYAML} -When unable to retrieve cadlYAML
   * @throws {UnableToParseYAML} -When unable to parse yaml file
   */
  public async getPage(pageName: string): Promise<CADL_OBJECT> {
    //TODO: used for local testing
    // if (pageName === 'AddDocuments') return _.cloneDeep(AddDocuments)
    // if (pageName === 'BaseDataModel') return _.cloneDeep(BaseDataModel)

    let pageCADL
    let pageUrl
    if (pageName.startsWith('~')) {
      if (!this.myBaseUrl) {
        pageUrl = this.baseUrl
      } else {
        pageUrl = this.myBaseUrl
      }
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
    // let sourceCopy = _.cloneDeep(source)
    let sourceCopy = source
    let localRoot = pageName ? sourceCopy[pageName] : sourceCopy

    //using a clone and deep clone to find references when certain slices of the noodl root are being processed
    let rootCopy = _.clone(this.root)
    let rootDeepCopy = _.cloneDeep(this.root)
    let localCopy = _.clone(localRoot)
    let localDeepCopy = _.clone(localRoot)
    const sourceCopyWithRootKeys = populateKeys({
      source: sourceCopy,
      lookFor: '.',
      locations: [rootCopy, rootDeepCopy],
    })
    //populate the keys from the local page object
    const sourceCopyWithLocalKeys = populateKeys({
      source: sourceCopyWithRootKeys,
      lookFor: '..',
      locations: [localCopy, localDeepCopy],
    })
    const boundDispatch = this.dispatch.bind(this)
    localRoot = pageName
      ? sourceCopyWithLocalKeys[pageName]
      : sourceCopyWithLocalKeys
    const sourceCopyWithVals = populateVals({
      source: sourceCopyWithLocalKeys,
      lookFor,
      skip,
      locations: [this, rootCopy, rootDeepCopy, localCopy, localDeepCopy],
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
   * @param HandleEvalStringArgs.stringArg The item being de-referenced
   * @param HandleEvalStringArgs.pageName
   *
   * Used as a helper function for emitCall --> evalObject
   */
  private async handleEvalString({ stringArg, pageName }) {
    let response = ''
    if (stringArg.startsWith('..')) {
      response = populateString({
        source: stringArg,
        lookFor: '..',
        locations: [this.root, this.root[pageName]],
      })
    } else if (stringArg.startsWith('.')) {
      response = populateString({
        source: stringArg,
        lookFor: '.',
        locations: [this.root, this.root[pageName]],
      })
    } else if (stringArg.startsWith('=')) {
      response = populateString({
        source: stringArg,
        lookFor: '=',
        locations: [this.root, this.root[pageName]],
      })
    } else if (stringArg.startsWith('~')) {
      response = populateString({
        source: stringArg,
        lookFor: '~',
        locations: [this],
      })
    }
    return response
  }

  /**
   *
   * @param HandleEvalObject.object series of commands in object {key:val} format
   * @param HandleEvalObject.pageName
   *
   * Used as a helper function for emitCall --> evalObject
   */
  private async handleEvalObject({ object, pageName }) {
    let results
    const command = object

    const objectKeys = Object.keys(command)
    await asyncForEach(objectKeys, async (key) => {
      const result = await this.handleEvalCommands({
        commands: command,
        key,
        pageName,
      })
      if (results === undefined && result !== undefined) {
        results = result
      }
    })
    return results
  }

  /**
   *
   * @param HandleEvalArray.array series of commands in object[] [{key:val} ]format
   * @param HandleEvalArray.pageName
   *
   * Used as a helper function for emitCall --> evalObject
   */
  private async handleEvalArray({ array, pageName }) {
    /**
     * handles the following format
     * [
     *  {'.path@':3},
     *  {'path2@':5},
     *  {if:['.condition', ifTrue, ifFalse]}
     * ]
     */

    let results
    await asyncForEach(array, async (command) => {
      if (results && results?.actionType === 'popUp') return
      /**
       * object is being populated before running every command. This is done to ensure that the new change from a previous command is made available to the subsequent commands
       */
      let populatedCommand = await this.dispatch({
        type: 'populate-object',
        payload: {
          pageName,
          object: command,
          copy: true,
        },
      })
      if ('actionType' in populatedCommand) {
        populatedCommand = {
          actionType: populatedCommand,
        }
      }

      const commandKeys = Object.keys(populatedCommand)
      await asyncForEach(commandKeys, async (key) => {
        const result = await this.handleEvalCommands({
          commands: populatedCommand,
          key,
          pageName,
        })
        if (
          (results === undefined && result !== undefined) ||
          (isObject(result) && result?.actionType === 'popUp')
        ) {
          results = result
        }
      })
    })

    return results
  }

  /**
   * @param HandleEvalCommandsArgs.commands Series of commands to evaluate
   * @param HandleEvalCommandsArgs.key Key to a specified command within commands
   *
   * Used as a helper function for emitCall --> evalObject
   */
  private async handleEvalCommands({ commands, key, pageName }) {
    let results
    if (key === 'if') {
      //handle If command
      const result = await this.handleIfCommand({
        pageName,
        ifCommand: { [key]: commands[key] },
      })
      //record result if any
      if (isObject(result)) {
        results = result
      }
    } else if (key === 'goto') {
      /**
       * object is being populated before running every command. This is done to ensure that the new change from a previous command is made available to the subsequent commands
       */
      const shouldCopy =
        key.includes('builtIn') &&
        'dataIn' in commands[key] &&
        isObject(commands[key]['dataIn']) &&
        !('object' in commands[key]['dataIn']) &&
        !('array' in commands[key]['dataIn'])
      const populatedCommand = await this.dispatch({
        type: 'populate-object',
        payload: {
          pageName,
          object: { [key]: commands[key] },
          copy: shouldCopy,
        },
      })
      let gotoCommand
      if (typeof populatedCommand[key] === 'string') {
        gotoCommand = {
          '=.builtIn.goto': {
            dataIn: { destination: populatedCommand[key] },
          },
        }
      } else if (isObject(populatedCommand[key])) {
        gotoCommand = {
          '=.builtIn.goto': populatedCommand[key],
        }
      }
      results = await this.handleEvalFunction({
        command: gotoCommand,
        pageName,
        key: '=.builtIn.goto',
      })
    } else if (key === 'actionType') {
      if (commands['actionType']['actionType'] === 'evalObject') {
        if (typeof commands['actionType']['object'] === 'function') {
          results = await commands['actionType']['object']()
        } else if (isObject(commands['actionType']['object'])) {
          results = await this.dispatch({
            type: 'eval-object',
            payload: {
              updateObject: commands['actionType']['object'],
              pageName,
            },
          })
        }
      } else {
        results = commands[key]
      }
    } else if (!key.startsWith('=')) {
      const shouldCopy =
        key.includes('builtIn') &&
        'dataIn' in commands[key] &&
        isObject(commands[key]['dataIn']) &&
        !('object' in commands[key]['dataIn']) &&
        !('array' in commands[key]['dataIn'])
      //handles assignment expressions
      const populatedCommand = await this.dispatch({
        type: 'populate-object',
        payload: {
          pageName,
          object: { [key]: commands[key] },
          copy: shouldCopy,
        },
      })
      await this.handleEvalAssignmentExpressions({
        pageName,
        command: populatedCommand,
        key,
      })
    } else if (key.startsWith('=')) {
      /**
       * object is being populated before running every command. This is done to ensure that the new change from a previous command is made available to the subsequent commands
       */
      const shouldCopy =
        key.includes('builtIn') &&
        'dataIn' in commands[key] &&
        (isObject(commands[key]['dataIn']) ||
          Array.isArray(commands[key]['dataIn'])) &&
        !('object' in commands[key]['dataIn']) &&
        !('array' in commands[key]['dataIn'])
      const populatedCommand = await this.dispatch({
        type: 'populate-object',
        payload: {
          pageName,
          object: { [key]: commands[key] },
          copy: shouldCopy,
        },
      })
      //handles function evaluation
      results = await this.handleEvalFunction({
        command: populatedCommand,
        pageName,
        key,
      })
    }
    return results
  }

  /**
   *
   * @param HandleEvalAssignmentExpressionsArgs.command Assigment command of shape {'.path@':4}
   * @param HandleEvalAssignmentExpressionsArgs.pageName
   *
   * Used as a helper function for emitCall --> evalObject -->  handleEvalCommands
   */
  private async handleEvalAssignmentExpressions({ pageName, command, key }) {
    //handles assignment expressions
    let trimPath, val
    val = command[key]
    if (key.startsWith('..')) {
      trimPath = key.substring(2, key.length - 1)
      const pathArr = trimPath.split('.')

      const currValue = _.get(this.root, [pageName, ...pathArr]) || ''
      if (isObject(currValue)) {
        val = mergeDeep(currValue, val)
      }
      if (isNoodlFunction(val)) {
        const key = Object.keys(val)[0]
        val = await this.handleEvalFunction({ pageName, key, command: val })
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
      if (isNoodlFunction(val)) {
        const key = Object.keys(val)[0]
        val = await this.handleEvalFunction({ pageName, key, command: val })
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
  }

  /**
   *
   * @param HandleEvalFunctionArgs.key
   * @param HandleEvalFunctionArgs.pageName
   * @param HandleEvalFunctionArgs.command
   * Used as a helper function for emitCall --> evalObject -->  handleEvalCommands
   */
  private async handleEvalFunction({ key, pageName, command }) {
    //handles function evaluation
    let results
    let trimPath
    if (key.startsWith('=..')) {
      trimPath = key.substring(3, key.length)
    } else if (key.startsWith('=.')) {
      trimPath = key.substring(2, key.length)
    }
    const pathArr = trimPath.split('.')
    let func = _.get(this.root, pathArr) || _.get(this.root[pageName], pathArr)
    if (isObject(func)) {
      if ('dataKey' in func) {
        func = { ...func, dataIn: func.dataKey, dataOut: func.dataKey }
        delete func.dataKey
      }
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
      //Using force for Global object that needs to
      //be processed since functions cannot be serialized
      //in localstorage and Global is retrieved from localstorage on page refresh
      func = attachFns({
        cadlObject: populateAfterAttachingMyBaseUrl,
        dispatch: boundDispatch,
        force:
          populateAfterAttachingMyBaseUrl['dataIn'] &&
          (populateAfterAttachingMyBaseUrl['dataIn'].includes('Global') ||
            populateAfterAttachingMyBaseUrl['dataIn'].includes('Firebase'))
            ? true
            : false,
      })
    }
    if (typeof func === 'function') {
      if (isObject(command[key])) {
        const { dataIn, dataOut } = command[key]
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
          if (result) {
            results = result
          }
        } else if (dataIn && dataOut === undefined) {
          results = result
        }
      } else {
        results = await func()
      }
    } else if (Array.isArray(func)) {
      func = func[1]
      await func()
    }
    if (key.includes('goto')) {
      results = { abort: true }
    }
    return results
  }

  /**
   *
   * @param action
   */
  private async dispatch(action: { type: string; payload?: any }) {
    switch (action.type) {
      case 'update-map': {
        //TODO: consider adding update-page-map
        this.map = dot.dot(this.root)
        break
      }
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
        const { pageName, object, copy } = action.payload
        let populatedObject
        let sourceObject = object
        if (copy) {
          sourceObject = _.cloneDeep(object)
        }
        populatedObject = populateObject({
          source: sourceObject,
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
          let shouldReplace
          if (isObject(mergedVal) && 'jwt' in mergedVal) {
            if (
              mergedVal.doc &&
              Array.isArray(mergedVal.doc) &&
              mergedVal.doc.length === 0
            )
              shouldReplace = true
            if (
              mergedVal.edge &&
              Array.isArray(mergedVal.edge) &&
              mergedVal.edge.length === 0
            )
              shouldReplace = true
            if (
              mergedVal.vertex &&
              Array.isArray(mergedVal.vertex) &&
              mergedVal.vertex.length === 0
            )
              shouldReplace = true
          }
          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              dataKey: pathArr,
              value: mergedVal,
              replace: shouldReplace,
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
          let shouldReplace
          if (isObject(mergedVal) && 'jwt' in mergedVal) {
            if (
              mergedVal.doc &&
              Array.isArray(mergedVal.doc) &&
              mergedVal.doc.length === 0
            )
              shouldReplace = true
            if (
              mergedVal.edge &&
              Array.isArray(mergedVal.edge) &&
              mergedVal.edge.length === 0
            )
              shouldReplace = true
            if (
              mergedVal.vertex &&
              Array.isArray(mergedVal.vertex) &&
              mergedVal.vertex.length === 0
            )
              shouldReplace = true
          }
          this.newDispatch({
            type: 'SET_VALUE',
            payload: {
              pageName,
              dataKey: pathArr,
              value: mergedVal,
              replace: shouldReplace,
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
        /**
         * handles the following cases
         *
         * case 1: assignment expression
         * ----> {'.key@':3}
         *
         *  * the left-hand side ('.key@') denotes the path that will be updated with the corresponding value on the right (3)
         *  * '@' must be present after the path for the expression to be evaluated successfully
         *
         * case 2: evaluating functions
         * ----> {
         *        '=.builtIn.add:{
         *          dataIn:{
         *            val1:1,
         *            val2:3
         *          },
         *          dataOut:'.path'
         *        }
         *      }
         *  * the program knows this is a function to be evaluated because of the '=' at the start of the key.
         *  * it will will find the reference to the function at the given path, then apply the given arguments (dataIn)
         *
         * case 3: if blocks
         * ---->{
         *        if:[
         *            '.pathCondExpression',
         *            'isTrueEffect',
         *            'isFalseEffect'
         *          ]
         *      }
         *
         *  * the program runs handleIfCommand if it notices that there is an 'if' key
         *
         */
        let { pageName, updateObject } = action.payload
        let results
        if (typeof updateObject === 'string') {
          //handle possible missing references
          updateObject = await this.handleEvalString({
            stringArg: updateObject,
            pageName,
          })
        }
        if (isObject(updateObject)) {
          /**
           * update object is in the following form
           *
           * {
           *    '.path@':5,
           *    '.path2@':6
           * }
           */
          const evalObjectResults = await this.handleEvalObject({
            object: updateObject,
            pageName,
          })
          results = evalObjectResults
        } else if (Array.isArray(updateObject)) {
          /**
           * handles the following format
           * [
           *  {'.path@':3},
           *  {'path2@':5},
           *  {if:['.condition', ifTrue, ifFalse]}
           * ]
           */
          results = await this.handleEvalArray({
            array: updateObject,
            pageName,
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
        return results
      }
      case 'update-localStorage': {
        //only add the Global object if user is loggedIn
        const esk = localStorage.getItem('esk')
        if (esk) {
          const { globalRegister, ...restOfGlobalProperties } =
            this.root?.Global
          localStorage.setItem('Global', JSON.stringify(restOfGlobalProperties))
        }
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
      case 'set-api-buffer': {
        const { apiObject } = action.payload
        try {
          let limit
          if (store.env === 'test') {
            limit = 60
          } else {
            limit = 3
          }

          const hash = Base64.stringify(sha256(JSON.stringify(apiObject)))
          const currentTimestamp = moment(Date.now())
          let apiDispatchBufferObject = this.root['apiCache']

          let pass
          if (!(hash in apiDispatchBufferObject)) {
            //if request has not been made(hash is undefined)
            //the request continues
            pass = true
          } else {
            //if similar request has been made (hash exists)
            //compare recorded timestamp with current timestamp
            const oldTimestamp = moment(
              apiDispatchBufferObject[hash]?.timestamp
            )
            const timeDiff = currentTimestamp.diff(oldTimestamp, 'seconds')
            if (timeDiff > limit) {
              apiDispatchBufferObject[hash].timestamp =
                currentTimestamp.toString()
              pass = true
            } else {
              apiDispatchBufferObject[`${hash}FAILED_REPEAT`] = {
                timestamp: currentTimestamp.toString(),
                request: apiObject,
              }
              pass = false
            }
          }
          //remove old values
          for (let [key, val] of Object.entries(apiDispatchBufferObject)) {
            //@ts-ignore
            const timeDiff = currentTimestamp.diff(val?.timestamp, 'seconds')
            if (timeDiff > limit) {
              delete apiDispatchBufferObject[key]
            }
          }
          return { pass, cacheIndex: hash }
        } catch (error) {
          console.log(error)
          return { pass: false, cacheIndex: hash }
        }
      }
      case 'set-cache': {
        this.newDispatch({
          type: 'SET_CACHE',
          payload: action.payload,
        })
        break
      }
      case 'get-cache': {
        const { cacheIndex } = action.payload
        const cacheData = this.getApiCache(cacheIndex)
        return cacheData
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

  /**
   *
   *  - evaluates if block of shape
   * {
   *  if:[
   *      condition,
   *      ifTrueEffect,
   *      ifFalseEffect
   *    ]
   * }
   */
  private async handleIfCommand({ pageName, ifCommand }) {
    const [condExpression, ifTrueEffect, ifFalseEffect] = ifCommand['if']
    let condResult
    if (
      condExpression === false ||
      condExpression === 'false' ||
      condExpression === true ||
      condExpression === 'true'
    ) {
      condResult = condExpression
    } else if (typeof condExpression === 'function') {
      //condExpression is a function
      condResult = await condExpression()
    } else if (
      typeof condExpression === 'string' &&
      (condExpression.startsWith('.') ||
        condExpression.startsWith('=') ||
        condExpression.startsWith('..'))
    ) {
      //condExpression is a path pointing to a reference
      let lookFor
      if (condExpression.startsWith('..')) {
        lookFor = '..'
      } else if (condExpression.startsWith('.')) {
        lookFor = '.'
      } else if (condExpression.startsWith('=')) {
        lookFor = '='
      }
      let res
      if (condExpression.startsWith('..') || condExpression.startsWith('=..')) {
        res = populateString({
          source: condExpression,
          locations: [this.root[pageName]],
          lookFor,
        })
      } else if (
        condExpression.startsWith('.') ||
        condExpression.startsWith('=.')
      ) {
        res = populateString({
          source: condExpression,
          locations: [this.root],
          lookFor,
        })
      }
      if (typeof res === 'function') {
        condResult = await res()
      } else if (res && res !== condExpression) {
        if (condResult === 'false') {
          condResult = false
        } else {
          condResult = true
        }
      } else {
        condResult = false
      }
    } else if (
      isObject(condExpression) &&
      Object.keys(condExpression)?.[0]?.startsWith('=')
    ) {
      //condExpression matches an evalObject function evaluation
      condResult = await this.dispatch({
        type: 'eval-object',
        payload: { pageName, updateObject: condExpression },
      })
    }
    if (condResult === true || condResult === 'true') {
      let lookFor
      if (isObject(ifTrueEffect) && 'goto' in ifTrueEffect) {
        //handles goto function logic
        const populatedTrueEffect = populateVals({
          source: ifTrueEffect,
          pageName,
          lookFor: ['..', '.', '='],
          locations: [this.root, this.root[pageName]],
        })
        let gotoArgs

        if (typeof populatedTrueEffect['goto'] === 'string') {
          gotoArgs = populatedTrueEffect['goto']
        } else if (isObject(populatedTrueEffect['goto'])) {
          gotoArgs = populatedTrueEffect['goto'].dataIn
        }
        await this.root.builtIn['goto'](gotoArgs)
        return { abort: 'true' }
      } else if (
        isObject(ifTrueEffect) &&
        (Object.keys(ifTrueEffect)?.[0]?.includes('@') ||
          Object.keys(ifTrueEffect)?.[0]?.startsWith('='))
      ) {
        //handles evalObject assignment expression
        await this.dispatch({
          type: 'eval-object',
          payload: { pageName, updateObject: ifTrueEffect },
        })
        return
      } else if (
        isObject(ifTrueEffect) &&
        'actionType' in ifTrueEffect &&
        ifTrueEffect?.actionType === 'evalObject'
      ) {
        //ifTrueEffect matches an evalObject actionType
        const res = await this.dispatch({
          type: 'eval-object',
          payload: { pageName, updateObject: ifTrueEffect?.object },
        })
        return res
      } else if (
        (isObject(ifTrueEffect) && 'actionType' in ifTrueEffect) ||
        Array.isArray(ifTrueEffect)
      ) {
        //this returns unhandled object expressions that will be handled by the UI
        return ifTrueEffect
      } else if (
        typeof ifTrueEffect === 'string' &&
        ifTrueEffect.startsWith('..')
      ) {
        lookFor = '..'
      } else if (
        typeof ifTrueEffect === 'string' &&
        ifTrueEffect.startsWith('.')
      ) {
        lookFor = '.'
      } else if (
        typeof ifTrueEffect === 'string' &&
        ifTrueEffect.startsWith('=')
      ) {
        lookFor = '='
      }
      if (lookFor) {
        //ifTrueEffect is a path that points to a reference
        let res = populateString({
          source: ifTrueEffect,
          locations: [this.root, this.root[pageName]],
          lookFor,
        })
        if (typeof res === 'function') {
          //reference is a function
          await res()
        } else if (isObject(res)) {
          //reference is an object
          //assume that it is an evalObject object function evaluation type
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
    } else if (condResult === false || condResult === 'false') {
      let lookFor
      if (isObject(ifFalseEffect) && 'goto' in ifFalseEffect) {
        if (
          'goto' in this.root.builtIn &&
          typeof this.root.builtIn['goto'] === 'function'
        ) {
          //handles goto function logic
          const populatedFalseEffect = populateVals({
            source: ifFalseEffect,
            pageName,
            lookFor: ['..', '.', '='],
            locations: [this.root, this.root[pageName]],
          })

          let gotoArgs

          if (typeof populatedFalseEffect['goto'] === 'string') {
            gotoArgs = populatedFalseEffect['goto']
          } else if (isObject(populatedFalseEffect['goto'])) {
            gotoArgs = populatedFalseEffect['goto'].dataIn
          }
          await this.root.builtIn['goto'](gotoArgs)
          return { abort: true }
        }
      } else if (typeof ifFalseEffect === 'function') {
        await ifFalseEffect()
        return
      } else if (
        isObject(ifFalseEffect) &&
        (Object.keys(ifFalseEffect)?.[0]?.includes('@') ||
          Object.keys(ifFalseEffect)?.[0]?.startsWith('='))
      ) {
        //handles evalObject assignment expression
        await this.dispatch({
          type: 'eval-object',
          payload: { pageName, updateObject: ifFalseEffect },
        })
        return
      } else if (
        isObject(ifFalseEffect) &&
        'actionType' in ifFalseEffect &&
        ifFalseEffect?.actionType === 'evalObject'
      ) {
        //ifTrueEffect matches an evalObject actionType
        const res = await this.dispatch({
          type: 'eval-object',
          payload: { pageName, updateObject: ifFalseEffect?.object },
        })
        return res
      } else if (
        (isObject(ifFalseEffect) && 'actionType' in ifFalseEffect) ||
        Array.isArray(ifFalseEffect)
      ) {
        //this returns unhandled object expressions that will be handled by the UI
        return ifFalseEffect
      } else if (
        typeof ifFalseEffect === 'string' &&
        ifFalseEffect.startsWith('..')
      ) {
        lookFor = '..'
      } else if (
        typeof ifFalseEffect === 'string' &&
        ifFalseEffect.startsWith('.')
      ) {
        lookFor = '.'
      } else if (
        typeof ifFalseEffect === 'string' &&
        ifFalseEffect.startsWith('=')
      ) {
        lookFor = '='
      }
      if (lookFor) {
        //ifFalseEffect is a path that points to a reference
        let res = populateString({
          source: ifFalseEffect,
          locations: [this.root, this.root[pageName]],
          lookFor,
        })

        if (typeof res === 'function') {
          //reference is a function
          await res()
        } else if (isObject(res)) {
          //reference is an object
          //assume that it is an evalObject object function evaluation type
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
        replace: true,
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

      let page = pageObject
      const pageName = Object.keys(page)[0]
      let init = Object.values(page)[0].init

      if (init) {
        //adds commands to queue
        this.initCallQueue = init.map((_command, index) => index)
        while (this.initCallQueue.length > 0) {
          const currIndex = this.initCallQueue.shift()
          const command: any = init[currIndex]
          let populatedCommand
          if (
            isObject(command) &&
            (Object.keys(command)[0].includes('=') ||
              Object.keys(command)[0].includes('@'))
          ) {
            await this.dispatch({
              type: 'eval-object',
              payload: { updateObject: command, pageName },
            })
          } else if (isPopulated(command)) {
            populatedCommand = command
          } else {
            populatedCommand = populateVals({
              source: command,
              locations: [this.root, this.root[pageName]],
              lookFor: ['.', '..', '=', '~'],
            })
          }
          if (typeof populatedCommand === 'function') {
            try {
              //TODO: check dispatch function/ side effects work accordingly
              await populatedCommand()
            } catch (error) {
              throw new UnableToExecuteFn(
                `An error occured while executing ${pageName}.init. Check command at index ${currIndex} under init`,
                error
              )
            }
          } else if (
            isObject(populatedCommand) &&
            'actionType' in populatedCommand
          ) {
            const { actionType, dataKey, dataObject, object, funcName }: any =
              populatedCommand
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
                    await this.root.builtIn[funcName](populatedCommand)
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
          } else if (isObject(populatedCommand) && 'if' in populatedCommand) {
            //TODO: add the then condition
            await this.handleIfCommand({
              pageName,
              ifCommand: populatedCommand,
            })
          } else if (Array.isArray(populatedCommand)) {
            if (typeof populatedCommand[0][1] === 'function') {
              try {
                await populatedCommand[0][1]()
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

          //update the init commands so they
          //reflect the updated pageObject
          init = Object.values(populatedUpdatedPageWithFns)[0].init

          //update the pageObject object to
          //reflect the result of the current command
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
      draft.apiCache = {}
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
          const { pageName, dataKey, value, replace } = action.payload
          let currVal
          let newVal = value
          if (!replace) {
            //used to merge new value to existing value ref
            if (typeof pageName === 'undefined') {
              currVal = _.get(state, dataKey)
            } else {
              currVal = _.get(state[pageName], dataKey)
            }
          }
          if (isObject(currVal) && isObject(newVal)) {
            newVal = _.merge(currVal, newVal)
          } else if (Array.isArray(currVal) && Array.isArray(newVal)) {
            currVal.length = 0
            currVal.push(...newVal)
          } else if (typeof pageName === 'undefined') {
            _.set(draft, dataKey, newVal)
          } else {
            _.set(draft[pageName], dataKey, newVal)
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
        case 'SET_CACHE': {
          const { cacheIndex, data } = action.payload
          const currentTimestamp = moment(Date.now()).toString()

          _.set(draft['apiCache'], cacheIndex, {
            data,
            timestamp: currentTimestamp,
          })
          break
        }
        case 'EDIT_DRAFT': {
          const { callback } = action.payload
          callback(draft)
        }
      }
    })
  }

  /**
   *
   * @param EmitCallArgs
   * @param EmitCallArgs.dataKey -object with variables e.g {var1:{name:'tom'}}
   * @param EmitCallArgs.actions -an array of commands/actions to be performed
   * @param EmitCallArgs.pageName
   * @returns any[]
   *
   * -used to handle the emit syntax, where a series
   *  of actions can be called given a common variable(s)
   */
  public async emitCall({
    dataKey,
    actions,
    pageName,
  }: {
    dataKey: Record<string, any>
    actions: any[]
    pageName: string
  }): Promise<any[]> {
    const returnValues = {}
    await asyncForEach(actions, async (action, index) => {
      //handles explicit evalObject call
      if (typeof action === 'string' && action.includes('=')) {
        action = { [action]: '' }
      }
      const clone = _.cloneDeep(action)
      const actionWithVals: Record<string, any> = replaceVars({
        vars: dataKey,
        source: clone,
      })
      if ('actionType' in action && action?.actionType === 'evalObject') {
        const response = await this.dispatch({
          type: 'eval-object',
          payload: {
            pageName,
            updateObject: action?.object,
          },
        })
        if (response) {
          returnValues[index] = response
        } else {
          returnValues[index] = ''
        }
      } else if (
        //handles eval expressions associated to evalObject
        Object.keys(action)[0].includes('@') ||
        Object.keys(action)[0].startsWith('=')
      ) {
        const response = await this.dispatch({
          type: 'eval-object',
          payload: {
            pageName,
            updateObject: actionWithVals,
          },
        })
        if (response) {
          returnValues[index] = response
        } else {
          returnValues[index] = ''
        }
      } else if ('if' in action) {
        //handles if blocks
        const response = await this.handleIfCommand({
          pageName,
          ifCommand: actionWithVals,
        })
        if (response) {
          returnValues[index] = response
        } else {
          returnValues[index] = ''
        }
      }
    })

    return Object.values(returnValues)
  }

  private getApiCache(cacheIndex) {
    return this.root.apiCache[cacheIndex].data
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
    if (this.cadlBaseUrl) {
      this._baseUrl = this.cadlBaseUrl
    }
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
    return this._config
  }
  set map(map) {
    this._map = map
  }

  get map() {
    return this._map
  }
}
