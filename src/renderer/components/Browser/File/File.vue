<template>
    <li class="truncate file" v-if="!hide" @click="$emit('readDir')">
        <div class="file__col icon"><i class="material-icons left" v-text="type" v-if="type"></i></div>
        <div class="file__col name"><span>{{name}}</span></div>
        <div class="file__col size"><span>{{displayStats.size}}</span></div>
        <div class="file__col time"><span>{{displayStats.time}}</span></div>
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
                displayStats: Object,
                hide: false
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
                        this.hide = true
                    })
            },
            assignStats(stats) {
                this.stats = stats
                if (stats.mode === 16822) {
                    this.hide = true
                }
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
    .btn-flat {
        text-transform: none;
    }
    @accent: teal;
    .file {
        color: #444;
        font-size: 13px;
        cursor: pointer;
        letter-spacing: 0.5px;
        font-family: Roboto;
        transition :all 200ms ease;
        display: table-row;
        &:nth-child(2n + 1) {
            background: fade(teal, 5%)
        }
        &:hover {
            color: @accent;
            text-decoration: underline;
        }
    }

    .file__col {
        &:first-child {
            padding-left: 20px;
        }
        &:last-child {
            padding-right: 20px;
        }
        display: table-cell;
        padding: 10px 5px;
        vertical-align: middle;
    }
    .time {
        width: 125px;
    }
    .icon {
        width: 10px;
    }

</style>