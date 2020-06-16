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
    private _root: Record<string, any> = { builtIn: {} }

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

        //populate keys 
        let populatedKeysCadlCopy = populateKeys({ source: cadlCopy, lookFor: '.', locations: [this.root] })


        const boundDispatch = this.dispatch.bind(this)
        //TODO: find out who handles update
        //replace any update object with Fn
        let replaceUpdateJob = replaceUpdate(populatedKeysCadlCopy, boundDispatch)


        //populate the values from baseDataModels
        const populatedBaseData = populateObject({ source: replaceUpdateJob, lookFor: '.', locations: [this.root] })

        //TODO: refac to keep reference to local object within the root e.g SignIn, SignUp
        //populate the values from self
        const populatedSelfData = populateObject({ source: populatedBaseData, lookFor: '..', locations: [Object.values(populatedBaseData)[0]] })

        //attach functions
        const withFNs = attachFns({ cadlObject: populatedSelfData, dispatch: boundDispatch })

        let populatedPage = withFNs
        //run init commands if any
        const { init } = Object.values(populatedPage)[0]

        if (init) {
            for (let [actionType, actions] of Object.entries(init)) {
                if (Array.isArray(actions) && actions.length > 0) {
                    for (let command of actions) {
                        if (typeof command === 'function') {
                            try {
                                //TODO: check dispatch function/ side effects work accordingly
                                await command()
                            } catch (error) {
                                throw new UnableToExecuteFn(`An error occured while executing ${pageName}.init.${actionType}`, error)
                            }
                            //populateObject again
                            populatedPage = populateObject({ source: populatedPage, lookFor: '..', locations: [cadlCopy] })
                        }
                    }
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
            case ('update-data'): {
                const { pageName, dataKey, data } = action.payload
                const firstCharacter = dataKey[0]
                const pathArr = dataKey.split('.')
                if (firstCharacter === firstCharacter.toUpperCase()) {
                    //TODO: adjust baseDataModel to be at the root of class
                    const currentVal = _.get(this.root, pathArr)
                    const mergedVal = mergeDeep(currentVal, data)
                    _.set(this.root, pathArr, mergedVal)
                } else {
                    const currentVal = _.get(this.root[pageName], pathArr)
                    const mergedVal = mergeDeep(currentVal, data)
                    _.set(this.root[pageName], pathArr, mergedVal)
                }
                return
            }
            case ('update-global'): {
                const { updateObject, response } = action.payload
                Object.keys(updateObject).forEach((key) => {
                    const trimPath = key.substring(1, key.length - 1)
                    const pathArr = trimPath.split('.')

                    const trimVal = updateObject[key].substring(2, updateObject[key].length)

                    const valPath = trimVal.split('.')
                    const val = _.get({ builtIn: response }, valPath) || _.get(this.root, valPath)
                    _.set(this.root, pathArr, val)
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