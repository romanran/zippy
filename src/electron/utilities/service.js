const handledExtensions = {
    ZIP: '.zip',
    SEVENZIP: '.7z',
}
module.exports = {
    handledExtensions,
    extractArchive(sourcePath, targetDir) {
        const path = require('path')

        return new Promise((resolve, reject) => {
            const extensions = {
                [handledExtensions.ZIP]: () => {
                    const extract = require('extract-zip')

                    extract(sourcePath, { dir: targetDir }, (error) => {
                        if (error) {
                            return reject(error)
                        }
                        resolve(targetDir)
                    })
                },
                [handledExtensions.SEVENZIP]: async () => {
                    const sevenBin = require('7zip-bin')
                    const { extractFull } = require('node-7z')

                    const pathTo7zip = sevenBin.path7za
                    await extractFull(sourcePath, targetDir, {
                        $bin: pathTo7zip,
                    })
                    resolve(targetDir)
                },
            }
            const extension = path.parse(sourcePath).ext
            const extractFunction = extensions[extension]
            if (extractFunction) {
                extractFunction()
            } else {
                reject('Unhandled extension: ' + extension)
            }
        })
    },
    createArchive(paths) {},
}
