<template>
    <div
        class="browser"
        ref="browserElement"
        @click="onBrowserClick"
        @mousemove="onMouseMove"
        @mousedown="onMouseDown"
        @drop="onDrop"
        @dragenter.prevent
        @dragover.prevent
    >
        <!-- <div @click="closeWindow">ZAMKNIJ OKNO</div> -->
        <sidebar class="browser__sidebar" :drives="drives" :loading="loadingDrives" @click="readDir" />
        <main class="browser__main" :class="{ loading: loading }">
            <div class="section">
                <filter-bar @previous="readDir(previousDir)" @filter="readDir(currentDir)" />
                <div class="divider"></div>
                <div class="btn-flat waves-effect waves-teal parent_dir" @click="readDir(previousDir)" v-show="previousDirExists">../</div>
                <div class="files-wrap">
                    <ul class="files" @contextmenu="onRightClick">
                        <file
                            v-for="(file, fileIndex) in files"
                            :data-index="fileIndex"
                            :key="file.name"
                            :selected="checkIfSelected(file.fullPath)"
                            :file="file"
                            @click.stop="select($event, file.fullPath)"
                            @contextmenu="select($event, file.fullPath)"
                            @doubleClick="readDir(file.fullPath)"
                        >
                        </file>
                    </ul>
                </div>
            </div>
        </main>

        <loader class="browser__loader" :loading="loading"></loader>
        <context-menu :position="contextMenuCoords" :selectedFiles="selectedFiles" v-show="contextMenuOpen" @change="contextClick" />
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import Selecto from 'selecto'
import Sidebar from './components/Sidebar.vue'
import FilterBar from './components/FilterBar.vue'
import Loader from './components/Loader.vue'
import File from './components/File.vue'
import ContextMenu from './components/ContextMenu.vue'
import { handledExtensions } from '@/electron/utilities/service.js'

const keys = {
    ctrl: 'Control',
    shift: 'Shift',
    ctrlShift: 'ControlShift',
}

export default {
    components: { Loader, Sidebar, FilterBar, File, ContextMenu },

    setup() {
        const store = useStore()
        let selectedFiles = ref([])
        const browserElement = ref(false)
        const heldKey = ref(null)
        const contextMenuOpen = ref(false)
        const isMoving = ref(false)
        const contextMenuCoords = ref({ x: 0, y: 0 })

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
            if (ev.key === 'Delete') {
                store.dispatch('browser/delete', { paths: selectedFilesPaths.value })
                return
            }
            if (ev.key === 'F2' && selectedFilesPaths.value.length === 1) {
                rename()
                return
            }
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

        function handleSelection(path, heldKey) {
            const fileIndex = filesPaths.value.indexOf(path)

            const actions = {
                [keys.ctrl](path) {
                    const selectedFilePathIndex = selectedFilesPaths.value.indexOf(path)
                    const isSelected = selectedFilePathIndex >= 0
                    if (isSelected) {
                        const { pullAt, cloneDeep } = require('lodash')
                        const selectedFilesCopy = cloneDeep(selectedFiles.value)
                        pullAt(selectedFilesCopy, selectedFilePathIndex)
                        selectedFiles.value = selectedFilesCopy
                    } else {
                        selectedFiles.value = [...selectedFiles.value, files[fileIndex]]
                    }
                },
                [keys.shift](path) {
                    selectedFiles.value = getSelectedFiles(path)
                },
                [keys.ctrlShift](path) {
                    selectedFiles.value = [...selectedFiles.value, ...getSelectedFiles(path)]
                },
                default() {
                    selectedFiles.value = [files.value[fileIndex]]
                },
            }
            actions[heldKey] ? actions[heldKey](path) : actions.default(path)
        }
        function addSelectRectangle() {
            const selecto = new Selecto({
                container: browserElement.value,
                selectableTargets: ['.file'],
                selectByClick: false,
                selectFromInside: true,
                continueSelect: false,
                toggleContinueSelect: 'shift',
                keyContainer: window,
                preventDefault: true,
                preventDragFromInside: true,
                hitRate: 10,
            })
            selecto.on('select', (e) => {
                selectedFiles.value = e.selected.map((el) => files.value[el.dataset.index])
            })
        }

        const methods = {
            checkIfSelected(path) {
                return selectedFilesPaths.value.includes(path)
            },
            select(event, path) {
                contextMenuOpen.value = false
                if (path === null) {
                    return (selectedFiles.value = [])
                }
                if (event.type === 'contextmenu' && selectedFiles.value.length > 1) {
                    return
                }

                handleSelection(path, heldKey.value)
            },
            readDir(path) {
                store.dispatch('browser/readDir', path)
            },
            onRightClick(ev) {
                contextMenuCoords.value = { x: ev.pageX, y: ev.pageY }
                contextMenuOpen.value = true
            },
            contextClick(eventName) {
                contextMenuOpen.value = false

                const eventFunctions = {
                    zip() {
                        store.dispatch('browser/zip', { paths: selectedFilesPaths.value, extension: handledExtensions.SEVENZIP, password: null })
                    },
                    unzip() {
                        store.dispatch('browser/unzip', { paths: selectedFilesPaths.value })
                    },
                    delete() {
                        store.dispatch('browser/delete', { paths: selectedFilesPaths.value })
                    },
                }
                eventFunctions[eventName] ? eventFunctions[eventName]() : null
            },
            onBrowserClick(ev) {
                contextMenuOpen.value = false
                if (!isMoving.value) {
                    selectedFiles.value = []
                }
            },
            onMouseMove() {
                isMoving.value = true
            },
            onMouseDown(ev) {
                isMoving.value = false
            },
            closeWindow() {
                window.api.closeWindow()
            },
            onDrop(ev) {
                const { toArray } = require('lodash')
                const files = toArray(ev.dataTransfer.files)
                const paths = files.map((file) => file.path)
                store.dispatch('browser/move', { paths, targetDir: currentDir.value })
            },
        }

        window.addEventListener('keydown', handleKeyEvent)
        window.addEventListener('keyup', handleKeyEvent)
        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeyEvent)
            window.removeEventListener('keyup', handleKeyEvent)
        })
        onMounted(() => {
            addSelectRectangle()
        })

        async function init() {
            store.dispatch('browser/getDrives')
            await store.dispatch('browser/getCWD')
            store.dispatch('browser/readDir', currentDir.value)
        }

        init()

        return {
            loadingDrives,
            loading,
            drives,
            browserElement,
            previousDir,
            currentDir,
            files,
            filesPaths,
            selectedFiles,
            selectedFilesPaths,
            previousDirExists,
            contextMenuOpen,
            contextMenuCoords,
            ...methods,
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
    height: 100vh;
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
.files-wrap {
    max-height: calc(100vh - 105px);
    overflow: auto;
    -webkit-app-region: drag;
}
</style>
