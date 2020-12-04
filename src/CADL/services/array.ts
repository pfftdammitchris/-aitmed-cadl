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
    append({ newMessage, messages }) {
        if (isArray(messages)) {
            if (newMessage) {
                var cloned = _.cloneDeep(newMessage)
                messages.push(cloned)
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
    has({ object, key }) {
        if (isArray(object)) {
            for (let i = 0; i < object.length; i++) {
                if (object[i].key === key) {
                    return true
                }
            }
        }
        return false
    },
    push({ newMessage, messages }) {
        if (isArray(messages)) {
            if (newMessage) {
                var cloned = _.cloneDeep(newMessage)
                messages.unshift(cloned)
                return
            }
        }
        return
    },
    removeByKey({ object, key }) {
        if (isArray(object)) {
            for (let i = 0; i < object.length; i++) {
                if (object[i][key]) {
                    // TO DO: how to handle objects with same key? should they all be deleted, or just delete first one?
                    // Should duplicate object key made not allowed using add method?
                    object.splice(i, 1)
                    return
                }
            }
        }
        return
    },
}


