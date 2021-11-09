import * as u from '@jsmanifest/utils'
import * as nt from 'noodl-types'
import _ from 'lodash'
import axios from 'axios'
import { EventEmitter } from 'events'
import produce, { Draft, setAutoFreeze } from 'immer'
import moment from 'moment'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import { parseYml } from '../utils/yaml'
import reducer, { Action as ReducerAction, producer } from './reducer'
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
  attachFns,
  isPopulated,
  isNoodlFunction,
  populateObject,
  populateString,
  populateKeys,
  populateVals,
  populateArray,
  replaceUint8ArrayWithBase64,
  replaceEvalObject,
  replaceVars,
} from './utils'
import { isObject, asyncForEach, mergeDeep } from '../utils'
import builtInFns from './services/builtIn'
import FuzzyIndexCreator from '../db/utils/FuzzyIndexCreator'
import basicExtraction from '../db/utils/KeyExtraction/BasicAlgorithm'
import IndexRepository from '../db/IndexRepository'
// import InboxContacts from './__mocks__/InboxContacts'
// import BaseDataModel from './__mocks__/BaseDataModel'

class CADL extends EventEmitter {
  private _cadlBaseUrl: string | undefined
  private _baseUrl: string
  private _assetsUrl: string
  private _root: Record<string, any> = this.initRoot({})
  private _designSuffix: Record<string, any>
  private _aspectRatio: number
  private _config: Record<string, any>
  private _dbConfig: any
  private _indexRepository: IndexRepository
  cadlEndpoint: CADL_OBJECT
  cadlVersion: 'test' | 'stable'
  initCallQueue = [] as any[]
  myBaseUrl = ''
  verificationRequest = { timer: 0, phoneNumber: '' }

  /**
   * @param { number } aspectRatio
   * @param { string } configUrl
   * @param { 'test' | 'stable' } cadlVersion
   * @param { unknown } dbConfig
   */
  constructor({ configUrl, cadlVersion, aspectRatio, dbConfig }: CADLARGS) {
    super()
    aspectRatio && (this.aspectRatio = aspectRatio)
    store.env = cadlVersion
    store.configUrl = configUrl
    store.noodlInstance = this
    this._dbConfig = dbConfig
    this._indexRepository = new IndexRepository()
    this.cadlVersion = cadlVersion
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
  async init({
    onConfig,
    onCadlEndpoint,
    onPreload,
    onRehydrateGlobal,
    ...use
  }: {
    BaseDataModel?: Record<string, any>
    BaseCSS?: Record<string, any>
    BasePage?: Record<string, any>
    config?: nt.RootConfig & Record<string, any>
    cadlEndpoint?: nt.AppConfig & Record<string, any>
    onConfig?: (
      processedObject: Record<string, any>,
      json: Record<string, any>,
    ) => void
    onCadlEndpoint?: (
      json: Record<string, any>,
      yml: string | undefined,
    ) => void
    onPreload?: (
      name: string,
      processedObject: Record<string, any>,
      json: Record<string, any>,
      yml: string | undefined,
    ) => void
    onRehydrateGlobal?: (globalObject: Record<string, any>) => void
  } = {}): Promise<void> {
    //load noodl config
    let config: Record<string, any>
    try {
      config = u.isObj(use.config)
        ? use.config
        : await store.level2SDK.loadConfigData()
    } catch (error) {
      if (error instanceof Error) throw error
      throw new UnableToLoadConfig(
        `[Error] An error occured while trying to load the config`,
        error,
      )
    }

    //initialize sqlite db
    await this._indexRepository.getDataBase(this._dbConfig)

    //get app curent position
    if (config?.isGetPosition) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }

      if (typeof window !== 'undefined') {
        window.navigator.geolocation.getCurrentPosition(
          function onSuccess(position) {
            let currentLatitude = position.coords.latitude
            let currentLongitude = position.coords.longitude
            store.currentLatitude = currentLatitude
            store.currentLongitude = currentLongitude
          },
          function onError(error) {
            let errorType = [
              'You refuse to share location information',
              "Can't get location information",
              'Get location information timed out',
            ]
            if (store.env === 'test') {
              console.log(errorType[error.code - 1])
            }
          },
          options,
        )
      }
    }

