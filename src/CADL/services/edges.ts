import _ from 'lodash'
import store from '../../common/store'
import { replaceEidWithId } from '../utils'
import { mergeDeep } from '../../utils'


export {
    get,
    create,
}

/**
 * 
 * @param output Api object
 */
function get({ pageName, apiObject, dispatch }) {
    return async () => {
        const {
            api,
            dataKey,
            dataIn,
            dataOut,
            id,
            maxcount,
            type,
            sCondition,
            ...options
        } = _.cloneDeep(apiObject || {})

        let res: any[] = []
        let idList: string[] | Uint8Array[] = []
        if (id) {
            idList = Array.isArray(id) ? [...id] : [id]
        }
        if (maxcount) {
            options.maxcount = parseInt(maxcount)
        }
        if (type) {
            options.type = parseInt(type)
        }
        if (sCondition) {
            options.scondition = sCondition
        }
        try {
            if (store.env === 'test') {
                console.log(
                    '%cGet Edge Request', 'background: purple; color: white; display: block;',
                    {
                        idList, options: { ...options }
                    });
            }

            const { data } = await store.level2SDK.edgeServices.retrieveEdge({
                idList,
                options: { ...options }
            })
            res = data
        } catch (error) {
            throw error
        }

        //Doesn't update the state. Shows mock data instead.
        if (!res.length && store.env === 'test') {
            console.log(
                '%cGet Edge Response', 'background: purple; color: white; display: block;',
                res
            );
        } else {
            //maps edge.eid to edge.id
            res = res.map((edge) => {
                return replaceEidWithId(edge)
            })
            if (store.env === 'test') {
                console.log(
                    '%cGet Edge Response', 'background: purple; color: white; display: block;',
                    res
                );
            }

            dispatch({
                type: 'update-data',
                //TODO: handle case for data is an array or an object
                payload: {
                    pageName,
                    dataKey: dataOut ? dataOut : dataKey, data: res
                }
            })
            dispatch({
                type: 'emit-update',
                payload: {
                    pageName,
                    dataKey: dataOut ? dataOut : dataKey, newVal: res
                }
            })
        }

        return res
    }
}


/**
 * Creates an edge or updates an edge if there is an id 
 * in the apiObject
 *  
 * @param param0 
 */
function create({ pageName, apiObject, dispatch }) {
    return async (name) => {
        const {
            dataKey,
            dataIn,
            dataOut
        } = _.cloneDeep(apiObject || {})

        //get current object name value
        const { deat, id, ...currentVal } = dispatch({
            type: 'get-data',
            payload: { pageName, dataKey: dataIn ? dataIn : dataKey }
        })
        //merging existing name field and incoming name field
        const parsedType = parseInt(currentVal.type)
        let mergedVal = { ...currentVal, type: parsedType }
        if (name) {
            mergedVal = mergeDeep(mergedVal, { name })
        }
        let res

        //if there is an id present
        //it is treated as un update request
        if (id && !id.startsWith('.')) {
            try {
                if (store.env === 'test') {
                    console.log(
                        '%cUpdate Edge Request', 'background: purple; color: white; display: block;',
                        { ...mergedVal, id }
                    );
                }
                const { data } = await store.level2SDK.edgeServices.updateEdge({ ...mergedVal, id })
                res = data

                if (store.env === 'test') {
                    console.log('%cUpdate Edge Response', 'background: purple; color: white; display: block;', res);
                }

            } catch (error) {
                throw error
            }
        } else {
            try {
                if (store.env === 'test') {
                    console.log(
                        '%cCreate Edge Request', 'background: purple; color: white; display: block;',
                        { ...mergedVal, id }
                    );
                }

                const { data } = await store.level2SDK.edgeServices.createEdge({ ...mergedVal })
                res = data

                if (store.env === 'test') {
                    console.log(
                        '%cCreate Edge Response', 'background: purple; color: white; display: block;',
                        res
                    );
                }
            } catch (error) {
                throw error
            }
        }
        if (res) {
            res = replaceEidWithId(res)
            dispatch({
                type: 'update-data',
                //TODO: handle case for data is an array or an object
                payload: {
                    pageName,
                    dataKey: dataOut ? dataOut : dataKey,
                    data: res
                }
            })

            //dispatch action to update state that is dependant of this response
            //TODO: optimize by updating a slice rather than entire object
            dispatch({
                type: 'populate',
                payload: { pageName }
            })
            dispatch({
                type: 'emit-update',
                payload: {
                    pageName, dataKey: dataOut ? dataOut : dataKey, newVal: res
                }
            })
        }
        return res
    }
}

