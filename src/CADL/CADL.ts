import axios from 'axios'
import YAML from 'yaml'
import {
    mergeDataModels,
    populateData,
    attachFns,
    populateKeys,
} from './utils'
import { CADL_OBJECT, BASE_DATA_MODEL } from './types'
import store, { ResponseCatcher, ErrorCatcher } from '../common/store'

import {
    NoDataModelsFound,
    UnableToRetrieveCADL,
    UnableToRetrieveBaseDataModel,
    UnableToExecuteDataModelFn,
    UnableToParseYAML,
    UnableToRetrieveYAML
} from './errors'


export default class CADL {

    private _cadlVersion: 'test' | 'stable'
    private _baseDataModel: BASE_DATA_MODEL
    private _baseCSS: Record<string, any>
    private _cadlEndpoint: CADL_OBJECT
    private _baseUrl: string
    private _assetsUrl: string
    private _pages: Record<string, any> = {}
    private _data: Record<string, any> = {}


    constructor({ env, configUrl, cadlVersion }) {
        //replace default arguments
        store.env = env
        store.configUrl = configUrl
        this._cadlVersion = cadlVersion
    }

    /**
     * @throws UnableToRetrieveCADL if CADL object is note retrieved
     * @throws UnableToRetrieveBaseDataModel if baseDataModel is note retrieved
     * @throws NoDataModelsFound if there are no dataModels found in the CADL object
     * @throws UnableToExecuteDataModelFn if an init function fails to execute
     */
    public async init(): Promise<void> {
        let config = store.getConfig()
        if (config === null) {
            config = await store.level2SDK.loadConfigData('aitmedAlpha')
        }
        const { cadlEndpoint: cadlEndpointUrl, web } = config
        //set cadlVersion
        this.cadlVersion = web.cadlVersion[this.cadlVersion]
        const cadlEndpointUrlWithCadlVersion = cadlEndpointUrl.replace('${cadlVersion}', this.cadlVersion)
        const { baseUrl, assetsUrl } = await this.getCadlEndpoint(cadlEndpointUrlWithCadlVersion)

        this.baseUrl = baseUrl
        this.assetsUrl = assetsUrl

        const rawBaseDataModel = await this.getBaseDataModel()
        debugger
        const populatedBaseDataModel = populateKeys(rawBaseDataModel, [rawBaseDataModel])
        debugger
        this.baseDataModel = populatedBaseDataModel
        this.baseCSS = await this.getBaseCSS()
    }


    /**
     * 
     * @param pageName 
     * 
     * - initiates cadlObject for page specified
     */
    async initPage(pageName: string) {
        if (!this.cadlEndpoint) await this.init()

        let pageCADL = await this.getPage(pageName)

        //make a copy of the CADL object
        let cadlCopy = Object.assign({}, pageCADL)
        debugger
        let populatedCadlCopy = populateKeys(cadlCopy, [this.baseDataModel])
        debugger
        //merge CADL dataModels with base dataModels
        const mergedDataModels = mergeDataModels(this.baseDataModel, populatedCadlCopy)
        debugger
        cadlCopy.dataModels = mergedDataModels
        debugger

        //populateData
        const populatedData = populateData(cadlCopy.dataModels, [cadlCopy.dataModels])
        const populateAgain = populateData(populatedData, [cadlCopy.dataModels])

        cadlCopy.dataModels = { ...cadlCopy.dataModels, ...populateAgain }

        const { init } = cadlCopy.dataModels
        const boundDispatch = this.dispatch.bind(this)
        //iterate through dataModels.init
        if (Array.isArray(init) && init.length > 0) {
            for (let command of init) {
                const { dataModel: dataModelKey, ecosAction } = command
                const currDataModel = cadlCopy.dataModels[dataModelKey]

                //attach functions to dataModel
                const dataModelWithFn = attachFns({
                    dataModelKey,
                    dataModel: currDataModel,
                    dispatch: boundDispatch
                })
                cadlCopy.dataModels[dataModelKey] = dataModelWithFn

                //run init commands
                if (typeof cadlCopy.dataModels[dataModelKey][ecosAction] === 'function') {
                    try {
                        await cadlCopy.dataModels[dataModelKey][ecosAction]()
                    } catch (error) {
                        throw new UnableToExecuteDataModelFn(`An error occured while executing ${dataModelKey}.${ecosAction}`, error)
                    }
                    //populateData again
                    const populatedData = populateData(cadlCopy.dataModels, [cadlCopy.dataModels, this.data.dataModels])
                    const populateAgain = populateData(populatedData, [cadlCopy.dataModels, this.data.dataModels])
                    cadlCopy.dataModels = populateAgain
                }
            }
        }
        this.cadl = cadlCopy
    }

