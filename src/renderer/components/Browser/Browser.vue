<template>
    <div class="max-height">
        <div class="browser">
            <aside class="browser__drivelist z-depth-2">
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
                    <a class="btn-flat waves-effect waves-teal" @click="readDir(prev_dir)">
                        <i class="material-icons left">history</i><span>Previous</span>
                    </a>
                    <a 
                        class="btn-flat waves-effect waves-teal" 
                        @click="filter_zip = !filter_zip; readDir(curr_dir)"
                        :class="{teal: filter_zip}"
                    >
                        <i class="material-icons left">content_cut</i><span>Filter zip</span>
                    </a>
                    <div class="divider"></div>
                    <div class="sort-bar z-depth-1">
                        <div class="sort-row">
                            <div
                                class="btn-flat waves-effect waves-teal sort"
                                v-for="(val, type) in sort" 
                                :key="type"
                                @click="handleSortDirection(type); sortFiles()">
                                {{type}}
                                <i class="material-icons right" v-if="val.direction === 'asc'">arrow_drop_up</i>
                                <i class="material-icons right" v-if="val.direction === 'desc'">arrow_drop_down</i>
                                <i class="material-icons right" v-if="val.direction !== 'desc' && val.direction !== 'asc'">remove</i>
                                </div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div 
                        class="btn-flat waves-effect waves-teal parent_dir" 
                        @click="readDir('../')"
                        v-if="show_prev">
                        ../
                    </div>
                    <div class="files-wrap">
                        <ul class="files">
                            <file 
                                v-for="file in files" 
                                :key="file.name" 
                                :file="file" 
                                @click="readDir(file.name)"
                                @right-click="$refs.menu.open">
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
        <vue-context ref="menu">
            <ul slot-scope="child">
                <li @click="rename(child.data)">Rename</li>
                <li v-if="child.data && child.data.type==='storage'" @click="unzip($event, child.data)">Unzip</li>
            </ul>
        </vue-context>
        <div ref="renameModal" class="modal">
            <div class="modal-content">
                <input type="text"/>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-red btn-flat">Cancel</a>
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Accept</a>
            </div>
        </div>
    </div>
</template>

<script>
    import fs from 'fs-extra'
    import glob from 'glob'
    import async from 'async'
    import path from 'path'
    import _ from 'lodash'
    import {getDirPattern, getWinDrives, openFile, extractArchive, handleExtracted} from '@/services/Service'
    import {getFileStats, renameDir} from '@/services/File'
    import File from './File/File'
    import { VueContext } from 'vue-context'
    import storage from 'electron-json-storage'

    export default {
        name: 'Browser',
        components: {File, VueContext},
        data: () => {
            return {
                prev_dir: path.resolve(process.env.HOME),
                curr_dir: path.resolve(process.env.HOME),
                files: Array,
                drives: Array,
                loading: 0,
                inside_archive: 0,
                archive_location: String,
                show_prev: true,
                filter_zip: true,
                sort_type: 'name',
                sort: {
                    name: {direction: 'asc'}, 
                    size: {direction: ''}, 
                    time: {direction: ''} 
                }
            }
        },
        methods: {
            rename() {
                $(this.$refs.renameModal).modal()
                $(this.$refs.renameModal)[0].M_Modal.open()
            },
            async unzip(e, file) {
                const [from, target] = [path.resolve(this.curr_dir, file.name), path.resolve(this.curr_dir, path.parse(file.name).name)]
                const exists = await fs.pathExists(target)
                await extractArchive(from, target)
                handleExtracted(target)
                if (!exists) {
                    const file_statted = await getFileStats(path.parse(file.name).name, this.curr_dir)
                    this.files.push(file_statted)
                    this.sortFiles()
                }
            },
            readDir: async function(dir, inside_archive) {
                let target_dir = path.resolve(this.curr_dir, dir)
                document.title = target_dir
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

                // --If target directory is a file
                try {
                    this.loading = 1
                    const stat = fs.statSync(target_dir)
                    if (stat.isFile()) {
                        await openFile(target_dir)
                            .then(dir => {
                                this.loading = 0
                                this.readDir(dir, path.parse(dir).name)
                            })
                        return false;
                    } else {
                        this.loading = 0
                    }
                } catch (err) {
                }
                // --

                if (dir === '/' || ((_.isEmpty(curr_dir_parsed.base) || curr_dir_parsed.base === '..') && dir === '../')) {
                    this.files = this.drives
                    this.prev_dir = this.curr_dir
                    this.curr_dir = '/';
                    this.$store.commit('setCWD', this.curr_dir)
                } else {
                    // deb(this.curr_dir, dir, target_dir, path.resolve(this.curr_dir, dir))
                    await glob(getDirPattern(this.inside_archive, this.filter_zip), {cwd: target_dir}, async (err, files) => {
                        files =  await Promise.all(_.map(files, async file => await getFileStats(file, target_dir)))
                        this.prev_dir = this.curr_dir
                        this.curr_dir = path.resolve(this.curr_dir, dir)
                        this.$store.commit('setCWD', this.curr_dir)
                        if (err) return this.showError(err)
                        this.files = files
                        this.sortFiles()
                        this.loading = 0
                    })
                }
                this.show_prev = path.parse(target_dir).root !== target_dir
            },
            showError(err) {
                console.warn(err)
            },
            sortFiles() {
                const type = this.sort_type
                const sort_mode = {
                    name: 'name',
                    size: 'data.size',
                    time: 'data.mtime'
                }

                _.forEach(this.sort, (o, key) => {
                    key === type || (this.sort[key].direction = '')
                })

                this.files = _.orderBy(this.files, sort_mode[type], this.sort[type].direction)
            },
            handleSortDirection(type) {
                let dir = ''
                switch (this.sort[type].direction) { 
                    case 'asc': 
                        dir = 'desc'
                        break
                    case 'desc': 
                        dir = 'asc'
                        break
                    default :
                        dir = 'desc'
                        break
                }
                this.sort[type].direction = dir
                this.sort_type = type
            }
        },
        created() {
            getWinDrives()
                .then(drives => {
                    drives = drives.map(drive => drive + '\\')
                    this.drives = drives
                })
                .catch(err => this.showError(err))
            storage.get('curr_dir', (error, data) => {
                if (error) throw error;
                this.curr_dir = data
                this.readDir(this.curr_dir)
            });
        }
    }
</script>

<style lang="less">
    .teal {
        color: white;
    }
    .btn-flat {
        text-transform: none;
        transition: background 150ms ease;
        &:hover {
            background: fade(black, 10%)
        }
    }
    .parent_dir {
        width: 100%;
    }
    .browser {
        font-size: 0;
        overflow: hidden;
        border-top: 1px solid #DDD;
        height: calc(~"100vh - 1px");
    }

    .browser__drivelist {
        background: white;
        display: inline-block;
        vertical-align: top;
        width: 150px;
        padding-top: 20px;
        min-height: 100vh;
        opacity: 1;
        z-index: 2;
        position: relative;
        transition: opacity 250ms ease;
    }

    .browser__drive {
        width: 100%;        
    }

    .browser__main {
        display: inline-block;
        vertical-align: top;
        width: calc(~"100% - 150px");
        opacity: 1;
        z-index: 1;
        position: relative;
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
        max-height: calc(~"100vh - 106px");
        .parent_dir + & {
            max-height: calc(~"100vh - 140px");
        }
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

    .v-context {
        border-radius: 4px;
        background: white;
        box-shadow: 0 8px 17px 2px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2) !important;
        outline: none;
    }
</style>
