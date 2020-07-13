import _ from 'lodash'
import dot from 'dot-object'
import store from '../../common/store'
import { mergeDeep, isObject } from '../../utils'
import Document from '../../services/document'
import { documentToNote } from '../../services/document/utils'
import { UnableToLocateValue } from '../errors'
import { Account } from '../../services'

export {
    isPopulated,
    replaceEidWithId,
    lookUp,
    populateKeys,
    attachFns,
    populateString,
    populateArray,
    populateObject,
    builtInFns,
    populateVals,
    replaceUint8ArrayWithBase64,
    replaceEvalObject,
}


/**
 * 
 * @param edge 
 * @returns edge
 */
function replaceEidWithId(edge: Record<string, any>) {
    let output = Object.assign({}, edge)
    const { eid } = output
    if (eid) {
        const b64Id = store.utils.idToBase64(eid)
        output = { ...output, id: b64Id }
        delete output.eid
        return output
    } else {
        return edge
    }
}

/**
 * 
 * @param params {}
 * @param params.source Record<string, any>
 * @param params.lookFor string
 * @param params.locations Record<string, any>[]
 * @returns Record<string, any>
 * - merges source object with objects in locations where keys match lookFor
 */
function populateKeys({ source, lookFor, locations }: { source: Record<string, any>, lookFor: string, locations: Record<string, any>[] }) {
    let output = _.cloneDeep(source)
    Object.keys(output).forEach((key) => {
        if (key.startsWith(lookFor)) {
            let parent = {}
            let currKey = key
            if (lookFor === '..') {
                currKey = currKey.slice(1)
            }
            for (let location of locations) {
                try {
                    const res = lookUp(currKey, location)
                    if (res) {
                        parent = res
                    }
                } catch (error) {
                    if (error instanceof UnableToLocateValue) {
                        continue
                    } else {
                        throw error
                    }
                }
            }
            if (Object.keys(parent).length && output[key]) {
                const mergedObjects = mergeDeep(populateKeys({ source: parent, lookFor, locations }), populateKeys({ source: output[key], lookFor, locations }))
                output = { ...output, ...mergedObjects }
                delete output[key]
            } else if (Object.keys(parent).length) {

                //TODO: test why it is undefined when .Edge:""
                //check SignUp page
                const mergedObjects = populateKeys({ source: parent, lookFor, locations })
                //TODO: pending unit test
                output = mergeDeep(mergedObjects, output)
                // output = { ...mergedObjects, ...output }
                delete output[key]
            }
        } else if (isObject(output[key])) {
            output[key] = populateKeys({ source: output[key], lookFor, locations })
        } else if (Array.isArray(output[key])) {
            output[key] = output[key].map((elem) => {
                if (isObject(elem)) {
                    return populateKeys({ source: elem, lookFor, locations })
                }
                return elem
            })
        }
    })
    return output
}

/**
 * 
 * @param directions string -dot notation leading to location of value
 * @param location - Record<string, any> -place to look for value
 * @returns any - whatever value that was attached to the location object at the given directions
 * @throws UnableToLocateValue if value is not found given the directions and location
 */
function lookUp(directions: string, location: Record<string, any>) {
    let arr = directions.split('.')

    try {
        const res = arr.slice(1).reduce((o, key) => {
            return o[key]
        }, location)
        return res
    } catch (error) {
        throw new UnableToLocateValue('value not found', error)
    }
}



/**
 * 
 * @param item string | Record<string, any>
 * @returns boolean
 * -takes in an object or string and checks whether or not the item has been populated
 */
function isPopulated(item: string | Record<string, any>): boolean {
    let itemCopy = _.cloneDeep(item)
    let isPop: boolean = true
    if (isObject(itemCopy)) {
        for (let key of Object.keys(itemCopy)) {
            if (!isPop) return isPop
            if (isObject(itemCopy[key])) {
                isPop = isPopulated(itemCopy[key])
            } else if (Array.isArray(itemCopy[key])) {
                isPop = itemCopy[key].forEach((elem) => {
                    if (isObject(elem)) {
                        isPop = isPopulated(elem)
                    } else if (typeof elem === 'string') {
                        if (elem.startsWith('.') || elem.startsWith('..')) {
                            isPop = false
                        }
                    }
                })
            } else if (typeof itemCopy[key] === 'string') {
                const currVal = itemCopy[key].toString()
                if (currVal.startsWith('.') || currVal.startsWith('..')) {
                    isPop = false
                }
            }
        }
    }
    return isPop
}


/**
 * 
 * @param cadlObject Record<string, any>
 * @param dispatch Function
 * @returns Record<string,any>
 */
