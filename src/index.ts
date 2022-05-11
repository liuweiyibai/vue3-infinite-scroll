import type { App } from 'vue';

import InfiniteScroll from './directive';

const install = (app: App) => {
  app.directive('InfiniteScroll', InfiniteScroll);
};

export default install;

export { install };
