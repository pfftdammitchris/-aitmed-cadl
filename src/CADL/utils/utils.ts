import store from '../../common/store'
import { mergeDeep, isObject } from '../../utils'
import Document from '../../services/document'
import { UnableToLocateValue } from '../errors'

export {
    filterDataModels,
    populateData,
    attachDocumentFns,
    attachEdgeFns,
    isPopulated,
    replaceEidWithId,
    lookUp,
    populateKeys,
    attachFns,
    updateState,
    replaceUpdate
}


function filterDataModels(objectType: string, dataModels: Record<string, any>) {
    if (!Object.keys(dataModels).length) return {}
    let output = {}
    for (let key in dataModels) {
        if (dataModels[key].objectType === objectType) {
            output = { ...output, [key]: dataModels[key] }
        }
    }
    return output
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
 * @param source  Record<string, any> -object that has values that need to be replaced
 * @param locations Record<string, any>[] -array of objects that may contain the values for the source object
 * @returns Record<string. any> 
 */
//TODO: refactor to populate the values again
function populateData(source: Record<string, any>, lookFor: string, locations: Record<string, any>[]) {
    let output = Object.assign({}, source)
    if (isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                output[key] = populateData(source[key], lookFor, locations)
            } else if (Array.isArray(source[key])) {
                output[key] = source[key].map((elem) => {
                    if (isObject(elem)) {
                        return populateData(elem, lookFor, locations)
                    } else if (typeof elem === 'string' && elem.startsWith(lookFor)) {
                        for (let location of locations) {
                            let currVal = elem
                            if (lookFor === '..') {
                                currVal = currVal.slice(1)
                            }
                            try {
                                let res = lookUp(currVal, location)
                                return res
                            } catch (error) {
                                if (error instanceof UnableToLocateValue) {
                                    continue
                                } else {
                                    throw error
                                }
                            }
                        }
                    }
                    return elem
                })
            } else if (source[key] && typeof source[key] === 'string') {
                let currVal = source[key].toString()
                if (currVal.startsWith(lookFor)) {
                    let newVal = currVal
                    if (lookFor === '..') {
                        currVal = currVal.slice(1)
                    }
                    for (let location of locations) {
                        try {
                            let res = lookUp(currVal, location)
                            if (res && typeof res === 'string' && !res.startsWith(lookFor)) {
                                newVal = res
                            } else if (res) {
                                newVal = res
                            }
                        } catch (error) {
                            if (error instanceof UnableToLocateValue) {
                                continue
                            } else {
                                throw error
                            }
                        }
                    }
                    output[key] = newVal
                }
            } else {
                output[key] = source[key]
            }
        })
    }
    return output
}

function populateKeys(source: Record<string, any>, locations: Record<string, any>[]) {
    let output = Object.assign({}, source)
    if (isObject(source)) {
        Object.keys(source).forEach((key) => {
            //TODO: check if the key startsWith('.')
            if (key.startsWith('.')) {
                let parent = {}
                for (let location of locations) {
                    try {
                        const res = lookUp(key, location)
                        if (res) {
                            parent = res
                        }
                    } catch (error) {
                        if (error instanceof UnableToLocateValue) {
                            parent = {}
                            continue
                        } else {
                            throw error
                        }
                    }
                }
                if (Object.keys(parent).length) {
                    const mergedObjects = mergeDeep(parent, populateKeys(output[key], locations))
                    output = { ...output, ...mergedObjects }
                    delete output[key]
                }
            } else if (isObject(source[key])) {
                output[key] = populateKeys(source[key], locations)
            } else if (Array.isArray(source[key])) {
                source[key] = source[key].map((elem) => {
                    if (isObject(elem)) {
                        return populateKeys(elem, locations)
                    }
                    return elem
                })
                //TODO: may need to add string case
            } else {
                output[key] = source[key]
            }
        })
    }
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
    let itemCopy = Object.assign({}, item)
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
 * @param params
 * @param params.dataModelKey string
 * @param params.dataModel Record<string, any>
 * @param params.dispatch Function
 * @returns Record<string,any>
 */
function attachFns(
    cadlObject, dispatch
) {
    let output = Object.assign({}, cadlObject)
    if (isObject(output)) {
        Object.keys(output).forEach((key) => {
            if (isObject(output[key])) {
                output[key] = attachFns(output[key], dispatch)
            } else if (Array.isArray(output[key])) {
                output[key] = output[key].map((elem) => {
                    if (isObject(elem)) return attachFns(elem, dispatch)
                    return elem
                })
            } else if (typeof output[key] === 'string' && key === 'api') {
                const { api } = output
                switch (api) {
                    case ('re'): {
                        const getFn = (output) => async () => {
                            const options = Object.assign({}, output)
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
                                //TODO: handle populate
                                // dispatch({
                                //     type: 'update-data-dataModel',
                                //     //TODO: handle case for data is an array or an object
                                //     payload: { data: res[0] }
                                // })
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

function updateState(updateObject: Record<string, any>, dispatch: Function) {
    return (response: Record<string, any>): void => {
        dispatch({ type: 'update-global', payload: { updateObject, response } })
        return
    }
}

function replaceUpdate(cadlObject, dispatch) {
    const cadlCopy = Object.assign({}, cadlObject)
    if (isObject(cadlCopy)) {
        Object.keys(cadlCopy).forEach((key) => {
            if (key === 'update') {
                cadlCopy[key] = updateState(cadlCopy[key], dispatch)
            } else if (isObject(cadlCopy[key])) {
                cadlCopy[key] = replaceUpdate(cadlCopy[key], dispatch)
            }
        })
    }
    return cadlCopy
}


