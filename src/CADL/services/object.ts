import _, { isArray, isObject } from 'lodash'

// Points from talk with Ray:
// Original plan is to modify the object in place, but the object could be referenced in multiple locations
// We can either modify the object in place, or return a deep copy
// Alternatively, we can change the function to do both, if being told
// I will include all three methods here, with two being commented out
export default {
  // Returns a deep copy

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
  //  clear one key of all items of object, and set one item ， for list radio
  clearAndSetKey({ object, item, key, value }) {
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        object[i][key] = ""
      }
      item[key] = value
    }
    return
  }
  // Modifies in place

  // remove({ object, key }) {
  //     _.unset(object, key)
  // },

  // set({ object, key, value }) {
  //     _.set(object, key, value)
  // }

  // Checks for what to do, adds an extra parameter, should update noodl if going with this path

  // remove({ object, key, deep = false }) {
  //     if(deep) {
  //         var cloned = _.cloneDeep(object)
  //         _.unset(cloned, key)
  //         return cloned
  //     }
  //     else {
  //         _.unset(object, key)
  //     }
  // },

  // set({ object, key, value, deep = false }) {
  //     if(deep) {
  //         var cloned = _.cloneDeep(object)
  //         _.set(cloned, key, value)
  //         return cloned
  //     }
  //     else {
  //         _.set(object, key, value)
  //     }
  // }
}
