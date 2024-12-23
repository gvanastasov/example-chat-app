import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router';
import { pinia } from './store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import BootstrapVue3 from 'bootstrap-vue-3';

createApp(App).use(BootstrapVue3).use(pinia).use(router).mount('#app')
