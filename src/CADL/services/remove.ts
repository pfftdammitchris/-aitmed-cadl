import _ from 'lodash'
import store from '../../common/store'
import setAPIBuffer from '../middleware/setAPIBuffer'

export { remove }

function remove({ pageName, apiObject, dispatch }) {
  return async () => {
    const { dataKey, dataIn } = _.cloneDeep(apiObject || {})
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

    const { api, id, ...options } = populatedCurrentVal
    let res
    if (Array.isArray(id)) {
      id.forEach(async (element) => {
        try {
          if (store.env === 'test') {
            console.log(
              '%cDelete Object Request',
              'background: purple; color: white; display: block;',
              { ...options, id: element }
            )
          }
          //Buffer check
          const shouldPass = setAPIBuffer({
            api: 'dx',
            element,
          })
          if (!shouldPass) return
          const { data } = await store.level2SDK.commonServices.deleteRequest([
            element,
          ])
          res = data
          if (store.env === 'test') {
            console.log(
              '%cDelete Object Response',
              'background: purple; color: white; display: block;',
              res
            )
          }
        } catch (error) {
          throw error
        }
      })
    }
    //delete request must have have an id
    if (typeof (id) == 'string') {
      try {
        if (store.env === 'test') {
          console.log(
            '%cDelete Object Request',
            'background: purple; color: white; display: block;',
            { ...options, id }
          )
        }
        //Buffer check
        const shouldPass = setAPIBuffer({
          api: 'dx',
          id,
        })
        if (!shouldPass) return
        const { data } = await store.level2SDK.commonServices.deleteRequest([
          id,
        ])
        res = data
        if (store.env === 'test') {
          console.log(
            '%cDelete Object Response',
            'background: purple; color: white; display: block;',
            res
          )
        }
      } catch (error) {
        throw error
      }
    }
  }
}
