import { createApp } from 'vue';
import Vue3infiniteScroll from './vue3-infinite-scroll.esm.js';
import App from './App.vue';

const app = createApp(App);
app.use(Vue3infiniteScroll);

app.mount('#app');
