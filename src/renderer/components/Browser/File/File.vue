<template>
    <li class="truncate file" v-if="!file.hidden" @click="$emit('click')">
        <div class="file__col icon"><i class="material-icons left" v-text="file.type" v-if="file.type"></i></div>
        <div class="file__col name" v-if="file.display"><span>{{file.name}}</span></div>
        <div class="file__col size" v-if="file.display"><span>{{file.display.size}}</span></div>
        <div class="file__col time" v-if="file.display"><span>{{file.display.time}}</span></div>
    </li>
</template>
<script>
    export default {
        name: 'Browser',
        props: {
            file: Object
        },
        data: () => {
            return {
            }
        },
        methods: {

        },
        created() {
            deb('created', this.file)
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