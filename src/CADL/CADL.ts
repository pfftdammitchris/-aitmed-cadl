import axios from 'axios'
import YAML from 'yaml'
import {
    mergeDataModels,
    populateData,
    attachFns,
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

    private _pageUrl: string
    private _baseDataModel_URL: string
    private _cadl: CADL_OBJECT
    private _pageName: string
    private _dataModels: Record<string, any>
    private _dataModelKeys: string[]
    private _data: Record<string, any> = {}
    private _baseDataModel: BASE_DATA_MODEL

    //TODO: create a method that takes in the page url and process the yaml for that page
    constructor(

        { apiVersion, env, apiHost, configUrl }

    ) {
        //replace default arguments
        store.env = env
        store.configUrl = configUrl
        store.apiVersion = apiVersion
        store.apiHost = apiHost

    }

    /**
     * @throws UnableToRetrieveCADL if CADL object is note retrieved
     * @throws UnableToRetrieveBaseDataModel if baseDataModel is note retrieved
     * @throws NoDataModelsFound if there are no dataModels found in the CADL object
     * @throws UnableToExecuteDataModelFn if an init function fails to execute
     */
    public async init(): Promise<void> {
        if(store.getConfig()===null){
            store.level2SDK.
        }
        await this.getCadlEndpoint()
        if (!this.cadl) {
            try {
                await this.getCADL()
            } catch (error) {
                // UnableToRetrieveCADL
                throw error
            }
        }
        if (!this.baseDataModel) {
            try {
                await this.getBaseDataModel()
            } catch (error) {
                // UnableToRetrieveBaseDataModel
                throw error
            }
        }
        if (!this._dataModelKeys.length) {
            throw new NoDataModelsFound(`There were no dataModels found for ${this.pageName}`)
        }
        //make a copy of the CADL object
        let cadlCopy = Object.assign({}, this.cadl)
        cadlCopy.data = {}

        //merge CADL dataModels with base dataModels
        const mergedDataModels = mergeDataModels(this.baseDataModel, this.dataModels)
        cadlCopy.dataModels = mergedDataModels

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
    public async getCADL(): Promise<CADL_OBJECT> {
        try {
            this.cadl = await this.defaultObject(this._pageUrl)
        } catch (error) {
            throw new UnableToRetrieveCADL(`There was an error retrieving the CADL object for ${this._pageUrl}`, error)
        }
        return this.cadl
    }

    /**
     * @returns BASE_DATA_MODEL
     * @throws UnableToRetrieveBaseDataModel
     */
    public async getBaseDataModel(): Promise<BASE_DATA_MODEL> {
        try {
            this.baseDataModel = await this.defaultObject(this._baseDataModel_URL)
        } catch (error) {
            throw new UnableToRetrieveBaseDataModel(`There was an error retrieving the baseDataModel object for ${this._pageUrl}`, error)
        }
        return this.baseDataModel
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


    public get pageName() {
        return this._pageName
    }

    public set pageName(pageName) {
        this._pageName = pageName
    }

    public get cadl() {
        return this._cadl
    }

    public set cadl(cadl) {
        const { dataModels, pageName } = cadl
        this._cadl = cadl
        this._dataModelKeys = Object.keys(dataModels).length ? Object.keys(dataModels) : []
        this.pageName = pageName || 'UNKNOWN'
        this.dataModels = dataModels || {}
    }

    public get dataModels() {
        return this._dataModels
    }

    public set dataModels(dataModels) {
        this._dataModels = dataModels || {}
    }
    public get baseDataModel() {
        return this._baseDataModel
    }

    public set baseDataModel(dataModel) {
        this._baseDataModel = dataModel || {}
    }

    public get data() {
        return this._data
    }

    public set data(data) {
        this._data = data || {}
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