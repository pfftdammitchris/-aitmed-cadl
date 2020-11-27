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
    },
    clear({ object }) {
        if (isArray(object)) {
            object.length = 0
        }
        return
    },
    removeByKey({ object, key }) {
        if (isArray(object)) {
            for (let i = 0; i < object.length; i++) {
                if (object[i][key]) {
                    object.splice(i, 1)
                    return
                }
            }
        }
        return
    },
}
