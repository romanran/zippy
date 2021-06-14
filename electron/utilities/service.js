const saveLog = require('./log')

module.exports = {
    extractArchive(sourcePath, targetDir) {
        const path = require('path')

        return new Promise((resolve, reject) => {
            const extensions = {
                '.zip': () => {
                    const extract = require('extract-zip')

                    extract(sourcePath, { dir: targetDir }, (error) => {
                        console.log('aaa poszlo zip', error)
                        if (error) {
                            return reject(error)
                        }
                        resolve(targetDir)
                    })
                },
                '.7z': () => {
                    const _7z = require('7zip-min')
                    _7z.unpack(sourcePath, targetDir, (error) => {
                        if (error) {
                            return reject(error)
                        }
                        resolve(targetDir)
                    })
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
}
