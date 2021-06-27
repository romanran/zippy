const handledExtensions = {
    ZIP: '.zip',
    SEVENZIP: '.7z',
}

module.exports = {
    handledExtensions,
    extractArchive(sourcePath, targetDir, password) {
        const path = require('path')

        return new Promise((resolve, reject) => {
            const extensions = {
                [handledExtensions.ZIP]: async () => {
                    const fs = require('fs-extra')
                    const unzipper = require('unzipper')
                    const directory = await unzipper.Open.file(sourcePath)
                    directory.files.forEach(async (file) => {
                        const extracted = password ? await file.buffer(password) : await file.buffer()
                        fs.writeFile(`${targetDir}/${file.path}`, extracted)
                    })
                },
                [handledExtensions.SEVENZIP]: async () => {
                    const sevenBin = require('7zip-bin')
                    const { extractFull } = require('node-7z')

                    const pathTo7zip = sevenBin.path7za
                    await extractFull(sourcePath, targetDir, {
                        $bin: pathTo7zip,
                        password,
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
    createArchive(paths, extension, password) {
        return new Promise((resolve, reject) => {
            const path = require('path')
            const targetDir = path.parse(paths[0]).dir
            const dirArray = targetDir.split('\\')
            const zipPath = `${targetDir}\\${dirArray[dirArray.length - 1]}${extension}`

            const extensions = {
                [handledExtensions.ZIP]: async () => {
                    const archiver = require('archiver')
                    archiver.registerFormat('zip-encrypted', require('archiver-zip-encrypted'))

                    const fs = require('fs-extra')
                    const output = fs.createWriteStream(zipPath)
                    output.on('end', () => resolve())
                    let archive
                    if (password) {
                        archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password })
                    } else {
                        archive = archiver.create('zip', { zlib: { level: 8 } })
                    }
                    archive.pipe(output)
                    paths.forEach(async (filePath) => {
                        const pathParsed = path.parse(filePath)
                        archive.append(fs.createReadStream(filePath), { name: `${pathParsed.name}${pathParsed.ext}` })
                    })
                    archive.finalize()
                },
                [handledExtensions.SEVENZIP]: async () => {
                    const sevenBin = require('7zip-bin')
                    const { add } = require('node-7z')
                    const pathTo7zip = sevenBin.path7za
                    await add(zipPath, paths, {
                        $bin: pathTo7zip,
                        password: password ? password : undefined,
                    })
                },
            }
            const zipFunction = extensions[extension]
            if (zipFunction) {
                zipFunction()
            } else {
                reject('Unhandled extension: ' + extension)
            }
        })
    },
}
