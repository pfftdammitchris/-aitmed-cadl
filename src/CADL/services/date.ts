import _, { isArray, isObject } from 'lodash'
import moment from 'moment'
class splitTime {
  showTime: string
  stime: number
  etime: number
}
function convertWeek(day) {
  switch (day) {
    case 1:
      day = 'MO';
      break;
    case 2:
      day = 'TU';
      break;
    case 3:
      day = 'WE';
      break;
    case 4:
      day = 'TH';
      break;
    case 5:
      day = 'FR';
      break;
    case 6:
      day = 'SA';
      break;
    case 0:
      day = 'SU';
      break;
  }
  return day
}
export default {
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
    return new Date((parseInt(timeStamp) * 1000))
  },
  stampToTime(timeStamp) {
    if (timeStamp) {
      let time = new Date((parseInt(timeStamp) * 1000)).toString()
      let timeArray = time.split(" ")[4].split(':');
      return (parseInt(timeArray[0]) < 12) ? `${timeArray[0]}:${timeArray[1]}AM` : `${parseInt(timeArray[0]) - 12}:${timeArray[1]}PM`
    }
    return 'timeStamp is null'
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
    let dateObject = new Date()
    dateObject.setMonth(dateArray[1])
    dateObject.setDate(dateArray[2])
    dateObject.setFullYear(dateArray[0])
    dateObject.setHours(0)
    dateObject.setMinutes(0)
    dateObject.setSeconds(0)
    timeStamp.start = Date.parse(dateObject.toString()) / 1000
    timeStamp.end = timeStamp.start + 86400
    return timeStamp
  },
  LoopToGenerate({ span }) {
    let fotmat = (n: number) => {
      if (n < 13 * 60) {
        let h = Math.floor(n / 60)
        let m = n % 60
        return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}AM`
      } else {
        let h = Math.floor((n - 12 * 60) / 60)
        let m = (n - 12 * 60) % 60
        return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}PM`
      }
    }
    let i: number = 0
    let arr: any[] = []
    while (i <= 24 * 60) {
      arr.push(fotmat(i))
      i += parseInt(span)
    }
    console.log(arr)
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
          color: '#ffffff',
          backgroundColor: '#508CC7',
        })
      } else {
        dataObject.push({
          key: dataArray[i],
          color: '#000000',
          backgroundColor: '#ffffff',
        })
      }

    }
    // let dataJson = _.chunk(dataArray, 7);
    return dataObject
  },
  splitByTimeSlot({ object2, timeSlot }) {
    let splitTimeArray = []
    let splitTimeItem = {}
    // alert(typeof (object))
    console.log(object2)
    if (object2) {
      // alert(1)
      object2.forEach(obj => {
        if (isObject(obj)) {
          if (timeSlot) {
            let i = 0
            do {
              splitTimeItem = {
                stime: obj.stime + i * timeSlot * 60,
                etime: obj.stime + (i + 1) * timeSlot * 60,
                showTime: moment((obj.stime + i * timeSlot * 60) * 1000).format('LT'),
                refid: obj.id
              }
              if ((obj.etime - splitTimeItem.stime) < timeSlot * 60) continue
              splitTimeArray.push(splitTimeItem)
              i += 1
            } while (splitTimeItem.etime <= obj.etime)
            // splitTimeArray.pop()
          }
        }
      })
      console.log(splitTimeArray)
      return splitTimeArray
    }
    return
  },
  ShowTimeSpan(object) {
    // console.log("test ShowTimeSpan", object)
    if (isObject(object)) {
      if (object.hasOwnProperty("stime") && object.hasOwnProperty("etime")) {
        let start_date = moment(object.stime * 1000).format('LT')
        let end_date = moment(object.etime * 1000).format('LT')
        let duration_date = start_date + ' - ' + end_date
        return duration_date
      }
      return
    }
    return
  },
  minicalendarArray({ year, month, today, middleDay, span, color, backgroundColor, todayColor, todayBackgroundColor }) {
    console.log("test minicalendarArray", {
      year: year,
      month: month,
      today: today,
      middleDay: middleDay,
      span: span
    })
    middleDay = parseInt(middleDay)
    span = parseInt(span)
    year = parseInt(year)
    month = parseInt(month)
    let dataObject: Record<string, any> = []
    let isLeapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? true : false
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    days[1] = isLeapYear ? 29 : 28
    let index = parseInt(-(span / 2))
    for (let i = 1; i <= span; i++) {
      let d = middleDay + index
      if (today == d) {
        let date = new Date(year, month, d)
        let day = convertWeek(date.getDay())
        dataObject.push({
          key: today,
          week: day,
          color: todayColor,
          backgroundColor: todayBackgroundColor,
        })
      } else if (d < 1) {
        d = d + days[month - 1]
        let date = new Date(year, month, d)
        let day = convertWeek(date.getDay())
        dataObject.push({
          key: d,
          week: day,
          color: color,
          backgroundColor: backgroundColor,
        })
      } else if (d > days[month - 1]) {
        d = d - days[month - 1]
        let date = new Date(year, month, d)
        let day = convertWeek(date.getDay())
        dataObject.push({
          key: d,
          week: day,
          color: color,
          backgroundColor: backgroundColor,
        })
      } else {
        let date = new Date(year, month, d)
        let day = convertWeek(date.getDay())
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
  AddHeightByTimeSpan({ object }) {
    if (isArray(object)) {
      console.log("test AddHeightByTimeSpan", object)
      // let heights = [30, 40, 50, 60, 70]
      object.forEach(obj => {
        let span = (parseInt(obj.etime) - parseInt(obj.stime)) / (60)
        span = span * 1.5
        obj.height = span + "px"
      })
      return object
    }
    return
  },
  ShowDateByNumber({ year, month, day }) {
    if (year && month && day) {
      year = parseInt(year)
      month = parseInt(month)
      day = parseInt(day)
      let date = new Date(year, month, day)
      let months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      let weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      return weeks[date.getDay() - 1] + " " + months[month - 1] + " " + day + "," + year
    }
    return
  },

  TransformWeekDate({ object }) {
    if (isArray(object)) {
      console.log("test TransformWeekDate", object)
      let dataObject: Record<string, any> = []
      object.forEach(obj => {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDay()
        let start_time, end_time;
        let workdays = obj.duration.split("-")
        workdays.forEach((d, index) => {
          if (d.indexOf("AM") != -1) {
            d = d.replace('AM', '')
          } else if (d.indexOf("PM") != -1) {
            d = d.replace('PM', '')
            let split_date = d.split(":")
            let form_date = parseInt(split_date[0]) + 12
            d = form_date + ":" + split_date[1]
          }

          if (index == 0) {
            start_time = year + "/" + month + "/" + day + " " + d
          } else {
            end_time = year + "/" + month + "/" + day + " " + d
          }
        })
        let item = { itemStyle: { normal: { color: "#2988E65f" } }, value: [] }
        item.value[0] = obj.index
        item.value[1] = start_time
        item.value[2] = end_time
        dataObject.push(item)
      })
      let option = {
        legend: {
          bottom: '1%',
          selectedMode: false,
          textStyle: {
            color: '#000'
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          top: '1%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          interval: 3600 * 1000,
          axisLabel: {
            "formatter": function (value) {
              var date = new Date(value);
              return getzf(date.getHours()) + ':' + getzf(date.getMinutes());
              function getzf(num) {
                if (parseInt(num) < 10) {
                  num = '0' + num;
                }
                return num;
              }
            },
          }
        },
        yAxis: {
          data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        series: [
          {
            type: 'custom',
            renderItem: function (params, api) {
              var categoryIndex = api.value(0);
              var start = api.coord([api.value(1), categoryIndex]);
              var end = api.coord([api.value(2), categoryIndex]);
              var height = 24;
              return {
                type: 'rect',
                shape: echarts.graphic.clipRectByRect({
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, { // 当前坐标系的包围盒。
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
              };
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: dataObject
          }
        ]
      }
      return option
    }
    return
  },
}



