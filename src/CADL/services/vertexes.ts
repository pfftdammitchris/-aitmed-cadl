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
    //get current object name value
    const { deat, ...currentVal } = await dispatch({
      type: 'get-data',
      payload: { pageName, dataKey: dataIn ? dataIn : dataKey },
    })

    let populatedCurrentVal = await dispatch({
      type: 'populate-object',
      payload: { object: currentVal, pageName },
    })

    let id = populatedCurrentVal?.id
    if (!isPopulated(id)) {
      throw new UnableToLocateValue(
        `Missing reference ${id} at page ${pageName}`
      )
    }
    let res: Record<string, any> = {}
    try {
      if (store.env === 'test') {
        console.log(
          '%cGet Vertex Request',
          'background: purple; color: white; display: block;',
          { options: { ...options } }
        )
      }
      const { data } = await store.level2SDK.vertexServices.retrieveVertex({
        idList: [id],
        options,
      })
      res = data
      if (store.env === 'test') {
        console.log(
          '%cGet Vertex Response',
          'background: purple; color: white; display: block;',
          res
        )
      }
    } catch (error) {
      throw error
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
    const { dataKey, dataIn, dataOut, id, ...cloneOutput } = _.cloneDeep(
      apiObject || {}
    )
    if (!isPopulated(id)) {
      throw new UnableToLocateValue(
        `Missing reference ${id} at page ${pageName}`
      )
    }
    const currentVal = await dispatch({
      type: 'get-data',
      payload: {
        dataKey: dataIn ? dataIn : dataKey,
        pageName,
      },
    })
    let populatedCurrentVal = await dispatch({
      type: 'populate-object',
      payload: { object: currentVal, pageName },
    })
    const mergedVal = mergeDeep(populatedCurrentVal, cloneOutput)
    const mergedName = mergeDeep({ name: mergedVal }, name)
    const { api, store: storeProp, get, ...options } = mergedVal
    let res
    //If id is in apiObject it is an update request
    if (id) {
      try {
        if (store.env === 'test') {
          console.log(
            '%cUpdate Vertex Request',
            'background: purple; color: white; display: block;',
            { ...options, mergedName, id }
          )
        }
        const { data } = await store.level2SDK.vertexServices.updateVertex({
          ...options,
          mergedName,
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
      //TODO: check data store to see if object already exists. if it does call update instead to avoid poluting the database
      try {
        if (store.env === 'test') {
          console.log(
            '%cCreate Vertex Request',
            'background: purple; color: white; display: block;',
            { ...options, name }
          )
        }
        const response = await store.level2SDK.vertexServices.createVertex({
          ...options,
          name,
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
