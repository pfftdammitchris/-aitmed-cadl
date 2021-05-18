import moment from 'moment'
import humanizeDuration from 'humanize-duration'
import { AnyArray } from 'immer/dist/internal'

export default {
  formatTimer(time: number) {
    return moment(time).format('HH:mm:ss')
  },
  formatUnixtime_en(unixTime: number) {
    return moment(unixTime * 1000).format('lll')
  },
  formatUnixtimeL_en(unixTime: number) {
    return moment(unixTime * 1000).format('l')
  },
  formatUnixtimeLT_en(unixTime: number) {
    return moment(unixTime * 1000).format('LT')
  },
  formatDurationInSecond(unixTime: number) {
    return humanizeDuration(unixTime * 1000)
  },
  concat(stringArr: string[]): string {
    if (Array.isArray(stringArr)) {
      return stringArr.join('')
    }
    return ''
  },
  equal({ string1, string2 }): boolean {
    return string1 === string2
  },
  getFirstChar(string: string): string | void {
    if (string) {
      return string.charAt(0).toUpperCase()
    }
    return
  },
  getLength(str: any): number {
    return str.toString().length
  },
  retainNumber({ value }): number {
    return parseInt(value)
  },

  /**
   *
   * @param countryCode country code of phone number
   * @param phoneNumber phone number
   * @returns Boolean
   */
  phoneVerification({ countryCode, phoneNumber }) {
    console.log('test phoneVerificatio', {
      countryCode: countryCode,
      phoneNumber: phoneNumber,
    })
    const phonesRegex = {
      'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
      'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
      'ar-KW': /^(\+?965)[569]\d{7}$/,
      'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
      'es-MX': /^(\+?52)?\d{6,12}$/,
    }
    if (countryCode && phoneNumber) {
      phoneNumber = phoneNumber.toString(10)
      countryCode = countryCode.trim()
      phoneNumber = phoneNumber.trim()
      let re
      if (countryCode == '+86') {
        phoneNumber = countryCode + '' + phoneNumber
        re = phoneNumber.match(phonesRegex['zh-CN'])
      } else if (countryCode == '+1') {
        if (phoneNumber.substring(0, 3) == '888') {
          return true
        }
        phoneNumber = countryCode + '' + phoneNumber
        re = phoneNumber.match(phonesRegex['en-US'])
      } else if (countryCode == '+965') {
        phoneNumber = countryCode + '' + phoneNumber
        re = phoneNumber.match(phonesRegex['ar-KW'])
      } else if (countryCode == '+52') {
        phoneNumber = countryCode + '' + phoneNumber
        re = phoneNumber.match(phonesRegex['es-MX'])
      }

      if (re != null) {
        return true
      }
    }
    return false
  },
  /**
   *
   * @param str  phoneNumber
   * @returns string
   */
  phoneNumberSplit({ phoneNumber, sign }): AnyArray {
    return phoneNumber.toString().split(sign)
  },

  //judge whether all string equal 
  judgeMultipleEqual(stringArr: string[]) {
    for (let i = 1; i < stringArr.length; i++)
      if (stringArr[i - 1] !== stringArr[i]) return false
    return true
  },

  //judge whether all the request textfield is filled in 
  judgeFillinAll(stringArr: string[]) {
    for (let i = 0; i < stringArr.length; i++)
      if (stringArr[i] == "") return true
    return false
  },
  judgeAllTrue({ str1, str2, str3 }) {
    return str1 && str2 && str3
  },

  judgesFillinAll(object) {
    let isEmpty = false
    Object.keys(object).forEach((x) => {
      if (object[x] !== null && object[x] !== "") {
        // console.log(Object.keys(object[x]))
        Object.keys(object[x]).forEach((y) => {
          if (object[x][y] == null || object[x][y] == "") {
            console.log(object[x][y])
            isEmpty = true
            // return false

          }
        })

      }
    })
    if (isEmpty) {
      return false
    }
    return true
  }
}
