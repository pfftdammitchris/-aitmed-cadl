import axios from 'axios'
import YAML from 'yaml'
import _, { isObject } from 'lodash'
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
    private _root: Record<string, any> = { actions: {}, refs: {} }
    private _builtIn: Record<string, any> = builtInFns(this.dispatch.bind(this))
    private _initCallQueue: any[]

    /**
     * 
     * @param CADLARGS
     * @param CADLARGS.env string 
     * @param CADLARGS.configUrl string 
     * @param CADLARGS.cadlVersion 'test' | 'stable' 
     */
    constructor({ env, configUrl, cadlVersion }: CADLARGS) {
        //replace default arguments
        store.env = env
        store.configUrl = configUrl
        this._cadlVersion = cadlVersion
    }

    /**
     * @param InitArgs 
     * @param InitArgs.BaseDataModel Record<string, any>
     * @param InitArgs.BaseCSS Record<string, any>
     * @param InitArgs.BasePage Record<string, any>
     * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
     * @throws UnableToParseYAML -if unable to parse yaml file
     * @throws UnableToLoadConfig -if unable to load config data
     * 
     * -loads config if not already loaded
     * -sets CADL version, baseUrl, assetsUrl, and root
     */
    public async init({
        BaseDataModel,
        BaseCSS,
        BasePage
    }: {
        BaseDataModel?: Record<string, any>,
        BaseCSS?: Record<string, any>,
        BasePage?: Record<string, any>
    } = {}
    ): Promise<void> {
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

        //set overrides of Base Objects
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

        let localStorageGlobal = localStorage.getItem('Global')
        if (localStorageGlobal) {
            try {
                localStorageGlobal = JSON.parse(localStorageGlobal)
            } catch (error) {
                console.log(error)
            }
            this.root = { ...this.root, Global: localStorageGlobal }
        }
        this.dispatch({ type: 'update-map' })
    }


    /**
     * 
     * @param pageName string
     * @param skip string[] -denotes the keys to skip in the population process 
     * @param options { builtIn?: Record<string, any> } -object that takes in set of options for the page
     * 
     * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
     * @throws UnableToParseYAML -if unable to parse yaml file
     * @throws UnableToExecuteFn -if something goes wrong while executing any init function
     * 
     * - initiates cadlObject for page specified
     */
    //TODO: extract init functionality to use only runInit()
    async initPage(
        pageName: string,
        skip: string[] = [],
        options: { builtIn?: Record<string, any> } = {}
    ): Promise<void> {
        if (!this.cadlEndpoint) await this.init()

        const { builtIn } = options
        if (builtIn && isObject(builtIn)) {
            this.builtIn = { ...this.builtIn, ...builtIn }
        }
        let pageCADL = await this.getPage(pageName)
        //FOR FORMDATA
        //process formData
        if (this.root[pageName]) {
            delete this.root[pageName]
            // const cloneCurrPage = _.cloneDeep(this.root[pageName])
            // //TODO: test order of overrides
            // const mergedPage = _.merge(pageCADL, { [pageName]: cloneCurrPage })
            // pageCADL = mergedPage
        }
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
                const command: any = init[currIndex]
                if (typeof command === 'function') {
                    try {
                        //TODO: check dispatch function/ side effects work accordingly
                        await command()
                    } catch (error) {
                        throw new UnableToExecuteFn(`An error occured while executing ${pageName}.init`, error)
                    }
                } else if (isObject(command) && 'actionType' in command) {
                    const { actionType, dataKey, dataObject, funcName }: any = command
                    switch (actionType) {
                        case ('updateObject'): {
                            this.updateObject({ dataKey, dataObject })
                            break
                        }
                        case ('builtIn'): {
                            if (funcName === 'videoChat') {
                                if (funcName in this.builtIn && typeof this.builtIn[funcName] === 'function') {
                                    this.builtIn[funcName](command)
                                }
                            }
                            break
                        }
                        default: {
                            return
                        }
                    }
                } else if (Array.isArray(command)) {
                    if (typeof command[0][1] === 'function') {
                        try {
                            await command[0][1]()
                        } catch (error) {
                            throw new UnableToExecuteFn(`An error occured while executing ${pageName}.init`, error)
                        }
                    }
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
     * @param pageName string
     * @returns CADL_OBJECT
     * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
     * @throws UnableToParseYAML -if unable to parse yaml file
     */
    public async getPage(pageName: string): Promise<CADL_OBJECT> {
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
     * @param pageName string
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
     * @param ProcessPopulateArgs 
     * @param ProcessPopulateArgs.source  Record<string, any> -item being de-referenced
     * @param ProcessPopulateArgs.lookFor  string[] -reference tokens to look for e.g ['.','..']
     * @param ProcessPopulateArgs.pageName?  string
     * @param ProcessPopulateArgs.skip?  string[] -keys that should not be de-referenced e.g ['name','country']
     * @param ProcessPopulateArgs.withFns?  boolean -choose to attach ecos functions to the source
     * 
     * @returns Record<string, any> -the processed/de-referenced object
     * 
     * - used to populate the references 
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

        let sourceCopy = _.cloneDeep(source)
        let localRoot = pageName ? sourceCopy[pageName] : sourceCopy
        const sourceCopyWithRootKeys = populateKeys({
            source: sourceCopy,
            lookFor: '.',
            locations: [this.root, sourceCopy]
        })

        //populate the keys from the local page object
        const sourceCopyWithLocalKeys = populateKeys({
            source: sourceCopyWithRootKeys,
            lookFor: '..',
            locations: [localRoot]
        })
        const boundDispatch = this.dispatch.bind(this)

        localRoot = pageName ? sourceCopyWithLocalKeys[pageName] : sourceCopyWithLocalKeys
        const sourceCopyWithVals = populateVals({
            source: sourceCopyWithLocalKeys,
            lookFor,
            skip,
            locations: [this.root, localRoot],
            pageName,
            dispatch: boundDispatch,
        })
        localRoot = pageName ? sourceCopyWithVals[pageName] : sourceCopyWithLocalKeys
        let populatedResponse = sourceCopyWithVals
        if (withFns) {
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
                this.dispatch({ type: 'update-localStorage' })
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

                this.dispatch({ type: 'update-localStorage' })

                return
            }
            case ('get-data'): {
                const { pageName, dataKey } = action.payload
                const pathArr = dataKey.split('.')
                const currentVal = _.get(this.root[pageName], pathArr) || _.get(this.root, pathArr)
                return currentVal
            }
            case ('eval-object'): {

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
                //populates Global because this object is instantiated once 
                //unlike pages that are instantiated multiple times and can be repopulated 
                //when they are loaded again
                this.dispatch({ type: 'populate', payload: { pageName: 'Global' } })

                //update the localStorage root
                this.dispatch(
                    {
                        type: 'update-localStorage',
                    }
                )
                break
            }
            case ('update-localStorage'): {
                localStorage.setItem('Global', JSON.stringify(this.root?.Global))
                break
            }
            case ('update-map'): {
                //TODO: consider adding update-page-map
                this.map = dot.dot(this.root)
                break
            }
            case ('add-fn'): {
                //actions for page currently used for signIn 
                const { pageName, fn } = action.payload
                if (this.root.actions[pageName]) {
                    this.root.actions[pageName].update = fn
                } else {
                    this.root.actions[pageName] = { update: fn }
                }
                break
            }
            case ('save-ref'): {
                //saves path to references as object is populated
                const { pageName, ref, path } = action.payload
                if (this.root.refs[pageName]) {
                    this.root.refs[pageName][path] = ref
                } else {
                    this.root.refs[pageName] = {}
                    this.root.refs[pageName][path] = ref
                }
                break
            }

            default: {
                return
            }
        }
    }

    /**
     * 
     * @param UpdateObjectArgs
     * @param UpdateObjectArgs.dataKey string
     * @param UpdateObjectArgs.dataObject Record<string, any>
     * @param UpdateObjectArgs.dataObjectKey string
     * 
     * -used for actionType updateObject
     */
    public updateObject({ dataKey, dataObject, dataObjectKey }: { dataKey: string, dataObject: any, dataObjectKey?: string }) {
        const location = this.root
        let path
        if (dataKey.startsWith('.')) {
            path = dataKey.substring(1, dataKey.length)
        } else {
            path = dataKey
        }
        const pathArr = path.split('.')
        const newVal = dataObjectKey ? dataObject[dataObjectKey] : dataObject
        _.set(location, pathArr, newVal)

        this.dispatch({
            type: 'update-localStorage'
        })
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
                } else if (isObject(command) && 'actionType' in command) {
                    const { actionType, dataKey, dataObject }: any = command
                    switch (actionType) {
                        case ('updateObject'): {
                            this.updateObject({ dataKey, dataObject })
                            break
                        }
                        default: {
                            return
                        }
                    }
                } else if (Array.isArray(command)) {
                    if (typeof command[0][1] === 'function') {
                        try {
                            await command[0][1]()
                        } catch (error) {
                            throw new UnableToExecuteFn(`An error occured while executing ${pageName}.init`, error)
                        }
                    }
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

    /**
     * 
     * @param key "user" | "meetroom"
     * 
     * -sets either the user or meetroom value from localStorage to the corresponding root value in memory
     */
    public setFromLocalStorage(key: "user" | "meetroom") {
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
                case ("user"): {
                    let user = localStorageGlobal.currentUser.vertex
                    this.root.Global.currentUser.vertex = user
                    break
                }
                case ("meetroom"): {
                    let currMeetroom = localStorageGlobal.meetroom.edge
                    this.root.Global.meetroom.edge = currMeetroom
                    break
                }
                default: {
                    return
                }
            }
        }
    }

    /**
     * 
     * @param SetValueArgs
     * @param SetValueArgs.path string
     * @param SetValueArgs.value any
     * 
     * - set value to a given path. Assume the path begins at the root.
     */
    public setValue({ path, value }: { path: string, value: any }): void {
        let pathArr = path.split('.')
        _.set(this.root, pathArr, value)
        return
    }

    /**
     * 
     * @param AddValueArgs 
     * @param AddValueArgs.path string
     * @param AddValueArgs.value any
     * 
     * - add value to a given path. Assume the path begins at the root.
     */
    public addValue({ path, value }: { path: string, value: any }): void {
        let pathArr = path.split('.')
        let currVal = _.get(this.root, pathArr)
        if (typeof currVal === 'undefined') {
            currVal = [value]
        } else if (Array.isArray(currVal)) {
            currVal.push(value)
        }
        _.set(this.root, pathArr, currVal)
        return
    }

    /**
     * 
     * @param RemoveValue 
     * @param RemoveValue.path string
     * @param RemoveValue.Predicate Record<string, number | string>
     * 
     * - remove value from a given path. Assume the path begins at the root.
     */
    public removeValue({ path, predicate }: { path: string, predicate: Record<string, number | string> }): void {
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
            _.set(this.root, pathArr, newVal)
        }

    }

    /**
     * 
     * @param ReplaceValueArgs 
     * @param ReplaceValueArgs.path string
     * @param ReplaceValueArgs.predicate Record<string, number | string>
     * @param ReplaceValueArgs.value any
     * 
     * - replace value at a given path. Assume the path begins at the root.
     */
    public replaceValue({
        path,
        predicate,
        value
    }: {
        path: string,
        predicate: Record<string,
            number | string>,
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
                _.set(this.root, pathArr, currValCopy)
            }
        }
        return
    }


    public resetReferences(pageName: string) {
        const pageRefs = _.cloneDeep(this.root.refs[pageName])
        for (let [path, ref] of Object.entries(pageRefs)) {
            // let pathArr = path.split('.')
            _.set(this.root[pageName], path, ref)
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