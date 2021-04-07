import _, { isArray, isObject } from 'lodash'

export default {
  remove({ object, key }) {
    if (isObject(object)) {
      _.unset(object, key)
    }
    return
  },
  clear({ object, key }) {
    if (isObject(object)) {
      object[key] = ''
    }
    return
  },

  set({ object, key, value }) {
    if (isObject(object)) {
      _.set(object, key, value)
    }
    return
  },
  get({ object, key }) {
    if (isObject(object)) {
      return object[key]
    }
    return
  },
  has({ object, key }) {
    if (isObject(object)) {
      if (key in object && !!object[key]) {
        return true
      }
      return false
    }
    return
  },
  //clears one key of all items of object, and set one item，for list radio
  clearAndSetKey({ object, item, key, value }) {
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        object[i][key] = ''
      }
      item[key] = value
    }
    return
  },
  extract({ array, field }) {
    let match: string[] = field.split('.')
    let result: string[] = []
    // let str: string = "array"
    // match.forEach(arr => {
    //   str += "[\'" + arr + "\']"
    // })
    if (isArray(array)) {
      if (match.length === 1) {
        array.forEach((array) => {
          result.push(array[match[0]])
        })
      } else if (match.length === 2) {
        array.forEach((arr) => {
          result.push(arr[match[0]][match[1]])
        })
      }
    } else if (array) {
      if (match.length === 1) {
        result.push(array[match[0]])
      } else if (match.length === 2) {
        result.push(array[match[0]][match[1]])
      }
    }
    return result
  },
  authToSubType({ auth, authList }) {
    let result: number[] = []
    Object.keys(auth).forEach((key: any) => {
      let authType = 0
      Object.keys(authList).forEach((arr) => {
        if (key === arr) {
          authType = authList[arr] * 10000
        }
      })
      if (auth[key]['create'] === true) authType += 4
      if (auth[key]['edit'] === true) authType += 2
      if (auth[key]['review'] === true) authType += 1
      result.push(parseInt(authType.toString(), 16))
    })
    return result
  },
}
