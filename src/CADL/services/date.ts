import _, { isArray, isObject } from 'lodash'
import moment from 'moment'
interface splitTime {
  showTime: string
  stime: number
  etime: number
  refid: string
  bvid: string
}

export default {
  currentDateTime() {
    return Date.now()
  },
  getDate() {
    return new Date().getDate()
  },
  getMonth() {
    return new Date().getMonth() + 1
  },
  getYear() {
    return new Date().getFullYear()
  },
  getTimezoneOffset() {
    return new Date().getTimezoneOffset().toString()
  },
  getNowLocalTime() {
    return new Date(new Date().toLocaleDateString()).getTime();
  },
  getNowLocalUnixTime() {
    return Math.ceil(new Date().getTime() / 1000);
  },

  /**
   * return time stamp (s)  date-->to ---> timestamp
   */
  getTime() {
    let date = new Date().toString()
    let stamp = Date.parse(date) / 1000
    return stamp
  },
  /**
   * timestamp--->date
   */
  stampToDate(timeStamp) {
    return new Date(parseInt(timeStamp) * 1000)
  },
  stampToTime(timeStamp) {
    if (timeStamp) {
      let time = new Date(parseInt(timeStamp) * 1000).toString()
      let timeArray = time.split(' ')[4].split(':')
      return parseInt(timeArray[0]) < 12
        ? `${timeArray[0]}:${timeArray[1]}AM`
        : `${parseInt(timeArray[0]) - 12}:${timeArray[1]}PM`
    }
    return 'timeStamp is null'
  },
  /**
   * timestamp--> year,month,day
   * @param timeStamp 
   * @returns 
   */
  stampToDay({ timeStamp }) {
    if (!timeStamp) return
    timeStamp = parseInt(timeStamp)
    let date = new Date(timeStamp * 1000)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  },
  /**
   * Returns the time stamp interval of a day  (s)
   * @param {string} (date) -->  MM-DD-YY
   * @return
   */
  getTimeStampOfDate({ date }) {
    //   convert time to YYYY-MM-DD
    let timeStamp = {
      start: 0,
      end: 0,
    }
    let dateArray = date.split('-')
    dateArray[1] = parseInt(dateArray[1]) - 1
    let dateObject = new Date(dateArray[0], dateArray[1], dateArray[2])
    // dateObject.setMonth(dateArray[1])
    // dateObject.setDate(dateArray[2])
    // dateObject.setFullYear(dateArray[0])
    // dateObject.setHours(0)
    // dateObject.setMinutes(0)
    // dateObject.setSeconds(0)
    timeStamp.start = Date.parse(dateObject.toString()) / 1000
    timeStamp.end = timeStamp.start + 86400
    return timeStamp
  },
  LoopToGenerate({ span }) {
    let fotmat = (n: number) => {
      if (n < 13 * 60) {
        let h = Math.floor(n / 60)
        let m = n % 60
        if (h == 12) {
          return `${`${h}`.slice(-2)}:${`0${m}`.slice(-2)}PM`
        }
        return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}AM`
      } else {
        let h = Math.floor((n - 12 * 60) / 60)
        let m = (n - 12 * 60) % 60
        if (h == 12) {
          return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}AM`
        }
        return `${`${h}`.slice(-2)}:${`0${m}`.slice(-2)}PM`
      }
    }
    let i: number = 0
    let arr: any[] = []
    while (i <= 24 * 60) {
      arr.push(fotmat(i))
      i += parseInt(span)
    }
    arr[arr.length - 1] = "11:59PM"
    // console.log(arr)
    return arr
  },
  calendarArray({ year, month, today }) {
    year = parseInt(year)
    month = parseInt(month)
    let dataObject: Record<string, any> = []
    let isLeapYear =
      (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? true : false
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    days[1] = isLeapYear ? 29 : 28
    let dataArray = new Array(42).fill(0)
    // What day is the first day of the month
    let day = new Date(`${year}-${month}-1`).getDay()
    for (let i = day, j = 1; i < day + days[month - 1]; i++, j++) {
      dataArray[i] = j
    }
    // let frontMonth = month == 1 ? days[11] : days[month - 2]
    //  fill other day
    for (let i = day - 1, j = 0; i >= 0; i--, j++) {
      if (day == 0) break
      else {
        // dataArray[i] = frontMonth - j
        dataArray[i] = ''
      }
    }
    for (let i = day + days[month - 1], j = 1; i < 42; i++, j++) {
      // dataArray[i] = j
      dataArray[i] = ''
    }
    //  convert dataarray to jsononject
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] == today) {
        dataObject.push({
          key: dataArray[i],
          color: '#003d68',
          backgroundColor: '#d7e2ea',
        })
      } else {
        dataObject.push({
          key: dataArray[i],
          color: '#517086',
          backgroundColor: '#ffffff',
        })
      }
    }
    // let dataJson = _.chunk(dataArray, 7);
    return dataObject
  },
  splitByTimeSlot({ object2, timeSlot, year, month, day }) {
    let date = new Date(year, month - 1, day)
    // date.setFullYear(year)
    // date.setMonth(month - 1)
    // date.setDate(day)
    // date.setHours(0)
    // date.setMinutes(0)
    // date.setSeconds(0)
    // date.setUTCMilliseconds(0)
    let anotherDay = date.getTime() / 1000 + 86400
    let splitTimeItem: splitTime
    let array: any = {
      morning: [],
      afternoon: []
    }
    //@ts-ignore
    let nowtime = new Date().valueOf() / 1000
    if (isArray(object2)) {
      object2.forEach((obj) => {
        if (isObject(obj)) {
          if (
            obj['stime'] < date.getTime() / 1000 &&
            obj['etime'] > date.getTime() / 1000
          )
            obj['stime'] = date.getTime() / 1000
          if (obj['stime'] < anotherDay && obj['etime'] > anotherDay)
            obj['etime'] = anotherDay
          if (timeSlot) {
            let i = 0
            do {
              splitTimeItem = {
                stime: obj['stime'] + i * timeSlot * 60,
                etime: obj['stime'] + (i + 1) * timeSlot * 60,
                showTime: moment(
                  (obj['stime'] + i * timeSlot * 60) * 1000
                ).format('LT'),
                refid: obj['id'],
                bvid: obj['bvid'],
              }
              console.log(date.getTime())
              if (obj['etime'] - splitTimeItem['stime'] < timeSlot * 60) {
                continue
              } else {
                // console.log(splitTimeItem['stime'])
                // console.log(nowtime)
                // if (splitTimeItem['stime'] >= nowtime) {
                if (splitTimeItem['showTime'].indexOf('AM') != -1) {
                  array.morning.push(splitTimeItem)
                } else {
                  array.afternoon.push(splitTimeItem)
                }
                // }
                i += 1
              }
            } while (
              splitTimeItem['etime'] <= obj['etime'] &&
              splitTimeItem['etime'] <= anotherDay
            )
          }
        }
      })
      return array
    }
    return array
  },
  splitTime({ object2, timeSlot, year, month, day, isSplitCurrent = false }) {
    console.log('test splitTime', {
      object2, timeSlot, year, month, day, isSplitCurrent
    })
    let currentDate
    let currentTime
    if (isSplitCurrent) {
      currentDate = new Date()
      currentTime = currentDate.getTime() / 1000
    }

    let date = new Date(year, month - 1, day)
    let anotherDay = date.getTime() / 1000 + 86400
    let splitTimeItem: splitTime
    let array: any = []
    if (isArray(object2)) {
      object2.forEach((obj) => {
        if (isObject(obj)) {
          if (
            obj['stime'] < date.getTime() / 1000 &&
            obj['etime'] > date.getTime() / 1000
          )
            obj['stime'] = date.getTime() / 1000
          if (obj['stime'] < anotherDay && obj['etime'] > anotherDay)
            obj['etime'] = anotherDay
          if (timeSlot) {
            let i = 0
            do {
              splitTimeItem = {
                stime: obj['stime'] + i * timeSlot * 60,
                etime: obj['stime'] + (i + 1) * timeSlot * 60,
                showTime: moment(
                  (obj['stime'] + i * timeSlot * 60) * 1000
                ).format('LT'),
                refid: obj['id'],
                bvid: obj['bvid'],
              }
              if (obj['etime'] - splitTimeItem['stime'] < timeSlot * 60) {
                continue
              } else {

                if (splitTimeItem['showTime'].indexOf('AM') != -1) {
                  if (isSplitCurrent) {
                    if (splitTimeItem['stime'] > currentTime)
                      array.push(splitTimeItem)
                  } else {
                    array.push(splitTimeItem)
                  }
                } else {
                  if (isSplitCurrent) {
                    if (splitTimeItem['stime'] > currentTime)
                      array.push(splitTimeItem)
                  } else {
                    array.push(splitTimeItem)
                  }
                }
                i += 1
              }
            } while (
              splitTimeItem['etime'] <= obj['etime'] &&
              splitTimeItem['etime'] <= anotherDay
            )
          }
        }
      })
      return array
    }
    return array
  },
  ShowTimeSpan(object) {
    if (isObject(object)) {
      if (object.hasOwnProperty('stime') && object.hasOwnProperty('etime')) {
        let start_date = moment(object['stime'] * 1000).format('LT')
        let end_date = moment(object['etime'] * 1000).format('LT')
        let duration_date = start_date + ' - ' + end_date
        return duration_date
      }
      return
    }
    return
  },
  ShowTimeDate(object) {
    if (isObject(object)) {
      if (object.hasOwnProperty('stime') && object.hasOwnProperty('etime')) {
        let date = new Date(object['stime'] * 1000)
        let y = date.getFullYear()
        let m =
          date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1)
        let d = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
        let duration_date =
          m + '-' + d + '-' + y
        return duration_date
      }
      return
    }
    return
  },
  ShowTimeDateUS(object) {
    if (isObject(object)) {
      if (object.hasOwnProperty('stime') && object.hasOwnProperty('etime')) {
        let date = new Date(object['stime'] * 1000)
        let y = date.getFullYear()
        let m =
          date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1)
        let d = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
        let duration_date =
          m + '-' + d + '-' + y
        return duration_date
      }
      return
    }
    return
  },
  ShowTimeSpanFormat_us(object) {
    if (isObject(object)) {
      if (object.hasOwnProperty('stime') && object.hasOwnProperty('etime')) {
        let date = new Date(object['stime'] * 1000)
        let y = date.getFullYear()
        let m =
          date.getMonth() + 1 >= 10
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1)
        let d = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
        let start_date = moment(object['stime'] * 1000).format('LT')
        let end_date = moment(object['etime'] * 1000).format('LT')
        let duration_date =
          m + '-' + d + '-' + y + ' ' + start_date + '-' + end_date
        return duration_date
      }
      return
    }
    return
  },
  // minicalendarArray({ year, month, today, middleDay, span, color, backgroundColor, todayColor, todayBackgroundColor }) {
  //   console.log("test minicalendarArray", {
  minicalendarArray({
    year,
    month,
    today,
    middleDay,
    span,
    color,
    backgroundColor,
    todayColor,
    todayBackgroundColor,
  }) {
    console.log('test minicalendarArray', {
      year: year,
      month: month,
      today: today,
      middleDay: middleDay,
      span: span,
    })
    middleDay = parseInt(middleDay)
    span = parseInt(span)
    year = parseInt(year)
    month = parseInt(month)
    month = month
    let weeks = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
    let dataObject: Record<string, any> = []
    let isLeapYear =
      (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? true : false
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    days[1] = isLeapYear ? 29 : 28
    let index = Math.ceil(-(span / 2))
    for (let i = 1; i <= span; i++) {
      let d = middleDay + index
      if (today == d) {
        let date = new Date(year, month, d)
        let day = weeks[date.getDay()]
        dataObject.push({
          key: today,
          week: day,
          color: todayColor,
          backgroundColor: todayBackgroundColor,
        })
      } else if (d < 1) {
        d = d + days[month - 1]
        let date = new Date(year, month, d)
        let day = weeks[date.getDay()]
        dataObject.push({
          key: d,
          week: day,
          color: color,
          backgroundColor: backgroundColor,
        })
      } else if (d > days[month - 1]) {
        d = d - days[month - 1]
        let date = new Date(year, month, d)
        let day = weeks[date.getDay()]
        dataObject.push({
          key: d,
          week: day,
          color: color,
          backgroundColor: backgroundColor,
        })
      } else {
        let date = new Date(year, month, d)
        let day = weeks[date.getDay()]
        dataObject.push({
          key: d,
          week: day,
          color: color,
          backgroundColor: backgroundColor,
        })
      }
      index = index + 1
    }
    return dataObject
  },
  loopMonth({ month, step }) {
    month = parseInt(month)
    step = parseInt(step)
    if (month && step) {
      let newmonth = month + step
      if (newmonth > 12) {
        newmonth = newmonth - 12
      } else if (newmonth < 1) {
        newmonth = newmonth + 12
      }
      return newmonth
    }
    return
  },

  /**
   *
   * @param year input year
   * @param month input month
   * @param today input today,this can generate today font color and backgroundcolor
   * @param markDay Generate week time according this param
   * @param color   font color of common date
   * @param backgroundColor  background color of common date
   * @param todayColor  font color of today
   * @param todayBackgroundColor background color of today
   * @returns
   * return data formate:
   * [{year: 2021,month: 3,day: 28,weekDay: 'Su',color: '#000000', backgroundColor: '#ffffff'}]
   */
  miniWeeklyCalendarArray({
    year,
    month,
    today,
    markDay,
    color,
    backgroundColor,
    todayColor,
    todayBackgroundColor,
  }) {
    console.log('test weekly', {
      year: year,
      month: month,
      today: today,
      markDay: markDay,
    })
    if (
      typeof year == 'string' ||
      typeof month == 'string' ||
      typeof today == 'string' ||
      typeof markDay == 'string'
    ) {
      return
    }
    if (year && month && today && markDay) {
      today = parseInt(today)
      year = parseInt(year)
      month = parseInt(month)
      markDay = parseInt(markDay)
      let dataObject: Record<string, any> = []
      let weeks = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      const date = new Date(year, month - 1, markDay)
      let currenWeekDay = date.getDay()
      let d = new Date(date.getTime() - currenWeekDay * 24 * 60 * 60 * 1000)
      for (let i = 0; i < 7; i++) {
        let item = {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          day: d.getDate(),
          weekDay: weeks[d.getDay()],
          color: color,
          backgroundColor: backgroundColor,
        }
        if (d.getDate() == today) {
          item.color = todayColor
          item.backgroundColor = todayBackgroundColor
        }
        dataObject.push(item)
        d = new Date(d.getTime() + 24 * 60 * 60 * 1000)
      }
      return dataObject
    }
    return
  },

  NextWeek({ year, month, day }) {
    console.log('test NextWeek2', {
      year: year,
      month: month,
      day: day,
    })
    let date = new Date(year, month - 1, day)
    date = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    let res = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    }
    console.log('test NextWeek2', res)
    return res
  },
  LastWeek({ year, month, day }) {
    console.log('test lastweek1', {
      year: year,
      month: month,
      day: day,
    })
    let date = new Date(year, month - 1, day)
    date = new Date(date.getTime() - 24 * 60 * 60 * 1000)
    let res = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    }
    console.log('test lastweek2', res)
    return res
  },

  /**
   * Add a height attribute to each item below the array
   * @param object
   * @returns
   */
  AddHeightByTimeSpan({ object }) {
    if (isArray(object)) {
      console.log('test AddHeightByTimeSpan', object)
      // let heights = [30, 40, 50, 60, 70]
      object.forEach((obj) => {
        let span = (parseInt(obj.etime) - parseInt(obj.stime)) / 60
        span = span * 1.5 < 20 ? 20 : span * 1.5
        if (span >= 100) {
          span = 100
        }
        obj.height = span + 'px'
      })
      return object
    }
    return
  },
  /**
   *
   * @param year
   * @param month
   * @param day
   * @param formatType
   * The default date format is week month day, year (such as Saturday April 10, 2021)
   * customized to YMD (year, month, day), and place the corresponding year, month,
   * and day according to the position of YMD (such as "YMD" corresponds to "2021 -04-10")
   * @returns
   */
  ShowRightTime({ year, month, day, formatType = '' }) {
    if (
      typeof year == 'string' ||
      typeof month == 'string' ||
      typeof day == 'string'
    ) {
      return
    }
    if (year && month && day) {
      if (formatType == '' || typeof formatType == undefined) {
        year = parseInt(year)
        month = parseInt(month)
        day = parseInt(day)
        let strTime = year + "-" + month + "-" + (day)
        let dayStart = new Date(strTime)
        let stime = dayStart.valueOf()
        let eday = year + "-" + month + "-" + (day + 1)
        let etime = (new Date(eday)).valueOf()
        let s = parseInt(stime.toString().substr(0, 10))
        let e = parseInt(etime.toString().substr(0, 10))
        return (
          [s, e]
        )
      } else if (typeof formatType == 'string') {
        if (day < 10) {
          day = '0' + day
        }
        if (month < 10) {
          month = '0' + month
        }
        formatType.toUpperCase()
        let re = formatType.replace('Y', year)
        re = re.replace('M', month)
        re = re.replace('D', day)

        return re
      }
    }
    return
  },
  ShowLeftTime({ year, month, day, formatType = '' }) {
    if (
      typeof year == 'string' ||
      typeof month == 'string' ||
      typeof day == 'string'
    ) {
      return
    }
    if (year && month && day) {
      if (formatType == '' || typeof formatType == undefined) {
        year = parseInt(year)
        month = parseInt(month)
        day = parseInt(day)
        let strTime = year + "-" + month + "-" + day
        let dayStart = new Date(strTime)
        let stime = dayStart.valueOf()
        let eday = year + "-" + month + "-" + (day + 1)
        let etime = (new Date(eday)).valueOf()
        let s = parseInt(stime.toString().substr(0, 10))
        let e = parseInt(etime.toString().substr(0, 10))
        return (
          [s, e]
        )

      } else if (typeof formatType == 'string') {
        if (day < 10) {
          day = '0' + day
        }
        if (month < 10) {
          month = '0' + month
        }
        formatType.toUpperCase()
        let re = formatType.replace('Y', year)
        re = re.replace('M', month)
        re = re.replace('D', day)

        return re
      }
    }
    return
  },
  ShowDateByNumber({ year, month, day, formatType = '' }) {
    console.log('test ShowDateByNumber', { year, month, day })
    if (
      typeof year == 'string' ||
      typeof month == 'string' ||
      typeof day == 'string'
    ) {
      return
    }
    if (year && month && day) {
      if (formatType == '' || typeof formatType == undefined) {
        year = parseInt(year)
        month = parseInt(month)
        day = parseInt(day)
        let date = new Date(year, month - 1, day)
        let months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]
        let weeks = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ]
        return (
          weeks[date.getDay()] +
          ' ' +
          months[month - 1] +
          ' ' +
          day +
          ',' +
          year
        )
      } else if (typeof formatType == 'string') {
        if (day < 10) {
          day = '0' + day
        }
        if (month < 10) {
          month = '0' + month
        }
        formatType.toUpperCase()
        let re = formatType.replace('Y', year)
        re = re.replace('M', month)
        re = re.replace('D', day)

        return re
      }
    }
    return
  },

  TransformWeekDate({ object }) {
    if (isArray(object)) {
      console.log('test TransformWeekDate', object)
      let dataObject: Record<string, any> = []
      object.forEach((obj) => {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDay()
        let start_time, end_time
        let workdays = obj.duration.split('-')
        workdays.forEach((d, index) => {
          if (d.indexOf('AM') != -1) {
            d = d.replace('AM', '')
            let split_date = d.split(':')
            let form_date
            if (parseInt(split_date[0]) == 12) {
              form_date = parseInt(split_date[0]) + 12
            } else {
              form_date = parseInt(split_date[0])
            }
            d = form_date + ':' + split_date[1]
          } else if (d.indexOf('PM') != -1) {
            d = d.replace('PM', '')
            let split_date = d.split(':')
            let form_date
            if (parseInt(split_date[0]) == 12) {
              form_date = parseInt(split_date[0])
            } else {
              form_date = parseInt(split_date[0]) + 12
            }
            d = form_date + ':' + split_date[1]
          }

          if (index == 0) {
            start_time = year + '/' + month + '/' + day + ' ' + d
          } else {
            end_time = year + '/' + month + '/' + day + ' ' + d
          }
        })
        let item: any = {
          itemStyle: { normal: { color: '#2988E65f' } },
          value: [],
        }
        item.value[0] = 6 - obj.index
        item.value[1] = start_time
        item.value[2] = end_time
        dataObject.push(item)
      })
      let option = {
        legend: {
          bottom: '1%',
          selectedMode: false,
          textStyle: {
            color: '#000',
          },
        },
        grid: {
          left: '3%',
          right: '3%',
          top: '1%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          interval: 3600 * 1000,
          axisLabel: {
            formatter: function (value) {
              var date = new Date(value)
              if (date.getHours() % 4 == 0) {
                return date.getHours() + ':' + getzf(date.getMinutes())
              }
              return
              function getzf(num) {
                if (parseInt(num) < 10) {
                  num = '0' + num
                }
                return num
              }
            },
          },
        },
        yAxis: {
          data: ['SA', 'FR', 'TH', 'WE', 'TU', 'MO', 'SU'],
        },
        series: [
          {
            type: 'custom',
            renderItem: function (params, api) {
              var categoryIndex = api.value(0)
              var start = api.coord([api.value(1), categoryIndex])
              var end = api.coord([api.value(2), categoryIndex])
              var height = 24
              return {
                type: 'rect',
                //@ts-ignore
                shape: echarts.graphic.clipRectByRect(
                  {
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height,
                  },
                  {
                    // 当前坐标系的包围盒。
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height,
                  }
                ),
                style: api.style(),
              }
            },
            encode: {
              x: [1, 2],
              y: 0,
            },
            data: dataObject,
          },
        ],
      }
      return option
    }
    return
  },

  transformMonth({ month, flag = 1 }) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const monthName = {
      'Jan': 1,
      'Feb': 2,
      'Mar': 3,
      'Apr': 4,
      'May': 5,
      'Jun': 6,
      'Jul': 7,
      'Aug': 8,
      'Sep': 9,
      'Oct': 10,
      'Nov': 11,
      'Dec': 12
    }

    if (flag == 2) {
      return monthName[month]
    } else {
      return months[month - 1]
    }
  },
  /**
   * transform year to int type
   * @param year
   * @returns 
   */
  transformYear({ year }) {
    return parseInt(year)
  },
  getDurationByMinute({ stime, etime }) {
    return (etime - stime) / 60
  },

  startMeeting({ stime }) {
    if ((stime - 900) * 1000 <= new Date().getTime()) return true
    return false
  },
  transformSelectWeek({ object }) {
    if (isArray(object)) {
      let selectWeek: Record<string, any> = []
      let addWeek: Record<string, any> = []
      let weeks = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa']
      for (let i = 0; i < 7; i++) {
        if (
          !(
            Object.keys(object[i]).length === 0 &&
            object[i].constructor === Object
          )
        ) {
          selectWeek.push({
            index: i,
            key: weeks[i],
            availableTime: {
              timeStart: '',
              timeEnd: '',
            },
          })
          object[i].forEach((obj) => {
            addWeek.push({
              duration: obj,
              location: '',
              index: i,
              key: weeks[i],
            })
          })
        }
      }
      return {
        selectWeek: selectWeek,
        addWeek: addWeek,
      }
    }
    return
  },
  isType({ parameter, type }) {
    console.log('test isType', {
      parameter: parameter,
      type: type,
    })
    if (typeof parameter == type) {
      return true
    }
    return false
  },

  getQuarterStartMonth(now: number) {
    let quarterStartMonth = 0;
    if (new Date(now).getMonth() < 3 || new Date(now).getMonth() == 12) {
      quarterStartMonth = 0;
    }
    if (2 < new Date(now).getMonth() && new Date(now).getMonth() < 6) {
      quarterStartMonth = 3;
    }
    if (5 < new Date(now).getMonth() && new Date(now).getMonth() < 9) {
      quarterStartMonth = 6;
    }
    if (new Date(now).getMonth() > 8) {
      quarterStartMonth = 9;
    }
    return quarterStartMonth;
  },

  getWeekEndDate(getTime: number) {
    let now: Date = new Date(getTime);
    let weekEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - ((now.getDay() === 0) ? 7 : now.getDay())));
    return weekEndDate.valueOf() / 1000;
  },

  getMonthEndDate(getTime: number) {
    let now: Date = new Date(getTime * 1000);
    let monthEndDate = new Date(now.getFullYear(), now.getMonth(), new Date(now.getFullYear(), now.getMonth(), 0).getDate());
    return monthEndDate.valueOf() / 1000;
  },

  getQuarterEndDate(getTime: number) {
    let quarterStartMonth = 0;
    let now: Date = new Date(getTime * 1000);
    let monthTime: number = new Date(now).getMonth() + 1;
    let yearTime: number = now.getFullYear();
    console.log(monthTime)
    if (monthTime < 3) {
      quarterStartMonth = 0;
    }
    if (2 < monthTime && monthTime < 6) {
      quarterStartMonth = 3;
    }
    if (5 < monthTime && monthTime < 9) {
      quarterStartMonth = 6;
    }
    if (monthTime > 8 && monthTime <= 11) {
      quarterStartMonth = 9;
    }
    if (monthTime === 12) {
      quarterStartMonth = 0;
      yearTime++;
    }
    let quarterEndMonth = quarterStartMonth + 2;
    console.log(quarterStartMonth)
    let quarterStartDate = new Date(yearTime, quarterEndMonth - 1, new Date(now.getFullYear(), quarterEndMonth, 0).getDate());
    return quarterStartDate.valueOf() / 1000;
  },

  compareTime({ startTime, endTime }) {
    var date = new Date()
    let stTime = startTime.split(/[A-Z]{2}/)[0].split(":")
    let edTime = endTime.split(/[A-Z]{2}/)[0].split(":")
    return date.setHours(stTime[0], stTime[1]) < date.setHours(edTime[0], edTime[1])
  },
  DateCompare({ startTime, endTime }: { startTime: string, endTime: string }) {
    let date: Date = new Date();
    let sEndStr = startTime.substr(-2, 2),
      eEndStr = endTime.substr(-2, 2),
      sTimeArr: string[] = _.split(startTime.substr(0, 5), ':', 2),
      eTimeArr: string[] = _.split(endTime.substr(0, 5), ':', 2);
    if (sEndStr === eEndStr) {
      if (sEndStr === "AM") {
        return date.setHours(+sTimeArr[0], +sTimeArr[1]) < date.setHours(+eTimeArr[0], +eTimeArr[1])
      }
      else if (sEndStr === "PM") {
        return date.setHours(+sTimeArr[0] + 12, +sTimeArr[1]) < date.setHours(+eTimeArr[0] + 12, +eTimeArr[1])
      }
    }
    else if (sEndStr === "AM" && eEndStr === "PM") {
      return true
    }
    else if (sEndStr === "PM" && eEndStr === "AM") {
      return false
    }
    return
  },
  generateYear({ last = 30, next = 10 }) {
    let currentYear = new Date().getFullYear()
    let data: any = []
    let startYear = currentYear - last
    for (let i = 0; i < last + next; i++) {
      data.push(startYear)
      startYear++
    }
    return data
  },
  formatData(timeStamp): string {
    timeStamp = timeStamp * 1000;
    function formatAMPM(date: Date) {
      let hours = date.getHours();
      let minutes: string | number = date.getMinutes();
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      let strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
    if (timeStamp >= new Date(new Date().toLocaleDateString()).getTime()) {
      return formatAMPM(new Date(timeStamp))
    } else {
      return (new Date(timeStamp).toDateString().split(" ")[1] + "\u0020" + new Date(timeStamp).toDateString().split(" ")[2])
    }
  },
  getMonthString(): string[] {
    return ["December", "November", "October", "September", "August", "July", "June", "May", "April", "March", "February", "January"].splice(11 - new Date().getMonth(), 12)
  },
  formatDataPro({ date, separator }: { date: number | string, separator: string }) {
    if (date.toString().length === 10) {
      date = (+date) * 1000;
    }
    let dateFormat: Date = new Date(+date);
    return `${dateFormat.toLocaleString('en-US', { month: "2-digit" })}` + `${separator}` + `${dateFormat.toLocaleString('en-US', { day: "2-digit" })}` + `${separator}` + `${dateFormat.getFullYear()}` + '\u0020'
      + `${dateFormat.toLocaleString('en-US', { hour: 'numeric', minute: "numeric", hour12: true })}`
  },

  /**
   * 
   * @param date --->1998-09-02
   */
  checkUnder18({ date }) {
    let currentDate = new Date().getTime()
    let pastDate = new Date(date).getTime()
    let years = (currentDate - pastDate) / (1000 * 60 * 60 * 24 * 356)
    if (years < 18) return true
    return false
  },
}
