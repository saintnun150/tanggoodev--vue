import Vue from 'vue'

Vue.config.errorHandler = err => {
  console.log(err.message);
  Vue.prototype.$toast.error(err.message);
};