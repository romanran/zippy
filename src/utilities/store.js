import _ from 'lodash'

export function makeMutations(state) {
    return _.keys(state).reduce((obj, key) => {
        obj[key] = function(state, value) {
            state[key] = value
        }
        return obj
    }, {})
}
