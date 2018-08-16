import path from 'path'
import extract from 'extract-zip'
import fs from 'fs-extra'
import _7zip from '7zip'

const _7z = _7zip['7z']

export const getDirPattern = (inside_archive) => {
    let pattern = '*'
    // deb('!inside', !inside_archive)
    if (!inside_archive) {
        pattern = '*(!(*.*)';
        'rar, zip, 7z'.split(', ').forEach(ext => pattern = pattern + `|*.${ext}`)
        pattern = pattern + ')'
    }
    return pattern
}

export const getWinDrives = () => {
    return new Promise((resolve, reject) => {
        let stdout = '';
        const spawn = require('child_process').spawn,
            list = spawn('cmd');

        list.stdout.on('data', function (data) {
            stdout += data;
        });

        list.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        list.on('exit', function (code) {
            if (code == 0) {
                var data = stdout.split('\r\n');
                data = data.splice(4, data.length - 7);
                data = data.map(Function.prototype.call, String.prototype.trim);
                resolve(data);
            } else {
                reject('child process exited with code ' + code);
            }
        });
        list.stdin.write('wmic logicaldisk get caption\n');
        list.stdin.end();
    })
}

const extractArchive = (source_path, target_dir) => {
    return new Promise((resolve, reject) => {
        switch (path.parse(source_path).ext) {
            case '.zip':
                extract(source_path, {dir: target_dir}, function (err) {
                    if (err) console.warn(err)
                    resolve(target_dir)
                })
                break
            case '.7z':
                const spawn = require('child_process').spawn
                const seven_zip = spawn(_7z, ['x', source_path, '-y', '-o' + target_dir])
                seven_zip.on('close', function (code) {
                    resolve(target_dir)
                    deb('sad')
                });
                seven_zip.stdout.on('data', function (data) {
                    deb(data)
                });
                seven_zip.stderr.on('data', function (data) {
                    console.log('stderr: ' + data);
                });
        
                break;
        }
    })
}

export const openFile = (file_path) => {
    const file_path_parsed = path.parse(file_path)
    const target_path = path.resolve(process.env.TMP, file_path_parsed.name)
    return new Promise((resolve, reject) => {
        extractArchive(file_path, target_path)
            .then(() => resolve(target_path))
    })
}