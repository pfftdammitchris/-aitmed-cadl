import _ from 'lodash'
import store from '../../common/store'
import { mergeDeep, replaceEidWithId } from '../../utils'
import { isPopulated } from '../utils'
import { UnableToLocateValue } from '../errors'
import setAPIBuffer from '../middleware/setAPIBuffer'

export { get, create }

/**
 *
 * @param output Api object
 */
function get({ pageName, apiObject, dispatch }) {
  return async () => {
    let res: Record<string, any> = {}
    let idList: string[] | Uint8Array[] = []

    const { api, dataKey, dataIn, dataOut, ...options } = _.cloneDeep(
      apiObject || {}
    )

    let requestOptions = {
      ...options,
    }
    let maxcount = options?.maxcount
    let type = options?.type
    let sCondition = options?.sCondition
    if (dataIn) {
      //get current object name value
      const { deat, id, ...currentVal } = await dispatch({
        type: 'get-data',
        payload: { pageName, dataKey: dataIn ? dataIn : dataKey },
      })
      if (!isPopulated(id)) {
        throw new UnableToLocateValue(
          `Missing reference ${id} at page ${pageName}`
        )
      }
      idList = Array.isArray(id) ? [...id] : [id]
      requestOptions = { ...requestOptions, ...currentVal }
      maxcount = currentVal?.maxcount
      type = currentVal?.type
      sCondition = currentVal?.sCondition
    } else if (options.id) {
      idList = Array.isArray(options.id) ? [...options.id] : [options.id]
    }
    if (maxcount) {
      requestOptions.maxcount = parseInt(maxcount)
    }
    if (type) {
      requestOptions.type = parseInt(type)
    }
    if (sCondition) {
      requestOptions.scondition = sCondition
    }
    try {
      if (store.env === 'test') {
        console.log(
          '%cGet Edge Request',
          'background: purple; color: white; display: block;',
          {
            idList,
            options: requestOptions,
          }
        )
      }

      //Buffer check
      const { pass: shouldPass, cacheIndex } = setAPIBuffer({
        idList,
        options: requestOptions,
      })
      if (!shouldPass) {
        res = await dispatch({ type: 'get-cache', payload: { cacheIndex } })
        return
      } else {
        const { data } = await store.level2SDK.edgeServices.retrieveEdge({
          idList,
          options: requestOptions,
        })
        res = data
      }
    } catch (error) {
      throw error
    }

    //Doesn't update the state. Shows mock data instead.
    if (!res?.edge.length && store.env === 'test') {
      console.log(
        '%cGet Edge Response',
        'background: purple; color: white; display: block;',
        res
      )
    } else {
      //maps edge.eid to edge.id
      let listOfEdgesWithId = res?.edge.map((edge) => {
        return replaceEidWithId(edge)
      })
      res.edge = listOfEdgesWithId
      if (store.env === 'test') {
        console.log(
          '%cGet Edge Response',
          'background: purple; color: white; display: block;',
          res
        )
      }

      await dispatch({
        type: 'update-data',
        //TODO: handle case for data is an array or an object
        payload: {
          pageName,
          dataKey: dataOut ? dataOut : dataKey,
          data: res,
        },
      })
      await dispatch({
        type: 'emit-update',
        payload: {
          pageName,
          dataKey: dataOut ? dataOut : dataKey,
          newVal: res,
        },
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
    const { dataKey, dataIn, dataOut } = _.cloneDeep(apiObject || {})

    //get current object name value
    const { deat, id, ...currentVal } = await dispatch({
      type: 'get-data',
      payload: { pageName, dataKey: dataIn ? dataIn : dataKey },
    })
    if (!isPopulated(id)) {
      throw new UnableToLocateValue(
        `Missing reference ${id} at page ${pageName}`
      )
    }

    let populatedCurrentVal = await dispatch({
      type: 'populate-object',
      payload: { object: currentVal, pageName },
    })
    //merging existing name field and incoming name field
    const parsedType = parseInt(populatedCurrentVal.type)
    if (parsedType === NaN || parsedType === 0) return
    let mergedVal = { ...populatedCurrentVal, type: parsedType }
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
            '%cUpdate Edge Request',
            'background: purple; color: white; display: block;',
            { ...mergedVal, id }
          )
        }
        //Buffer check
        const shouldPass = setAPIBuffer({
          ...mergedVal,
          id,
        })
        if (!shouldPass) return
        const { data } = await store.level2SDK.edgeServices.updateEdge({
          ...mergedVal,
          id,
        })
        res = data

        if (store.env === 'test') {
          console.log(
            '%cUpdate Edge Response',
            'background: purple; color: white; display: block;',
            res
          )
        }
      } catch (error) {
        throw error
      }
    } else {
      try {
        if (store.env === 'test') {
          console.log(
            '%cCreate Edge Request',
            'background: purple; color: white; display: block;',
            { ...mergedVal, id }
          )
        }
        //Buffer check
        const shouldPass = setAPIBuffer({
          ...mergedVal,
        })
        if (!shouldPass) return
        const { data } = await store.level2SDK.edgeServices.createEdge({
          ...mergedVal,
        })
        res = data

        if (store.env === 'test') {
          console.log(
            '%cCreate Edge Response',
            'background: purple; color: white; display: block;',
            res
          )
        }
      } catch (error) {
        throw error
      }
    }
    if (res) {
      res.edge = replaceEidWithId(res.edge)
      await dispatch({
        type: 'update-data',
        //TODO: handle case for data is an array or an object
        payload: {
          pageName,
          dataKey: dataOut ? dataOut : dataKey,
          data: res,
        },
      })

      //dispatch action to update state that is dependant of this response
      //TODO: optimize by updating a slice rather than entire object
      await dispatch({
        type: 'populate',
        payload: { pageName },
      })
      await dispatch({
        type: 'emit-update',
        payload: {
          pageName,
          dataKey: dataOut ? dataOut : dataKey,
          newVal: res,
        },
      })
    }
    return res
  }
}
