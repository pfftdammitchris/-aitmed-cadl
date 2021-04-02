import moment from 'moment'
import humanizeDuration from 'humanize-duration'

export default {
  formatTimer(time: number) {
    return moment(time).format('HH:mm:ss')
  },
  formatUnixtime_en(unixTime: number) {
    return moment(unixTime * 1000).format('lll')
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
}
