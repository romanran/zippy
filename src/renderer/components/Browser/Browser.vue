<template>
    <main class="container">
        <div class="section">
        <a  @click="readDir(prev_dir)">Previous</a>
        <div class="divider"></div>
        <ul>
            <li v-for="file in files">
                <a href="#" @click="readDir(file)" class="truncate btn-flat btn-small waves-effect waves-teal ">{{ file }}</a>
            </li>
        </ul>
        </div>
    </main>
</template>

<script>
    const fs = require('fs-extra')
    const glob = require('glob')
    const async = require('async')
    const path = require('path')
    const _ = require('lodash')
    import {getDirPattern} from '@/services/Service'

    export default {
        name: 'Browser',
        data: () => {
            return {
                curr_dir: process.env.HOMEPATH,
                files: null
            }
        },
        methods: {
            readDir: function(dir) {
                if (dir) {
                    this.prev_dir = this.curr_dir
                    this.curr_dir = path.resolve(this.curr_dir, dir)
                }
                glob(getDirPattern(), {cwd: this.curr_dir}, (err, files) => {
                    files = _.concat('../', files)
                    if (err) {
                        this.curr_dir = this.prev_dir
                        return this.showError(err)
                    } else {
                        this.files = files
                    }
                })
            },
            showError(err) {
                console.warn(err)
            }
        },
        created() {
            this.readDir()
        },
        watch: {
            $route: 'readDir'
        },
    }
</script>

<style scoped>
    .btn-flat {
        text-transform: none;
    }
    /* CSS */
</style>