    /**
     * @returns CADL_OBJECT
     * @throws UnableToRetrieveCADL if CADL object is note retrieved
     */
    public async getPage(pageName): Promise<CADL_OBJECT> {
        let pageCADL
        try {
            let url = pageName === 'BaseCSS' ? `${this.baseUrl}${pageName}.yml` : `${this.baseUrl}${pageName}_en.yml`
            pageCADL = await this.defaultObject(`${this.baseUrl}${pageName}_en.yml`)
            this.dispatch({ type: 'set-page', payload: { [pageName]: pageCADL } })
        } catch (error) {
            throw error
        }
        return pageCADL
    }

    /**
     * @returns BASE_DATA_MODEL
     * @throws UnableToRetrieveBaseDataModel
     */
    public async getBaseDataModel(): Promise<BASE_DATA_MODEL> {
        try {
            const baseDataModel = await this.defaultObject(`${this.baseUrl}BaseDataModel_en.yml`)
            this.baseDataModel = baseDataModel
            return baseDataModel
        } catch (error) {
            throw new UnableToRetrieveBaseDataModel(`There was an error retrieving the baseDataModel objec`, error)
        }
    }
    /**
     * @returns Record<string, any>
     */
    public async getBaseCSS(): Promise<Record<string, any>> {
        try {
            this.baseCSS = await this.defaultObject(`${this.baseUrl}BaseCSS.yml`)
        } catch (error) {
            throw error
        }
        return this.baseCSS
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
            case ('populate'): {
                //populating twice because data must be filled from both the data.dataModels and the dataModels object
                //TODO: refactor populate data to require populating once
                const populatedData = populateData(this.dataModels, [this.data.dataModels, this.data.dataModels])

                const populatedAgain = populateData(populatedData, [this.dataModels, this.data.dataModels])
                this.dataModels = populatedAgain
                return
            }
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
            case ('attach-Fns'): {
                const dataModelsCopy = Object.assign({}, this.dataModels)
                delete dataModelsCopy.init
                delete dataModelsCopy.const
                delete dataModelsCopy.final
                const boundDispatch = this.dispatch.bind(this)
                for (let [dataModelKey, dataModel] of Object.entries(dataModelsCopy)) {

                    const dataModelWithFn = attachFns({
                        dataModelKey,
                        dataModel,
                        dispatch: boundDispatch
                    })
                    dataModelsCopy[dataModelKey] = dataModelWithFn
                }
                this.dataModels = { ...this.dataModels, dataModelsCopy }
                return
            }
            default: {
                return
            }
        }
    }

    private async getCadlEndpoint(cadlEndpointUrl: string) {
        let cadlEndpoint
        try {
            cadlEndpoint = await this.defaultObject(cadlEndpointUrl)
            if (Object.keys(cadlEndpoint).length) {
                this.cadlEndpoint = cadlEndpoint
            } else return
            return cadlEndpoint
        } catch (error) {
            throw error
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
        this._baseUrl = baseUrl.replace('${cadlVersion}', this.cadlVersion)
    }
    public get assetsUrl() {
        return this._assetsUrl
    }

    public set assetsUrl(assetsUrl) {
        this._assetsUrl = assetsUrl
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