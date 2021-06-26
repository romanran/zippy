<template>
    <div class="">
        <div class="context-menu z-depth-3" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
            <ul>
                <li class="context-menu__item" v-show="selectedFiles.length > 1" @click="$emit('change', 'zip')">Zip</li>
                <li class="context-menu__item" v-show="hasArchive" @click="$emit('change', 'unzip')">Unzip</li>
                <li class="context-menu__item" v-show="selectedFiles.length === 1" @click="$emit('change', 'rename')">Rename</li>
                <li class="context-menu__item" v-show="selectedFiles.length === 0" @click="$emit('change', 'new')">New folder</li>
                <li class="context-menu__item" @click="$emit('change', 'delete')">Delete</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
export default {
    props: {
        selectedFiles: {
            required: true,
            type: Array,
        },
        position: {
            require: true,
            type: Object,
        },
    },
    setup(props) {
        const hasArchive = computed(() => !!props.selectedFiles.find((file) => file.type === 'archive'))
        return {
            hasArchive,
        }
    },
}
</script>

<style lang="scss">
.context-menu {
    position: fixed;
    background: white;
    padding: 3px 0px;
    z-index: 100;
    border-radius: 6px;
    min-width: 100px;
}
.context-menu__item {
    cursor: pointer;
    padding: 5px 10px;
    &:hover {
        background: teal;
    }
}
</style>
