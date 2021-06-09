import path from 'path'
import { extractArchive } from '@/utilities/service'
import { saveLog } from '../utilities/log'

export async function handleFile(filePath) {
    const targetDir = path.parse(filePath).dir
    try {
        await extractArchive(filePath, targetDir)
    } catch (error) {
        saveLog('ERROR', 'extraction', error)
    }
}
