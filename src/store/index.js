import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawerState: null
  },
  mutations: {
    change(state, payload) {
      state.drawerState = payload;
    }
  },
  actions: {},
  modules: {}
});
