import _, { isArray, isObject, isString } from 'lodash'

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
      console.log(object[key])
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
    let match: string[] = field.split(".")
    let result: string[] = []
    if (isArray(array)) {
      if (match.length === 1) {
        array.forEach(arr => {
          let str = arr[`${match[0]}${match[1]}`]
          alert(str)
          result.push(str)
        });
      }
      else if (match.length === 2) {
        array.forEach(arr => {

          result.push(arr[match[0]][match[1]])
        });
      }
    }
    else if (array) {
      if (match.length === 1) {
        let str = array[match[0]][match[1]]
        alert(typeof (str))
        result.push(str)
      }
      else if (match.length === 2) {
        let str = array[`${match[0]}${match[1]}`]
        result.push(str)
      }
    }
    return result
  }
}
