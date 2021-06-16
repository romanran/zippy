import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { createRouter, createWebHashHistory } from 'vue-router'
import LandingPage from './components/LandingPage'

const router = createRouter({
    history: createWebHashHistory(),
    // baseUrl: process.enc.WEBPACK_DEV_SERVER_URL,
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: LandingPage
        }
    ]
})
const app = createApp(App)
app.use(store)
    .use(router)
    .mount('#app')
