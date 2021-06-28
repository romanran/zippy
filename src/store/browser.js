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
            const response = await window.api.readDir({ dir })
            if (!response.handledDefault) {
                context.commit('files', response.files)
                context.commit('previousDirExists', path.dirname(dir) !== dir)
                context.commit('currentDir', response.targetDir || dir)
            }
            window.api.dirWatcher({
                dir,
                callback: (response) => {
                    context.commit('files', response.files)
                },
            })
            context.commit('loading', false)
        },
        sortFiles(context, payload) {
            const { orderBy } = require('lodash')

            context.commit('files', orderBy(context.rootState.browser.files, payload))
        },
        async unzip(context, payload) {
            await window.api.unzip(payload)
        },
        async zip(context, payload) {
            await window.api.zip(payload)
        },
        async delete(context, payload) {
            await window.api.delete(payload)
        },
        async move(context, payload) {
            await window.api.move(payload)
        },
        async getCWD(context) {
            const dir = await window.api.readStore({ name: 'cwd' })
            context.commit('currentDir', dir)
        },
    },
}
