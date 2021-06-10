const regedit = require('regedit')
const { saveLog } = require('../utilities/log.js')

const registryPaths = {
    zip: 'HKCR\\.zip',
    '7z': 'HKCR\\.7z',
    rar: 'HKCR\\.rar',
    '*': 'HKCR\\*'
}

const createExtensionPath = programId => {
    return {
        root: `HKCU\\Software\\Classes\\${programId}`,
        app: `HKCU\\Software\\Classes\\${programId}\\shell\\zippy\\`,
        command: `HKCU\\Software\\Classes\\${programId}\\shell\\zippy\\command`
    }
}
function getExtensionsIds(key) {
    return new Promise((resolve, reject) => {
        if (key === '*') {
            return key
        }
        regedit.list(registryPaths[key], (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result[registryPaths[key]].values[''].value)
        })
    })
}

async function addExtensionContextMenu(key) {
    let programsId
    try {
        programsId = await getExtensionsIds(key)
    } catch (error) {
        saveLog('ERROR', 'get-extension-id', error)
    }
    const zipExtension = createExtensionPath(programsId)
    const contextMenu = {
        [zipExtension.app]: {
            zippy: {
                value: 'Unzip',
                type: 'REG_DEFAULT'
            },
            Icon: {
                value: 'W:\\Projects\\zippy\\public\\zippy.ico',
                type: 'REG_SZ'
            }
        },
        [zipExtension.command]: {
            zippy: {
                value: '"W:\\Projects\\zippy\\dist_electron\\win-unpacked\\zippy.exe" "%1"',
                type: 'REG_DEFAULT'
            }
        }
    }
    regedit.putValue(contextMenu, error => {
        console.log(error?.message, error?.code)
        if (error?.code === 2) {
            regedit.createKey(zipExtension.root, error => {
                if (error) {
                    return saveLog('ERROR', `create-key-${key}`, error)
                }
                addExtensionContextMenu(key)
            })
        }
        error && saveLog('ERROR', `add-registry-${key}`, error)
    })
}

Object.keys(registryPaths).forEach(key => {
    addExtensionContextMenu(key)
})
