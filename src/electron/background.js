'use strict'

import { app, protocol, BrowserWindow, ipcRenderer } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from 'path'

const { addIpcHandlers } = require('./service/ipc')
const { handleFile } = require('./system-handlers/app')
const { saveLog } = require('./utilities/log')
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

const unzipPath = path.parse(process.argv[1])
if (unzipPath.base === 'dist_electron' || unzipPath.base === 'zippy') {
    async function createWindow() {
        const win = new BrowserWindow({
            width: 1600,
            height: 1000,
            webPreferences: {
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
                contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
                preload: path.join(__dirname, 'preload.js'),
                enableRemoteModule: true,
                frame: false,
            },
        })

        addIpcHandlers(win)
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
            if (!process.env.IS_TEST) win.webContents.openDevTools()
        } else {
            createProtocol('app')
            await win.loadURL('app://./index.html')
        }
    }

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('ready', async () => {
        if (isDevelopment && !process.env.IS_TEST) {
            try {
                await installExtension(VUEJS3_DEVTOOLS)
            } catch (e) {
                console.error('Vue Devtools failed to install:', e.toString())
            }
        }
        createWindow()
    })

    if (isDevelopment) {
        if (process.platform === 'win32') {
            process.on('message', (data) => {
                if (data === 'graceful-exit') {
                    app.quit()
                }
            })
        } else {
            process.on('SIGTERM', () => {
                app.quit()
            })
        }
    }
} else {
    handleFile(process.argv[1])
        .then(() => {
            app.quit()
        })
        .catch((error) => {
            saveLog('ERROR', 'handling-file', error)
            app.quit()
        })
}
