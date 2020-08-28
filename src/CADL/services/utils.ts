import _ from 'lodash'

export { localSearch }

function localSearch({ pageName, apiObject, dispatch }) {
  return async () => {
    const { dataKey, filter, source: sourcePath } = _.cloneDeep(apiObject || {})
    let res: any
    try {
      const source = dispatch({
        type: 'get-data',
        payload: {
          pageName,
          dataKey: sourcePath,
        },
      })
      //TODO: make signature more generic
      const data = source.filter((elem) => {
        //TODO: make filter more universal
        for (let [key, val] of Object.entries(filter)) {
          //@ts-ignore
          if (elem.type[key] !== parseInt(val)) {
            return false
          }
        }
        return true
      })
      res = data
    } catch (error) {
      throw error
    }
    if (Array.isArray(res) && res.length > 0) {
      dispatch({
        type: 'update-data',
        //TODO: handle case for data is an array or an object
        payload: {
          pageName,
          dataKey,
          data: res[0],
        },
      })
      dispatch({
        type: 'emit-update',
        payload: {
          pageName,
          newVal: res,
          dataKey,
        },
      })
    }
    return res
  }
}
