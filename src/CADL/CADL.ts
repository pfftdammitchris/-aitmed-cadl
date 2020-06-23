import axios from 'axios'
import YAML from 'yaml'
import _ from 'lodash'
import {
    populateObject,
    attachFns,
    populateKeys,
    replaceUpdate,
    builtInFns,
} from './utils'
import store, {
    ResponseCatcher,
    ErrorCatcher
} from '../common/store'
import {
    UnableToParseYAML,
    UnableToRetrieveYAML,
    UnableToExecuteFn
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
    private _root: Record<string, any> = {}
    private _builtIn: Record<string, any> = builtInFns(this.dispatch.bind(this))
    private _callQueue: any[]

    constructor({ env, configUrl, cadlVersion }: CADLARGS) {
        //replace default arguments
        store.env = env
        store.configUrl = configUrl
        this._cadlVersion = cadlVersion
    }

    /**
     * -loads config if not already loaded
     * 
     * -sets CADL version, baseUrl, assetsUrl, baseDataModel, baseCSS
     * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
     * @throws UnableToParseYAML -if unable to parse yaml file
     */
    //TODO: add a force parameter to allow user to force init again
    public async init({ BaseDataModel, BaseCSS, BasePage }: {
        BaseDataModel?: Record<string, any>,
        BaseCSS?: Record<string, any>,
        BasePage?: Record<string, any>
    } = {}): Promise<void> {
        if (this.cadlEndpoint) return

        //get config
        let config = store.getConfig()
        if (config === null) {
            //@ts-ignore
            config = await store.level2SDK.loadConfigData('aitmed')
        }
        //@ts-ignore
        const { cadlEndpoint: cadlEndpointUrl, web, cadlBaseUrl, cadlMain } = config

        //set cadlVersion
        this.cadlVersion = web.cadlVersion[this.cadlVersion]
        this.cadlBaseUrl = cadlBaseUrl


        let cadlEndpoint = await this.defaultObject(`${this.cadlBaseUrl}${cadlMain}`)
        this.cadlEndpoint = cadlEndpoint

        const { baseUrl, assetsUrl, preload } = cadlEndpoint

        //set baseUrl and assets Url
        this.baseUrl = baseUrl
        this.assetsUrl = assetsUrl

        if (BaseDataModel) {
            const populatedBaseDataModelKeys = populateKeys({ source: BaseDataModel, lookFor: '.', locations: [BaseDataModel] })
            //populate baseDataModel vals
            const populatedBaseDataModelVals = populateObject({ source: populatedBaseDataModelKeys, lookFor: '.', locations: [populatedBaseDataModelKeys] })

            this.root = { ...this.root, ...populatedBaseDataModelVals }
        }
        if (BaseCSS) {
            const populatedBaseCSSKeys = populateKeys({ source: BaseCSS, lookFor: '.', locations: [BaseCSS] })

            //populate baseCSS vals
            const populatedBaseCSSVals = populateObject({ source: populatedBaseCSSKeys, lookFor: '.', locations: [populatedBaseCSSKeys] })

            this.root = { ...this.root, ...populatedBaseCSSVals }
        }
        if (BasePage) {
            const populatedBasePageKeys = populateKeys({ source: BasePage, lookFor: '.', locations: [BasePage] })

            //populate BasePage vals
            const populatedBasePageVals = populateObject({ source: populatedBasePageKeys, lookFor: '.', locations: [populatedBasePageKeys] })

            this.root = { ...this.root, ...populatedBasePageVals }
        }

        if (preload && preload.length) {
            //populate baseDataModel keys
            //TODO: refactor to reduce redundancy
            for (let pageName of preload) {
                switch (pageName) {
                    case ('BaseDataModel'): {
                        if (BaseDataModel) break
                        const rawBaseDataModel = await this.getPage('BaseDataModel')
                        const populatedBaseDataModelKeys = populateKeys({ source: rawBaseDataModel, lookFor: '.', locations: [rawBaseDataModel] })
                        //populate baseDataModel vals
                        const populatedBaseDataModelVals = populateObject({ source: populatedBaseDataModelKeys, lookFor: '.', locations: [populatedBaseDataModelKeys] })

                        this.root = { ...this.root, ...populatedBaseDataModelVals }

                        break
                    }
                    case ('BaseCSS'): {
                        if (BaseCSS) break
                        //populate baseCSS keys
                        const rawBaseCSS = await this.getPage('BaseCSS')
                        const populatedBaseCSSKeys = populateKeys({ source: rawBaseCSS, lookFor: '.', locations: [rawBaseCSS] })

                        //populate baseCSS vals
                        const populatedBaseCSSVals = populateObject({ source: populatedBaseCSSKeys, lookFor: '.', locations: [populatedBaseCSSKeys] })

                        this.root = { ...this.root, ...populatedBaseCSSVals }

                        break
                    }
                    case ('BasePage'): {
                        if (BasePage) break
                        const rawBasePage = await this.getPage('BasePage')
                        const populatedBasePageKeys = populateKeys({ source: rawBasePage, lookFor: '.', locations: [rawBasePage] })

                        //populate BasePage vals
                        const populatedBasePageVals = populateObject({ source: populatedBasePageKeys, lookFor: '.', locations: [populatedBasePageKeys] })

                        this.root = { ...this.root, ...populatedBasePageVals }
                        break
                    }
                    default: {
                        const rawPage = await this.getPage(pageName)
                        const populatedKeys = populateKeys({ source: rawPage, lookFor: '.', locations: [rawPage] })
                        const populatedVals = populateObject({ source: populatedKeys, lookFor: '.', locations: [populatedKeys] })

                        this.root = { ...this.root, ...populatedVals }
                        break
                    }
                }
            }
        }
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
    async initPage(pageName: string) {
        if (!this.cadlEndpoint) await this.init()

        let pageCADL = await this.getPage(pageName)

        //make a copy of the CADL object
        let cadlCopy = _.cloneDeep(pageCADL)
        const boundDispatch = this.dispatch.bind(this)

        //populate keys 
        let populatedKeysCadlCopy = populateKeys({ source: cadlCopy, lookFor: '.', locations: [this.root] })

        //FOR FORMDATA
        //populate the values from baseDataModels for formData
        const populatedBaseData = populateObject({ source: populatedKeysCadlCopy, lookFor: '.', locations: [this.root], skip: ['update', 'components'] })

        //TODO: refac to keep reference to local object within the root e.g SignIn, SignUp
        //populate the values from self
        const populatedSelfData = populateObject({ source: populatedBaseData, lookFor: '..', locations: [Object.values(populatedBaseData)[0]], skip: ['update', 'components'] })
        const populatedAfterInheriting = populateObject({ source: populatedSelfData, lookFor: '=', locations: [Object.values(populatedSelfData)[0], this.root], skip: ['update', 'components'] })
        //TODO: add skip prop
        //attach functions
        const withFNs = attachFns({ cadlObject: populatedAfterInheriting, dispatch: boundDispatch })

        let replaceUpdateJob = replaceUpdate({ pageName, cadlObject: withFNs, dispatch: boundDispatch })


        //FOR COMPONENTS
        //populate the values from baseDataModels for components
        const populatedBaseDataComp = populateObject({ source: replaceUpdateJob, lookFor: '.', locations: [this.root], skip: ['update', 'formData'] })

        //TODO: refac to keep reference to local object within the root e.g SignIn, SignUp
        //populate the values from self
        const populatedSelfDataComp = populateObject({ source: populatedBaseDataComp, lookFor: '..', locations: [Object.values(populatedBaseDataComp)[0]], skip: ['update', 'formData'] })
        const populatedAfterInheritingComp = populateObject({ source: populatedSelfDataComp, lookFor: '=', locations: [Object.values(populatedSelfDataComp)[0], this.root], skip: ['update', 'formData'] })

        let populatedPage = populatedAfterInheritingComp
        this.root = { ...this.root, ...populatedPage }
        //run init commands if any
        let init = Object.values(populatedPage)[0].init
        if (init) {
            //@ts-ignore
            this.callQueue = init.map((command, index) => index)
            while (this.callQueue.length > 0) {
                const currIndex = this.callQueue.shift()
                const command = init[currIndex]
                if (typeof command === 'function') {
                    try {
                        //TODO: check dispatch function/ side effects work accordingly
                        await command()
                    } catch (error) {
                        throw new UnableToExecuteFn(`An error occured while executing ${pageName}.init`, error)
                    }

                    
                    const updatePage = this.root[pageName]
                    
                    //populateObject again
                    let populatedPageAgain = populateObject({ source: updatePage, lookFor: '..', locations: [this.root[pageName]] })
                    
                    const withFNs2 = attachFns({ cadlObject: { [pageName]: populatedPageAgain }, dispatch: boundDispatch })
                    

                    populatedPage = Object.values(withFNs2)[0]
                    
                    init = Object.values(withFNs2)[0].init
                    
                    this.root[pageName] = { ...this.root[pageName], ...Object.values(withFNs2)[0] }
                    
                }
            }
        }
        this.root = { ...this.root, ...populatedPage }

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
    private dispatch(action: { type: string, payload: any }) {
        switch (action.type) {
            case ('populate'): {
                const { pageName } = action.payload
                const pageObjectCopy = _.cloneDeep(this.root[pageName])
                const boundDispatch = this.dispatch.bind(this)

                const populateWithRoot = populateObject({ source: pageObjectCopy, lookFor: '.', locations: [this.root, this.root[pageName]] })
                const populateWithSelf = populateObject({ source: populateWithRoot, lookFor: '..', locations: [this.root, this.root[pageName]] })
                const populateAfterInheriting = populateObject({ source: populateWithSelf, lookFor: '=', locations: [this.root, this.root[pageName]] })

                const withFNs = attachFns({ cadlObject: populateAfterInheriting, dispatch: boundDispatch })

                this.root[pageName] = withFNs
                break
            }
            case ('update-data'): {
                const { pageName, dataKey, data } = action.payload
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
                const currentVal = _.get(this.root[pageName], pathArr)
                return currentVal
            }
            case ('update-global'): {
                const { pageName, updateObject } = action.payload

                const populateWithRoot = populateObject({ source: updateObject, lookFor: '.', locations: [this.root, this.root[pageName]] })
                const populateWithSelf = populateObject({ source: populateWithRoot, lookFor: '..', locations: [this.root, this.root[pageName]] })
                const populateAfterInheriting = populateObject({ source: populateWithSelf, lookFor: '=', locations: [this, this.root, this.root[pageName]] })
                Object.keys(populateAfterInheriting).forEach(async (key) => {
                    //TODO: add case for key that starts with =
                    if (!key.startsWith('=')) {
                        const trimPath = key.substring(1, key.length - 1)
                        const pathArr = trimPath.split('.')
                        const val = populateAfterInheriting[key]
                        _.set(this.root, pathArr, val)
                    } else if (key.startsWith('=')) {
                        const trimPath = key.substring(2, key.length)
                        const pathArr = trimPath.split('.')
                        const val = _.get(this.root, pathArr) || _.get(this.root[pageName], pathArr)

                        const populateWithRoot = populateObject({ source: val, lookFor: '.', locations: [this.root, this.root[pageName]] })

                        const populateWithSelf = populateObject({ source: populateWithRoot, lookFor: '..', locations: [this.root, this.root[pageName]] })

                        const populateAfterInheriting = populateObject({ source: populateWithSelf, lookFor: '=', locations: [this.root, this.root[pageName]] })

                        const boundDispatch = this.dispatch.bind(this)
                        const withFn = attachFns({ cadlObject: populateAfterInheriting, dispatch: boundDispatch })
                        if (typeof withFn === 'function') {
                            await withFn()
                            console.log(this)
                        }
                        console.log(withFn)
                    }
                })
                break
            }
            default: {
                return
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
    set callQueue(callQueue) {
        this._callQueue = callQueue
    }

    get callQueue() {
        return this._callQueue
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