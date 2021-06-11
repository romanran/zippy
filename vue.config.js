module.exports = {
    publicPath: '',
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
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
        devtool: 'source-map',
        output: {
            // The filenames need to have a ./ otherwise Electron won't be able to find the files.
            filename: './[name].js',
            chunkFilename: './[name].js',
        },
    },
}
