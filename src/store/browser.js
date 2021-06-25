const { makeMutations } = require('../utilities/store')

const initialState = {
    files: [],
    drives: [],
    loading: true,
    loadingDrives: true,
    openedArchive: false,
    filterZipFiles: false,
    currentDir: '',
    previousDir: null,
    previousDirExists: false,
}

export default {
    state: initialState,
    namespaced: true,
    mutations: {
        ...makeMutations(initialState),
    },
    actions: {
        getDrives() {
            const platforms = {
                win32: async () => {
                    // const drives = await getWinDrives()
                    // context.commit('drives', drives)
                },
            }
            platforms[process.platform]?.()
        },

        readDir: async function (context, dir) {
            const path = require('path')
            const os = require('os')
            if (!dir) {
                dir = os.homedir()
            }
            context.commit('previousDir', context.state.currentDir)
            context.commit('loading', true)
            console.log(dir)
            const response = await window.api.readDir({ dir, filterZipFiles: context.state.filterZipFiles })
            if (!response.handledDefault) {
                context.commit('files', response.files)
                context.commit('previousDirExists', path.dirname(dir) !== dir)
                context.commit('currentDir', dir)
            }
            context.commit('loading', false)
        },
        sortFiles(context, payload) {
            const { orderBy } = require('lodash')

            context.commit('files', orderBy(context.rootState.browser.files, payload))
        },
        unzip(context, payload) {
            payload.paths.forEach(async (path) => {
                const response = await window.api.unzip({ dir: path })
                console.log(response)
            })
        },
        async getCWD(context) {
            const dir = await window.api.readStore({ name: 'cwd' })
            context.commit('currentDir', dir)
        },
    },
}
