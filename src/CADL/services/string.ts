import moment from 'moment'
import humanizeDuration from 'humanize-duration'
import { AnyArray } from 'immer/dist/internal'
import store from '../../common/store'
function Rad(d) {
  //The latitude and longitude is converted into a trigonometric function in the form of a mid-degree minute table.
  return d * Math.PI / 180.0;
}
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
  split16DkeytoArray(key: string): string[] {
    if (key.length !== 16) return []
    let keyArray: string[] = []
    return keyArray.concat(key.substring(0, 4), key.substring(4, 8), key.substring(8, 12), key.substring(12))
  },
  split16Dkey(key: string): string {
    if (key.length !== 16) return ""
    return key.substring(0, 4) + '-' + key.substring(4, 8) + '-' + key.substring(8, 12) + '-' + key.substring(12)
  },
  equal({ string1, string2 }): boolean {
    return string1 === string2
  },
  getFirstChar(value: string): string | void {
    if (value) {
      return value.charAt(0).toUpperCase()
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
      if (stringArr[i] == "" || stringArr[i] == "-- --") return true
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
  },
  strLenx({ obj }): string {
    let newStr: string = ''
    let len: number = 0;
    for (let val of (Object as any).values(obj)) {
      if (val !== '') {
        len++;
        if (len === 2 || len === 4) {
          newStr += val + ' ';
          continue;
        }
        newStr += val + ',';
      }
    }
    if (newStr === '') {
      return '';
    }
    return newStr.substr(0, newStr.length - 1);
  },
  /**
   * Calculate the distance based on the longitude and latitude obtained by this software 
   * and the incoming longitude and latitude
   * @param point => longitude and latitude parameters
   * @returns 
   */
  distanceByPosition(point) {
    if (point != null || typeof point != 'undefined') {
      let currentLatitude = store.currentLatitude
      let currentLongitude = store.currentLongitude
      if (currentLatitude == null || currentLongitude == null || typeof currentLongitude == 'undefined' || typeof currentLatitude == 'undefined') {
        return
      }
      let radLat1 = Rad(currentLatitude)
      let radLat2 = Rad(point[0])
      let a = radLat1 - radLat2
      let b = Rad(currentLongitude) - Rad(point[1])
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
      s = s * 6378.137 // EARTH_RADIUS
      s = Math.round(s * 10000) / 10000 //输出为公里
      return s.toFixed(2) + " km"
    }
    return

  },
  /**
   * Parse the address data obtained by mapbox
   * @param object => mapbox daddress data
   * @returns 
   */
  getAddress({ object }) {
    let res = {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      location: "",
      geoCode: []
    }
    if (object) {
      let context = object['context']
      context.forEach(element => {
        let prefix = element.id.split('.')[0]
        console.log(prefix)
        switch (prefix) {
          case 'postcode':
            res.zipCode = element.text
            break
          case 'place':
            res.city = element.text
            break
          case 'region':
            res.state = element.text
            break
        }
      })
      res.geoCode = object.center
      res.location = object.place_name
      if (object?.properties?.address) {
        res.address = object.text + ', ' + object.properties.address
      } else {
        res.address = object.text
      }

      if (object.place_type[0] == 'place') {
        res.city = object.text
        res.address = ''
      }

      if (object.place_type[0] == 'region') {
        res.state = object.text
        res.address = ''
      }


      return res
    }
    return res
  }
}
