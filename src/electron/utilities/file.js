function getDisplayStats(stats) {
    const { format } = require('date-fns')
    const prettyBytes = require('pretty-bytes')

    return {
        size: stats.size ? prettyBytes(stats.size) : '',
        time: format(stats.mtime, 'yyyy/MM/dd HH:mm'),
    }
}
const { handledExtensions } = require('./service')

module.exports = {
    async getFileStats(file, currentDir) {
        if (file === '../') {
            return {
                type: '',
            }
        }
        const path = require('path')
        const fs = require('fs-extra')
        const { clone, find } = require('lodash')
        const fullPath = path.resolve(currentDir, file)
        try {
            const data = await fs.stat(fullPath)
            const dataStats = clone(data)
            dataStats.mtime = data.mtime.getTime()
            dataStats.atime = data.atime.getTime()
            dataStats.ctime = data.ctime.getTime()
            const extension = path.parse(file).ext
            let type = 'folder'
            if (!data.isDirectory()) {
                if (!!find(handledExtensions, (value) => value === extension)) {
                    type = 'archive'
                } else {
                    type = 'file'
                }
            }
            return {
                type,
                name: file,
                data: dataStats,
                fullPath: path.normalize(fullPath),
                display: getDisplayStats(data),
            }
        } catch (err) {
            console.warn(err)
            return null
        }
    },
    getDisplayStats,
    renameDir(file) {
        console.log(file)
    },
}
