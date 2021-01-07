import _, { isArray } from 'lodash'

export default {
  add({ object, value }) {
    if (isArray(object)) {
      if (value) {
        var cloned = _.cloneDeep(value)
        object.push(cloned)
      }
      return
    }
    return
  },
  addByIndex({ object, value, index }) {
    if (isArray(object)) {
      if (value) {
        var cloned = _.cloneDeep(value)
        if (object[parseInt(index)] == null) {
          let item_1 = new Array();
          item_1.push(cloned)
          object[parseInt(index)] = item_1
        }
        else {
          let item_2 = object[parseInt(index)]
          item_2.push(cloned)
          object[parseInt(index)] = item_2
        }

      }
      return
    }
    return
  },
  clear({ object }) {
    if (isArray(object)) {
      object.length = 0
    }
    return
  },
  removeByKey({ object, key }) {
    //the format of the array must be [ man: man]  man： man
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].key === key) {
          // TO DO: how to handle objects with same key? should they all be deleted, or just delete first one?
          // Should duplicate object key made not allowed using add method?
          object.splice(i, 1)
          console.log(i);
          return
        } else {
          console.log('false', 'color: red');
        }
      }
    }
    return
  },
  removeByValue({ object, value }) {
    //the format of the array must be [ man: man]  man： man
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (object[i] == value) {
          // TO DO: how to handle objects with same key? should they all be deleted, or just delete first one?
          // Should duplicate object key made not allowed using add method?
          object.splice(i, 1)
          return
        }
      }
    }
    return
  },
  append({ newMessage, messages }) {
    if (isArray(messages)) {
      if (newMessage) {
        var cloned = _.cloneDeep(newMessage)
        messages.push(cloned)
      }
    }
    return
  },
  has({ object, value }) {
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (object[i] === value) {
          return true
        }
      }
    }
    return false
  },
  hasKey({ object, key }) {
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].key === key) {
          return true
        }
      }
    }
    return false
  },
  push({ newMessage, messages }) {
    if (isArray(messages)) {
      if (newMessage) {
        var cloned = _.cloneDeep(newMessage)
        messages.unshift(cloned)
        return
      }
    }
    return
  },
  // convert ["anemia", "anxiety", "arthritis"] to [{key: "anemia"},{key: "anxiety"},{key: "arthritis"}] for listObject
  covertToJsonArray({ array }) {
    let dataObject: Record<string, any> = []
    if (isArray(array)) {
      for (let i = 0; i < array.length; i++) {
        dataObject.push({ key: array[i] })
      }
      console.dir(dataObject)
      return dataObject
    }
    return `${array}is not an array`
  },
  // get the length of object
  getListLength({ object }) {
    if (isArray(object)) {
      return object.length
    }
    return 0
  },
  // copy one item of array1 to array2 by key
  copyByKey({ array1, array2, key }) {
    if (isArray(array1) && isArray(array2)) {
      for (let i = 0; i < array1.length; i++) {
        if (array1[i].key === key) {
          array2.push(array1[i])
          return array2
        }
      }
    }
    return array2
  }
}
