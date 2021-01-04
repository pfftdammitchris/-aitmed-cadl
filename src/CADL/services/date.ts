import _ from 'lodash'
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
        return new Date().getTimezoneOffset()
    },
    /**
     * Return the number of milliseconds between January 1, 1970
     */
    getTime() {
        return new Date().getTime()
    },
    /**
     * Returns the time stamp interval of a day  (ms)
     * @param {string} (date) -->  MM-DD-YY
     * @return 
     */
    getTimeStampOfDate({ date }) {
        //   convert time to MM-DD-YY
        let timeStamp = {
            start: 0,
            end: 0
        }
        timeStamp.start = Date.parse(date)
        timeStamp.end = timeStamp.start + 86400000
        return timeStamp
    }
}
