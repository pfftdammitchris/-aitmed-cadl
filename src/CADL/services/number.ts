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
}
