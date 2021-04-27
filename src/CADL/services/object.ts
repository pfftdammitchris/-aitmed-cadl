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
    } else if (array) {
      if (match.length === 1) {
        result.push(array[match[0]])
      } else if (match.length === 2) {
        result.push(array[match[0]][match[1]])
      }
    }
    return result
  },
  // 将数组中的指定项提取出来 ，已方便table打印
  // extractArray({obj,arr}){
  //   let resArray:any[] = []
  //   arr.forEach((element:string) => {
  //     if(element.indexOf('.') === -1){
  //       // 说明没有点，直接返回
  //       resArray[element] = obj[element]
  //     }else{
  //       let subtitle:any[] = element.split('.')
  //       // 根据数据长度进行迭代
  //       resArray[subtitle[subtitle.length-1]] = subtitle[JSON.parse(element)]
  //     }
  //   });
  // }
  extractArray({ obj, arr }) {
    console.dir(obj)
    if (isArray(obj)) {
      let res = new Array()
      obj.forEach((objItem) => {
        console.dir(objItem)
        let resArray: any[] = []
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
            resArray[subtitle[subtitle.length - 1]] = _data.toString()
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
      Schedule: false
    }
    Object.keys(object).forEach((key) => {
      Object.keys(object[key]).forEach((key1) => {
        if ((key === "MFI" || key === "TDT") && (object[key][key1]) === true) {
          auth.Settings = true
          return
        }
        if ((key === "staff" || key === "patient" || key === "provider") && (object[key][key1]) === true) {
          auth.UserManagement = true
          return
        }
        if ((key === "scheduleInfo" || key === "PAT") && (object[key][key1]) === true) {
          auth.Schedule = true
          return
        }
      })
      // console.log(object[key]);
      // if (object[key] === true) {
      //   flag = 1
      //   return
      // }
    })
    // if (flag === 1) return true
    // return false
    return auth
  },
}
