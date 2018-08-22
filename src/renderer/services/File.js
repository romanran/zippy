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
    return fs.stat(path.resolve(curr_dir, file))
        .then(data => {
            return {
                type: data.isDirectory() ? 'folder' : 'storage',
                name: file,
                data: data,
                hidden: 0,
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