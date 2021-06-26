const Store = require('electron-store')
const { readDir } = require('./browser')
const storage = new Store()
const { ipcMain, MessageChannelMain } = require('electron')
const { extractArchive } = require('../utilities/service')

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
            extractArchive(path, targetDir.dir)
        })
    },
    zip(event, payload) {
        return payload
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
            dirWatcher && dirWatcher.close()
            dirWatcher = fs.watch(payload.dir, {}, async (a, b) => {
                const paths = await readDir(payload.dir)
                win.webContents.send('dirChange', paths)
            })
        })
    },
}
