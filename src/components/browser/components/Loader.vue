<template>
    <div class="loader-wrap center-align" :class="{ loading: loading }" v-show="loading">
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div>
                <div class="gap-patch">
                    <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
        <p class="flow-text">Opening the archive...</p>
        <!-- TODO: progress bar -->
    </div>
</template>

<script>
export default {
    props: {
        loading: Boolean
    }
}
</script>

<style lang="scss"></style>
