import _, { isArray } from 'lodash'

export default {
    add({ object, value }) {
        if (isArray(object)) {
            if (value) {
                var cloned = _.cloneDeep(value)
                object.push(cloned)
            }
            return
        }
        return
    }
}