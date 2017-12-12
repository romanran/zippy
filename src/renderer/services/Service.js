const path = require('path')

export const getDirPattern = (curr_dir) => {
    let pattern = '*(!(*.*)'
    'rar, zip'.split(', ').forEach(ext => pattern = pattern + `|*.${ext}`)
    return pattern + ')'
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