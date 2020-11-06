import _ from 'lodash'

// Points from talk with Ray:
// Original plan is to modify the object in place, but the object could be referenced in multiple locations
// We can either modify the object in place, or return a deep copy
// Alternatively, we can change the function to do both, if being told
// I will include all three methods here, with two being commented out
export default {
    // Returns a deep copy

    remove({ object, key }) {
        var cloned = _.cloneDeep(object)
        _.unset(cloned, key)
        return cloned
    },

    set({ object, key, value }) {
        var cloned = _.cloneDeep(object)
        _.set(cloned, key, value)
        return cloned
    }

    // Modifies in place

    // remove({ object, key }) {
    //     _.unset(object, key)
    // },

    // set({ object, key, value }) {
    //     _.set(object, key, value)
    // }

    // Checks for what to do, adds an extra parameter, should update noodl if going with this path

    // remove({ object, key, deep = false }) {
    //     if(deep) {
    //         var cloned = _.cloneDeep(object)
    //         _.unset(cloned, key)
    //         return cloned
    //     }
    //     else {
    //         _.unset(object, key)
    //     }
    // },

    // set({ object, key, value, deep = false }) {
    //     if(deep) {
    //         var cloned = _.cloneDeep(object)
    //         _.set(cloned, key, value)
    //         return cloned
    //     }
    //     else {
    //         _.set(object, key, value)
    //     }
    // }
}
