'use strict'

const { contextBridge, ipcRenderer } = require('electron')

const { handlers } = require('./service/ipc')
const remote = require('electron').remote

/****************************************************************
 * Auto-creates window.api[handleName] handlers
 *
 *
 * *************/
const apiFunctions = Object.keys(handlers).reduce((reducer, key) => {
    reducer[key] = (payload) => ipcRenderer.invoke(key, payload)
    return reducer
}, {})

let watchDir

contextBridge.exposeInMainWorld('api', {
    ...apiFunctions,
    dirWatcher: (payload) => {
        if (watchDir) ipcRenderer.removeListener('dirChange', watchDir)
        ipcRenderer.invoke('watchDir', { dir: payload.dir })
        watchDir = function (event, data) {
            payload.callback(data)
        }
        ipcRenderer.on('dirChange', watchDir)
    },
    closeWindow() {
        remote.getCurrentWindow().close()
    },
})
