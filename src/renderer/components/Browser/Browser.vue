<template>
    <div class="max-height">
        <div class="browser">
            <aside class="browser__drivelist">
                <ul>
                    <li v-for="drive in drives" :class="{loading: loading}" :key="drive">
                        <a
                            @click="readDir(drive)"
                            class="truncate btn-flat waves-effect waves-teal browser__drive"
                        ><i class="material-icons left">desktop_windows</i>{{drive}}</a>
                    </li>
                </ul>
            </aside>
            <main class="browser__main" :class="{loading: loading}">
                <div class="section">
                    <a class="btn-flat waves-effect waves-teal" @click="readDir(prev_dir)"><i
                            class="material-icons left">history</i><span>Previous</span></a>
                    <div class="divider"></div>
                    <div class="sort-bar">
                        <div class="sort-row">
                            <div
                                class="btn-flat waves-effect waves-teal sort"
                                v-for="(val, type) in sort" 
                                :key="type"
                                @click="sortFiles(type)">{{type}}</div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div class="files-wrap">
                        <ul class="files">
                            <file 
                                v-for="file in files" 
                                :key="file.name" 
                                :file="file" 
                                @click="readDir(file.name)">
                            </file>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
        <div class="loader-wrap center-align" :class="{loading: loading}">
            <div class="preloader-wrapper big active">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
            <p class="flow-text">Opening the archive...</p>
            <!-- TODO: progress bar -->
        </div>
    </div>
</template>

<script>
    import fs from 'fs-extra'
    import glob from 'glob'
    import async from 'async'
    import path from 'path'
    import _ from 'lodash'
    import {getDirPattern, getWinDrives, openFile} from '@/services/Service'
    import {getFileStats} from '@/services/File'
    import File from './File/File'

    export default {
        name: 'Browser',
        components: {File},
        data: () => {
            return {
                prev_dir: process.env.HOMEPATH,
                curr_dir: process.env.HOMEPATH,
                files: Array,
                drives: Array,
                loading: 0,
                inside_archive: 0,
                archive_location: String,
                sort: {
                    name: {direction: 'asc'}, 
                    size: {direction: 'asc'}, 
                    time:{direction: 'asc'} 
                }
            }
        },
        methods: {
            readDir: async function(dir, inside_archive) {
                let target_dir = path.resolve(this.curr_dir, dir)
                const curr_dir_parsed = path.parse(this.curr_dir);

                if (inside_archive) {
                    this.inside_archive = inside_archive;
                    this.archive_location = this.curr_dir;
                }
                if (this.inside_archive) {
                    if (target_dir.search(this.inside_archive) < 0) {
                        this.inside_archive = 0
                        target_dir = this.archive_location
                        this.curr_dir = path.resolve(target_dir, this.inside_archive) //refactor this part
                    }
                }

                try {
                    this.loading = 1
                    const stat = fs.statSync(target_dir)
                    if (stat.isFile()) {
                        openFile(target_dir)
                            .then(dir => {
                                this.loading = 0
                                this.readDir(dir, path.parse(dir).name)
                            })
                        return false;
                    } else {
                        this.loading = 0
                    }
                } catch (err) {
//                        console.warn(err)
                }

                if (dir === '/' || ((_.isEmpty(curr_dir_parsed.base) || curr_dir_parsed.base === '..') && dir === '../')) {
                    this.files = this.drives
                    this.prev_dir = this.curr_dir
                    this.curr_dir = '/';
                    this.$store.commit('setCWD', this.curr_dir)
                } else {
                    // deb(this.curr_dir, dir, target_dir, path.resolve(this.curr_dir, dir))

                    glob(getDirPattern(this.inside_archive), {cwd: target_dir}, async (err, files) => {
                        files =  await Promise.all(_.map(files, async file => await getFileStats(file, target_dir)))
                        if (path.parse(target_dir).root !== target_dir) {
                            files = _.concat({
                                name: '../',
                                hidden: false
                            }, files)
                        }
                        this.prev_dir = this.curr_dir
                        this.curr_dir = path.resolve(this.curr_dir, dir)
                        this.$store.commit('setCWD', this.curr_dir)
                        if (err) return this.showError(err)
                        this.files = files
                        this.loading = 0
                    })
                }
            },
            showError(err) {
                console.warn(err)
            },
            sortFiles(type) {
                this.sort[type].direction = this.handleSortDirection(type)
                const sort_mode = {
                    name: 'name',
                    size: 'data.size',
                    time: 'data.mtime'
                }
                this.files = _.orderBy(this.files, sort_mode[type], this.sort[type].direction)
            },
            handleSortDirection(type) {
                switch (this.sort[type].direction) { 
                    case 'asc': 
                        return 'desc'
                        break
                    case 'desc': 
                        return ''
                        break
                    default :
                        return 'asc'
                        break
                }

            }
        },
        created() {
            getWinDrives()
                .then(drives => {
                    drives = drives.map(drive => drive + '\\')
                    this.drives = drives
                })
                .catch(err => this.showError(err))
            this.readDir(this.curr_dir)
        }
    }
</script>

<style lang="less">

    .browser {
        font-size: 0;
    }

    .browser__drivelist {
        display: inline-block;
        vertical-align: top;
        width: 150px;
        padding-top: 20px;
        opacity: 1;
        transition: opacity 250ms ease;
    }

    .browser__drive {
        width: 100%;
        &:hover {
            background: fade(black, 5%)
        }
    }

    .browser__main {
        display: inline-block;
        vertical-align: top;
        width: calc(~"100% - 150px");
        opacity: 1;
        transition: opacity 250ms ease;
        &.loading {
            opacity: 0
        }
    }

    .loader-wrap {
        opacity: 0;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        &.loading {
            z-index: 1;
            opacity: 1
        }
    }
    .center-align {
        width: 100%;
    }
    
    .files-wrap {
        max-height: calc(~"100vh - 104px");
        overflow: auto;
    }

    .files {
        display: table;
        width: 100%;
    }

    .sort-bar {
        display: table;
        width: 100%;
        border-collapse: collapse;
    }
    .sort-row {
        display: table-row;
    }
    .sort {
        display: table-cell;
    }
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1; 
    }

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888; 
    transition: background 200ms ease;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: rgb(110, 160, 160); 
}
</style>
