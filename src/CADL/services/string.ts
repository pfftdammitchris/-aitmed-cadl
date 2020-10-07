import moment from 'moment'
import humanizeDuration from 'humanize-duration'

export default {
  formatUnixtime_en(unixTime: number) {
    return moment(unixTime * 1000).format('lll')
  },
  formatDurationInSecond(unixTime: number) {
    return humanizeDuration(unixTime * 1000)
  },
  concat(stringArr: string[]) {
    if (Array.isArray(stringArr)) {
      return stringArr.join('')
    }
    return ''
  },
}
