import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import prettyBytes from 'pretty-bytes'
import moment from 'moment'
export async function getFileStats(file, curr_dir) {
    if (file === '../') {
        return {
            type: ''
        }
    }
    const full_path = path.resolve(curr_dir, file)
    return fs.stat(full_path)
        .then(data => {
            const data_stats = _.clone(data)
            data_stats.mtime = data.mtime.getTime()
            data_stats.atime = data.atime.getTime()
            data_stats.ctime = data.ctime.getTime()
            return {
                type: data.isDirectory() ? 'folder' : 'storage',
                name: file,
                data: data_stats,
                hidden: 0,
                full_path: full_path,
                display: getDisplayStats(data)
            }
        })
        .catch(err => {
            console.warn(err)
            return {
                type: 'lock',
                hidden: true
            }
        })
}

function getDisplayStats(stats) {
    return {
        size: stats.size ? prettyBytes(stats.size) : '',
        time: moment(stats.mtime).format('YYYY/MM/DD HH:mm')
    }
}

export function renameDir(file) {
    deb(file)
}