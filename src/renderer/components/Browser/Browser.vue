<template>
    <div class="max-height">
        <div class="browser">
            <aside class="browser__drivelist">
                <ul>
                    <li v-for="drive in drives" v-bind:class="{loading: loading}">
                        <a
                                @click="readDir(drive)"
                                class="truncate btn-flat waves-effect waves-teal"
                        ><i class="material-icons left">desktop_windows</i>{{drive}}</a>
                    </li>
                </ul>
            </aside>
            <main class="browser__main" v-bind:class="{loading: loading}">
                <div class="section">
                    <a class="btn-flat waves-effect waves-teal" @click="readDir(prev_dir)"><i class="material-icons left">history</i><span>Previous</span></a>
                    <div class="divider"></div>
                    <ul>
                        <li v-for="file in files">
                            <a
                                    @click="readDir(file)"
                                    class="truncate btn-flat waves-effect waves-teal"
                            ><i class="material-icons left" v-text="getType(file)"></i>{{file}}</a>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
        <div class="loader-wrap center-align" v-bind:class="{loading: loading}">
            <div class="preloader-wrapper big active">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
                </div>
            </div>
            <p class="flow-text">Opening the archive...</p>
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

    export default {
        name: 'Browser',
        data: () => {
            return {
                prev_dir: process.env.HOMEPATH,
                curr_dir: process.env.HOMEPATH,
                files: null,
                drives: null,
                loading: 0,
                inside_archive: 0,
                archive_location: null
            }
        },
        methods: {
            readDir: function (dir, inside_archive) {
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
                        this.curr_dir = target_dir + '/' + this.inside_archive //refactor this part
                    }
                }

                try {
                    const stat = fs.statSync(target_dir)
                    if (stat.isFile()) {
                        this.loading = 1;
                        openFile(target_dir)
                            .then(dir => this.readDir(dir, path.parse(dir).name))
                        return false;
                    }
                } catch (err) {
//                        console.warn(err)
                }

                if (dir === '/' || ((_.isEmpty(curr_dir_parsed.base) || curr_dir_parsed.base === '..') && dir === '../')) {
                    this.files = this.drives
                    this.prev_dir = this.curr_dir
                    this.curr_dir = '/';
                } else {
                    deb(this.curr_dir, dir, target_dir, path.resolve(this.curr_dir, dir))
                    glob(getDirPattern(this.inside_archive), {cwd: target_dir}, (err, files) => {
                        files = _.concat('../', files)
                        if (err) return this.showError(err)
                        this.prev_dir = this.curr_dir
                        this.curr_dir = path.resolve(this.curr_dir, dir)
                        this.files = files
                        this.loading = 0
                    })
                }
            },
            showError(err) {
                console.warn(err)
            },
            getType(file) {
                if (file === '../') {
                    return ''
                }
                try {
                    file = fs.statSync(path.resolve(this.curr_dir, file))
                } catch (err) {
                    console.log(err)
                    return 'lock'
                }
                return file.isDirectory() ? 'folder' : 'storage';
            },
            sort(type) {
                switch (type) {
                    case 'name':
                        this.files = _.sortBy(this.files, file)
                        break;
                    case 'type':
                        this.files = _.sortBy(this.files, file)
                        break;
                    case 'time':
                        this.files = _.sortBy(this.files, file)
                        break;
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

<style scoped>
    .btn-flat {
        text-transform: none;
    }
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
    .browser__main {
        display: inline-block;
        vertical-align: top;
        width: calc(100% - 150px);
        opacity: 1;
        transition: opacity 250ms ease;
    }
    .loading {
        opacity: 0;
    }
    a:hover {
         color: teal;
        text-decoration: underline;
    }
    .center-align {
        width: 100%;
    }
    .loader-wrap {
        transition: opacity 250ms ease;
        opacity: 0;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
    }
    .loader-wrap.loading {
        opacity: 1
    }
    /* CSS */
</style>
