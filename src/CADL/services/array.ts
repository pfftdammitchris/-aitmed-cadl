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
  clear({ object }) {
    if (isArray(object)) {
      object.length = 0
    }
    return
  },
  removeByKey({ object, key }) {   //the format of the array must be [ man: man]
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
  append({ newMessage, messages }) {
    if (isArray(messages)) {
      if (newMessage) {
        var cloned = _.cloneDeep(newMessage)
        messages.push(cloned)
      }
    }
    return
  },
  has({ object, key }) {  // the format of array must be [ key: man ]
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
  LoopToGenerate(span: number) {
    let fotmat = (n) => {
      if (n < 13 * 60) {
        let h = Math.floor(n / 60)
        let m = n % 60
        return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}`
      } else {
        let h = Math.floor((n - 12 * 60) / 60)
        let m = (n - 12 * 60) % 60
        return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}(pm)`
      }
    }
    let i: number = 0
    let arr: string[] = []
    while (i <= 24 * 60) {
      arr.push(fotmat(i));
      i += span;
    }
    return arr
  }
}
