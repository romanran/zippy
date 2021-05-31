<template>
    <aside class=" z-depth-2">
        <ul>
            <li v-for="drive in drives" :class="{ loading: loading }" :key="drive">
                <a @click="$emit('click', drive)" class="truncate btn-flat waves-effect waves-teal browser__drive"
                    ><i class="material-icons left">desktop_windows</i>{{ drive }}</a
                >
            </li>
        </ul>
    </aside>
</template>

<script>
export default {
    props: {
        loading: Boolean,
        drives: Array
    }
}
</script>

<style></style>
