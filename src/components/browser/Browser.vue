<template>
    <div class="browser">
        <drive-list class="browser__drivelist" :drives="drives" :loading="loadingDrives" @click="readDir" />
        <main class="browser__main" :class="{ loading: loading }">
            <div class="section">
                <filter-bar @previous="readDir(previousDir)" @filter="readDir(currentDir)" />
                <div class="divider"></div>
                <div class="btn-flat waves-effect waves-teal parent_dir" @click="readDir('../')" v-show="previousDirExists">
                    ../
                </div>
                <div class="files-wrap">
                    <ul class="files">
                        <file v-for="file in files" :key="file.name" :file="file" @click="readDir(file.name)" @right-click="$refs.menu.open"> </file>
                    </ul>
                </div>
            </div>
        </main>
        <loader class="browser__loader" :loading="loading"></loader>
        <!-- <vue-context ref="menu">
            <template v-slot:default="{ child }">
                <ul>
                    <li @click="rename(child.data)">Rename</li>
                    <li v-if="child.data && child.data.type === 'storage'" @click="unzip($event, child.data)">Unzip</li>
                </ul>
            </template>
        </vue-context> -->
        <div class="modal">
            <div class="modal-content">
                <input type="text" />
            </div>
            <div class="modal-footer">
                <button class="modal-close waves-effect waves-red btn-flat">Cancel</button>
                <button class="modal-close waves-effect waves-green btn-flat">Accept</button>
            </div>
        </div>
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
        const previousDir = computed(() => store.state.browser.previousDir)
        const currentDir = computed(() => store.state.browser.currentDir)

        store.dispatch('browser/getDrives')
        return {
            loadingDrives,
            loading,
            drives,
            previousDir,
            currentDir,
            readDir(path) {
                store.dispatch('browser/readDir', path)
            },
            rename() {}
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
.browser__loader {
    opacity: 0;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    &.loading {
        z-index: 1;
        opacity: 1;
    }
}
</style>
