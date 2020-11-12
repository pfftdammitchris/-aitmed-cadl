import _ from 'lodash'
import store from '../../common/store'

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
    //delete request must have have an id
    if (id) {
      try {
        if (store.env === 'test') {
          console.log(
            '%cDelete Object Request',
            'background: purple; color: white; display: block;',
            { ...options, id }
          )
        }
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
