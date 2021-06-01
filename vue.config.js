module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            removeElectronJunk: false
        }
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}
