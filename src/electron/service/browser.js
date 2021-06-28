const { saveLog } = require('../utilities/log')

async function openFile(filePath) {
    const fs = require('fs-extra')
    const path = require('path')
    const { extractArchive } = require('../utilities/service')

    const targetPath = path.resolve(process.env.TMP)
    return await extractArchive(filePath, targetPath)
}

function getDirectoryFiles(dir) {
    const { getFileStats } = require('../utilities/file')
    const glob = require('glob')

    return new Promise((resolve, reject) => {
        glob(`*(!($RECYCLE.BIN))`, { cwd: dir }, async (error, newFiles) => {
            files = await Promise.all(newFiles.map(async (file) => await getFileStats(file, dir)))
            files = files.filter((file) => !!file)
            if (error) {
                reject(error)
            }
            resolve(files)
        })
    })
}
async function handleFile(fileDir) {
    const path = require('path')
    const { handledExtensions } = require('../utilities/service')

    const fileExtension = path.extname(fileDir)
    if (Object.values(handledExtensions).includes(fileExtension)) {
        try {
            const archiveDir = await openFile(fileDir)
            return await readDir(archiveDir)
        } catch (error) {
            saveLog('ERROR', 'open-file', error)
            return { error }
        }
    } else {
        const shell = require('electron').shell

        shell.openPath(fileDir)
        return {
            targetDir: fileDir,
            handledDefault: true,
        }
    }
}

async function readDir(targetDir) {
    const fs = require('fs-extra')
    // --If target directory is a file
    const targetStat = await fs.stat(targetDir)
    const isFile = targetStat.isFile()
    if (isFile) {
        return await handleFile(targetDir)
    } else {
        // --
        let files, error

        try {
            files = await getDirectoryFiles(targetDir)
        } catch (dirError) {
            error = dirError
            saveLog('ERROR', 'glob-read', dirError)
        }
        return { files, targetDir, error }
    }
}

module.exports = {
    readDir,
}
