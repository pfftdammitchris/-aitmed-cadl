import _ from 'lodash'
import store from '../../common/store'
import { mergeDeep, isObject } from '../../utils'
import Document from '../../services/document'
import { UnableToLocateValue } from '../errors'

export {
    attachDocumentFns,
    attachEdgeFns,
    isPopulated,
    replaceEidWithId,
    lookUp,
    populateKeys,
    attachFns,
    updateState,
    replaceUpdate,
    populateString,
    populateArray,
    populateObject,
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
                output = { ...mergedObjects, ...output }
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

function attachDocumentFns({ dataModelKey, dataModel, dispatch }) {
    let output = Object.assign({}, dataModel)

    const storeFn = (dataModel) => async ({ data, type, id = null }) => {
        let res
        if (id) {
            try {
                const { data } = await store.level2SDK.documentServices.updateDocument({ ...dataModel.dataModel, name, id })
                res = data
            } catch (error) {
                throw error
            }
        } else {
            //TODO: check data store to see if object already exists. if it does call update instead to avoid poluting the database
            try {
                const { type: appDataType, eid, name } = dataModel.store
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
            dispatch({ type: 'update-data-dataModel', payload: { key: dataModelKey, data: res } })
            dispatch({ type: 'populate' })
            return res
        }
        //TODO:handle else case
        return null
    }

    const getFn = (dataModel) => async () => {
        let res
        try {
            const { api, ids, type, ...rest } = dataModel.get
            const parsedType = type.split('-')[1]
            const { data } = await store.level2SDK.documentServices.retrieveDocument({ idList: [ids], options: { ...rest, type: parseInt(parsedType) } })
            res = data
        } catch (error) {
            throw error
        }
        if (res) {
            //TODO: handle case for data is an array or an object
            dispatch({ type: 'update-data-dataModel', payload: { key: dataModelKey, data: res[0] } })
            dispatch({ type: 'populate' })
            return res
        }
        //TODO:handle else case
        return null
    }

    output = { ...output, store: isPopulated(dataModel.store) ? storeFn(dataModel) : dataModel.store, get: isPopulated(dataModel.get) ? getFn(dataModel) : dataModel.get }
    return output
}


function attachEdgeFns({ dataModelKey, dataModel, dispatch }) {
    let output = Object.assign({}, dataModel)
    const storeFn = (dataModel) => async (name, id = null) => {
        let res
        if (id) {
            try {
                const { data } = await store.level2SDK.edgeServices.updateEdge({ ...dataModel.dataModel, name, id })
                res = data
            } catch (error) {
                throw error
            }
        } else {
            try {
                const { data } = await store.level2SDK.edgeServices.createEdge({ ...dataModel.dataModel, name })
                res = data
            } catch (error) {
                throw error
            }
        }
        if (res) {
            const replacedEidWithId = replaceEidWithId(res)
            dispatch({ type: 'update-data-dataModel', payload: { key: dataModelKey, data: replacedEidWithId } })
            dispatch({ type: 'populate' })
            dispatch({ type: 'attach-Fns' })

            return res
        }
        //TODO:handle else case
        return null
    }

    const getFn = (dataModel) => async () => {
        const { get } = dataModel
        const options = Object.assign({}, get)
        delete options.api
        let res: any[] = []
        try {
            const { data } = await store.level2SDK.edgeServices.retrieveEdge({ idList: [], options })
            res = data
        } catch (error) {
            throw error
        }
        if (res.length > 0) {
            res = res.map((edge) => {
                return replaceEidWithId(edge)
            })
            dispatch({
                type: 'update-data-dataModel',
                //TODO: handle case for data is an array or an object
                payload: { key: dataModelKey, data: res[0] }
            })
            dispatch({ type: 'populate' })
            return res
        }
        //TODO:handle else case
        return null
    }

    output = { ...output, store: isPopulated(dataModel.store) ? storeFn(dataModel) : dataModel.store, get: isPopulated(dataModel.get) ? getFn(dataModel) : dataModel.get }
    return output
}

/**
 * 
 * @param cadlObject Record<string, any>
 * @param dispatch Function
 * @returns Record<string,any>
 */
function attachFns({ cadlObject,
    dispatch }) {
    const localRoot = cadlObject
    const pageName = Object.keys(cadlObject)[0]

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
                } else if (typeof output[key] === 'string' && key === 'api') {
                    const { api } = output
                    switch (api) {
                        case ('re'): {
                            const getFn = (output) => async () => {
                                const { api, dataKey, ...options } = _.cloneDeep(output)
                                let res: any[] = []
                                try {
                                    const { data } = await store.level2SDK.edgeServices.retrieveEdge({ idList: [], options })
                                    res = data
                                } catch (error) {
                                    console.log(error)
                                    throw error
                                }
                                if (res.length > 0) {
                                    res = res.map((edge) => {
                                        return replaceEidWithId(edge)
                                    })
                                    //TODO: handle populate
                                    dispatch({
                                        type: 'update-data',
                                        //TODO: handle case for data is an array or an object
                                        payload: { pageName, dataKey, data: res[0] }
                                    })
                                    //TODO: handle populate
                                    //dispatch({ type: 'populate' })
                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }
                            output = getFn(output)
                            break
                        }
                        case ('ce'): {
                            const storeFn = (output) => async (name, id = null) => {
                                const { dataKey, ...cloneOutput } = _.cloneDeep(output)
                                const pathArr = dataKey.split('.')
                                const currentVal = _.get(localRoot[pageName], pathArr)
                                const mergedVal = mergeDeep(currentVal, cloneOutput)
                                const mergedName = mergeDeep({ name: mergedVal }, name)
                                const { api, store: storeProp, get, ...options } = mergedVal


                                let res
                                if (id) {
                                    try {
                                        const { data } = await store.level2SDK.edgeServices.updateEdge({ ...options, mergedName, id })
                                        res = data
                                    } catch (error) {
                                        throw error
                                    }
                                } else {
                                    try {
                                        const { data } = await store.level2SDK.edgeServices.createEdge({ ...options, name })
                                        res = data
                                    } catch (error) {
                                        throw error
                                    }
                                }
                                if (res) {
                                    const replacedEidWithId = replaceEidWithId(res)
                                    dispatch({ type: 'update-data-dataModel', payload: { key: dataKey, data: replacedEidWithId } })
                                    // dispatch({ type: 'populate' })
                                    // dispatch({ type: 'attach-Fns' })

                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }
                            output = storeFn(output)
                            break
                        }
                        case ('rd'): {
                            const getFn = (output) => async () => {
                                let res
                                try {
                                    const { api, ids, type, ...rest } = output
                                    const parsedType = type.split('-')[1]
                                    const { data } = await store.level2SDK.documentServices.retrieveDocument({ idList: [ids], options: { ...rest, type: parseInt(parsedType) } })
                                    res = data
                                } catch (error) {
                                    throw error
                                }
                                if (res) {
                                    //TODO: handle case for data is an array or an object
                                    //TODO: handle update of data state
                                    // dispatch({ type: 'update-data-dataModel', payload: { key: dataModelKey, data: res[0] } })
                                    //TODO: handle update of data state
                                    // dispatch({ type: 'populate' })
                                    return res
                                }
                                //TODO:handle else case
                                return null
                            }

                            output = isPopulated(output) ? getFn(output) : output
                            break
                        }
                        //TODO: fill with vertex functions
                        case ('vertex'): {
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
function updateState(updateObject: Record<string, any>, dispatch: Function): Function {
    return (response: Record<string, any>): void => {
        dispatch({ type: 'update-global', payload: { updateObject, response } })
        return
    }
}

/**
 * 
 * @param cadlObject Record<string, any>
 * @param dispatch Function
 * @returns Record<string, any>
 * 
 * - replaces the update object, if any, with a function that performs the the actions detailed in the update object 
 */
function replaceUpdate(cadlObject: Record<string, any>, dispatch: Function) {
    const cadlCopy = _.cloneDeep(cadlObject)
    Object.keys(cadlCopy).forEach((key) => {
        if (key === 'update') {
            cadlCopy[key] = updateState(cadlCopy[key], dispatch)
        } else if (isObject(cadlCopy[key])) {
            cadlCopy[key] = replaceUpdate(cadlCopy[key], dispatch)
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
function populateString({ source, lookFor, locations }: { source: string, lookFor: string, locations: Record<string, any>[] }) {
    if (!source.startsWith(lookFor)) return source
    let currVal = source
    if (lookFor === '..') {
        currVal = currVal.slice(1)
    }
    let replacement
    for (let location of locations) {
        try {
            replacement = lookUp(currVal, location)
            if (replacement && replacement !== source) {
                if (typeof replacement === 'string' && replacement.startsWith(lookFor)) {
                    return populateString({ source: replacement, lookFor, locations })
                }
                return replacement
            }
        } catch (error) {
            if (error instanceof UnableToLocateValue) {
                continue
            } else {
                throw error
            }
        }
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
function populateArray({ source, lookFor, locations }: { source: any[], lookFor: string, locations: Record<string, any>[] }) {
    let sourceCopy = _.cloneDeep(source)

    let replacement = sourceCopy.map((elem) => {
        if (Array.isArray(elem)) {
            return populateArray({ source: elem, lookFor, locations })
        } else if (isObject(elem)) {
            return populateObject({ source: elem, lookFor, locations })
        } else if (typeof elem === 'string') {
            return populateString({ source: elem, lookFor, locations })
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
function populateObject({ source, lookFor, locations }: { source: Record<string, any>, lookFor: string, locations: Record<string, any>[] }): Record<string, any> {
    let sourceCopy = _.cloneDeep(source)

    Object.keys(sourceCopy).forEach((key) => {
        if (isObject(sourceCopy[key])) {
            sourceCopy[key] = populateObject({ source: sourceCopy[key], lookFor, locations })
        } else if (Array.isArray(sourceCopy[key])) {
            sourceCopy[key] = populateArray({ source: sourceCopy[key], lookFor, locations })
        } else if (typeof sourceCopy[key] === 'string') {
            sourceCopy[key] = populateString({ source: sourceCopy[key], lookFor, locations })
        }
    })

    return sourceCopy
}