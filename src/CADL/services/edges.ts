import _ from 'lodash'
import store from '../../common/store'
import { mergeDeep, replaceEidWithId } from '../../utils'
import { isPopulated } from '../utils'
import { UnableToLocateValue } from '../errors'

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
    let nonce

    //get current object name value
    const currentVal = await dispatch({
      type: 'get-data',
      payload: { pageName, dataKey: dataIn ? dataIn : dataKey },
    })
    if (dataIn) {
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

      requestOptions = { ...requestOptions, ...populatedCurrentVal }
      maxcount = populatedCurrentVal?.maxcount
      type = populatedCurrentVal?.type
      sCondition = populatedCurrentVal?.sCondition
    } else if (options.id) {
      idList = Array.isArray(options.id) ? [...options.id] : [options.id]
    }
    const { deat, id, _nonce, ...populatedCurrentVal } = await dispatch({
      type: 'populate-object',
      payload: { object: requestOptions, pageName },
    })
    requestOptions = { ...requestOptions, ...populatedCurrentVal }

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
          '%cGet Edge Request',
          'background: purple; color: white; display: block;',
          {
            idList,
            options: requestOptions,
          }
        )
      }

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
        const { data } = await store.level2SDK.edgeServices.retrieveEdge({
          idList,
          options: requestOptions,
        })
        await dispatch({
          type: 'set-cache',
          payload: { data, cacheIndex },
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

    let populatedCurrentVal = await dispatch({
      type: 'populate-object',
      payload: { object: currentVal, pageName, copy: true },
    })
    const isFCMRegisterEdge = populatedCurrentVal.type === 1090
    if (isFCMRegisterEdge) {
      populatedCurrentVal.subtype = 2
    }
    if (!isPopulated(id)) {
      throw new UnableToLocateValue(
        `Missing reference ${id} at page ${pageName}`
      )
    }
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
            { ...mergedVal }
          )
        }

        const { data } = await store.level2SDK.edgeServices.createEdge({
          ...mergedVal,
        })
        const isInviteEdge = data?.edge?.type === 1053
        if (false) {
          const pkOfInviter = localStorage.getItem('pk')
          const skOfInviter = localStorage.getItem('sk')
          const {
            data: { edge },
          } = await store.level2SDK.edgeServices.retrieveEdge({
            idList: [data?.edge?.refid],
          })
          const rootEdge = edge[0]
          let rootEdgeBesak = rootEdge?.besak
          if (!rootEdge?.besak) {
            const besak = store.level2SDK.commonServices.generateEsak(
              pkOfInviter
            )
            const {
              data: updatedRootEdgeRes,
            } = await store.level2SDK.edgeServices.updateEdge({
              id: rootEdge.eid,
              type: 40000,
              besak,
              name: rootEdge.name,
            })

            if (updatedRootEdgeRes?.edge) rootEdgeBesak = besak
          }
          let pkOfInviterToUint8Array, skOfInviterToUint8Array
          if (pkOfInviter && skOfInviter) {
            pkOfInviterToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
              pkOfInviter
            )
            skOfInviterToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
              skOfInviter
            )
          }
          const sak = store.level2SDK.utilServices.aKeyDecrypt(
            pkOfInviterToUint8Array,
            skOfInviterToUint8Array,
            rootEdgeBesak
          )
          const inviteEdge = data?.edge
          const pkOfInvitee = inviteEdge.deat.evPK
            ? inviteEdge.deat.evPK
            : inviteEdge.deat.eePK
          const pkOfInviteeToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
            pkOfInvitee
          )
          if (sak) {
            const eesak = store.level2SDK.utilServices.aKeyEncrypt(
              pkOfInviteeToUint8Array,
              skOfInviterToUint8Array,
              sak
            )
            const {
              data: updatedInviteEdgeRes,
            } = await store.level2SDK.edgeServices.updateEdge({
              id: inviteEdge.eid,
              type: 1053,
              eesak,
              name: inviteEdge.name,
            })
            res = updatedInviteEdgeRes
          }
        } else {
          res = data
        }

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
