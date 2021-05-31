import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import prettyBytes from 'pretty-bytes'
import { format } from 'date-fns'

export async function getFileStats(file, currentDir) {
    if (file === '../') {
        return {
            type: ''
        }
    }
    const fullPath = path.resolve(currentDir, file)
    try {
        const data = await fs.stat(fullPath)
        data => {
            const data_stats = _.clone(data)
            data_stats.mtime = data.mtime.getTime()
            data_stats.atime = data.atime.getTime()
            data_stats.ctime = data.ctime.getTime()
            return {
                type: data.isDirectory() ? 'folder' : 'storage',
                name: file,
                data: data_stats,
                hidden: 0,
                fullPath: fullPath,
                display: getDisplayStats(data)
            }
        }
    } catch (err) {
        console.warn(err)
        return {
            type: 'lock',
            hidden: true
        }
    }
}

function getDisplayStats(stats) {
    return {
        size: stats.size ? prettyBytes(stats.size) : '',
        time: format(stats.mtime, 'YYYY/MM/DD HH:mm')
    }
}

export function renameDir(file) {}
