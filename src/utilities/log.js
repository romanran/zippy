const fs = require('fs-extra')
const { format } = require('date-fns')
const os = require('os')

module.exports = {
    saveLog(type, name, error) {
        return new Promise(async (resolve, reject) => {
            try {
                console.warn(type, name, error)

                const logfileName = format(new Date(), 'yyyy-MM-dd')
                const rootDir = process.env.NODE_ENV !== 'production' ? 'W:/Projects' : `${os.homedir()}/AppData/Roaming`
                const logDir = `${rootDir}/zippy/logs/`
                const logPath = `${logDir}${logfileName}.log`

                const errorMessage = typeof error === 'string' ? error : JSON.stringify({ message: error.message, code: error.code })
                const errorString = `${type}_${name}: ${errorMessage} \r\n`

                const exists = await fs.pathExists(logDir)
                if (exists) {
                    await fs.appendFile(logPath, errorString)
                } else {
                    await fs.writeFile(logPath, errorString)
                }
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
}
