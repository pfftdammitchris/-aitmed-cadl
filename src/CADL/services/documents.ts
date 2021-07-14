import _ from 'lodash'
import store from '../../common/store'
import { documentToNote } from '../../services/document/utils'
import Document from '../../services/document'
import { isPopulated } from '../utils'
import { UnableToLocateValue } from '../errors'

export { get, create }

function get({ pageName, apiObject, dispatch }) {
  return async () => {

    let res
    const { api, dataKey, dataIn, dataOut, subtype, ...options } = _.cloneDeep(
      apiObject || {}
    )

    let requestOptions = {
      ...options,
    }
    let maxcount = options?.maxcount
    let type = options?.type
    let sCondition = options?.sCondition
    let nonce
    let idList
    let objtype
    if (dataIn) {
      //get current object name value
      const currentVal = await dispatch({
        type: 'get-data',
        payload: { pageName, dataKey: dataIn ? dataIn : dataKey },
      })
      const { deat, id, ids, _nonce, ObjType, key, ...populatedCurrentVal } =
        await dispatch({
          type: 'populate-object',
          payload: { object: currentVal, pageName, copy: true },
        })

      if (ObjType && ObjType === 3 && key) {
        let res: any[] = []
        const searchResponse = await dispatch({
          type: 'search-cache',
          payload: { key },
        })
        if (searchResponse.length) {
          const decryptedDocs = searchResponse.map(async (doc) => {
            const decryptedDoc = await documentToNote({ document: doc })
            return decryptedDoc
          })
          await Promise.all(decryptedDocs)
            .then((decryptedDataResults) => {
              res = decryptedDataResults
            })
            .catch((error) => {
              console.log(error)
            })
        }
        await dispatch({
          type: 'update-data',
          //TODO: handle case for data is an array or an object
          payload: {
            pageName,
            dataKey: dataOut ? dataOut : dataKey,
            data: { doc: res, searchResult: true },
          },
        })
        return
      }
      objtype = ObjType
      idList = ids ? ids : id ? [id] : ['']
      nonce = _nonce
      if (!isPopulated(id)) {
        throw new UnableToLocateValue(
          `Missing reference ${id} at page ${pageName}`
        )
      }

      requestOptions = populatedCurrentVal
      maxcount = populatedCurrentVal?.maxcount
      type = populatedCurrentVal?.type
      sCondition = populatedCurrentVal?.sCondition
    } else {
      const { deat, _nonce, id, ids, ...populatedCurrentVal } = await dispatch({
        type: 'populate-object',
        payload: { object: requestOptions, pageName },
      })
      idList = ids ? ids : id ? [id] : ['']
      nonce = _nonce
      requestOptions = populatedCurrentVal
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

    if (objtype) {
      requestOptions.ObjType = objtype
    }
    //Buffer check
    const { pass: shouldPass, cacheIndex } = await dispatch({
      type: 'set-api-buffer',
      payload: {
        apiObject: {
          idList,
          options: requestOptions,
          nonce,
        },
      },
    })
    try {
      if (store.env === 'test') {
        console.log(
          '%cGet Document Request',
          'background: purple; color: white; display: block;',
          { idList, options: requestOptions }
        )
      }
      //Buffer check
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
        let rawResponse
        await store.level2SDK.documentServices
          .retrieveDocument({
            idList,
            options: requestOptions,
          })
          .then((res) => {
            rawResponse = res.data
            return Promise.all(
              res?.data?.document.map(async (document) => {
                await dispatch({
                  type: 'insert-to-object-table', //yuhan
                  payload: { doc: document },
                })
                //decrypt data
                if (document?.deat?.url) {
                  //skip files that are in S3
                  //these will be retrieved as needed by noodl established prepareDoc util fn
                  return document
                } else {
                  const note = await documentToNote({ document })

                  return note
                }
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
        await dispatch({
          type: 'set-cache',
          payload: { data: rawResponse, cacheIndex },
        })
        res = rawResponse
      }
    } catch (error) {
      throw error
    }
    if (res) {
      if (store.env === 'test') {
        console.log(
          '%cGet Document Response',
          'background: purple; color: white; display: block;',
          res
        )
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
      await dispatch({
        type: 'insert-to-index-table',
        payload: { doc: res },
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
    const { deat, id, _nonce, ...populatedCurrentVal } = await dispatch({
      type: 'populate-object',
      payload: { object: currentVal, pageName },
    })
    if (!isPopulated(id)) {
      throw new UnableToLocateValue(
        `Missing reference ${id} at page ${pageName}`
      )
    }
    if (
      populatedCurrentVal.type == '2000' &&
      typeof populatedCurrentVal.name.nonce === 'function'
    ) {
      //document is a payment type
      populatedCurrentVal.name = {
        ...populatedCurrentVal.name,
        nonce: populatedCurrentVal.name.nonce(),
      }
    }
    let res
    //If id is in apiObject then it is an updateRequest
    if (id) {
      try {
        const {
          eid,
          name,
          subtype: dTypeProps,
          ...restOfDocOptions
        } = populatedCurrentVal
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
              targetRoomName: name?.targetRoomName,
              tags: name?.tags,
              user: name?.user,
              type: restOfDocOptions?.type,
              fid: restOfDocOptions?.fid,
              jwt: restOfDocOptions?.jwt,
              dTypeProps,
            }
          )
        }

        const response = await Document.update(id, {
          edge_id: eid,
          content: name?.data,
          mediaType: name?.type,
          title: name?.title,
          targetRoomName: name?.targetRoomName,
          tags: name?.tags,
          user: name?.user,
          type: restOfDocOptions?.type,
          fid: restOfDocOptions?.fid,
          jwt: restOfDocOptions?.jwt,
          dTypeProps,
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
        const {
          subtype: dTypeProps,
          eid,
          name,
          ...restOfDocOptions
        } = populatedCurrentVal
        if (store.env === 'test') {
          console.log(
            '%cCreate Document Request',
            'background: purple; color: white; display: block;',
            {
              edge_id: eid,
              content: name?.data,
              targetRoomName: name?.targetRoomName,
              paymentNonce: name?.nonce,
              mediaType: name?.type,
              title: name?.title,
              user: name?.user,
              type: restOfDocOptions?.type,
              fid: restOfDocOptions?.fid,
              jwt: restOfDocOptions?.jwt,
              dTypeProps,
            }
          )
        }

        const response = await Document.create({
          edge_id: eid,
          content: name?.data,
          targetRoomName: name?.targetRoomName,
          paymentNonce: name?.nonce,
          mediaType: name?.type,
          title: name?.title,
          user: name?.user,
          type: restOfDocOptions?.type,
          fid: restOfDocOptions?.fid,
          jwt: restOfDocOptions?.jwt,
          dTypeProps,
          dispatch,
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
      await dispatch({
        type: 'insert-to-index-table',
        payload: { doc: [res.doc] },
      })
    }
    return res
  }
}
