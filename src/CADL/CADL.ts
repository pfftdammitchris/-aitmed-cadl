import axios from 'axios'
import YAML from 'yaml'
import _ from 'lodash'
import dot from 'dot-object'

import {
    populateObject,
    attachFns,
    populateKeys,
    builtInFns,
    populateVals,
    replaceUint8ArrayWithBase64,
    replaceEvalObject,
} from './utils'
import store, {
    ResponseCatcher,
    ErrorCatcher
} from '../common/store'
import {
    UnableToParseYAML,
    UnableToRetrieveYAML,
    UnableToExecuteFn,
    UnableToLoadConfig
} from './errors'
import {
    CADL_OBJECT,
    CADLARGS
} from './types'

import { mergeDeep } from '../utils'
export default class CADL {

    private _cadlVersion: 'test' | 'stable'
    private _cadlEndpoint: CADL_OBJECT
    private _cadlBaseUrl: string
    private _baseUrl: string
    private _assetsUrl: string
    private _map: Record<string, any>
    private _root: Record<string, any> = {}
    private _builtIn: Record<string, any> = builtInFns(this.dispatch.bind(this))
    private _initCallQueue: any[]

    constructor({ env, configUrl, cadlVersion }: CADLARGS) {
        //replace default arguments
        store.env = env
        store.configUrl = configUrl
        this._cadlVersion = cadlVersion
    }

    /**
     * -loads config if not already loaded
     * 
     * -sets CADL version, baseUrl, assetsUrl, and root
     * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
     * @throws UnableToParseYAML -if unable to parse yaml file
     * @throws UnableToLoadConfig -if unable to load config data
     */
    //TODO: add a force parameter to allow user to force init again
    public async init({ BaseDataModel, BaseCSS, BasePage }: {
        BaseDataModel?: Record<string, any>,
        BaseCSS?: Record<string, any>,
        BasePage?: Record<string, any>
    } = {}): Promise<void> {
        if (this.cadlEndpoint) return
        //get config
        let config: any = store.getConfig()
        if (config === null) {
            try {
                config = await store.level2SDK.loadConfigData('meet')
            } catch (error) {
                throw new UnableToLoadConfig('An error occured while trying to load the config', error)
            }
        }

        const { web, cadlBaseUrl, cadlMain } = config

        //set cadlVersion
        this.cadlVersion = web.cadlVersion[this.cadlVersion]
        this.cadlBaseUrl = cadlBaseUrl

        //set cadlEndpoint
        let cadlEndpointUrl = `${this.cadlBaseUrl}${cadlMain}`
        let cadlEndpoint = await this.defaultObject(cadlEndpointUrl)
        this.cadlEndpoint = cadlEndpoint

        const { baseUrl, assetsUrl, preload } = this.cadlEndpoint

        //set baseUrl and assets Url
        this.baseUrl = baseUrl
        this.assetsUrl = assetsUrl

        if (BaseDataModel) {
            const processedBaseDataModel = this.processPopulate({
                source: BaseDataModel,
                lookFor: ['.', '..', '='],
            })
            this.root = { ...this.root, ...processedBaseDataModel }
        }
        if (BaseCSS) {
            const processedBaseCSS = this.processPopulate({
                source: BaseCSS,
                lookFor: ['.', '..', '='],
            })
            this.root = { ...this.root, ...processedBaseCSS }
        }
        if (BasePage) {
            const processedBasePage = this.processPopulate({
                source: BasePage,
                lookFor: ['.', '..', '='],
            })
            this.root = { ...this.root, ...processedBasePage }
        }

        if (preload && preload.length) {
            for (let pageName of preload) {
                switch (pageName) {
                    case ('BaseDataModel'): {
                        if (BaseDataModel) break
                        const rawBaseDataModel = await this.getPage('BaseDataModel')
                        const processedBaseDataModel = this.processPopulate({
                            source: rawBaseDataModel,
                            lookFor: ['.', '..', '='],
                        })
                        this.root = { ...this.root, ...processedBaseDataModel }
                        break
                    }
                    case ('BaseCSS'): {
                        if (BaseCSS) break
                        const rawBaseCSS = await this.getPage('BaseCSS')
                        const processedBaseCSS = this.processPopulate({
                            source: rawBaseCSS,
                            lookFor: ['.', '..', '='],
                        })
                        this.root = { ...this.root, ...processedBaseCSS }
                        break
                    }
                    case ('BasePage'): {
                        if (BasePage) break
                        const rawBasePage = await this.getPage('BasePage')
                        const processedBasePage = this.processPopulate({
                            source: rawBasePage,
                            lookFor: ['.', '..', '='],
                        })
                        this.root = { ...this.root, ...processedBasePage }
                        break
                    }
                    default: {
                        const rawPage = await this.getPage(pageName)
                        const processedRawPage = this.processPopulate({
                            source: rawPage,
                            lookFor: ['.', '..', '='],
                        })
                        this.root = { ...this.root, ...processedRawPage }
                        break
                    }
                }
            }
        }

        this.dispatch({ type: 'update-map' })
    }


