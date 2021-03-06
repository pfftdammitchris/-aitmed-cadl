import _ from 'lodash'

export default {
  inRange({ number, start, end }): boolean {
    if (number == start || number == end) {
      return true
    }
    return _.inRange(number, start, end)
  },
  multiply({ number, multiple }): number {
    if (number && multiple) {
      return number * multiple
    }
    return 0
  },
  OctToBin({ number }) {
    if (number) {
      return number.toString(2).toString()
    }
    return 0
  },
  getAuthority({ authSubtype, authList }) {
    let authDoc: any = {}
    if (authSubtype) {
      authSubtype.forEach((item: number) => {
        /***
         * convert subtype to Hex , get the authority type ,and the  authority level
         * authority level： '1 1 1' --> 'invite edit review'
         *  */
        let authHex: number = parseInt(item.toString(16)) // convert decimal to hexadecimal 
        let authType: number = parseInt((authHex / 10000).toString()) // get authority type from High Bit , and authority level low bit
        let authLevel: number = authHex % 10
        let authName: string = ""
        // convert authority level to object
        let authBinary = authLevel.toString(2).split('');
        let resArray = authBinary.map((item) => {
          return (item === '1') ? true : false
        })
        Object.keys(authList).forEach((key: any) => {
          if (authList[key] == authType) {
            authName = key
          }
        })
        authDoc[authName] = {
          invite: resArray[0],
          edit: resArray[1],
          review: resArray[2]
        }
      })
    }
    return authDoc
  },
  addition({ num, step }) {
    console.log("test addition", {
      num: num,
      step: step
    })
    num = parseInt(num)
    step = parseInt(step)
    return (num + step)
  },
  Subtraction({ num, step }) {
    num = parseInt(num)
    step = parseInt(step)
    return (num - step)
  },
  less({ num1, num2 }) {
    if (num1 < num2)
      return true
    else
      return false
  },
  inhx({ intHex, index, hex }): number {
    if (typeof (intHex) === "string")
      intHex = parseInt(intHex)
    if (((intHex >> (index - 1)) & 1) !== hex) {
      if (hex === 1) {
        intHex += Math.pow(2, index - 1)
      }
      else {
        intHex -= Math.pow(2, index - 1)
      }
      return intHex;
    } else {
      return intHex;
    }
  },
  hexAnd({ intOne, hexTwo }) {
    return intOne & hexTwo
  },
  hexOr({ intOne, hexTwo }) {
    return intOne | hexTwo
  },
  hx({ docGroup, localArr, binaryArr }) {
    if (localArr.length === binaryArr.length) {
      let equals: any;
      let pushArr: number[] = [];
      for (let index = 0; index < docGroup.length; index++) {
        equals = 0;
        for (let j = 0; j < localArr.length; j++) {
          if (((docGroup[index].type >> (localArr[j] - 1)) & 1) === binaryArr[j]) {
            equals++;
          } else {
            break;
          }
        }
        if (equals === localArr.length) {
          pushArr.push(docGroup[index]);
        }
      }
      return pushArr;
    }
    return false;
  },
  //  校验单个约束
  typeIsValid({ docType, localArr, binaryArr }) {
    if (localArr.length === binaryArr.length) {
      let equals: any;
      equals = 0;
      for (let j = 0; j < localArr.length; j++) {
        if (((docType >> (localArr[j] - 1)) & 1) === binaryArr[j]) {
          equals++;
        } else {
          break;
        }
      }
      return equals === binaryArr.length ? true : false
    }
    return false;
  },

  // 校验对象表单
  formValid({ docData }): boolean {
    for (const key in docData) {
      if (docData.hasOwnProperty(key)) {
        if (docData[key] === null || docData[key] === '') {
          return false;
        }
      }
    }
    return true;
  },

  /**
   * E8 -> E2
   * subtype = 196616 addition = 2
   * return 196610
   * @param subtype 
   * @param addition 
   * @returns 
   */
  transformSubtype({ subtype, addition }) {
    if (subtype && addition) {
      subtype = parseInt(subtype)
      let _subtype = subtype & 0xff
      let newSubtype = subtype - _subtype + addition
      return newSubtype
    }
    return 0
  }
}



