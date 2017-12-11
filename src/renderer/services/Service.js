const path = require('path')

export const getDirPattern = (curr_dir) => {
    let pattern = '*(!(*.*)'
    'rar, zip'.split(', ').forEach(ext => pattern = pattern + `|*.${ext}`)
    return pattern + ')'
}