    /**
     * 
     * @param pageName 
     * 
     * - initiates cadlObject for page specified
     * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
     * @throws UnableToParseYAML -if unable to parse yaml file
     * @throws UnableToExecuteFn -if something goes wrong while executing any init function
     */
    async initPage(pageName: string, skip: string[] = []) {
        if (!this.cadlEndpoint) await this.init()

        let pageCADL = await this.getPage(pageName)
        //FOR FORMDATA
        //process formData
        const processedFormData = this.processPopulate({
            source: pageCADL,
            lookFor: ['.', '..', '='],
            skip: ['update', 'components', 'init', ...skip],
            withFns: true,
            pageName
        })

        //FOR FNS
        //process components
        const processedWithFns = this.processPopulate({
            source: processedFormData,
            lookFor: ['.', '..', '=', '_'],
            skip: ['update', 'formData', 'components', ...skip],
            withFns: true,
            pageName
        })

        // //replace updateObj with Fn
        const boundDispatch = this.dispatch.bind(this)
        // let replaceUpdateJob = replaceUpdate({ pageName, cadlObject: processedFormData, dispatch: boundDispatch })


        let processedPage = processedWithFns
        this.root = { ...this.root, ...processedPage }

        //run init commands if any
        let init = Object.values(processedPage)[0].init
        if (init) {
            this.initCallQueue = init.map((_command, index) => index)
            while (this.initCallQueue.length > 0) {
                const currIndex = this.initCallQueue.shift()
                const command = init[currIndex]
                if (typeof command === 'function') {
                    try {
                        //TODO: check dispatch function/ side effects work accordingly
                        await command()
                    } catch (error) {
                        throw new UnableToExecuteFn(`An error occured while executing ${pageName}.init`, error)
                    }

                    //updating page after command has been called
                    const updatedPage = this.root[pageName]

                    //populateObject again to populate any data that was dependant on the command call
                    let populatedUpdatedPage = populateObject({
                        source: updatedPage,
                        lookFor: '..',
                        skip: ['components'],
                        locations: [this.root[pageName]]
                    })

                    const populatedUpdatedPageWithFns = attachFns({ cadlObject: { [pageName]: populatedUpdatedPage }, dispatch: boundDispatch })

                    processedPage = populatedUpdatedPageWithFns

                    init = Object.values(populatedUpdatedPageWithFns)[0].init

                    this.root[pageName] = { ...this.root[pageName], ...Object.values(populatedUpdatedPageWithFns)[0] }
                }
            }
        }
        //FOR COMPONENTS
        //process components
        const processedComponents = this.processPopulate({
            source: processedPage,
            lookFor: ['.', '..', '=', '_'],
            skip: ['update', 'formData', ...skip],
            withFns: true,
            pageName
        })
        let replaceUpdateJob2 = replaceEvalObject({ pageName, cadlObject: processedComponents, dispatch: boundDispatch })
        this.root = { ...this.root, ...replaceUpdateJob2 }
        this.dispatch({ type: 'update-map' })
    }

