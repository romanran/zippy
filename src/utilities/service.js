import path from 'path'
import extract from 'extract-zip'
import fs from 'fs-extra'
import _7zip from '7zip'
import glob from 'glob'

const _7z = _7zip['7z']

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
    return new Promise((resolve, reject) => {
        const extensions = {
            '.zip': () => {
                extract(sourcePath, { dir: targetDir }, function(err) {
                    if (err) console.warn(err)
                    resolve(targetDir)
                })
            },
            '.7z': () => {
                const spawn = require('child_process').spawn
                const sevenZip = spawn(_7z, ['x', sourcePath, '-y', '-o' + targetDir])
                sevenZip.on('close', code => {
                    resolve(targetDir)
                })
                sevenZip.stdout.on('data', data => {
                    console.log('data', data)
                })
                sevenZip.stderr.on('data', data => {
                    console.log('stderr: ' + data)
                })
            }
        }
        extensions[path.parse(sourcePath).ext]()
    })
}

export async function openFile(file_path) {
    const file_path_parsed = path.parse(file_path)
    const target_path = path.resolve(process.env.TMP, file_path_parsed.name)
    const exists = await fs.pathExists(target_path)
    if (exists) {
        return target_path
    }
    return extractArchive(file_path, target_path)
}

export async function handleExtracted(target) {
    glob(target + '/*', async (err, files) => {
        if (files.length !== 1) {
            return
        }
        // const stats = await fs.stat(files[0])
        await fs.move(files[0], target)
    })
}
