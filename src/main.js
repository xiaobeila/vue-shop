// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueLazyload from 'vue-lazyload';
import { currency } from './common/js/currency';
import infiniteScroll from 'vue-infinite-scroll';

import './assets/css/base.css';
import './assets/css/checkout.css';
import './assets/css/product.css';

// vuex
import store from './store';
import vConsole from 'vconsole';

Vue.use(infiniteScroll);
Vue.filter('currency', currency);
Vue.config.productionTip = false;

Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
