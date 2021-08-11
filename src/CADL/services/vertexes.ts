import _ from 'lodash'
import store from '../../common/store'
import { mergeDeep } from '../../utils'
import { isPopulated } from '../utils'
import { UnableToLocateValue } from '../errors'

export { get, create }

function get({ pageName, apiObject, dispatch }) {
  return async () => {
    const { api, dataKey, dataIn, dataOut, ...options } = _.cloneDeep(
      apiObject || {}
    )
    let res: Record<string, any> = {}
    let requestOptions = {
      ...options,
    }
    let sCondition = options?.sCondition

    let nonce

    //get current object name value
    const currentVal = await dispatch({
      type: 'get-data',
      payload: { pageName, dataKey: dataIn ? dataIn : dataKey },
    })

    let { deat, id, _nonce, ...populatedCurrentVal } = await dispatch({
      type: 'populate-object',
      payload: { object: currentVal, pageName, copy: true },
    })

    nonce = _nonce
    if (!isPopulated(id)) {
      throw new UnableToLocateValue(
        `Missing reference ${id} at page ${pageName}`
      )
    }
    requestOptions = { ...requestOptions, ...populatedCurrentVal }
    sCondition = populatedCurrentVal?.sCondition

    try {
      if (store.env === 'test') {
        console.log(
          '%cGet Vertex Request',
          'background: purple; color: white; display: block;',
          { options: requestOptions }
        )
      }
      if (sCondition) {
        requestOptions.scondition = sCondition
      }
      //Buffer check
      const { pass: shouldPass, cacheIndex } = await dispatch({
        type: 'set-api-buffer',
        payload: {
          apiObject: {
            idList: [id],
            options: requestOptions,
            nonce,
          },
        },
      })
      if (!shouldPass) {
        res = await dispatch({ type: 'get-cache', payload: { cacheIndex } })
        if (store.env === 'test') {
          console.log(
            `%cUsing Cached Data for`,
            'background:#7268A6; color: white; display: block;',
            apiObject
          )
        }
      } else {
        if (requestOptions.sCondition) {
          requestOptions.scondition = requestOptions.sCondition
          delete requestOptions.sCondition
        }
        const { data } = await store.level2SDK.vertexServices.retrieveVertex({
          idList: id ? [id] : [],
          options: requestOptions,
        })
        await dispatch({
          type: 'set-cache',
          payload: { data, cacheIndex },
        })
        res = data
        if (store.env === 'test') {
          console.log(
            '%cGet Vertex Response',
            'background: purple; color: white; display: block;',
            res
          )
        }
      }
    } catch (error) {
      throw error
    }
    if (res.jwt) {
      //update Global jwt
      await dispatch({
        type: 'update-data',

        payload: {
          dataKey: 'Global.currentUser.JWT',
          data: res.jwt,
        },
      })
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
        newVal: res,
        dataKey: dataOut ? dataOut : dataKey,
      },
    })
    return res
  }
}

function create({ pageName, apiObject, dispatch }) {
  return async (name) => {
    const { dataKey, dataIn, dataOut } = _.cloneDeep(apiObject || {})

    const { deat, ...currentVal } = await dispatch({
      type: 'get-data',
      payload: {
        dataKey: dataIn ? dataIn : dataKey,
        pageName,
      },
    })
    let { id, ...populatedCurrentVal } = await dispatch({
      type: 'populate-object',
      payload: { object: currentVal, pageName, copy: true },
    })
    if (!isPopulated(id)) {
      throw new UnableToLocateValue(
        `Missing reference ${id} at page ${pageName}`
      )
    }

    let mergedVal = populatedCurrentVal
    if (name) {
      mergedVal = mergeDeep(mergedVal, { name })
    }

    const { api, store: storeProp, get, ...options } = mergedVal
    let res
    //If id is in apiObject it is an update request
    if (id) {
      try {
        if (store.env === 'test') {
          console.log(
            '%cUpdate Vertex Request',
            'background: purple; color: white; display: block;',
            { ...options, id }
          )
        }

        if (options['type']) {
          options['type'] = parseInt(options?.type)
        }
        if (options['tage']) {
          options['tage'] = parseInt(options?.tage)
        }
        const { data } = await store.level2SDK.vertexServices.updateVertex({
          ...options,
          id,
        })
        res = data
        if (store.env === 'test') {
          console.log(
            '%cUpdate Vertex Response',
            'background: purple; color: white; display: block;',
            res
          )
        }
      } catch (error) {
        throw error
      }
    } else {
      if (options['type']) {
        options['type'] = parseInt(options?.type)
      }
      if (options['tage']) {
        options['tage'] = parseInt(options?.tage)
      }
      //TODO: check data store to see if object already exists. if it does call update instead to avoid poluting the database
      try {
        if (store.env === 'test') {
          console.log(
            '%cCreate Vertex Request',
            'background: purple; color: white; display: block;',
            { ...options }
          )
        }

        const response = await store.level2SDK.vertexServices.createVertex({
          ...options,
        })

        res = response
        if (store.env === 'test') {
          console.log(
            '%cCreate Vertex Response',
            'background: purple; color: white; display: block;',
            res
          )
        }
      } catch (error) {
        throw error
      }
    }
    if (res) {
      if (res.jwt) {
        //update Global jwt
        await dispatch({
          type: 'update-data',

          payload: {
            dataKey: 'Global.currentUser.JWT',
            data: res.jwt,
          },
        })
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
          newVal: res,
          dataKey: dataOut ? dataOut : dataKey,
        },
      })
    }
    return res
  }
}
