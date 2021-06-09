const regedit = require('regedit')

const registryPaths = {
    zip: 'HKCR\\.zip'
}

const createExtensionPath = programId => {
    return {
        root: `HKCU\\Software\\Classes\\${programId}\\shell\\zippy\\`,
        command: `HKCU\\Software\\Classes\\${programId}\\shell\\zippy\\command`
    }
}
function getExtensionsIds() {
    return new Promise((resolve, reject) => {
        regedit.list(registryPaths.zip, function(err, result) {
            resolve({
                zip: result[registryPaths.zip].values[''].value
            })
        })
    })
}

async function addZippyContextMenu() {
    const programsIds = await getExtensionsIds()
    const zipExtension = createExtensionPath(programsIds.zip)
    const contextMenu = {
        [zipExtension.root]: {
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
    regedit.putValue(contextMenu, function(err) {
        err && console.warn(err)
    })
}
addZippyContextMenu()
