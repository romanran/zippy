import fs from 'fs-extra'
import { format } from 'date-fns'
import os from 'os'
export function saveLog(type, name, error) {
    return new Promise(async (resolve, reject) => {
        try {
            const logfileName = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
            const rootDir = process.env.NODE_ENV !== 'production' ? 'W:/Projects' : `${os.homedir()}/AppData/Roaming`
            const logDir = `${rootDir}/zippy/logs/`
            let errorString = typeof error === 'string' ? error : JSON.stringify(error)
            await fs.ensureDir(logDir)
            await fs.writeFile(`${logDir}${logfileName}_${type}_${name}.log`, errorString)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}
