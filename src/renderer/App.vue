<template>
    <div id="app" class="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'zippy'
    }
</script>

<style>
    /* CSS */
    @import (less) "~materialize-css/dist/css/materialize.css";
    @import (css) url("https://fonts.googleapis.com/icon?family=Material+Icons");
    * {
        box-sizing: border-box
    }
    html,
    body {
        height: 100%;
        background: white;
    }
    .app {
        height: 100%;
    }
    .max-height {
        height: 100%;
    }

</style>
