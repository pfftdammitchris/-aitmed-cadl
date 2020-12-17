import _, { isArray } from 'lodash'
import object from './object'

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
        if (object[i][key]) {
          // TO DO: how to handle objects with same key? should they all be deleted, or just delete first one?
          // Should duplicate object key made not allowed using add method?
          object.splice(i, 1)
          return
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
    // the format of array must be [ key: man ]
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (object[i] === value) {
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
  LoopToGenerate({ span }) {
    let fotmat = (n: number) => {
      if (n < 13 * 60) {
        let h = Math.floor(n / 60)
        let m = n % 60
        return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}`
      } else {
        let h = Math.floor((n - 12 * 60) / 60)
        let m = (n - 12 * 60) % 60
        return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}pm`
      }
    }
    let i: number = 0
    let arr: any[] = []
    while (i <= 24 * 60) {
      arr.push(fotmat(i))
      i += parseInt(span)
    }
    console.log(arr)
    return arr
  },
  // addIndex({ object, value }) {
  //   if (isArray(object)) {
  //     if (value) {
  //       //  get the length of array , and generate index
  //       var arrayLenght = object.keys.length;
  //       console.log(arrayLenght);
  //       let index = `I${arrayLenght}`;
  //       var cloned = _.cloneDeep(value)
  //       object[index] = cloned;
  //       // object.push(cloned)
  //     }
  //     return
  //   }
  //   return
  // },
  // get the length of object
  getListLength({ object }) {
    if (isArray(object)) {
      return object.length
    }
    return 0
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
}
