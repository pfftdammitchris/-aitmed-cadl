import store from '../../common/store'
import { mergeDeep, isObject } from '../../utils'
import Document from '../../services/document'
import { UnableToLocateValue } from '../errors'

export {
    filterDataModels,
    mergeDataModels,
    populateData,
    attachDocumentFns,
    attachEdgeFns,
    isPopulated,
    attachFns,
    replaceEidWithId,
    lookUp,
    populateKeys,
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
 * @param baseDataModel Record<string, any>
 * @param dataModels Record<string, any>
 * @returns Record<string, any>
 */
function mergeDataModels(baseDataModel: Record<string, any>, dataModels: Record<string, any>) {
    let _baseDataModel = Object.assign({}, baseDataModel)
    const {
        vertex: baseVertexDataModel,
        edge: baseEdgeDataModel,
        document: baseDocumentDataModel,
        dataModel: superDataModel,
        pageName,
        ...restBaseProperties
    } = _baseDataModel
    debugger
    let mergedDataModels = { ...restBaseProperties }

    // const mergedBaseEdgeDataModelWithBaseDataModel = mergeDeep({ dataModel: superDataModel }, baseEdgeDataModel)
    // const mergedBaseDocumentDataModelWithBaseDataModel = mergeDeep({ dataModel: superDataModel }, baseDocumentDataModel)
    // const mergedBaseVertexDataModelWithBaseDataModel = mergeDeep({ dataModel: superDataModel }, baseVertexDataModel)

    for (let [dataModelKey, dataModel] of Object.entries(dataModels)) {
        try {
            switch (dataModel.objectType) {
                case ('edge'): {
                    const mergedEdgeDataModel = mergeDeep(mergedBaseEdgeDataModelWithBaseDataModel, dataModel)

                    mergedDataModels = {
                        ...mergedDataModels,
                        [dataModelKey]: mergedEdgeDataModel
                    }
                    break
                }
                case ('document'): {
                    const mergedDocumentDataModel = mergeDeep(mergedBaseDocumentDataModelWithBaseDataModel, dataModel)
                    mergedDataModels = {
                        ...mergedDataModels,
                        [dataModelKey]: mergedDocumentDataModel
                    }
                    break
                }
                case ('vertex'): {
                    const mergedVertexDataModel = mergeDeep(mergedBaseVertexDataModelWithBaseDataModel, dataModel)
                    mergedDataModels = {
                        ...mergedDataModels,
                        [dataModelKey]: mergedVertexDataModel
                    }
                    break
                } default: {
                    mergedDataModels = {
                        ...mergedDataModels,
                        [dataModelKey]: dataModel
                    }
                    break
                }
            }
        } catch (error) {
            //TODO: customize error
            throw new Error(
                `UIDL -> getALLData -> dataModelKey:${dataModelKey}`
            )
        }
    }

    return mergedDataModels
}



/**
 * 
 * @param source  Record<string, any> -object that has values that need to be replaced
 * @param locations Record<string, any>[] -array of objects that may contain the values for the source object
 * @returns Record<string. any> 
 */
//TODO: refactor to populate the values again
function populateData(source: Record<string, any>, locations: Record<string, any>[]) {
    let output = Object.assign({}, source)
    if (isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                output[key] = populateData(source[key], locations)
            } else if (source[key]) {
                const currVal = source[key].toString()
                if (currVal.startsWith('.')) {
                    let newVal = currVal
                    for (let location of locations) {
                        try {
                            let res = lookUp(currVal, location)
                            if (res && typeof res === 'string' && !res.startsWith('.')) {
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
    // debugger
    let output = Object.assign({}, source)
    if (isObject(source)) {
        Object.keys(source).forEach((key) => {
            //TODO: check if the key startsWith('.')
            if (key.startsWith('.')) {
                let parent = {}
                for (let location of locations) {
                    try {
                        // debugger
                        parent = lookUp(key, location)
                        // debugger
                    } catch (error) {
                        if (error instanceof UnableToLocateValue) {
                            continue
                        } else {
                            throw error
                        }
                    }
                }
                output = { ...output, ...parent, ...populateKeys(output[key], locations) }
                if (Object.keys(parent).length) delete output[key]
            } else if (isObject(source[key])) {
                output[key] = populateKeys(source[key], locations)
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
    if (!Object.keys(item)) return false
    let isPop: boolean = true
    if (isObject(item)) {
        for (let key of Object.keys(item)) {
            if (!isPop) return isPop
            if (isObject(item[key])) {
                isPop = isPopulated(item[key])
            } else if (item[key]) {
                const currVal = item[key].toString()
                if (currVal.startsWith('.')) {
                    isPop = false
                }
            }
        }
    } else if (typeof item === 'string') {
        const currVal = item.toString()
        if (currVal.startsWith('.')) {
            isPop = false
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
function attachFns({
    dataModelKey,
    dataModel,
    dispatch
}) {
    const { objectType } = dataModel
    switch (objectType) {
        case ('edge'): {
            const dataModelWithFn = attachEdgeFns({
                dataModelKey,
                dataModel,
                dispatch
            })
            return dataModelWithFn
        }
        case ('document'): {
            const dataModelWithFn = attachDocumentFns({
                dataModelKey,
                dataModel,
                dispatch
            })
            return dataModelWithFn
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