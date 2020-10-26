import _ from 'lodash'
import store from '../../common/store'
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
      //@ts-ignore
      // filter: { applicationDataType = '' },
      subtype,
      maxcount,
      type,
      ...rest
    } = _.cloneDeep(apiObject || {})
    let idList = ids ? ids : id ? [id] : ['']
    try {
      if (store.env === 'test') {
        console.log(
          '%cGet Document Request',
          'background: purple; color: white; display: block;',
          { idList, options: { ...rest, maxcount } }
        )
      }
      let rawResponse
      await store.level2SDK.documentServices
        .retrieveDocument({
          idList,
          options: { ...rest },
        })
        .then((res) => {
          rawResponse = res.data
          return Promise.all(
            res?.data?.document.map(async (document) => {
              const note = await documentToNote({ document })
              return note
            })
          )
        })
        .then((res) => {
          rawResponse.doc = res
          delete rawResponse.document
        })
        .catch((err) => {
          console.log(err)
        })

      res = rawResponse
    } catch (error) {
      throw error
    }
    if (res) {
      // if (Array.isArray(res) && res.length && applicationDataType) {
      //   const filteredRes = res.filter((doc) => {
      //     return (
      //       doc.subtype.applicationDataType === parseInt(applicationDataType)
      //     )
      //   })
      //   res = filteredRes
      if (store.env === 'test') {
        console.log(
          '%cGet Document Response',
          'background: purple; color: white; display: block;',
          res
        )
      }
      // }
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
  return async () => {
    //@ts-ignore
    const { dataKey, dataIn, dataOut } = _.cloneDeep(apiObject || {})
    const currentVal = await dispatch({
      type: 'get-data',
      payload: {
        dataKey: dataIn ? dataIn : dataKey,
        pageName,
      },
    })

    const { api, id, ...options } = currentVal
    let res
    //If id is in apiObject then it is an updateRequest
    if (id) {
      try {
        const { eid, name, ...restOfDocOptions } = options
        if (store.env === 'test') {
          console.log(
            '%cUpdate Document Request',
            'background: purple; color: white; display: block;',
            id,
            {
              edge_id: eid,
              content: name?.data,
              mediaType: name?.type,
              title: name?.title,
              tags: name?.tags,
              type: restOfDocOptions?.type,
            }
          )
        }

        const response = await Document.update(id, {
          // ...options,
          edge_id: eid,
          content: name?.data,
          mediaType: name?.type,
          title: name?.title,
          tags: name?.tags,
          type: restOfDocOptions?.type,
        })
        res = response
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
        const { subtype: dTypeProps, eid, name, ...restOfDocOptions } = options
        if (store.env === 'test') {
          console.log(
            '%cCreate Document Request',
            'background: purple; color: white; display: block;',
            {
              edge_id: eid,
              content: name?.data,
              mediaType: name?.type,
              title: name?.title,
              type: restOfDocOptions?.type,
            }
          )
        }
        const response = await Document.create({
          edge_id: eid,
          content: name?.data,
          mediaType: name?.type,
          title: name?.title,
          type: restOfDocOptions?.type,
          dTypeProps,
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
