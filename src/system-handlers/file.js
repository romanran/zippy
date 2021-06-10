function getDisplayStats(stats) {
    const { format } = require('date-fns')
    const prettyBytes = require('pretty-bytes')

    return {
        size: stats.size ? prettyBytes(stats.size) : '',
        time: format(stats.mtime, 'yyyy/MM/dd HH:mm')
    }
}
module.exports = {
    async getFileStats(file, currentDir) {
        if (file === '../') {
            return {
                type: ''
            }
        }
        const path = require('path')
        const fs = require('fs-extra')
        const { clone } = require('lodash')
        const fullPath = path.resolve(currentDir, file)
        try {
            const data = await fs.stat(fullPath)
            const dataStats = clone(data)
            dataStats.mtime = data.mtime.getTime()
            dataStats.atime = data.atime.getTime()
            dataStats.ctime = data.ctime.getTime()
            return {
                type: data.isDirectory() ? 'folder' : 'storage',
                name: file,
                data: dataStats,
                hidden: 0,
                fullPath: fullPath,
                display: getDisplayStats(data)
            }
        } catch (err) {
            console.warn(err)
            return {
                type: 'lock',
                hidden: true
            }
        }
    },
    getDisplayStats,
    renameDir(file) {
        console.log(file)
    }
}
