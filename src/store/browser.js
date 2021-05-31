import Store from 'electron-store'
import { getWinDrives } from '../utilities/service'
import { makeMutations } from '../utilities/store'
const store = new Store()

const initialState = {
    currentDir: '.',
    files: [],
    drives: [],
    loading: true,
    loadingDrives: true
}

export default {
    state: initialState,
    namespaced: true,
    mutations: {
        ...makeMutations(initialState),
        setCWD(state, path) {
            store.set('currentDir', path)
            state.currentDir = path
        }
    },
    actions: {
        readDir(context, path) {
            console.log(path)
        },
        getDrives(context) {
            const platforms = {
                win32: async () => {
                    const drives = await getWinDrives()
                    context.commit('drives', drives)
                }
            }
            platforms[process.platform]?.()
        }
    }
}
