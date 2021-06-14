'use strict'
const installExtension = require('electron-devtools-installer')
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const { handleFile } = require('./system-handlers/app')
const { saveLog } = require('./utilities/log')
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
    require('electron-reload')(__dirname, {
        electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron.cmd'),
        forceHardReset: true,
    })
    const createWindow = async () => {
        if (isDev) {
            try {
                installExtension.default({
                    id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
                    electron: '>=1.2.1',
                })
                console.log('Vue devtools installed')
            } catch (e) {
                console.error('Vue Devtools failed to install:', e.toString())
            }
        }
        win = new BrowserWindow({
            width: 1600,
            height: 1000,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
            },
        })

        await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

        if (isDev) win.webContents.openDevTools()
    }

    app.on('ready', async () => {
        createWindow()
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
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

const Store = require('electron-store')
const { readDir } = require('./service/browser')
const storage = new Store()
ipcMain.handle('readDir', async (event, payload) => {
    const response = await readDir(payload.dir, payload.filterZipFiles)
    return response
})
