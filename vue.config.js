const glob = require('glob')
const electronFiles = 'service/browser.js, service/ipc.js, utilities/file.js, /utilities/service.js'
module.exports = {
    pluginOptions: {
        electronBuilder: {
            preload: 'src/electron/preload.js',
            mainProcessWatch: electronFiles.split(', ').map((file) => `src/electron/${file}`),
            mainProcessFile: 'src/electron/background.js',
            builderOptions: {
                appId: 'com.zippy.app',
                productName: 'zippy',
                win: {
                    icon: 'public/zippy.ico',
                },
            },
        },
    },
}
