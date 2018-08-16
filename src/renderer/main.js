import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import Hammer from 'hammerjs'
import Materialize from 'materialize-css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
global.deb = function() {
    if (process.env.production) {
        return 0;
    }
    console.log.apply(console, arguments)
}

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    Materialize,
    template: '<App/>'
}).$mount('#app')

