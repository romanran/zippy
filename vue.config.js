module.exports = {
    pluginOptions: {
        electronBuilder: {
            preload: 'src/electron/preload.js',
            mainProcessFile: 'src/electron/background.js',
            builderOptions: {
                appId: 'com.zippy.app',
                productName: 'zippy',
                win: {
                    icon: './public/zippy.ico'
                }
            }
        }
    }
}