    const {
      web = { cadlVersion: '' },
      cadlBaseUrl = '',
      cadlMain = '',
      designSuffix = '',
      myBaseUrl = '',
    } = config || {}

    this._config = this.processPopulate({
      source: config,
      lookFor: ['.', '..', '=', '~'],
    })

    onConfig?.(this._config, config)

    this.cadlVersion = web.cadlVersion?.[this.cadlVersion || 'test']
    this.cadlBaseUrl = cadlBaseUrl
    {
      let cadlYAML: string | undefined
      if (u.isObj(use.cadlEndpoint)) {
        this.cadlEndpoint = use.cadlEndpoint
      } else {
        const { cadlObject, cadlYAML: yml } = await this.defaultObject(
          `${this.cadlBaseUrl}${cadlMain}`,
        )
        this.cadlEndpoint = cadlObject
        cadlYAML = yml
      }
      onCadlEndpoint?.(this.cadlEndpoint, cadlYAML)
    }
    this.assetsUrl = this.cadlEndpoint?.assetsUrl
    this.baseUrl = this.cadlEndpoint?.baseUrl
    this.designSuffix = designSuffix || ''
    this.myBaseUrl = myBaseUrl

    this.newDispatch({
      type: 'SET_ROOT_PROPERTIES',
      payload: { properties: { Config: this._config } },
    })

    if (u.isArr(this.cadlEndpoint?.preload)) {
      for (const preload of _.uniq([
        'BaseDataModel',
        'BaseCSS',
        'BasePage',
        ...(this.cadlEndpoint?.preload || []),
      ])) {
        if (this.cadlEndpoint.preload.includes(preload)) {
          let obj = use[preload] || (await this.getPage(preload))
          let yml: string | undefined
          if ('pageCADL' in obj || 'pageYAML' in obj) {
            obj = obj.pageCADL
            yml = obj.pageYAML
          }
          const processed = this.processPopulate({
            source: obj,
            lookFor: ['.', '..', '=', '~'],
          })
          onPreload?.(preload, processed, obj, yml)
          this.newDispatch({
            type: 'SET_ROOT_PROPERTIES',
            payload: { properties: processed },
          })
        }
      }
    }

