<template>
    <div class="browser">
        <sidebar class="browser__sidebar" :drives="drives" :loading="loadingDrives" @click="readDir" />
        <main class="browser__main" :class="{ loading: loading }">
            <div class="section">
                <filter-bar @previous="readDir(previousDir)" @filter="readDir(currentDir)" />
                <div class="divider"></div>
                <div class="btn-flat waves-effect waves-teal parent_dir" @click="readDir('../')" v-show="previousDirExists">../</div>
                <div class="files-wrap">
                    <ul class="files">
                        <file v-for="file in files" :key="file.name" :file="file" @click="readDir(file.fullPath)"> </file>
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
import Sidebar from './components/Sidebar.vue'
import FilterBar from './components/FilterBar.vue'
import Loader from './components/Loader.vue'
import File from './components/File.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    components: { Loader, Sidebar, FilterBar, File },
    setup() {
        const store = useStore()

        const loadingDrives = computed(() => store.state.browser.loadingDrives)
        const loading = computed(() => store.state.browser.loading)
        const drives = computed(() => store.state.browser.drives)
        const previousDir = computed(() => store.state.browser.previousDir)
        const currentDir = computed(() => store.state.browser.currentDir)
        const files = computed(() => store.state.browser.files)
        const previousDirExists = computed(() => store.state.browser.previousDirExists)

        store.dispatch('browser/getDrives')
        store.dispatch('browser/readDir')
        return {
            loadingDrives,
            loading,
            drives,
            previousDir,
            currentDir,
            files,
            previousDirExists,
            readDir(path) {
                store.dispatch('browser/readDir', path)
            },
            rename() {},
        }
    },
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
.browser__sidebar {
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
.browser__main {
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 150px);
    opacity: 1;
    z-index: 1;
    position: relative;
    transition: opacity 250ms ease;
    &.loading {
        opacity: 0;
    }
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