function attachFns({ cadlObject,
    dispatch }) {
    //the localRoot object is the page object
    const localRoot = cadlObject

    //we need the pageName to use as a key to store the data
    //when using the dataKey
    let pageName
    if (Object.keys(cadlObject).length > 1) {
        pageName = 'Global'
    } else {
        pageName = Object.keys(cadlObject)[0]
    }
    return attachFnsHelper({
        pageName,
        cadlObject,
        dispatch
    })

    function attachFnsHelper({
        pageName,
        cadlObject,
        dispatch
    }: {
        pageName: string,
        cadlObject: Record<string, any>,
        dispatch: Function
    }): Record<string, any> {
        //traverse through the page object and look for the api keyword
        let output = _.cloneDeep(cadlObject)
        if (isObject(output)) {
            Object.keys(output).forEach((key) => {
                if (isObject(output[key])) {
                    output[key] = attachFnsHelper({ pageName, cadlObject: output[key], dispatch })
                } else if (Array.isArray(output[key])) {
                    output[key] = output[key].map((elem) => {
                        if (isObject(elem)) return attachFnsHelper({ pageName, cadlObject: elem, dispatch })
                        return elem
                    })
                }
                else if (typeof output[key] === 'string' && key === 'api') {
                    //when api keyword is found we attach the corresponding ecos function to the current output which should be the value of get or store 
                    /**
                     * get:output
                     * store:output
                     */
                    const { api } = output
                    const apiSplit = api.split('.')
                    const apiType = apiSplit[0]
                    switch (apiType) {
                        case ('re'): {
                            const getFn = (output) => async () => {
                                const { api, dataKey, id, maxcount, type, ...options } = _.cloneDeep(output)
                                let res: any[] = []
                                let idList: string[] | Uint8Array[] = []
                                if (id) {
                                    idList = Array.isArray(id) ? [...id] : [id]
                                }
                                if (maxcount) {
                                    options.maxcount = parseInt(maxcount)
                                }
                                if(type){
                                    options.type = parseInt(type)

                                }
                                try {
                                    const { data } = await store.level2SDK.edgeServices.retrieveEdge({ idList, options: { ...options} })
                                    res = data
                                } catch (error) {
                                    throw error
                                }

                                if (res.length > 0) {
                                    res = res.map((edge) => {
                                        return replaceEidWithId(edge)
                                    })

                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: res }
                                    })

                                }
                                //TODO:handle else case
                                return res
                            }
                            output = getFn(output)
                            break
                        }
                        case ('ce'): {
                            const storeFn = (output) => async (name, id = null) => {
                                const { dataKey } = _.cloneDeep(output)
                                const pathArr = dataKey.split('.')
                                //get current object name value
                                const { deat, ...currentVal } = _.get(localRoot[pageName], pathArr) || dispatch({ type: 'get-data', payload: { pageName, dataKey } })

                                //TODO: remove when backend fixes message type problem
                                if (currentVal.name && currentVal.name.message) {
                                    currentVal.name.message = "temp"
                                }

                                //merging existing name field and incoming name field
                                let parsedType = parseInt(currentVal.type)
                                let mergedVal = { ...currentVal, type: parsedType }

                                if (name) {
                                    mergedVal = mergeDeep(mergedVal, { name })
                                }
                                // mergedVal.type = parseInt(mergedVal.type)
                                let res
                                if (id) {
                                    try {
                                        const { data } = await store.level2SDK.edgeServices.updateEdge({ ...mergedVal, id })
                                        res = data
                                    } catch (error) {
                                        throw error
                                    }
                                } else {
                                    try {
                                        const { data } = await store.level2SDK.edgeServices.createEdge({ ...mergedVal })
                                        res = data
                                    } catch (error) {
                                        throw error
                                    }
                                }
                                if (res) {
                                    const replacedEidWithId = replaceEidWithId(res)
                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: replacedEidWithId }
                                    })

                                    //dispatch action to update state that is dependant of this response
                                    //TODO: optimize by updating a slice rather than entire object
                                    dispatch({
                                        type: 'populate',
                                        payload: { pageName }
                                    })

                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }

                            output = [output.dataKey, storeFn(output)]
                            break
                        }
                        case ('rd'): {
                            const getFn = (output) => async () => {
                                let res
                                //TODO:update to new format
                                const { api, dataKey, ids, ...rest } = _.cloneDeep(output)
                                try {
                                    // const parsedType = type.split('-')[1]
                                    const data = await store.level2SDK.documentServices.retrieveDocument({ idList: [ids], options: { ...rest } }).then(({ data }) => {
                                        return Promise.all(data.map(async (document) => {
                                            const note = await documentToNote({ document })
                                            return note
                                        }))
                                    }).then((res) => {
                                        return res
                                    }).catch((err) => { console.log(err) })

                                    res = data
                                } catch (error) {
                                    throw error
                                }
                                if (res) {
                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: res }
                                    })
                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }

                            output = isPopulated(output) ? getFn(output) : output
                            break
                        }
                        case ('cd'): {
                            const storeFn = (output) => async ({ data, type, id = null }) => {
                                //TODO:update to new format after ApplyBusiness is updated
                                //@ts-ignore
                                const { dataKey, ...cloneOutput } = _.cloneDeep(output)
                                // const pathArr = dataKey.split('.')
                                // const currentVal = _.get(localRoot[pageName], pathArr)
                                const currentVal = dispatch({ type: 'get-data', payload: { dataKey, pageName } })

                                const mergedVal = mergeDeep(currentVal, { name: { data, type } })
                                const { api, ...options } = mergedVal

                                let res
                                if (id) {
                                    try {
                                        const { data } = await store.level2SDK.documentServices.updateDocument({ ...options, id })
                                        res = data
                                    } catch (error) {
                                        throw error
                                    }
                                } else {
                                    //TODO: check data store to see if object already exists. if it does call update instead to avoid poluting the database
                                    try {
                                        const { type: appDataType, eid, name } = options
                                        const response = await Document.create({
                                            edge_id: eid,
                                            dataType: parseInt(appDataType.applicationDataType),
                                            content: data,
                                            type,
                                            title: name.title,
                                        })
                                        res = response
                                    } catch (error) {
                                        throw error
                                    }
                                }
                                if (res) {
                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: res }
                                    })
                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }
                            output = isPopulated(output) ? storeFn(output) : output
                            break
                        }
                        case ('cv'): {
                            const storeFn = (output) => async (name, id = null) => {

                                //TODO: update to new format
                                const { dataKey, ...cloneOutput } = _.cloneDeep(output)
                                const pathArr = dataKey.split('.')
                                const currentVal = _.get(localRoot[pageName], pathArr)
                                const mergedVal = mergeDeep(currentVal, cloneOutput)
                                const mergedName = mergeDeep({ name: mergedVal }, name)
                                const { api, store: storeProp, get, ...options } = mergedVal
                                let res
                                if (id) {
                                    try {
                                        const { data } = await store.level2SDK.vertexServices.updateVertex({ ...options, mergedName, id })
                                        res = data
                                    } catch (error) {
                                        throw error
                                    }
                                } else {
                                    //TODO: check data store to see if object already exists. if it does call update instead to avoid poluting the database
                                    try {
                                        const response = await store.level2SDK.vertexServices.createVertex({
                                            ...options, name
                                        })
                                        res = response
                                    } catch (error) {
                                        throw error
                                    }
                                }
                                if (res) {
                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: res }
                                    })
                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }
                            output = isPopulated(output) ? storeFn(output) : output
                            break
                        }
                        case ('rv'): {
                            const getFn = (output) => async () => {
                                const { api, dataKey, ...options } = _.cloneDeep(output)

                                let res: any[] = []
                                try {
                                    const { data } = await store.level2SDK.vertexServices.retrieveVertex({
                                        idList: [], options
                                    })
                                    res = data
                                } catch (error) {
                                    throw error
                                }
                                if (res.length > 0) {
                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: res }
                                    })
                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }
                            output = isPopulated(output) ? getFn(output) : output
                            break
                        }
                        case ('builtIn'): {
                            const pathArr = api.split('.').slice(1)
                            const builtInFnsObj = builtInFns()
                            const builtInFn = _.get(builtInFnsObj, pathArr)
                            const fn = (output) => async (input?: any) => {
                                //@ts-ignore
                                const { api, dataKey } = _.cloneDeep(output)
                                const pathArr = dataKey.split('.')
                                const currentVal = _.get(Object.values(localRoot)[0], pathArr)
                                let res: any
                                try {
                                    //TODO: make signature more generic
                                    const data = await builtInFn({ ...input, name: { ...currentVal.name, ...input } })
                                    res = data
                                } catch (error) {
                                    throw error
                                }
                                if (Array.isArray(res) && res.length > 0 || isObject(res)) {
                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: res }
                                    })
                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }
                            output = isPopulated(output) ? fn(output) : output
                            break
                        }
                        case ('localSearch'): {

                            const fn = (output) => async () => {
                                //@ts-ignore
                                const { api, dataKey, filter, source: sourcePath } = _.cloneDeep(output)
                                let res: any
                                try {
                                    const source = dispatch({ type: 'get-data', payload: { pageName, dataKey: sourcePath } })
                                    //TODO: make signature more generic
                                    const data = source.filter((elem) => {
                                        //TODO: make filter more universal
                                        for (let [key, val] of Object.entries(filter)) {
                                            //@ts-ignore
                                            if (elem.type[key] !== parseInt(val)) {
                                                return false
                                            }
                                        }
                                        return true
                                    })
                                    res = data
                                } catch (error) {
                                    throw error
                                }
                                if (Array.isArray(res) && res.length > 0) {
                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: res[0] }
                                    })
                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }
                            output = isPopulated(output) ? fn(output) : output
                            break
                        }
                        default: {
                            return
                        }
                    }
                }
            })
        }
        return output
    }
}