    /**
     * @returns CADL_OBJECT
     * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
     * @throws UnableToParseYAML -if unable to parse yaml file
     */
    public async getPage(pageName): Promise<CADL_OBJECT> {
        let pageCADL
        try {
            let url = `${this.baseUrl}${pageName}_en.yml`
            pageCADL = await this.defaultObject(url)
        } catch (error) {
            throw error
        }
        return pageCADL
    }

    /**
     * 
     * @param url string
     * @returns Promise<Record<string, any>>
     * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
     * @throws UnableToParseYAML -if unable to parse yaml file
     * 
     * -retrieves and parses cadl yaml file
     */
    private async defaultObject(url: string): Promise<Record<string, any>> {
        let cadlYAML, cadlObject
        try {
            const { data } = await axios.get(url)
            cadlYAML = data
        } catch (error) {
            throw new UnableToRetrieveYAML(`Unable to retrieve yaml for ${url}`, error)
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
     * @param dataKey string
     * @returns any
     * 
     * -returns data associated with given pageName and dataKey
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
     * 
     * @param action 
     */
    private processPopulate({
        source,
        lookFor,
        skip,
        pageName,
        withFns = false
    }: {
        source: Record<string, any>,
        lookFor: string[],
        pageName?: string,
        skip?: string[],
        withFns?: boolean
    }): Record<string, any> {
        // let localStorageRoot = {}
        // try {
        //     const root = localStorage.getItem('root')
        //     if (root) {
        //         localStorageRoot = JSON.parse(root)
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
        let sourceCopy = _.cloneDeep(source)
        let localRoot = pageName ? sourceCopy[pageName] : sourceCopy
        const sourceCopyWithKeys = populateKeys({
            source: sourceCopy,
            lookFor: '.',
            locations: [this.root, sourceCopy]
        })
        localRoot = pageName ? sourceCopyWithKeys[pageName] : sourceCopyWithKeys
        const sourceCopyWithVals = populateVals({
            source: sourceCopyWithKeys,
            lookFor,
            skip,
            locations: [this.root, localRoot]
        })
        localRoot = pageName ? sourceCopyWithVals[pageName] : sourceCopyWithKeys
        let populatedResponse = sourceCopyWithVals
        if (withFns) {
            const boundDispatch = this.dispatch.bind(this)
            populatedResponse = attachFns({
                cadlObject: sourceCopyWithVals,
                dispatch: boundDispatch
            })
        }
        return populatedResponse
    }

    /**
     * 
     * @param action 
     */
    private dispatch(action: { type: string, payload?: any }) {
        switch (action.type) {
            case ('populate'): {
                // let localStorageRoot = {}
                // try {
                //     const root = localStorage.getItem('root')
                //     if (root) {
                //         localStorageRoot = JSON.parse(root)
                //     }
                // } catch (error) {
                //     console.log(error)
                // }
                const { pageName } = action.payload
                const pageObjectCopy = _.cloneDeep(this.root[pageName])
                const boundDispatch = this.dispatch.bind(this)

                const populateWithRoot = populateObject({
                    source: pageObjectCopy,
                    lookFor: '.',
                    locations: [this.root, this.root[pageName]]
                })
                const populateWithSelf = populateObject({
                    source: populateWithRoot,
                    lookFor: '..',
                    locations: [this.root, this.root[pageName]]
                })
                const populateAfterInheriting = populateObject({
                    source: populateWithSelf,
                    lookFor: '=',
                    locations: [this.root, this.root[pageName]]
                })

                const withFNs = attachFns({
                    cadlObject: populateAfterInheriting,
                    dispatch: boundDispatch
                })

                this.root[pageName] = withFNs
                break
            }
            case ('update-data'): {
                const { pageName, dataKey, data: rawData } = action.payload
                let data = replaceUint8ArrayWithBase64(rawData)
                const firstCharacter = dataKey[0]
                const pathArr = dataKey.split('.')
                if (pageName === 'builtIn') {
                    _.set(this, pathArr, data)
                } else if (firstCharacter === firstCharacter.toUpperCase()) {
                    const currentVal = _.get(this.root, pathArr)
                    const mergedVal = mergeDeep(currentVal, data)
                    _.set(this.root, pathArr, mergedVal)
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
                    } else {
                        mergedVal = data
                    }
                    _.set(this.root[pageName], pathArr, mergedVal)
                }

                return
            }
            case ('get-data'): {
                const { pageName, dataKey } = action.payload
                const pathArr = dataKey.split('.')
                const currentVal = _.get(this.root[pageName], pathArr) || _.get(this.root, pathArr)
                return currentVal
            }
            case ('eval-object'): {
                // let localStorageRoot = {}
                // try {
                //     const root = localStorage.getItem('root')
                //     if (root) {
                //         localStorageRoot = JSON.parse(root)
                //     }
                // } catch (error) {
                //     console.log(error)
                // }
                const { pageName, updateObject } = action.payload
                const populateWithRoot = populateObject({ source: updateObject, lookFor: '.', locations: [this.root, this.root[pageName]] })
                const populateWithSelf = populateObject({ source: populateWithRoot, lookFor: '..', locations: [this.root, this.root[pageName]] })
                const populateAfterInheriting = populateObject({ source: populateWithSelf, lookFor: '=', locations: [this, this.root, this.root[pageName]] })
                Object.keys(populateAfterInheriting).forEach(async (key) => {
                    //TODO: add case for key that starts with =
                    if (!key.startsWith('=')) {
                        let trimPath, location
                        if (key.startsWith('..')) {
                            trimPath = key.substring(2, key.length - 1)
                            location = this.root[pageName]
                        } else if (key.startsWith('.')) {
                            trimPath = key.substring(1, key.length - 1)
                            location = this.root
                        }
                        const pathArr = trimPath.split('.')
                        const val = populateAfterInheriting[key]
                        _.set(location, pathArr, val)
                    } else if (key.startsWith('=')) {
                        const trimPath = key.substring(2, key.length)
                        const pathArr = trimPath.split('.')
                        const val = _.get(this.root, pathArr) || _.get(this.root[pageName], pathArr)

                        const populateWithRoot = populateObject({
                            source: val,
                            lookFor: '.',
                            locations: [this.root, this.root[pageName]]
                        })

                        const populateWithSelf = populateObject({
                            source: populateWithRoot,
                            lookFor: '..',
                            locations: [this.root, this.root[pageName]]
                        })

                        const populateAfterInheriting = populateObject({
                            source: populateWithSelf,
                            lookFor: '=',
                            locations: [this.root, this.root[pageName]]
                        })

                        const boundDispatch = this.dispatch.bind(this)
                        const withFn = attachFns({
                            cadlObject: populateAfterInheriting,
                            dispatch: boundDispatch
                        })
                        if (typeof withFn === 'function') {
                            await withFn()
                        }
                    }
                })
                this.dispatch({ type: 'populate', payload: { pageName: 'Global' } })
                this.dispatch(
                    {
                        type: 'update-localStorage',
                    }
                )
                break
            }
            case ('update-localStorage'): {
                localStorage.setItem('root', JSON.stringify(this.root))
                break
            }
            case ('update-map'): {
                //TODO: consider adding update-page-map
                this.map = dot.dot(this.root)
                break
            }

            default: {
                return
            }
        }
    }

    /**
     * 
     * @param params
     *  params.dataKey string
     *  params.dataObject Record<string, any>
     *  params.dataObjectKey string
     */
    public updateObject({ dataKey, dataObject, dataObjectKey }: { dataKey: string, dataObject: Record<string, any>, dataObjectKey: string }) {
        let trimPath, location
        if (dataKey.startsWith('.')) {
            trimPath = dataKey.substring(1, dataKey.length)
            location = this.root
        }
        const pathArr = trimPath.split('.')
        _.set(location, pathArr, dataObject[dataObjectKey])
    }

    /**
     * 
     * @param pageName string
     * - runs the init functions of the page matching the pageName
     */
    public async runInit(pageName: string): Promise<void> {
        const boundDispatch = this.dispatch.bind(this)

        //run init commands if any
        let page: Record<string, any> = this.root[pageName]
        let init = page.init
        if (init) {

            this.initCallQueue = init.map((_command, index) => index)
            while (this.initCallQueue.length > 0) {
                const currIndex = this.initCallQueue.shift()
                const command = init[currIndex]
                if (typeof command === 'function') {
                    try {
                        //TODO: check dispatch function/ side effects work accordingly
                        await command()
                    } catch (error) {
                        throw new UnableToExecuteFn(`An error occured while executing ${pageName}.init`, error)
                    }

                    //updating page after command has been called
                    const updatedPage = this.root[pageName]

                    //populateObject again to populate any data that was dependant on the command call
                    let populatedUpdatedPage = populateObject({
                        source: updatedPage,
                        lookFor: '..',
                        skip: ['components'],
                        locations: [this.root[pageName]]
                    })

                    const populatedUpdatedPageWithFns = attachFns({ cadlObject: { [pageName]: populatedUpdatedPage }, dispatch: boundDispatch })

                    page = populatedUpdatedPageWithFns

                    init = Object.values(populatedUpdatedPageWithFns)[0].init

                    this.root[pageName] = { ...this.root[pageName], ...Object.values(populatedUpdatedPageWithFns)[0] }
                }
            }
        }
    }

    /**
     * 
     * @param key "user" | "meetroom"
     * 
     * -sets either the user or meetroom value from localStorage to the corresponding root value in memory
     */
    public setFromLocalStorage(key: "user" | "meetroom") {
        let localStorageRoot
        try {
            const root = localStorage.getItem('root')
            if (root) {
                localStorageRoot = JSON.parse(root)
            }
        } catch (error) {
            console.log(error)
        }
        if (localStorageRoot) {
            const { Global, meetroom } = localStorageRoot
            switch (key) {
                case ("user"): {
                    let user = Global.currentUser.vertex
                    this.root.Global.currentUser.vertex = user
                    break
                }
                case ("meetroom"): {
                    let currMeetroom = meetroom.edge
                    this.root.meetroom.edge = currMeetroom
                    break
                }
                default: {
                    return
                }
            }
        }
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
    public get baseUrl() {
        return this._baseUrl
    }

    public set baseUrl(baseUrl) {
        this._baseUrl = baseUrl.replace('${cadlBaseUrl}', this.cadlBaseUrl)


    }
    public get cadlBaseUrl() {
        return this._cadlBaseUrl
    }

    public set cadlBaseUrl(cadlBaseUrl) {
        this._cadlBaseUrl = cadlBaseUrl.replace('${cadlVersion}', this.cadlVersion)
    }

    public get assetsUrl() {
        return this._assetsUrl
    }

    public set assetsUrl(assetsUrl) {
        this._assetsUrl = assetsUrl.replace('${cadlBaseUrl}', this.cadlBaseUrl)
    }


    public get root() {
        return this._root
    }

    public set root(root) {
        this._root = root || {}
    }
    public get builtIn() {
        return this._builtIn
    }
    public set builtIn(builtIn) {
        this._builtIn = builtIn || {}

    }

    set apiVersion(apiVersion) {
        store.apiVersion = apiVersion
    }

    get apiVersion() {
        return store.apiVersion
    }
    set map(map) {
        this._map = map
    }

    get map() {
        return this._map
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


    /**
     * Only able to be set when env = development
     * @param catcher if undefined, reset the catcher to be default
     */
    public setResponseCatcher(catcher?: ResponseCatcher) {
        store.setResponseCatcher(catcher)
    }

    /**
     * Only able to be set when env = development
     * @param catcher if undefined, reset the catcher to be default
     */
    public setErrorCatcher(catcher?: ErrorCatcher) {
        store.setErrorCatcher(catcher)
    }


} 