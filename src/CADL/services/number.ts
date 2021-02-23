import _ from 'lodash'
export default {
    inRange({ number, start, end }) {
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
    }
}