/**
 * 
 * @param updateObject Record<string, any>
 * @param dispatch Function
 * @returns Function
 *
 *  - returns a function that is used to update the global state of the CADL class
 */
function evalState({ pageName, updateObject, dispatch }: { pageName: string, updateObject: Record<string, any>, dispatch: Function }): Function {
    return async (): Promise<void> => {
        await dispatch({ type: 'eval-object', payload: { pageName, updateObject } })
        return
    }
}

/**
 * 
 * @param cadlObject Record<string, any>
 * @param dispatch Function
 * @returns Record<string, any>
 * 
 * - replaces the eval object, if any, with a function that performs the the actions detailed in the eval object 
 */
function replaceEvalObject({ pageName, cadlObject, dispatch }: { pageName: string, cadlObject: Record<string, any>, dispatch: Function }): Record<string, any> {
    const cadlCopy = _.cloneDeep(cadlObject)
    Object.keys(cadlCopy).forEach((key) => {
        if (key === 'update') {
            cadlCopy[key] = evalState({ pageName, updateObject: cadlCopy[key], dispatch })
        } else if (key === 'object' && cadlCopy.actionType === 'evalObject') {
            cadlCopy[key] = evalState({ pageName, updateObject: cadlCopy[key], dispatch })
        } else if (isObject(cadlCopy[key])) {
            cadlCopy[key] = replaceEvalObject({ pageName, cadlObject: cadlCopy[key], dispatch })
        } else if (Array.isArray(cadlCopy[key])) {
            cadlCopy[key] = cadlCopy[key].map((elem) => {
                if (isObject(elem)) {
                    return replaceEvalObject({ pageName, cadlObject: elem, dispatch })
                }
                return elem
            })
        }
    })
    return cadlCopy
}


