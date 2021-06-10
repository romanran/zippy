module.exports = {
    publicPath: '',
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: false,
            removeElectronJunk: false,
            builderOptions: {
                appId: 'com.zippy.app',
                productName: 'zippy',
                win: {
                    icon: './public/zippy.ico',
                },
            },
        },
    },
    configureWebpack: {
        output: {
            filename: './[name].js',
            chunkFilename: './[name].js',
        },
        devtool: 'source-map',
    },
}
