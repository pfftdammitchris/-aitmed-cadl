import _, { isArray } from 'lodash'
class connection {
  name: string
  category: string
  userId: string
}
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
  /**
   * object (Array|Object): The collection used for iteration.
   * iterate: Sorting iterative function.
   * orders: Designated as "desc" in descending order, designated as "asc" in ascending order
   */
  SortBy({ object, iterate, orders }) {
    console.log("test sortBy: %s", iterate);
    if (isArray(object)) {
      return _.orderBy(object, iterate, orders)
    }
    return "object is not array"
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
  removeByName({ object, key, name }) {
    //the format of the array must be [ man: man]  man： man
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (object[i][key] == name || object[i][key] == "") {
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
  removeById({ object, id }) {
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].id == id) {
          // TO DO: how to handle objects with same key? should they all be deleted, or just delete first one?
          // Should duplicate object key made not allowed using add method?
          object.splice(i, 1)
          return
        }
      }
    }
    return
  },
  /**
   * object (Array|Object): The collection used for iteration.
   * index: one index of array
   */
  removeByIndex({ object, index }) {
    if (isArray(object)) {
      object.splice(index, 1);
      return
    }
    return
  },
  /***
   * object1 : this object format like    0: {duration: "03:00AM-07:00AM", index: 0, key: "Su"}
   * object2 : this object format like    0: ["08:00AM-01:00PM"] 
   * index : 
   * duration ：
   */

  removeWeekByIndexs({ object1, object2, index, duration }) {
    //Functions used to make specific pages
    if (isArray(object1) && isArray(object2)) {
      for (let i = 0; i < object1.length; i++) {
        if (object1[i].index === index && object1[i].duration === duration) {
          object1.splice(i, 1)
          console.log(i);
        } else {
          console.log('false', 'color: red');
        }
      }

      for (let i = 0; i < object2[index].length; i++) {
        if (object2[index][i] === duration) {
          object2[index].splice(i, 1)
          console.log(i);
        } else {
          console.log('false', 'color: red');
        }
      }
      return
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
  AddWeek({ object, duration, index, key }) {
    console.log(object, duration, index, key);
    if (typeof (index) == undefined) {
      console.log("index is undefined");
      return;
    }
    if (typeof (key) == undefined) {
      console.log("key is undefined");
      return;
    }
    if (typeof (duration) == undefined) {
      console.log("duration is undefined");
      return;
    }
    // if (_.isArray(object)) {
    var arr = { "duration": duration, "index": index, "key": key }
    console.log(object.length)
    object[object.length] = arr
    return
    // }
    // return
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
    return "0"
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
  },

  changeColorByKey({ array, key, value }) {
    if (isArray(array)) {
      if (key) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].key === key) {
            array[i].color = value
            return
          }
        }
      }
      return
    }
    return
  },
  convertToList({ array, key }) {
    let array1: string[] = []
    if (isArray(array)) {
      if (key) {
        for (let i = 0; i < array.length; i++) {
          array1.push(array[i][key])
        }
        return array1
      }
      return
    }
    return
  },

  getByKey({ array, key1, value, key2 }) {
    if (isArray(array)) {
      for (let i = 0; i < array.length; i++) {
        if (array[i][key1] === value) {
          return array[i][key2]
        }
      }
      return
    }
  },

  getConnection({ array1, array2 }) {
    let arrayItem: connection
    let array: connection[] = []
    if (isArray(array1) && isArray(array2)) {
      array1.forEach(arr => {
        arrayItem = {
          name: arr['name']['inviterName'],
          category: arr['name']['inviterCategory'],
          userId: arr['evid']
        }
        array.push(arrayItem)
      })
      array2.forEach(arr => {
        arrayItem = {
          name: arr['name']['inviteeName'],
          category: arr['name']['inviteeCategory'],
          userId: arr['bvid']
        }
        array.push(arrayItem)
      })
      return array
    }
    return []
  },

  getFirstItem({ array }) {
    if (isArray(array)) {
      return array[0]
    }
  }

}