    //set Global object from localStorage
    //used to retain user data in case of browser reload
    try {
      const ls =
        typeof window !== 'undefined' ? window.localStorage : ({} as any)
      const cachedGlobal = ls.getItem?.('Global')
      const parsedGlobal = cachedGlobal
        ? JSON.parse(cachedGlobal)
        : cachedGlobal
      onRehydrateGlobal?.(parsedGlobal)
      if (parsedGlobal) {
        this.newDispatch({
          type: 'SET_ROOT_PROPERTIES',
          payload: {
            properties: {
              Global: {
                ...parsedGlobal,
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
            data: parsedGlobal?.currentUser?.vertex,
          },
        })
      }
    } catch (error) {
      console.error(error)
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
    pageArg: string | { pageName: string; cadlYAML: string; cadlObject: any },
    skip: string[] = [],
    options: Pick<
      Parameters<CADL['runInit']>[0],
      'onBeforeInit' | 'onInit' | 'onAfterInit'
    > & {
      reload?: boolean //if true then the pageObject is replaced
      builtIn?: Record<string, any>
      onReceive?(obj: { [pageName: string]: any }): Promise<void> | void
      onAbort?(obj: { [pageName: string]: any }): Promise<void> | void
      onFirstProcess?(obj: { [pageName: string]: any }): Promise<void> | void
      onSecondProcess?(obj: { [pageName: string]: any }): Promise<void> | void
    },
  ): Promise<void | { aborted: true }> {
    if (!this.cadlEndpoint) await this.init()

    const {
      builtIn,
      onBeforeInit,
      onInit,
      onAfterInit,
      onReceive,
      onAbort,
      onFirstProcess,
      onSecondProcess,
      reload,
    } = options

    if (reload === undefined) options.reload = true

    if (builtIn && isObject(builtIn)) {
      this.newDispatch({
        type: 'ADD_BUILTIN_FNS',
        payload: { builtInFns: { ...builtIn } },
      })
    }

    let pageName = ''
    let pageCADL: Record<string, any> | undefined
    let pageYAML = ''

    if (typeof pageArg === 'string') {
      pageName = pageArg
    } else if (typeof pageArg === 'object' && 'pageName' in pageArg) {
      pageName = pageArg.pageName
      pageCADL = pageArg.cadlObject
      pageYAML = pageArg.cadlYAML || ''
    }

    if (reload === false && this.root[pageName]) {
      //keep the current pageObject
      return
    } else {
      !pageCADL && (pageCADL = (await this.getPage(pageName))?.pageCADL)
      onReceive && (await onReceive?.(pageCADL as Record<string, any>))
    }

    if (this.root[pageName] && reload) {
      //delete old pageObject if refreshing
      this.newDispatch({ type: 'DELETE_PAGE', payload: { pageName } })
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
      source: pageCADL as Record<string, any>,
      lookFor: ['.', '..', '~'],
      skip: ['update', 'save', 'check', 'init', 'components', ...skip],
      withFns: true,
      pageName,
    })

    onFirstProcess && (await onFirstProcess?.(FIRST_process))

    const SECOND_process = this.processPopulate({
      source: FIRST_process,
      lookFor: ['.', '..', '_', '~'],
      skip: ['update', 'check', 'init', 'formData', 'components', ...skip],
      withFns: true,
      pageName,
    })

    onSecondProcess && (await onSecondProcess?.(SECOND_process))

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

    let aborted = false

    //run init commands of page if any
    let init = Object.values(processedPage)[0].init
    if (init) {
      await this.runInit({
        pageObject: processedPage,
        onBeforeInit,
        onInit,
        onAfterInit,
      }).then((page) => {
        if (page?.abort) {
          aborted = true
          onAbort?.(pageCADL as Record<string, any>)
          return
        }
        //FOR COMPONENTS
        //process components
        const FIRST_processComponents = this.processPopulate({
          source: page,
          lookFor: ['.', '..', '_', '~'],
          skip: [
            'update',
            'check',
            'init',
            'formData',
            'dataIn',
            'display',
            'backgroundColor',
            // 'height',
            // 'pointerEvents',
            // 'highlightKey',
            // 'boxShadow',
            ...skip,
          ],
          withFns: true,
          pageName,
        })
        // process components again to fill in new values
        const SECOND_processComponents = this.processPopulate({
          source: FIRST_processComponents,
          lookFor: ['.', '..', '_', '~'],
          // prettier-ignore
          skip: ['update', 'check', 'edge', 'document', 'vertex', 'init', 'formData', 'dataIn', 'style', ...skip],
          withFns: true,
          pageName,
        })

        //populate the components slice of the pageObject
        const evolveComponentVals = populateArray({
          source: SECOND_processComponents[pageName].components,
          lookFor: '=',
          // prettier-ignore
          skip: ['update', 'check', 'edge', 'document', 'vertex', 'init', 'formData', 'dataIn', 'style', ...skip],
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
        // prettier-ignore
        skip: ['update', 'check', 'init', 'formData', 'dataIn', 'style', ...skip],
        withFns: true,
        pageName,
      })
      //process components again to fill in new values
      const SECOND_processComponents = this.processPopulate({
        source: FIRST_processComponents,
        lookFor: ['.', '..', '_', '~'],
        // prettier-ignore
        skip: ['update', 'check', 'edge', 'document', 'vertex', 'init', 'formData', 'dataIn', 'style', ...skip],
        withFns: true,
        pageName,
      })

      const evolveComponentVals = populateArray({
        source: SECOND_processComponents[pageName].components,
        lookFor: '=',
        // prettier-ignore
        skip: ['update', 'check', 'edge', 'document', 'vertex', 'init', 'formData', 'dataIn', ...skip],
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

    if (aborted) return { aborted }
  }

  /**
   * @param pageName
   * @returns CADL_OBJECT
   * @throws {UnableToRetrieveYAML} -When unable to retrieve cadlYAML
   * @throws {UnableToParseYAML} -When unable to parse yaml file
   */
  async getPage(pageName: string): Promise<CADL_OBJECT> {
    //TODO: used for local testing
    // if (pageName === 'AddDocuments') return _.cloneDeep(AddDocuments)
    // if (pageName === 'BaseDataModel') return _.cloneDeep(BaseDataModel)

    let pageCADL: Record<string, any>
    let pageYAML = ''
    let pageUrl = ''

    if (pageName.startsWith('~')) {
      pageUrl = this.myBaseUrl || this.baseUrl
      pageName = pageName.substring(2)
    } else {
      pageUrl = this.baseUrl
    }
    try {
      const result = await this.defaultObject(`${pageUrl}${pageName}_en.yml`)
      pageCADL = result.cadlObject
      pageYAML = result.cadlYAML
    } catch (error) {
      throw error
    }
    return { pageCADL, pageYAML }
  }

  /**
   * Retrieves and parses cadl yaml file.
   *
   * @param url
   * @returns The original object version of the noodl file
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
        error,
      )
    }

    try {
      cadlObject = parseYml(cadlYAML)
    } catch (error) {
      throw new UnableToParseYAML(`Unable to parse yaml for ${url}`, error)
    }

    return { cadlObject, cadlYAML }
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
  getData(pageName: string, dataKey: string): any {
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
    // let rootCopy = _.clone(this.root)
    let rootDeepCopy = _.cloneDeep(this.root)
    // let localCopy = _.clone(localRoot)
    let localDeepCopy = _.clone(localRoot)
    const sourceCopyWithRootKeys = populateKeys({
      source: sourceCopy,
      lookFor: '.',
      locations: [rootDeepCopy],
    })
    //populate the keys from the local page object
    const sourceCopyWithLocalKeys = populateKeys({
      source: sourceCopyWithRootKeys,
      lookFor: '..',
      locations: [localDeepCopy],
    })
    const boundDispatch = this.dispatch.bind(this)
    localRoot = pageName
      ? sourceCopyWithLocalKeys[pageName]
      : sourceCopyWithLocalKeys
    const sourceCopyWithVals = populateVals({
      source: sourceCopyWithLocalKeys,
      lookFor,
      skip,
      locations: [this, rootDeepCopy, localDeepCopy],
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
    //console.log('dispatch action type!!!', action.type)
    switch (action.type) {
      case 'search-cache': {
        //console.log('search cache payload!!!', action.payload)
        const key = action.payload.key
        const res = this._indexRepository.search(key)
        return res
      }
      case 'insert-to-object-table': {
        //yuhan
        //console.log('insert object payload!!!', action.payload)
        const doc = action.payload.doc
        let docId = doc.id
        if (docId instanceof Uint8Array) {
          docId = store.level2SDK.utilServices.uint8ArrayToBase64(docId)
        }
        const isInObjectCache = this._indexRepository.getDocById(docId)
        if (isInObjectCache.length) return
        const cachedDoc = this._indexRepository.getDocById(docId)
        if (!cachedDoc.length) {
          this._indexRepository.cacheDoc(doc)
        }

        break
      }
      case 'insert-to-index-table': {
        //console.log('insert index payload!!!', action.payload)
        let doc: any = []
        if (Array.isArray(action.payload.doc.doc)) {
          doc = action.payload.doc.doc
        } else {
          // for adding new doc
          doc = action.payload.doc
        }

        for (let item of doc) {
          let content = item?.name
          const contentAfterExtraction = basicExtraction(content)

          const fuzzyIndexCreator = new FuzzyIndexCreator()
          let docId = item?.id
          if (docId instanceof Uint8Array) {
            docId = store.level2SDK.utilServices.uint8ArrayToBase64(docId)
          }
          for (let key of contentAfterExtraction) {
            const initialMapping = fuzzyIndexCreator.initialMapping(key)
            const fKey = fuzzyIndexCreator.toFuzzyInt64(initialMapping)
            //const fKeyHex = fuzzyIndexCreator.toFuzzyHex(initialMapping)
            this._indexRepository.insertIndexData({
              // kText: key,
              // id: docId,
              // docId,
              // docType: item.type,
              // fuzzyKey: initialMapping,
              // initMapping: initialMapping,
              // fKey,
              // fKeyHex,
              // score: 0,
              kText: key,
              docId,
              docType: item?.type,
              fKey,
              score: 0,
            })
            //console.log('insert to index table!!!', fKey, initialMapping, fKeyHex)
          }
        }

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
        if (res) {
          return res
        }
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
              apiDispatchBufferObject[hash]?.timestamp,
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
        // action.payload === cache index
        return this.root.apiCache[action.payload.cacheIndex].data
      }
      case 'emit-update': {
        const { pageName, dataKey, newVal } = action.payload
        this.emit('stateChanged', {
          name: 'update',
          path: `${pageName}.${dataKey}`,
          newVal,
        })
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

    let condResult: boolean | 'true' | 'false' | undefined
    let lookFor = undefined as string | undefined

    if (nt.Identify.isBoolean(condExpression)) {
      condResult = condExpression
    } else if (u.isFnc(condExpression)) {
      condResult = await condExpression()
    } else if (
      u.isStr(condExpression) &&
      ['.', '='].some((op) => condExpression.startsWith(op))
    ) {
      //condExpression is a path pointing to a reference
      // prettier-ignore
      lookFor = ['..', '.', '=',].find((op) => condExpression.startsWith(op))

      let res: any

      const isLocalEvalRef = ['=..', '..'].some((op) =>
        condExpression.startsWith(op),
      )

      const isRootEvalRef =
        !isLocalEvalRef &&
        ['.', '=.'].some((op) => condExpression.startsWith(op))

      if (lookFor && (isRootEvalRef || isLocalEvalRef)) {
        res = populateString({
          source: condExpression,
          locations: [isRootEvalRef ? this.root : this.root[pageName]],
          lookFor,
        })
      }

      // prettier-ignore
      condResult = u.isFnc(res)
        ? await res()
        : res && res !== condExpression
          ? nt.Identify.isBooleanFalse(condResult) ? false : true : false
    } else if (
      isObject(condExpression) &&
      u.keys(condExpression)?.[0]?.startsWith('=')
    ) {
      //condExpression matches an evalObject function evaluation
      const payload = { pageName, updateObject: condExpression }
      condResult = await this.dispatch({ type: 'eval-object', payload })
    }

    const effectValue = condResult ? ifTrueEffect : ifFalseEffect
    const isPlainObject = u.isObj(effectValue)
    const leadingKey = isPlainObject ? u.keys(effectValue)[0] : null
    const hasActionTypeKey = isPlainObject && 'actionType' in effectValue
    const isEvalObject =
      hasActionTypeKey && effectValue.actionType === 'evalObject'

    if (u.isFnc(effectValue)) {
      await effectValue()
      return
    }

    if (isPlainObject) {
      if (nt.Identify.folds.goto(effectValue)) {
        //handles goto function logic
        const result = populateVals({
          source: effectValue,
          pageName,
          lookFor: ['..', '.', '='],
          locations: [this.root, this.root[pageName]],
        })
        await this.root.builtIn?.goto?.({
          pageName,
          goto: u.isStr(result?.goto)
            ? result.goto
            : u.isObj(result?.goto)
              ? result.goto.dataIn
              : result,
        })
        return { abort: true }
      }

      // if (effectValue === ifFalseEffect && u.isFnc(effectValue)) {
      //   await effectValue()
      //   return
      // }

      if (leadingKey?.includes('@') || leadingKey?.startsWith('=')) {
        const payload = { pageName, updateObject: effectValue }
        await this.dispatch({ type: 'eval-object', payload })
        return
      }

      if (isEvalObject) {
        // matches an evalObject actionType
        const result = await this.dispatch({
          type: 'eval-object',
          payload: { pageName, updateObject: effectValue?.object },
        })
        return result
      }

      if (hasActionTypeKey || Array.isArray(effectValue)) {
        //this returns unhandled object expressions that will be handled by the UI
        return effectValue
      }

      let lookFor: string | undefined
      let res: any

      if (u.isStr(effectValue)) {
        lookFor = ['..', '.', '='].find((op) => effectValue.startsWith(op))
        if (lookFor) {
          //effectValue is a path that points to a reference
          res = populateString({
            source: effectValue,
            locations: [this.root, this.root[pageName]],
            lookFor,
          })
        } else {
          return effectValue
        }
      }

      if (u.isFnc(res)) {
        // reference is a function
        await res()
      } else if (isObject(res)) {
        //reference is an object
        //assume that it is an evalObject object function evaluation type
        const withFns = attachFns({
          cadlObject: res,
          dispatch: this.dispatch.bind(this),
        })

        const { dataIn, dataOut } = u.values(
          u.isObj(effectValue) ? effectValue : {},
        )?.[0]

        if (u.isFnc(withFns)) {
          const result = dataIn ? await withFns(dataIn) : await withFns()

          if (dataOut) {
            const pathArr = dataOut.split('.')
            const payload = { dataKey: pathArr, value: result }
            this.newDispatch({ type: 'SET_VALUE', payload })
          }
          return result
        } else if (u.isArr(withFns) && u.isFnc(withFns[1])) {
          const result = dataIn ? await withFns[1](dataIn) : await withFns[1]()
          if (dataOut) {
            this.newDispatch({
              type: 'SET_VALUE',
              payload: { dataKey: dataOut.split('.'), value: result },
            })
          }
          return result
        }
      } else if (u.isArr(res) && u.isFnc(res?.[1])) {
        const result = await res[1]()
        return result
      } else {
        return res
      }
    }

    return effectValue
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
  async updateObject(args: {
    dataKey: string
    dataObject: any
    dataObjectKey?: string
  }) {
    const { dataKey, dataObject, dataObjectKey } = args
    const path = dataKey.startsWith('.')
      ? dataKey.substring(1, dataKey.length)
      : dataKey
    const pathArr = path.split('.')
    const newVal = dataObjectKey ? dataObject[dataObjectKey] : dataObject
    this.newDispatch({
      type: 'SET_VALUE',
      payload: { dataKey: pathArr, value: newVal, replace: true },
    })
    await this.dispatch({ type: 'update-localStorage' })
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
   * @param onBeforeInit
   * @param onInit
   * @param onAfterInit
   */
  async runInit<Init extends any[]>({
    pageObject = {},
    onBeforeInit,
    onInit,
    onAfterInit,
  }: {
    pageObject: Record<string, any>
    onBeforeInit?(init: Init): Promise<void> | void
    onInit?(current: any, index: number, init: Init): Promise<void> | void
    onAfterInit?(error: null | Error, init: Init): Promise<void> | void
  }): Promise<Record<string, any>> {
    return new Promise(async (resolve) => {
      let boundDispatch = this.dispatch.bind(this)
      let page = pageObject
      let pageName = Object.keys(page)[0]
      let init = Object.values(page)[0].init

      if (init) {
        onBeforeInit && (await onBeforeInit?.(init))
        //adds commands to queue
        this.initCallQueue = init.map((_, index: number) => index)
        while (this.initCallQueue.length > 0) {
          const currIndex = this.initCallQueue.shift()
          const command: any = init[currIndex]
          onInit && (await onInit?.(command, currIndex, init))

          let populatedCommand

          if (
            isObject(command) &&
            (u.keys(command)[0].includes('=') ||
              u.keys(command)[0].includes('@'))
          ) {
            const payload = { updateObject: command, pageName }
            await this.dispatch({ type: 'eval-object', payload })
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
              await populatedCommand()
            } catch (error) {
              onAfterInit?.(error, init)
              throw new UnableToExecuteFn(
                `An error occured while executing ${pageName}.init. Check command at index ${currIndex} under init`,
                error,
              )
            }
          } else if (
            isObject(populatedCommand) &&
            'actionType' in populatedCommand
          ) {
            const { actionType, dataKey, dataObject, object, funcName }: any =
              populatedCommand
            if (actionType === 'updateObject') {
              await this.updateObject({ dataKey, dataObject })
            } else if (actionType === 'builtIn') {
              if (funcName === 'videoChat') {
                await this.root.builtIn?.[funcName]?.(populatedCommand)
              }
            } else if (actionType === 'evalObject') {
              const payload = { pageName, updateObject: object }
              await this.dispatch({ type: 'eval-object', payload })
            }
          } else if (isObject(populatedCommand) && 'if' in populatedCommand) {
            //TODO: add the then condition
            const ifResult = await this.handleIfCommand({
              pageName,
              ifCommand: populatedCommand,
            })
            ifResult?.abort && resolve({ abort: true })
          } else if (Array.isArray(populatedCommand)) {
            if (typeof populatedCommand[0][1] === 'function') {
              try {
                await populatedCommand[0][1]()
              } catch (error) {
                throw new UnableToExecuteFn(
                  `An error occured while executing ${pageName}.init`,
                  error,
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
        await onAfterInit?.(null, init)
        resolve(page)
      }
    })
  }

  /**
   * Sets either the user or meetroom value from localStorage to the corresponding root value in memory
   */
  setFromLocalStorage(key: 'user' | 'meetroom'): void {
    try {
      let serializedGlobal = localStorage.getItem('Global')
      if (serializedGlobal) {
        const Global = JSON.parse(serializedGlobal)
        for (const [k, path] of [
          ['user', 'currentUser.vertex'],
          ['meetroom', 'meetroom.edge'],
        ]) {
          if (k === key) {
            const dataKey = `Global.${path}`
            this.newDispatch({
              type: 'SET_VALUE',
              payload: { dataKey, value: _.get(Global, path) },
            })
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Used to mutate the draft state.
   *
   * @param callback Function used to update the state
   */
  editDraft(callback: (draft: Draft<CADL['root']>) => void) {
    this.newDispatch({ type: 'EDIT_DRAFT', payload: { callback } })
  }

  private initRoot(root: CADL['root']) {
    return produce(root, (draft) => {
      draft.actions = {}
      draft.builtIn = builtInFns(this.dispatch.bind(this))
      draft.apiCache = {}
    })
  }

  newDispatch<T extends keyof typeof producer>(action: ReducerAction<T>) {
    if (!isObject(action)) throw new Error('Actions must be plain objects')
    if (typeof action.type === 'undefined') {
      throw new Error('Action types cannot be undefined.')
    }
    this.root = reducer(this.root, action)
    return action
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
  async emitCall({
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
        let object = action?.object
        await object()

        // const response = await this.handleEvalObject({ object: action?.object, pageName })
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
      } else if ('goto' in action) {
        await this.handleEvalCommands({
          pageName,
          commands: actionWithVals,
          key: 'goto',
        })
      }
    })

    return Object.values(returnValues)
  }

  private get baseUrl() {
    return this._baseUrl
  }

  private set baseUrl(baseUrl) {
    if (this.cadlBaseUrl) {
      this._baseUrl = baseUrl.replace('${cadlBaseUrl}', this.cadlBaseUrl)
    }
  }

  get cadlBaseUrl() {
    if (!this._cadlBaseUrl) return undefined
    let baseUrlWithVersion = this._cadlBaseUrl
    if (baseUrlWithVersion.includes('cadlVersion')) {
      baseUrlWithVersion = baseUrlWithVersion.replace(
        '${cadlVersion}',
        this.cadlVersion,
      )
    }
    if (baseUrlWithVersion.includes('designSuffix')) {
      baseUrlWithVersion = baseUrlWithVersion.replace(
        '${designSuffix}',
        this.designSuffix || '',
      )
    }
    return baseUrlWithVersion
  }

  set cadlBaseUrl(cadlBaseUrl) {
    this._cadlBaseUrl = cadlBaseUrl
  }

  get assetsUrl() {
    return this._assetsUrl
  }

  set assetsUrl(assetsUrl) {
    if (this.cadlBaseUrl) {
      this._assetsUrl = assetsUrl.replace('${cadlBaseUrl}', this.cadlBaseUrl)
    }
  }

  get designSuffix() {
    const { greaterEqual, less, widthHeightRatioThreshold } =
      this._designSuffix || {}
    return this.aspectRatio >= widthHeightRatioThreshold ? greaterEqual : less
  }

  set designSuffix(designSuffix) {
    this._designSuffix = designSuffix || ''
  }

  get aspectRatio() {
    return this._aspectRatio
  }

  set aspectRatio(aspectRatio) {
    this._aspectRatio = aspectRatio
    if (this.cadlBaseUrl) {
      this._baseUrl = this.cadlBaseUrl
    }
  }

  get root() {
    return this._root
  }

  set root(root) {
    this._root = root || {}
  }

  set apiVersion(apiVersion) {
    store.apiVersion = apiVersion
  }

  get apiVersion() {
    return store.apiVersion
  }

  getConfig() {
    return this._config
  }
}

export default CADL
