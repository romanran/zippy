// const os = require('os')
// const { resolve } = require('path')

// const { getFileStats } = require('../utilities/file')
// const { getDirPattern, getWinDrives, openFile } = require('../utilities/service')
// const { makeMutations } = require('../utilities/store')

const initialState = {
    files: [],
    drives: [],
    loading: true,
    loadingDrives: true,
    openedArchive: false,
    archiveDir: null,
    filterZipFiles: false,
    currentDir: '',
    previousDir: null,
    previousDirExists: false,
}
export default {
    state: initialState,
    namespaced: true,
}
// export default {
//     state: initialState,
//     namespaced: true,
//     mutations: {
//         ...makeMutations(initialState),
//         setCWD(state, path) {
//             store.set('currentDir', path)
//             state.currentDir = path
//         },
//     },
//     actions: {
//         getDrives(context) {
//             const platforms = {
//                 win32: async () => {
//                     const drives = await getWinDrives()
//                     context.commit('drives', drives)
//                 },
//             }
//             platforms[process.platform]?.()
//         },

//         readDir: async function (context, dir, openedArchive) {
//             console.log('dir', dir)
//             const path = require('path')
//             const fs = require('fs-extra')

//             if (!dir) {
//                 dir = context.state.currentDir
//             }
//             let targetDir = path.resolve(context.state.currentDir, dir)
//             document.title = targetDir
//             if (openedArchive) {
//                 context.commit('openedArchive', openedArchive)
//                 context.commit('archiveDir', context.state.currentDir)
//                 if (targetDir.search(openedArchive) < 0) {
//                     context.commit('openedArchive', false)
//                     targetDir = context.state.archiveDir
//                     context.state.currentDir = path.resolve(targetDir, context.state.openedArchive) //refactor this part
//                 }
//             }
//             // --If target directory is a file
//             try {
//                 context.commit('loading', true)
//                 const stat = await fs.stat(targetDir)
//                 if (stat.isFile()) {
//                     const targetDir = await openFile(targetDir)
//                     context.commit('loading', false)
//                     context.dispatch('readDir', targetDir, path.parse(targetDir).name)
//                     return false
//                 } else {
//                     context.commit('loading', false)
//                 }
//             } catch (error) {
//                 console.warn(error)
//             }
//             // --
//             const glob = require('glob')

//             await glob(getDirPattern(context.state.openedArchive, context.state.filterZipFiles), { cwd: targetDir }, async (err, files) => {
//                 files = await Promise.all(files.map(async (file) => await getFileStats(file, targetDir)))
//                 context.state.previousDir = context.state.currentDir
//                 context.state.currentDir = path.resolve(context.state.currentDir, dir)
//                 context.commit('setCWD', context.state.currentDir)
//                 if (err) return context.dispatch('showError', err)
//                 context.commit('files', files)
//                 context.commit('loading', false)
//             })
//             context.commit('previousDirExists', path.parse(targetDir).root !== targetDir)
//         },
//         sortFiles(context, payload) {
//             const { orderBy } = require('lodash')

//             context.commit('files', orderBy(context.rootState.browser.files, payload))
//         },
//         showError(error) {
//             console.warn(error)
//         },
//     },
// }
