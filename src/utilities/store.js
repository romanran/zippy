module.exports = {
    makeMutations(state) {
        return Object.keys(state).reduce((obj, key) => {
            obj[key] = function (state, value) {
                state[key] = value
            }
            return obj
        }, {})
    },
}
