const { saveLog } = require('../utilities/log')
function getDirPattern(isInsideArchive, filterZip = true) {
    let pattern = '*'
    if (!isInsideArchive) {
        pattern = '*(!(*.*)'
        if (filterZip) {
            'rar, zip, 7z'.split(', ').forEach(ext => (pattern += `|*.${ext}`))
        } else {
            pattern += '|*.*'
        }
        pattern = pattern + ')'
    }
    return pattern
}
async function openFile(filePath) {
    const fs = require('fs-extra')
    const path = require('path')
    const { extractArchive } = require('../utilities/service')

    const filePathParsed = path.parse(filePath)
    const targetPath = path.resolve(process.env.TMP, `${filePathParsed.name}${filePathParsed.ext}`)
    const pathExists = await fs.pathExists(targetPath)
    if (pathExists) {
        return targetPath
    } else {
        return await extractArchive(filePath, targetPath)
    }
}

function getDirectoryFiles(dir, filterZipFiles, openedArchive) {
    const { getFileStats } = require('../utilities/file')
    const glob = require('glob')

    return new Promise((resolve, reject) => {
        glob(getDirPattern(openedArchive, filterZipFiles), { cwd: dir }, async (error, newFiles) => {
            files = await Promise.all(newFiles.map(async file => await getFileStats(file, dir)))
            if (error) {
                reject(error)
            }
            resolve(files)
        })
    })
}

async function readDir(targetDir, filterZipFiles, openedArchive) {
    const path = require('path')
    const fs = require('fs-extra')
    if (openedArchive) {
        if (targetDir.search(openedArchive) < 0) {
            openedArchive = false
        }
    }
    // --If target directory is a file
    const stat = await fs.stat(targetDir)
    const isFile = stat.isFile()
    if (isFile) {
        try {
            const archiveDir = await openFile(targetDir)
            const targetDirParsed = path.parse(targetDir)
            return await readDir(archiveDir, filterZipFiles, `${targetDirParsed.name}${targetDirParsed.ext}`)
        } catch (error) {
            saveLog('ERROR', 'open-file', error)
        }
    } else {
        // --
        let files

        try {
            files = await getDirectoryFiles(targetDir, filterZipFiles, openedArchive)
        } catch (error) {
            saveLog('ERROR', 'glob-read', error)
        }
        return { files, targetDir }
    }
}

module.exports = {
    readDir
}
