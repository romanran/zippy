<template>
    <li class="truncate file" :class="{ 'file--selected': selected }" @dblclick="$emit('doubleClick')">
        <div class="file__col icon"><i class="material-icons left" v-text="icon" v-if="file.type"></i></div>
        <div class="file__col name">
            <span>{{ file.name }}</span>
        </div>
        <div class="file__col size">
            <span>{{ file.display.size }}</span>
        </div>
        <div class="file__col time">
            <span>{{ file.display.time }}</span>
        </div>
    </li>
</template>
<script>
import { computed } from 'vue'
export default {
    props: {
        file: Object,
        selected: Boolean,
    },
    setup(props) {
        const icon = computed(() => {
            const icons = {
                archive: 'storage',
                folder: 'folder',
                file: 'file',
            }
            return icons[props.file.type]
        })
        return {
            icon,
        }
    },
}
</script>

<style lang="scss">
$accent: teal;
.file {
    color: #444;
    font-size: 13px;
    letter-spacing: 0.5px;
    font-family: Roboto;
    display: table-row;

    transition: background 150ms ease;
    user-select: none;
    &:hover {
        background: rgba(black, 10%);
    }
}
.file--selected {
    background: rgba($accent, 10%);
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
