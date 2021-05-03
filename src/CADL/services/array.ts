import _, { isArray } from 'lodash'
import store from '../../common/store'
type connection = {
  name: string
  category: string
  userId: string
  phone: string
  favorite: boolean
  connectId: string
}
type index = {
  key: number
  fontColor: string
  backgroundColor: string
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
        if (object[parseInt(index)] == null || (Object.keys(object[parseInt(index)]).length === 0 && object[parseInt(index)].constructor === Object)) {
          let item_1 = new Array()
          item_1.push(cloned)
          object[parseInt(index)] = item_1
        } else {
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
    if (isArray(object)) {
      return _.orderBy(object, iterate, orders)
    }
    return 'object is not array'
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
          console.log(i)
          return
        } else {
          console.log('false', 'color: red')
        }
      }
    }
    return
  },
  removeByName({ object, key, name }) {
    //the format of the array must be [ man: man]  man： man
    if (isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (object[i][key] == name || object[i][key] == '') {
          // TO DO: how to handle objects with same key? should they all be deleted, or just delete first one?
          // Should duplicate object key made not allowed using add method?
          object.splice(i, 1)
          console.log(i)
          return
        } else {
          console.log('false', 'color: red')
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
      object.splice(index, 1)
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
          console.log(i)
        } else {
          console.log('false', 'color: red')
        }
      }

      for (let i = 0; i < object2[index].length; i++) {
        if (object2[index][i] === duration) {
          object2[index].splice(i, 1)
          console.log(i)
        } else {
          console.log('false', 'color: red')
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
  appendUnique({
    newMessage,
    messages,
    uniqueKey,
    currentBackgroundColor,
    backgroundColor,
    fontColor,
    currentFontColor,
  }) {
    // if (isArray(messages)) {
    if (newMessage && uniqueKey) {
      let flag = false
      messages.forEach((message) => {
        if (message[uniqueKey] == newMessage[uniqueKey]) {
          flag = true
        }
      })
      if (!flag) {
        var cloned = _.cloneDeep(newMessage)
        messages.push(cloned)
      }
      //reverse
      for (let j = 0; j < messages.length / 2; j++) {
        let tmp = messages[j]
        messages[j] = messages[messages.length - j - 1]
        messages[messages.length - j - 1] = tmp
      }
      //add color
      for (let i = 0; i < messages.length; i++) {
        if (i == 0) {
          messages[i]['backgroundColor'] = currentBackgroundColor
          messages[i]['fontColor'] = currentFontColor
        } else {
          messages[i]['backgroundColor'] = backgroundColor
          messages[i]['fontColor'] = fontColor
        }
      }
    }
    // }
    // return
  },
  addColor({
    messages,
    id,
    currentBackgroundColor,
    backgroundColor,
    fontColor,
    currentFontColor,
  }) {
    if (isArray(messages)) {
      for (let i = 0; i < messages.length; i++) {
        if (messages[i]['id'] == id) {
          messages[i]['backgroundColor'] = currentBackgroundColor
          messages[i]['fontColor'] = currentFontColor
        } else {
          messages[i]['backgroundColor'] = backgroundColor
          messages[i]['fontColor'] = fontColor
        }
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
  AddWeek({ object, duration, location, index, key }) {
    console.log(object, duration, index, key)
    if (typeof index == undefined) {
      console.log('index is undefined')
      return
    }
    if (typeof key == undefined) {
      console.log('key is undefined')
      return
    }
    if (typeof duration == undefined) {
      console.log('duration is undefined')
      return
    }
    // if (_.isArray(object)) {
    var arr = { duration: duration, location: location, index: index, key: key }
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
      return object.length.toString()
    }
    return '0'
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
    let favorite1: boolean
    if (typeof array1 == 'string' || typeof array2 == 'string') {
      if (isArray(array1)) {
        array1.forEach((arr) => {
          if (arr['subtype'] == 0) favorite1 = false
          else favorite1 = true
          arrayItem = {
            name: arr['name']['inviterName'],
            category: arr['name']['inviterCategory'],
            userId: arr['evid'],
            phone: arr['name']['inviterPhoneNumber'],
            favorite: favorite1,
            connectId: arr['id'],
          }
          array.push(arrayItem)
        })
        return array
      } else if (isArray(array2)) {
        array2.forEach((arr) => {
          if (arr['subtype'] == 0) favorite1 = false
          else favorite1 = true
          arrayItem = {
            name: arr['name']['inviteeName'],
            category: arr['name']['inviteeCategory'],
            userId: arr['bvid'],
            phone: arr['name']['inviteePhoneNumber'],
            favorite: favorite1,
            connectId: arr['id'],
          }
          array.push(arrayItem)
        })
        return array
      } else {
        return []
      }
    } else {
      array1.forEach((arr) => {
        if (arr['subtype'] == 0) favorite1 = false
        else favorite1 = true
        arrayItem = {
          name: arr['name']['inviterName'],
          category: arr['name']['inviterCategory'],
          userId: arr['evid'],
          phone: arr['name']['inviterPhoneNumber'],
          favorite: favorite1,
          connectId: arr['id'],
        }
        array.push(arrayItem)
      })
      array2.forEach((arr) => {
        if (arr['subtype'] == 0) favorite1 = false
        else favorite1 = true
        arrayItem = {
          name: arr['name']['inviteeName'],
          category: arr['name']['inviteeCategory'],
          userId: arr['bvid'],
          phone: arr['name']['inviteePhoneNumber'],
          favorite: favorite1,
          connectId: arr['id'],
        }
        array.push(arrayItem)
      })
      return array
    }
  },

  getFirstItem({ array }) {
    if (isArray(array)) {
      return array[0]
    }
  },
  /**
   * Combine two arrays and sort
   * sortby: Select the character to sort
   * orders: Designated as "desc" in descending order, designated as "asc" in ascending order
   */
  concatArray({ array1, array2, sortby, orders }) {
    if (isArray(array1) && isArray(array2)) {
      if (sortby) {
        let arr = array1.concat(array2)
        if (orders) {
          return _.orderBy(arr, sortby, orders)
        } else {
          return _.orderBy(arr, sortby, 'desc')
        }
      }
      return array1.concat(array2)
    }
    return
  },
  isExist({ array, phoneNumber }) {
    let flag = 0
    if (isArray(array)) {
      array.forEach((arr) => {
        if (phoneNumber === arr['phone']) {
          flag = 1
          return
        }
      })
      if (flag === 1) return true
      else return false
    }
    return false
  },
  /***
   *
   */
  async createBySubtype({ subtypelist, createModel }) {
    console.log('test createBySubtype', {
      subtypelist: subtypelist,
      createModel: createModel,
    })
    if (Array.isArray(subtypelist)) {
      subtypelist.forEach(async (element) => {
        createModel['subtype'] = element
        try {
          if (store.env === 'test') {
            console.log(
              '%cCreate Edge Request',
              'background: purple; color: white; display: block;',
              { ...createModel }
            )
          }

          const { data } = await store.level2SDK.edgeServices.createEdge({
            ...createModel,
          })
          if (store.env === 'test') {
            console.log(
              '%cCreate Edge Response',
              'background: purple; color: white; display: block;',
              data
            )
          }
        } catch (error) {
          throw error
        }
      })
    }

    // return "test"
  },

  WeekSchedule({ planObject }) {
    if (isArray(planObject)) {
      console.log('test WeekSchedule', planObject)
      let res: Record<string, any> = []
      let len = 0
      let weeks = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]
      for (let i = 0; i < 7; i++) {
        if (Object.keys(planObject[i]).length == 0) {
          res.push({
            info: 'not settings',
            weekDay: weeks[i],
          })
        } else {
          len = planObject[i].length
          let info = ''
          for (let j = 0; j < len; j++) {
            info = info + ' ' + planObject[i][j]
          }
          res.push({
            info: info,
            weekDay: weeks[i],
          })
        }
      }
      return res
    }
    return
  },
  concat({ array1, array2 }) {
    if (isArray(array1) && isArray(array2)) {
      return array1.concat(array2)
    }
    return
  },
  getIdByUserName({ array, userName }) {
    let id = ''
    if (isArray(array)) {
      array.forEach((arr) => {
        if (arr['name']['inviteeName'] === userName) {
          id = arr['bvid']
          return
        }
      })
      return id
    }
    return
  },

  /**
   *
   * @param {*} parentObject Remove elements from this object
   * @param {*} subObject Delete elements based on this object
   * @param {*} key Determine whether the key is duplicate
   */
  removeByArray({ parentObject, subObject, key }) {
    if (isArray(parentObject) && isArray(subObject)) {
      console.log('test removeByArray1', {
        parentObject: parentObject,
        subObject: subObject,
        key: key,
      })
      for (let i = 0; i < parentObject.length; i++) {
        for (let j = 0; j < subObject.length; j++) {
          if (parentObject[i][key] == subObject[j][key]) {
            console.log('test', subObject[j][key])
            parentObject.splice(i, 1)
          }
        }
      }
      console.log('test removeByArray2', parentObject)
      return parentObject
    }
    return
  },

  /**
   *
   * @param {*} object Modify the state of a field of this object
   * @param {*} key This is the field in the object, modify the state
   * @param {*} flag The state about to be modified true or false     true|false
   */
  toggleStatus({ object, key, flag }) {
    if (isArray(object)) {
      object.forEach((obj) => {
        if (obj.hasOwnProperty(key)) {
          obj[key] = flag
        }
      })
    }
  },
  getPage({ array, pageCount, currentPage }) {
    let pageList: any[] = []
    if (isArray(array) && array) {
      let pageSum = Math.ceil(array.length / pageCount)
      for (let i = 1; i <= pageSum; i++) {
        let currentPage = (i - 1) * pageCount
        let pageListItem: any[] = []
        for (let j = currentPage; j < currentPage + pageCount; j++) {
          if (array[j] === undefined) break
          pageListItem.push(array[j])
        }
        pageList.push(pageListItem)
      }
    }
    return pageList[currentPage - 1]
  },
  getPageIndex({ array, pageCount, currentPage, select }) {
    let indexList = Array.from(
      new Array(Math.ceil(array.length / pageCount) + 1).keys()
    ).slice(1)
    let index = _.chunk(indexList, pageCount)
    let indexGroup: index[] = []
    index[currentPage - 1].forEach((arr) => {
      let indexItem: index = {
        key: 0,
        fontColor: '0x000000',
        backgroundColor: '0xFFFFFF',
      }
      if (select === arr) {
        indexItem.fontColor = '0xFFFFFF'
        indexItem.backgroundColor = '#003d68'
      }
      indexItem.key = arr
      indexGroup.push(indexItem)
    })
    return indexGroup
  },
  elementUnique({ arr }) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j]) {
          arr.splice(j, 1)
          j--
        }
      }
    }
    return arr
  },
  addProvider({ object, provider }) {
    provider['name']['basicInfo'] = { medicalFacilityName: "current Provider" }
    provider['isSelected'] = true
    let cloned = _.cloneDeep(provider)
    object.push(cloned)
    return
  },
  /**
   * 
   * @param Object : Data to be processed
   * @param timeLimit : Display the amount of data
   * @param timeSpan : Process data based on month, week, and day
   * @param increaseColor : Color when the rate of increase is positive
   * @param decreaseColor : Color when the rate of increase is negative
   * @returns 
  */
  handleData({ Object, timeLimit = 10, timeSpan = "day", increaseColor = "0x3DD598", decreaseColor = "0xF0142F" }) {
    if (isArray(Object)) {
      console.log("test handleData", Object)
      let time = 24 * 60 * 60 * 1000
      if (timeSpan == 'day') {
        time = 1 * time
      } else if (timeSpan == 'week') {
        time = 7 * time
      } else if (timeSpan == 'month') {
        time = 30 * time
      }
      let data_x: Record<string, any> = []
      let data_y: Record<string, any> = []
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
      let date = new Date()
      // hard code
      for (let i = 0; i < timeLimit; i++) {
        let ctime, etime, name
        if (timeSpan == 'day') {
          ctime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
          etime = ctime + 24 * 60 * 60 * 1000
          name = new Date(ctime).getFullYear() + "-" + new Date(ctime).getMonth() + "-" + new Date(ctime).getDate()
        } else if (timeSpan == 'week') {
          let d = new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000)
          ctime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
          etime = ctime + 7 * 24 * 60 * 60 * 1000
          name = new Date(ctime).getFullYear() + "-" + new Date(ctime).getMonth() + "-" + date.getDate()
        } else if (timeSpan == 'month') {
          let d = new Date(date.getTime() - (date.getDate() - 1) * 24 * 60 * 60 * 1000)
          ctime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
          let d2 = new Date(d.getFullYear(), d.getMonth(), 0);
          let currentdays = d2.getDate();
          etime = ctime + currentdays * 24 * 60 * 60 * 1000
          name = new Date(ctime).getFullYear() + "-" + months[new Date(ctime).getMonth()]
        }
        let count = 0
        Object.forEach(obj => {
          if (obj.ctime * 1000 > ctime && obj.ctime * 1000 < etime) {
            count = count + 1
          }
        })
        data_x.push(name)
        data_y.push(count)
        date = new Date(date.getTime() - time)
      }
      let currentNum = data_y[0]
      let currentRadio
      if (data_y[1] != 0) {
        currentRadio = ((data_y[0] / data_y[1]) - 1) * 100
      } else {
        currentRadio = 0
      }
      let color, radioString
      if (currentRadio >= 0) {
        radioString = currentRadio.toFixed(2) + "%" + " ↑"
        color = increaseColor
      } else {
        radioString = (-currentRadio).toFixed(2) + "%" + " ↓"
        color = decreaseColor
      }
      console.log({
        currentNum: currentNum,
        currentRadio: currentRadio.toFixed(2),
        radioString: radioString,
        color: color
      })
      // Returned data format
      return {
        currentNum: currentNum,
        currentRadio: currentRadio.toFixed(2),
        radioString: radioString,
        color: color,
        data_x: data_x,
        data_y: data_y
      }
    }
    return

  }
}
