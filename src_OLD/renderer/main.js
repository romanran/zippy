import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import Hammer from 'hammerjs'
import Materialize from 'materialize-css'


Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    Materialize,
    template: '<App/>'
}).$mount('#app')

