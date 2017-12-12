<template>
    <div class="container">
        <div class="row">
            <aside class="side-nav col s3 m2">
                <ul>
                    <li v-for="drive in drives">
                        <a
                                @click="readDir(drive)"
                                class="truncate btn-flat waves-effect waves-teal"
                        ><i class="material-icons left">desktop_windows</i>{{drive}}</a>
                    </li>
                </ul>
            </aside>
            <main class="col s7 m10">
                <div class="section">
                    <a class="btn-flat waves-effect waves-teal" @click="readDir(prev_dir)">Previous</a>
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
    </div>
</template>

<script>
    const fs = require('fs-extra')
    const glob = require('glob')
    const async = require('async')
    const path = require('path')
    const _ = require('lodash')
    import {getDirPattern, getWinDrives} from '@/services/Service'

    export default {
        name: 'Browser',
        data: () => {
            return {
                prev_dir: process.env.HOMEPATH,
                curr_dir: process.env.HOMEPATH,
                files: null,
                drives: null
            }
        },
        methods: {
            readDir: function (dir) {
                const target_dir = path.resolve(this.curr_dir, dir)
                const curr_dir_parsed = path.parse(this.curr_dir);

                try {
                    const stat = fs.statSync(target_dir)
                    if (stat.isFile()) {
                        return false;
                    }
                } catch (err) {
//                        console.warn(err)
                }

                if ((_.isEmpty(curr_dir_parsed.base) || curr_dir_parsed.base === '..') && dir === '../') {
                    this.files = this.drives
                    this.prev_dir = this.curr_dir
                    this.curr_dir = '../';
                } else {
                    glob(getDirPattern(), {cwd: target_dir}, (err, files) => {
                        files = _.concat('../', files)
                        if (err) {
//                            this.curr_dir = this.prev_dir
                            return this.showError(err)
                        }
                        this.files = files
                        this.prev_dir = this.curr_dir
                        this.curr_dir = path.resolve(this.curr_dir, dir)
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
                    return 'lock';
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

    /* CSS */
</style>
