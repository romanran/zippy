const saveLog = require('./log')
export function getDirPattern(insideArchive, filterZip = true) {
    let pattern = '*'
    if (insideArchive) {
        return pattern
    }
    pattern = '*(!(*.*)'
    if (filterZip) {
        'rar, zip, 7z'.split(', ').forEach(ext => (pattern += `|*.${ext}`))
    } else {
        pattern += '|*.*'
    }
    pattern = pattern + ')'
    return pattern
}

export function getWinDrives() {
    return new Promise((resolve, reject) => {
        let stdout = ''
        const spawn = require('child_process').spawn,
            list = spawn('cmd')

        list.stdout.on('data', function(data) {
            stdout += data
        })

        list.stderr.on('data', function(data) {
            console.log('stderr: ' + data)
        })

        list.on('exit', function(code) {
            if (code !== 0) {
                return reject('child process exited with code ' + code)
            }
            let data = stdout.split('\r\n')
            data = data.splice(4, data.length - 7)
            data = data.map(Function.prototype.call, String.prototype.trim)
            resolve(data)
        })
        list.stdin.write('wmic logicaldisk get caption\n')
        list.stdin.end()
    })
}

export function extractArchive(sourcePath, targetDir) {
    const path = require('path')

    return new Promise((resolve, reject) => {
        const extensions = {
            '.zip': () => {
                const extract = require('extract-zip')

                extract(sourcePath, { dir: targetDir }, error => {
                    if (error) {
                        return reject(error)
                    }
                    resolve()
                })
            },
            '.7z': () => {
                const _7z = require('7zip-min')
                _7z.unpack(sourcePath, targetDir, error => {
                    if (error) {
                        return reject(error)
                    }
                    resolve()
                })
            }
        }
        const extension = path.parse(sourcePath).ext
        const extractFunction = extensions[extension]
        if (extractFunction) {
            return extractFunction()
        } else {
            reject('Unhandled extension: ' + extension)
        }
    })
}

export async function openFile(filePath) {
    const fs = require('fs-extra')
    const path = require('path')

    const filePath_parsed = path.parse(filePath)
    const targetPath = path.resolve(process.env.TMP, filePath_parsed.name)
    const exists = await fs.pathExists(targetPath)
    if (exists) {
        return targetPath
    }
    try {
        await extractArchive(filePath, targetPath)
    } catch (error) {
        saveLog('ERROR', 'extraction', error)
    }
}

export async function handleExtracted(target) {
    const fs = require('fs-extra')
    const glob = require('glob')
    glob(target + '/*', async (err, files) => {
        if (files.length !== 1) {
            return
        }
        // const stats = await fs.stat(files[0])
        await fs.move(files[0], target)
    })
}
