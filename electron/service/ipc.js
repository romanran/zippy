const Store = require('electron-store')
const { readDir } = require('./browser')
const storage = new Store()
const { ipcMain } = require('electron')

const handlers = {
    async readDir(event, payload) {
        const response = await readDir(payload.dir, payload.filterZipFiles)
        return response
    },
}

module.exports = {
    addIpcHandlers() {
        Object.keys(handlers).forEach((key) => {
            ipcMain.handle(key, handlers[key])
        })
    },
}
