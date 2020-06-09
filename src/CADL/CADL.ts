import axios from 'axios'
import YAML from 'yaml'
import _ from 'lodash'
import {
    populateObject,
    attachFns,
    populateKeys,
    replaceUpdate
} from './utils'
import store, {
    ResponseCatcher,
    ErrorCatcher
} from '../common/store'
import {
    UnableToParseYAML,
    UnableToRetrieveYAML,
} from './errors'
import {
    CADL_OBJECT,
    BASE_DATA_MODEL,
    CADLARGS
} from './types'

export default class CADL {

    private _cadlVersion: 'test' | 'stable'
    private _baseDataModel: BASE_DATA_MODEL
    private _baseCSS: Record<string, any>
    private _cadlEndpoint: CADL_OBJECT
    private _cadlBaseUrl: string
    private _baseUrl: string
    private _assetsUrl: string
    private _global: Record<string, any>
    private _pages: Record<string, any> = {}
    private _data: Record<string, any> = {}


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
    public async init(): Promise<void> {
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

        if (preload && preload.length) {
            //populate baseDataModel keys
            for (let pageName of preload) {
                switch (pageName) {
                    case ('BaseDataModel'): {
                        const rawBaseDataModel = await this.getPage('BaseDataModel')
                        const populatedBaseDataModelKeys = populateKeys({ source: rawBaseDataModel, lookFor: '.', locations: [rawBaseDataModel] })
                        //populate baseDataModel vals
                        const populatedBaseDataModelVals = populateObject({ source: populatedBaseDataModelKeys, lookFor: '.', locations: [populatedBaseDataModelKeys] })
                        this.baseDataModel = populatedBaseDataModelVals

                        this.global = _.cloneDeep(populatedBaseDataModelVals.global)
                        break
                    }
                    case ('BaseCSS'): {
                        //populate baseCSS keys
                        const rawBaseCSS = await this.getPage('BaseCSS')
                        const populatedBaseCSSKeys = populateKeys({ source: rawBaseCSS, lookFor: '.', locations: [rawBaseCSS] })

                        //populate baseCSS vals
                        const populatedBaseCSSVals = populateObject({ source: populatedBaseCSSKeys, lookFor: '.', locations: [populatedBaseCSSKeys] })

                        this.baseCSS = populatedBaseCSSVals
                        break
                    }
                    default: {
                        const rawPage = await this.getPage(pageName)
                        const populatedKeys = populateKeys({ source: rawPage, lookFor: '.', locations: [rawPage] })
                        const populatedVals = populateObject({ source: populatedKeys, lookFor: '.', locations: [populatedKeys] })

                        this.pages = { ...this.pages, ...populatedVals }
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
     */
    async initPage(pageName: string) {
        if (!this.cadlEndpoint) await this.init()

        let pageCADL = await this.getPage(pageName)
        
        //make a copy of the CADL object
        let cadlCopy = _.cloneDeep(pageCADL)
        
        //populate keys 
        let populatedKeysCadlCopy = populateKeys({ source: cadlCopy, lookFor: '.', locations: [this.baseDataModel, this.baseCSS] })

        //replace any update object with Fn
        const boundDispatch = this.dispatch.bind(this)
        let replaceUpdateJob = replaceUpdate(populatedKeysCadlCopy, boundDispatch)

        //populate the values from baseDataModels
        const populatedBaseData = populateObject({ source: replaceUpdateJob, lookFor: '.', locations: [this.baseDataModel, this.baseCSS] })

        //populate the values from self
        const populatedSelfData = populateObject({ source: populatedBaseData, lookFor: '..', locations: [Object.values(populatedBaseData)[0]] })


        //@ts-ignore
        const { init } = Object.values(populatedSelfData)[0]

        //attach functions
        const withFNs = attachFns(populatedSelfData, boundDispatch)

        this.pages = { ...this.pages, ...withFNs }
        //TODO:implement init func 
        // //iterate through dataModels.init
        // if (Array.isArray(init) && init.length > 0) {
        //     for (let command of init) {
        //         const { dataModel: dataModelKey, ecosAction } = command
        //         const currDataModel = cadlCopy.dataModels[dataModelKey]

        //         //attach functions to dataModel
        //         const dataModelWithFn = attachFns({
        //             dataModelKey,
        //             dataModel: currDataModel,
        //             dispatch: boundDispatch
        //         })
        //         cadlCopy.dataModels[dataModelKey] = dataModelWithFn

        //         //run init commands
        //         if (typeof cadlCopy.dataModels[dataModelKey][ecosAction] === 'function') {
        //             try {
        //                 await cadlCopy.dataModels[dataModelKey][ecosAction]()
        //             } catch (error) {
        //                 throw new UnableToExecuteDataModelFn(`An error occured while executing ${dataModelKey}.${ecosAction}`, error)
        //             }
        //             //populateData again
        //             const populatedData = populateData(cadlCopy.dataModels, [cadlCopy.dataModels, this.data.dataModels])
        //             const populateAgain = populateData(populatedData, [cadlCopy.dataModels, this.data.dataModels])
        //             cadlCopy.dataModels = populateAgain
        //         }
        //     }
        // }
        // this.cadl = cadlCopy
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
            // this.dispatch({ type: 'set-page', payload: pageCADL })
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
     * @param action 
     */
    private dispatch(action: { type: string, payload: any }) {
        switch (action.type) {
            // case ('populate'): {
            //     //populating twice because data must be filled from both the data.dataModels and the dataModels object
            //     //TODO: refactor populate data to require populating once
            //     const populatedData = populateData(this.dataModels, [this.data.dataModels, this.data.dataModels])

            //     const populatedAgain = populateData(populatedData, [this.dataModels, this.data.dataModels])
            //     this.dataModels = populatedAgain
            //     return
            // }
            case ('update-data-dataModel'): {
                const dataCopy = Object.assign({}, this.data)
                if (!dataCopy.dataModels) dataCopy.dataModels = {}
                if (dataCopy.dataModels[action.payload.key]) {
                    dataCopy.dataModels[action.payload.key].dataModel = action.payload.data
                } else {
                    dataCopy.dataModels[action.payload.key] = {}
                    dataCopy.dataModels[action.payload.key].dataModel = action.payload.data
                }
                this.data = dataCopy
                return
            }
            case ('set-page'): {
                this.pages = { ...this.pages, ...action.payload }
            }
            // case ('attach-Fns'): {
            //     const dataModelsCopy = Object.assign({}, this.dataModels)
            //     delete dataModelsCopy.init
            //     delete dataModelsCopy.const
            //     delete dataModelsCopy.final
            //     const boundDispatch = this.dispatch.bind(this)
            //     for (let [dataModelKey, dataModel] of Object.entries(dataModelsCopy)) {

            //         const dataModelWithFn = attachFns({
            //             dataModelKey,
            //             dataModel,
            //             dispatch: boundDispatch
            //         })
            //         dataModelsCopy[dataModelKey] = dataModelWithFn
            //     }
            //     this.dataModels = { ...this.dataModels, dataModelsCopy }
            //     return
            // }
            case ('update-global'): {
                const { updateObject, response } = action.payload
                Object.keys(updateObject).forEach((key) => {
                    const trimPath = key.substring(1, key.length - 1)
                    const pathArr = trimPath.split('.')

                    const trimVal = updateObject[key].substring(2, updateObject[key].length)

                    const valPath = trimVal.split('.')
                    const val = _.get({ builtIn: response }, valPath) || _.get(this, valPath)
                    _.set(this, pathArr, val)

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
    private get cadlEndpoint() {
        return this._cadlEndpoint
    }

    private set cadlEndpoint(cadlEndpoint) {
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

    public get baseDataModel() {
        return this._baseDataModel
    }

    public set baseDataModel(dataModel) {
        this._baseDataModel = dataModel || {}
    }
    public get baseCSS() {
        return this._baseCSS
    }

    public set baseCSS(baseCSS) {
        this._baseCSS = baseCSS || {}
    }

    public get data() {
        return this._data
    }

    public set data(data) {
        this._data = data || {}
    }
    public get pages() {
        return this._pages
    }

    public set pages(pages) {
        this._pages = pages || {}
    }
    public get global() {
        return this._global
    }

    public set global(global) {
        this._global = global || {}
    }
    set apiVersion(apiVersion) {
        store.apiVersion = apiVersion
    }

    get apiVersion() {
        return store.apiVersion
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