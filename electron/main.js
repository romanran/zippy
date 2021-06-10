'use strict'
const installExtension = require('electron-devtools-installer')
const { saveLog } = require('../src/utilities/log')
const path = require('path')
const { handleFile } = require('../src/system-handlers/app')

const { app, BrowserWindow } = require('electron')

const isDev = process.env.NODE_ENV === 'development'

const unzipPath = path.parse(process.argv[1])
if (unzipPath.base !== 'main.js' && unzipPath.ext) {
    handleFile(process.argv[1])
        .then(() => {
            app.quit()
        })
        .catch((error) => {
            saveLog('ERROR', 'handling-file', error)
            app.quit()
        })
} else {
    let win
    const createWindow = async () => {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                // contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
            },
        })

        win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

        if (isDev) win.webContents.openDevTools()
    }

    app.on('ready', () => {
        createWindow()

        app.on('activate', async function () {
            if (isDev) {
                try {
                    await installExtension({
                        id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
                        electron: '>=1.2.1',
                    })
                    console.log('Vue devtools installed')
                } catch (e) {
                    console.error('Vue Devtools failed to install:', e.toString())
                }
            }
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            win = null
            app.quit()
        }
    })
    if (isDev) {
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
}
