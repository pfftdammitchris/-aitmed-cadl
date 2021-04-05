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
    const {
      api,
      dataKey,
      dataIn,
      dataOut,
      id,
      ids,
      subtype,
      ...options
    } = _.cloneDeep(apiObject || {})

    let idList = ids ? ids : id ? [id] : ['']

    let requestOptions = {
      ...options,
    }
    let maxcount = options?.maxcount
    let type = options?.type
    let sCondition = options?.sCondition
    let nonce

    if (dataIn) {
      //get current object name value
      const currentVal = await dispatch({
        type: 'get-data',
        payload: { pageName, dataKey: dataIn ? dataIn : dataKey },
      })

      const { deat, id, _nonce, ...populatedCurrentVal } = await dispatch({
        type: 'populate-object',
        payload: { object: currentVal, pageName, copy: true },
      })
      nonce = _nonce
      if (!isPopulated(id)) {
        throw new UnableToLocateValue(
          `Missing reference ${id} at page ${pageName}`
        )
      }

      idList = Array.isArray(id) ? [...id] : [id]
      requestOptions = populatedCurrentVal
      maxcount = populatedCurrentVal?.maxcount
      type = populatedCurrentVal?.type
      sCondition = populatedCurrentVal?.sCondition
    } else if (options.id) {
      idList = Array.isArray(options.id) ? [...options.id] : [options.id]
    } else {
      const { deat, _nonce, ...populatedCurrentVal } = await dispatch({
        type: 'populate-object',
        payload: { object: requestOptions, pageName },
      })
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
              user: name?.user,
              tags: name?.tags,
              type: restOfDocOptions?.type,
            }
          )
        }

        const response = await Document.update(id, {
          edge_id: eid,
          content: name?.data,
          mediaType: name?.type,
          title: name?.title,
          tags: name?.tags,
          user: name?.user,
          type: restOfDocOptions?.type,
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
              content: name?.data ? name?.data : name,
              mediaType: name?.type,
              user: name?.user,
              title: name?.title,
              type: restOfDocOptions?.type,
            }
          )
        }
        const response = await Document.create({
          edge_id: eid,
          content: name?.data,
          paymentNonce: name?.nonce,
          mediaType: name?.type,
          title: name?.title,
          user: name?.user,
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
