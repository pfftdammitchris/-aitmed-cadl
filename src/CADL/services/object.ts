import _, { isArray, isObject } from 'lodash'
type keyValue = {
  key: string
  value: string
}
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
  setObjectKey({ objectArr, key, value }: { objectArr: {}[], key: string, value: any }): {}[] {
    Array.from(objectArr).forEach((object) => {
      if (_.isObject(object)) {
        _.set(object, key, value)
      }
    })
    return objectArr;
  },

  get({ object, key }) {
    if (isObject(object)) {
      if (object[key] == "")
        object[key] = " "
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
  objectHasValue({ objArr, valPath }: { objArr: { [key: string]: {} }[], valPath: string }): boolean {
    let objBool = false;
    Array.from(objArr).forEach((obj) => {
      if (obj[valPath] !== false) {
        objBool = true;
        return objBool;
      }
      return objBool;
    })

    return objBool;
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
  // 从多个数组中提取某一项
  extract({ array, field }) {
    let match: string[] = field.split('.')
    let result: string[] = []
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
      else if (match.length === 3) {
        array.forEach((arr) => {
          result.push(arr[match[0]][match[1]][match[2]])
        })
      }
      return result
    }
    return
  },

  extractArray({ obj, arr }) {
    if (isArray(obj)) {
      let res = new Array()
      obj.forEach((objItem) => {
        console.dir(objItem)
        let resArray: any = {}
        arr.forEach((element: any) => {
          let _data = objItem
          if (element.indexOf('.') === -1) {
            resArray[element] = _data.hasOwnProperty(element)
              ? _data[element]
              : ''
          } else {
            let subtitle: any[] = element.split('.')
            subtitle.forEach((item) => {
              _data = _data.hasOwnProperty(item) ? _data[item] : ''
            })
            if (_data) {
              resArray[subtitle[subtitle.length - 1]] = _data.toString()
            }
          }
        })
        res.push(resArray)
      })

      return res
    }
    return ''
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
  findTrue({ object }) {
    let auth = {
      Settings: false,
      UserManagement: false,
      Schedule: false,
    }
    Object.keys(object).forEach((key) => {
      Object.keys(object[key]).forEach((key1) => {
        if ((key === 'MFI' || key === 'TDT') && object[key][key1] === true) {
          auth.Settings = true
          return
        }
        if (
          (key === 'staff' || key === 'patient' || key === 'provider') &&
          object[key][key1] === true
        ) {
          auth.UserManagement = true
          return
        }
        if (
          (key === 'scheduleInfo' || key === 'PAT') &&
          object[key][key1] === true
        ) {
          auth.Schedule = true
          return
        }
      })
    })
    return auth
  },
  setAuthAllTrue({ object }) {
    Object.keys(object).forEach((key) => {
      Object.keys(object[key]).forEach((key1) => {
        object[key][key1] = true
      })
    })
    return object
  },
  isEmpty({ object }) {
    if (object === '') return true
    return false
  },
  setByKey({ object, key, value }) {
    Object.keys(object).forEach((item) => {
      if (key === item) object[item] = value
    })
    return
  },
  getObjValueAndKey({ objects, objStr }): Object {
    let arr: Array<any> = Object.keys(objects);
    let objNew: { [k: string]: any } = {};
    for (let index = 0; index < arr.length; index++) {
      if (objStr[index] in objects) {
        objNew[objStr[index]] = objects[objStr[index]];
      }
    }
    return objNew;
  },
  getObjKey({ objects }): string[] | null {
    if (objects) {
      return Object.keys(objects)
    }
    return []
  },
  getObjWithKV({ object }) {
    var arr: keyValue[] = [];
    let o: keyValue
    for (let i in object) {
      o = {
        key: i,
        value: object[i]
      }
      arr.push(o);
    }
    return arr
  },
  setProperty({ obj, label, text, arr, valueArr, errorArr }: { obj: { [key: string]: any }[], label: string, text: string, arr: string[], valueArr: string[], errorArr: string[] }) {
    for (let index = 0; index < obj.length; index++) {
      for (let i in arr) {
        if (obj[index][label] === text) {
          obj[index][arr[i]] = valueArr[i];
        } else {
          obj[index][arr[i]] = errorArr[i];
        }
      }
    }
    return obj
  },
  clearAll({ object }) {
    Object.keys(object).forEach((item) => {
      if (isArray(object[item]))
        object[item] = []
      else
        object[item] = " "
    })
  },
  extractingFeatureStrings({ objArrs, pathObj, bool }: { objArrs: {}[], pathObj: string[], bool?: boolean }): string | { [key: string]: string[] }[] {
    let objArr: any[] = [], objArrData: any[] = [], itemName: string[] = [], objNameArr: {}[] = [], hj: { [key: string]: {}[] } = {}, newArr: string[] = [];
    if (objArrs.length === 0) {
      return [];
    }
    objArrs.forEach((o: {}) => {
      pathObj.forEach((item) => {
        itemName.push(item.split(".")[item.split(".").length - 1]);
        objArrData.push(_.get(o, item, "default"));
      })
      objArr.push(_.get(o, pathObj[0], "default"));
      objNameArr.push(_.zipObject(itemName, objArrData));
    })

    if (objArr.length === 0) {
      return "The array is empty";
    }
    if (bool) {
      objArr.map((value, index, arr) => { arr[index] = value[0].toLocaleUpperCase() + value.slice(1); objArr = arr });
    }
    objArr.sort();
    for (let arr of objArr) {
      if (!(arr in newArr) && /[a-zA-Z]+/.test(arr.charAt(0))) {
        newArr.push(arr.charAt(0));
      }
    }
    let newArrLen: number = newArr.length;
    let objValues: any[] = []
    for (let newArrIn = 0; newArrIn < newArrLen; newArrIn++) {
      hj[newArr[newArrIn]] = new Array();
      objNameArr.forEach((item) => {
        if ((item[itemName[0]].charAt(0) as string).toLocaleUpperCase() === newArr[newArrIn] && (/[a-zA-Z]+/.test(item[itemName[0]].charAt(0)))) {

          hj[newArr[newArrIn]].push(item)
        }
      })
    }
    objNameArr.forEach((item) => {
      if (!(/[a-zA-Z]+/.test(item[itemName[0]].charAt(0)))) {
        objValues.push(item);
      }
    })
    objArr = [];
    for (let [key, value] of Object.entries(hj)) {
      objArr.push(_.zipObject(["index", "data"], [key, value]));
    }
    if (objValues.length !== 0) {
      objArr.unshift(_.zipObject(["index", "data"], ["#", objValues]));

    }
    return objArr;
  }
}
