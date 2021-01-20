import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import "./plugins/firebase"
import './plugins/editor'
import "./error"
import "./plugins/moment"

Vue.config.productionTip = false;

//sameSite Lax 이슈
/*document.cookie = 'same-site-cookie=foo; SameSite=Lax';
document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';*/

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
