import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { createRouter, createWebHashHistory } from 'vue-router'
import LandingPage from './components/LandingPage'
import fs from 'fs-extra'
const { app } = require('electron')
if (process.argv[2]) {
    fs.writeFileSync('W:/Projects/udalosie.txt', JSON.stringify(process.argv))
    app.quit()
    process.exit(1)
} else {
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
    app.use(router)
    app.mount('#app')
}