/**
 * 
 * @param source  string -object that has values that need to be replaced
 * @param lookFor string -item to look for in object
 * @param locations Record<string, any>[] -array of objects that may contain the values for the source object
 * @returns Record<string. any> 
 */
function populateString({ source, lookFor, skip, locations, path }: { source: string, lookFor: string, skip?: string[], locations: Record<string, any>[], path?: string[] }) {
    if (skip && skip.includes(source)) return source
    if (!source.startsWith(lookFor)) return source
    let currVal = source
    let replacement
    if (lookFor === '_' && currVal.includes('.')) {
        let charArr = currVal.split('')
        let copyPath = _.clone(path) || []
        let currChar = charArr.shift()
        while (currChar !== '.' && charArr.length > 0) {
            if (currChar === '_') {
                copyPath.pop()
            }
            currChar = charArr.shift()
        }
        replacement = '.' + copyPath.concat(charArr.join('')).join('.')
        return replacement
    }
    else if (lookFor === '..') {
        currVal = currVal.slice(1)
    }
    else if (lookFor === '=') {
        if (source.startsWith('=..')) {
            currVal = currVal.slice(2)
        }
        // else if (source.startsWith('=.builtIn')) {
        //     const builtInFuncs = builtInFns()
        //     const pathArr = source.slice(2).split('.')[1]
        //     const fn = _.get(builtInFuncs, pathArr)
        //     if (fn) {
        //         replacement = fn
        //         return replacement
        //     }
        // } 
        else if (source.startsWith('=.')) {
            currVal = currVal.slice(1)
        }
    }
    if (currVal.startsWith('.')) {
        currVal = currVal.slice(1)
    }
    for (let location of locations) {
        try {
            replacement = dot.pick(currVal, location)

            // replacement = lookUp(currVal, location)
            if (replacement && replacement !== source) {
                if (typeof replacement === 'string' && replacement.startsWith(lookFor)) {
                    return populateString({ source: replacement, lookFor, skip, locations, path })
                } else {
                    break
                }
            }
        } catch (error) {
            if (error instanceof UnableToLocateValue) {
                continue
            } else {
                throw error
            }
        }
    }
    if (replacement && replacement !== source) {
        return replacement
    }
    return source
}

