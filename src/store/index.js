import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawerState: null,
    editable: null
  },
  mutations: {
    changeDrawerState(state, payload) {
      state.drawerState = payload;
    },
    changeEditable(state, payload) {
      console.log('payload', payload);
      state.editable = payload;
    }
  },
  actions: {},
  modules: {}
});
