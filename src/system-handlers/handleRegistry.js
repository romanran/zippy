const regedit = require('regedit')

const registryPaths = {
    zip: 'HKCR\\.zip'
}
let programsIds = {}

regedit.list(registryPaths.zip, function(err, result) {
    programsIds.zip = result[registryPaths.zip].values[''].value
})
const createExtensionPath = programId => {
    root: `HKEY_CURRENT_USER\\Software\\Classes\\${programId}\\shell\\zippy\\`
    command: `HKEY_CURRENT_USER\\Software\\Classes\\${programId}\\shell\\zippy\\`

const zipExtension = createExtensionPath(programsIds.zip)
const contextMenu = {
    [zipExtension.root]: {
        '': {
            value: 'Unzip',
            type: 'REG_SZ'
        },
        'Icon': {
            value: 'W:\\Projects\\zippy\\public\\logo.png',
            type: 'REG_SZ'
        }
    },
    [zipExtension.command]: {
        '': {
            value: 'W:\\Projects\\zippy\\dist_electron\\win-unpacked\\zippy.exe',
            type: 'REG_SZ'
        }
    }
}
 
regedit.putValue(valuesToPut, function(err) {
 
})