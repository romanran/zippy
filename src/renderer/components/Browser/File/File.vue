<template>
    <li 
        class="truncate file" 
        v-if="!file.hidden" 
        @click="$emit('click')"
        @contextmenu.prevent="$emit('right-click', $event, file)"
    >
        <div class="file__col icon"><i class="material-icons left" v-text="file.type" v-if="file.type"></i></div>
        <div class="file__col name"><span>{{file.name}}</span></div>
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

        }
    }
</script>

<style lang="less">
    @accent: teal;
    .file {
        color: #444;
        font-size: 13px;
        cursor: pointer;
        letter-spacing: 0.5px;
        font-family: Roboto;
        display: table-row;
        &:nth-child(2n + 1) {
            background: fade(teal, 5%)
        }
        transition: background 150ms ease;
        &:hover {
            background: fade(black, 10%)
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