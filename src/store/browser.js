import Store from 'electron-store'
const store = new Store()

export default {
    state: {
        currentDir: '.',
        files: []
    },
    mutations: {
        setCWD(state, path) {
            store.set('currentDir', path)
            state.currentDir = path
        }
    }
}
