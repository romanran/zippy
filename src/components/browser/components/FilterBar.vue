<template>
    <div class="filter-bar">
        <a class="btn-flat waves-effect waves-teal" @click="$emit('previous')"> <i class="material-icons left">history</i><span>Previous</span> </a>
        <a class="btn-flat waves-effect waves-teal" @click="filterZipClick" :class="{ teal: filterZipFiles }">
            <i class="material-icons left">content_cut</i><span>Filter zip</span>
        </a>
        <div class="divider"></div>
        <div class="sort-bar z-depth-1">
            <div class="sort-row">
                <div class="btn-flat waves-effect waves-teal sort" v-for="(val, type) in sort" :key="type" @click="sortClick">
                    {{ val }}
                    <i class="material-icons right" v-if="val.direction === directionsEnum.ASCENDING">arrow_drop_up</i>
                    <i class="material-icons right" v-if="val.direction === directionsEnum.DESCENDING">arrow_drop_down</i>
                    <i class="material-icons right" v-if="val.direction === directionsEnum.EMPTY">remove</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { computed } from 'vue'
// import { useStore } from 'vuex'
// import { directionsEnum, sortEnum } from '@/store/filters'
export default {
    setup() {
        // const store = useStore()
        // const filterZipFiles = computed({
        //     get() {
        //         return store.state.browser.filterZipFiles
        //     },
        //     set(value) {
        //         store.commit('browser/filterZipFiles', value)
        //     }
        // })
        // const sort = computed(() => store.state.browser.sort)
        // return {
        //     directionsEnum,
        //     sortEnum,
        //     sort,
        //     sortClick(type) {
        //         store.dispatch('filters/sortFiles', type)
        //     },
        //     filterZipClick() {
        //         filterZipFiles.value = !filterZipFiles.value
        //         this.$emit('filter')
        //     }
        // }
    },
}
</script>

<style lang="scss">
.sort-bar {
    display: table;
    width: 100%;
    border-collapse: collapse;
}
.sort-row {
    display: table-row;
}
.sort {
    display: table-cell;
}
</style>
