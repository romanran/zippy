const path = require('path')
const { extractArchive } = require('../utilities/service')
const { saveLog } = require('../utilities/log')

module.exports = {
    async handleFile(filePath) {
        const targetDir = path.parse(filePath).dir
        try {
            await extractArchive(filePath, targetDir, password)
        } catch (error) {
            saveLog('ERROR', 'extraction', error)
        }
    },
}