/**
 * 
 * @param source  any[] -object that has values that need to be replaced
 * @param lookFor string -item to look for in object
 * @param locations Record<string, any>[] -array of objects that may contain the values for the source object
 * @returns Record<string. any> 
 */
function populateArray({ source, lookFor, skip, locations, path }: { source: any[], lookFor: string, skip?: string[], locations: Record<string, any>[], path: string[] }) {
    let sourceCopy = _.cloneDeep(source)
    var previousKey = path[path.length - 1] || ''
    let replacement = sourceCopy.map((elem, i) => {
        let index = '[' + i + ']'
        if (Array.isArray(elem)) {
            return populateArray({ source: elem, skip, lookFor, locations, path: path.slice(0, -1).concat(previousKey + index) })
        } else if (isObject(elem)) {
            return populateObject({ source: elem, skip, lookFor, locations, path: path.slice(0, -1).concat(previousKey + index) })
        } else if (typeof elem === 'string') {
            return populateString({ source: elem, skip, lookFor, locations, path: path.slice(0, -1).concat(previousKey + index) })
        }
        return elem
    })

    return replacement
}

/**
 * 
 * @param source  Record<string, any> -object that has values that need to be replaced
 * @param lookFor string -item to look for in object
 * @param locations Record<string, any>[] -array of objects that may contain the values for the source object
 * @returns Record<string. any> 
 */
function populateObject({ source, lookFor, locations, skip = [], path = [] }: { source: Record<string, any>, lookFor: string, locations: Record<string, any>[], skip?: string[], path?: string[] }): Record<string, any> {
    let sourceCopy = _.cloneDeep(source)
    Object.keys(sourceCopy).forEach((key) => {
        let index = key
        if (!skip.includes(key)) {
            if (isObject(sourceCopy[key])) {
                sourceCopy[key] = populateObject({ source: sourceCopy[key], lookFor, locations, skip, path: path.concat(index) })
            } else if (Array.isArray(sourceCopy[key])) {
                sourceCopy[key] = populateArray({ source: sourceCopy[key], skip, lookFor, locations, path: path.concat(index) })
            } else if (typeof sourceCopy[key] === 'string') {
                sourceCopy[key] = populateString({ source: sourceCopy[key], skip, lookFor, locations, path: path.concat(index) })
            }
        }
    })

    return sourceCopy
}

/**
 * @returns Record<string, Function>
 */
function builtInFns(dispatch?: Function) {
    return {
        async createNewAccount({
            phoneNumber,
            password,
            verificationCode,
            name,
        }) {
            const data = await Account.create(
                phoneNumber,
                password,
                verificationCode,
                name
            )
            return data
        },
        async signIn({
            phoneNumber,
            password,
            verificationCode,
        }) {
            const data = await Account.login(
                phoneNumber,
                password,
                verificationCode,
            )
            if (dispatch) {
                dispatch({
                    type: 'update-data',
                    //TODO: handle case for data is an array or an object
                    payload: { pageName: 'builtIn', dataKey: 'builtIn.UserVertex', data }
                })

            }
            return data
        },
        currentDateTime: (() => Date.now())()
    }
}


function populateVals({
    source,
    lookFor,
    locations,
    skip
}: {
    source: Record<string, any>,
    lookFor: string[],
    skip?: string[],
    locations: any[]
}): Record<string, any> {
    let sourceCopy = _.cloneDeep(source)

    for (let symbol of lookFor) {
        sourceCopy = populateObject({
            source: sourceCopy,
            lookFor: symbol,
            skip,
            locations
        })
    }

    return sourceCopy
}

function replaceUint8ArrayWithBase64(source) {
    let sourceCopy = _.cloneDeep(source)
    if (isObject(source)) {

        Object.keys(sourceCopy).forEach((key) => {
            if (sourceCopy[key] instanceof Uint8Array) {
                sourceCopy[key] = store.level2SDK.utilServices.uint8ArrayToBase64(sourceCopy[key])
            } else if (isObject(sourceCopy[key])) {
                sourceCopy[key] = replaceUint8ArrayWithBase64(sourceCopy[key])
            } else if (Array.isArray(sourceCopy[key]) && !(sourceCopy[key] instanceof Uint8Array)) {
                sourceCopy[key] = sourceCopy[key].map((elem) => replaceUint8ArrayWithBase64(elem))
            }
        })
    }
    return sourceCopy
}