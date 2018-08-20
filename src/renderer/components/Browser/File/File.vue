<template>
    <li
        class="truncate btn-flat waves-effect waves-teal file"
    >
    <i class="material-icons left" v-text="type" v-if="type"></i>
    <span class="file__name">{{name}}</span>
    <span class="file__size">{{displayStats.size}}</span>
    <span class="file__modified">{{displayStats.time}}</span>
    </li>
</template>
<script>
    import fs from 'fs-extra'
    import path from 'path'
    import _ from 'lodash'
    import prettyBytes from 'pretty-bytes'
    import moment from 'moment'
    export default {
        name: 'Browser',
        props: {
            name: String
        },
        data: () => {
            return {
                type: 'loading',
                stats: Object,
                displayStats: Object
            }
        },
        methods: {
            getStats(file) {
                if (file === '../') {
                    return this.type = ''
                }
                fs.stat(path.resolve(this.$store.state.Browser.curr_dir, file))
                    .then(data => {
                        console.log(data)
                        this.type =  data.isDirectory() ? 'folder' : 'storage'
                        this.assignStats(data) 
                    })
                    .catch(err => {
                        console.log(err)
                        this.type = 'lock'
                    })
            },
            assignStats(stats) {
                this.stats = stats
                this.displayStats = {
                    size: stats.size ? prettyBytes(stats.size) : '',
                    time: moment(stats.mtime).format('YYYY/MM/DD HH:mm')
                }
            }
        },
        created() {
            console.log(this.name, this.$store.state.Browser.curr_dir);
            this.getStats(this.name)
        }
    }
</script>

<style lang="less">
    .file {
        width: 100%;
    }
    .btn-flat {
        text-transform: none;
    }
    @accent: teal;
    a {
        &:hover {
            color: @accent;
            text-decoration: underline;
        }
    }


</style>