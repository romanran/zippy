module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            removeElectronJunk: false,
            builderOptions: {
                appId: 'com.zippy.app',
                productName: 'zippy',
                win: {
                    icon: 'public/logo.png'
                }
            }
        }
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}
