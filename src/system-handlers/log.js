const fs = require('fs-extra')
const { format } = require('date-fns')
const os = require('os')
const { unset } = require('lodash')

module.exports = {
    async saveLog(type, name, error) {
        try {
            console.warn(type, name, error)

            const logfileName = format(new Date(), 'yyyy-MM-dd')
            const rootDir = process.env.NODE_ENV !== 'production' ? 'W:/Projects' : `${os.homedir()}/AppData/Roaming`
            const logDir = `${rootDir}/zippy/logs/`
            const logPath = `${logDir}${logfileName}.log`
            let errorMessage
            if (typeof error === 'string') {
                errorMessage = error
            } else {
                const errorWithoutStack = unset(error, 'stack')
                errorMessage = JSON.stringify(errorWithoutStack)
            }
            const errorString = `${type}_${name}: ${errorMessage} \r\n`

            const exists = await fs.pathExists(logDir)
            if (exists) {
                await fs.appendFile(logPath, errorString)
            } else {
                await fs.writeFile(logPath, errorString)
            }
        } catch (error) {
            // ¯\_(ツ)_/¯
            console.warn(error)
        }
    }
}
