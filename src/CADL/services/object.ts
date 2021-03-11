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
}
