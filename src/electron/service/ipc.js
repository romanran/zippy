const Store = require('electron-store')
const { readDir } = require('./browser')
const storage = new Store()
const { ipcMain } = require('electron')
const { extractArchive, createArchive } = require('../utilities/service')

let dirWatcher
const handlers = {
    async readStore(event, payload) {
        return storage.get(payload.name)
    },
    async readDir(event, payload) {
        storage.set('cwd', payload.dir)
        const response = await readDir(payload.dir)
        return response
    },
    unzip(event, payload) {
        const path = require('path')
        const targetDir = path.parse(payload.paths[0])
        payload.paths.forEach((path) => {
            extractArchive(path, targetDir.dir, payload.password)
        })
    },
    zip(event, payload) {
        return createArchive(payload.paths, payload.extension, payload.password)
    },
    delete(event, payload) {
        const fs = require('fs-extra')
        payload.paths.forEach((path) => {
            fs.remove(path)
        })
    },
}

module.exports = {
    handlers,
    addIpcHandlers(win) {
        Object.keys(handlers).forEach((key) => {
            ipcMain.handle(key, handlers[key])
        })
        ipcMain.handle('watchDir', (event, payload) => {
            const fs = require('fs')
            const { debounce } = require('lodash')
            dirWatcher && dirWatcher.close()
            const watcherCallback = async (a, b) => {
                const paths = await readDir(payload.dir)
                win.webContents.send('dirChange', paths)
            }
            dirWatcher = fs.watch(payload.dir, {}, debounce(watcherCallback, 33))
        })
    },
}
