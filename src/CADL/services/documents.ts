import _ from 'lodash'
import store from '../../common/store'
import { mergeDeep } from '../../utils'
import { documentToNote } from '../../services/document/utils'
import Document from '../../services/document'

export { get, create }

function get({ pageName, apiObject, dispatch }) {
  return async () => {
    let res
    const {
      api,
      dataKey,
      dataIn,
      dataOut,
      id,
      ids,
      filter: { applicationDataType = '' },
      type,
      maxcount,
      ...rest
    } = _.cloneDeep(apiObject || {})
    let idList = [ids ? ids : id ? id : '']
    try {
      if (store.env === 'test') {
        console.log(
          '%cGet Document Request',
          'background: purple; color: white; display: block;',
          { idList, options: { ...rest, maxcount } }
        )
      }
      const data = await store.level2SDK.documentServices
        .retrieveDocument({
          idList,
          options: { ...rest },
        })
        .then(({ data }) => {
          return Promise.all(
            data.map(async (document) => {
              const note = await documentToNote({ document })
              return note
            })
          )
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          console.log(err)
        })

      res = data
      if (store.env === 'test') {
        console.log(
          '%cGet Document Response',
          'background: purple; color: white; display: block;',
          res
        )
      }
    } catch (error) {
      throw error
    }
    if (res) {
      if (
        Array.isArray(res?.document) &&
        res?.document.length &&
        applicationDataType
      ) {
        const filteredRes = res?.document.filter((doc) => {
          return doc.type.applicationDataType === parseInt(applicationDataType)
        })
        res.document = filteredRes
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

function create({ pageName, apiObject, dispatch }) {
  //@ts-ignore
  return async ({ data, type: typeForStringData, title }) => {
    //@ts-ignore
    const { dataKey, dataIn, dataOut, id } = _.cloneDeep(apiObject || {})

    const currentVal = await dispatch({
      type: 'get-data',
      payload: {
        dataKey: dataIn ? dataIn : dataKey,
        pageName,
      },
    })

    const mergedVal = mergeDeep(currentVal, {
      name: { data, type: typeForStringData, title },
    })
    const { api, ...options } = mergedVal
    let res
    //If id is in apiObject then it is an updateRequest
    if (id) {
      try {
        if (store.env === 'test') {
          console.log(
            '%cUpdate Document Request',
            'background: purple; color: white; display: block;',
            { ...options, id }
          )
        }
        const { data } = await store.level2SDK.documentServices.updateDocument({
          ...options,
          id,
        })
        res = data
        if (store.env === 'test') {
          console.log(
            '%cUpdate Document Response',
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
        const { type: appDataType, eid, name } = options
        if (store.env === 'test') {
          console.log(
            '%cCreate Document Request',
            'background: purple; color: white; display: block;',
            {
              edge_id: eid,
              dataType: parseInt(appDataType.applicationDataType),
              content: data,
              type: typeForStringData,
              title: name.title,
            }
          )
        }
        const response = await Document.create({
          edge_id: eid,
          dataType: parseInt(appDataType.applicationDataType),
          content: data,
          type: typeForStringData,
          title: name.title,
        })
        res = response
        if (store.env === 'test') {
          console.log(
            '%cCreate Document Response',
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
