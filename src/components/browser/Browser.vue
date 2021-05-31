<template>
    <div class="browser">
        <drive-list class="browser__drivelist" :drives="drives" :loading="loadingDrives" @click="readDir" />
        <!-- <main class="browser__main" :class="{ loading: loading }">
            <div class="section">
                <a class="btn-flat waves-effect waves-teal" @click="readDir(prev_dir)"> <i class="material-icons left">history</i><span>Previous</span> </a>
                <a
                    class="btn-flat waves-effect waves-teal"
                    @click="
                        filter_zip = !filter_zip
                        readDir(curr_dir)
                    "
                    :class="{ teal: filter_zip }"
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
                            @click="
                                handleSortDirection(type)
                                sortFiles()
                            "
                        >
                            {{ type }}
                            <i class="material-icons right" v-if="val.direction === 'asc'">arrow_drop_up</i>
                            <i class="material-icons right" v-if="val.direction === 'desc'">arrow_drop_down</i>
                            <i class="material-icons right" v-if="val.direction !== 'desc' && val.direction !== 'asc'">remove</i>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="btn-flat waves-effect waves-teal parent_dir" @click="readDir('../')" v-if="show_prev">
                    ../
                </div>
                <div class="files-wrap">
                    <ul class="files">
                        <file v-for="file in files" :key="file.name" :file="file" @click="readDir(file.name)" @right-click="$refs.menu.open"> </file>
                    </ul>
                </div>
            </div>
        </main> -->
        <loader :loading="loading"></loader>
    </div>
</template>

<script>
import { computed } from 'vue'
import DriveList from './components/DriveList.vue'
import Loader from './components/Loader.vue'
import { useStore } from 'vuex'
export default {
    components: { Loader, DriveList },
    setup() {
        const store = useStore()

        const loadingDrives = computed(() => store.state.browser.loadingDrives)
        const loading = computed(() => store.state.browser.loading)
        const drives = computed(() => store.state.browser.drives)

        store.dispatch('browser/getDrives')
        return {
            loadingDrives,
            loading,
            drives,
            readDir(path) {
                store.dispatch('browser/readDir', path)
            }
        }
    }
}
</script>

<style lang="scss">
.btn-flat {
    text-transform: none;
    transition: background 150ms ease;
    &:hover {
        background: fade(black, 10%);
    }
}
.browser__drivelist {
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
</style>
