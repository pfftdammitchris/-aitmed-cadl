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
  getObjKey({ objects }): string[] {
    return Object.keys(objects);
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
  setProperty({ obj, label, text, arr, valueArr, errorArr }) {
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
  }
}
