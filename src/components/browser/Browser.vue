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
                        <file
                            v-for="file in files"
                            :key="file.name"
                            :selected="checkIfSelected(file.fullPath)"
                            :file="file"
                            @click="select($event, file.fullPath)"
                            @doubleClick="readDir(file.fullPath)"
                        >
                        </file>
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
import { computed, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

const keys = {
    ctrl: 'Control',
    shift: 'Shift',
    ctrlShift: 'ControlShift',
}

export default {
    components: { Loader, Sidebar, FilterBar, File },

    setup() {
        const store = useStore()
        let selectedFiles = ref([])
        const heldKey = ref(null)

        const loadingDrives = computed(() => store.state.browser.loadingDrives)
        const loading = computed(() => store.state.browser.loading)
        const drives = computed(() => store.state.browser.drives)
        const previousDir = computed(() => store.state.browser.previousDir)
        const currentDir = computed(() => store.state.browser.currentDir)
        const files = computed(() => store.state.browser.files)
        const filesPaths = computed(() => files.value.map((file) => file.fullPath))
        const selectedFilesPaths = computed(() => selectedFiles.value.map((file) => file.fullPath))
        const previousDirExists = computed(() => store.state.browser.previousDirExists)

        function handleKeyEvent(ev) {
            if (ev.key !== keys.shift && ev.key !== keys.ctrl) {
                return
            }
            if (ev.key === keys.shift && ev.ctrlKey) {
                heldKey.value = ev.type === 'keydown' ? keys.ctrlShift : null
                return
            }

            heldKey.value = ev.type === 'keydown' ? ev.key : null
        }

        function getSelectedFiles(path) {
            let firstSelectedFileIndex = filesPaths.value.indexOf(selectedFilesPaths.value[0])
            let secondSelectedFileIndex = filesPaths.value.indexOf(path)
            if (firstSelectedFileIndex > secondSelectedFileIndex) {
                // prettier-ignore
                [firstSelectedFileIndex, secondSelectedFileIndex] = [secondSelectedFileIndex, firstSelectedFileIndex]
            }
            return files.value.slice(firstSelectedFileIndex, secondSelectedFileIndex + 1)
        }

        store.dispatch('browser/getDrives')
        store.dispatch('browser/readDir')
        window.addEventListener('keydown', handleKeyEvent)
        window.addEventListener('keyup', handleKeyEvent)
        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeyEvent)
            window.removeEventListener('keyup', handleKeyEvent)
        })

        return {
            loadingDrives,
            loading,
            drives,
            previousDir,
            currentDir,
            files,
            filesPaths,
            selectedFiles,
            selectedFilesPaths,
            previousDirExists,
            checkIfSelected(path) {
                return selectedFilesPaths.value.includes(path)
            },
            select(event, path) {
                const actions = {
                    [keys.ctrl](path) {
                        const { pullAt, cloneDeep } = require('lodash')
                        const fileIndex = filesPaths.value.indexOf(path)
                        const selectedFilePathIndex = selectedFilesPaths.value.indexOf(path)
                        const isSelected = selectedFilePathIndex >= 0
                        if (isSelected) {
                            const selectedFilesCopy = cloneDeep(selectedFiles.value)
                            // console.log(...filesCopy, 'selected', path, selectedFilePathIndex)
                            pullAt(selectedFilesCopy, selectedFilePathIndex)
                            selectedFiles.value = selectedFilesCopy
                        } else {
                            selectedFiles.value = [...selectedFiles.value, files.value[fileIndex]]
                        }
                    },
                    [keys.shift](path) {
                        selectedFiles.value = getSelectedFiles(path)
                    },
                    [keys.ctrlShift](path) {
                        selectedFiles.value = [...selectedFiles.value, ...getSelectedFiles(path)]
                    },
                    default(path) {
                        const fileIndex = filesPaths.value.indexOf(path)
                        selectedFiles.value = [files.value[fileIndex]]
                    },
                }
                actions[heldKey.value] ? actions[heldKey.value](path) : actions.default(path)
            },
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
