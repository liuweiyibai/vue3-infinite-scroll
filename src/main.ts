import { createApp } from 'vue';
import App from './App.vue';
import InfiniteScroll from './directives/InfiniteScroll';

const app = createApp(App);

app.directive('InfiniteScroll', InfiniteScroll);
app.mount('#app');
