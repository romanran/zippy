const Store = require('electron-store')
const { readDir } = require('./browser')
const storage = new Store()
const { ipcMain } = require('electron')
const { extractArchive } = require('../utilities/service')

const handlers = {
    async readStore(event, payload) {
        return storage.get(payload.name)
    },
    async readDir(event, payload) {
        storage.set('cwd', payload.dir)
        const response = await readDir(payload.dir, payload.filterZipFiles)
        return response
    },
    async unzip(event, payload) {
        const targetDir = path.resolve(payload.dir)
        console.log(targetDir)
        return targetDir
        // extractArchive(payload.dir, targetDir)
    },
    zip(event, payload) {
        return payload
    },
}

module.exports = {
    handlers,
    addIpcHandlers() {
        Object.keys(handlers).forEach((key) => {
            ipcMain.handle(key, handlers[key])
        })
    },
}
