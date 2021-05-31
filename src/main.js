import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: require('@/components/LandingPage').default
        }
    ]
})
const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

process.on('unhandledRejection', error => {
    console.error(error)
})
