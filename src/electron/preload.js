'use strict'

const { contextBridge, ipcRenderer } = require('electron')

const { handlers } = require('./service/ipc')
// In this file we want to expose protected methods that allow the renderer
// process to use the ipcRenderer without exposing the entire object.
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
})
