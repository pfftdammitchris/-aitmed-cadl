import _ from 'lodash'
export default {
    inRange({ number, start, end }) {
        if (number == start || number == end) {
            return true
        }
        return _.inRange(number, start, end)
    }
}
