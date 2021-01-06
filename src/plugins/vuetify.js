import Vue from "vue";
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar-ng'

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
});


Vue.use(VuetifyToast, {
  x: "right", // default
  y: "bottom", // default
  color: "info", // default
  icon: "mdi-information",
  iconColor: "", // default
  classes: ["body-2"],
  timeout: 3000, // default
  dismissable: true, // default
  multiLine: false, // default
  vertical: false, // default
  queueable: false, // default
  showClose: false, // default
  closeText: "", // default
  closeIcon: "close", // default
  closeColor: "", // default
  slot: [], // default
  shorts: {
    custom: {
      color: "purple"
    }
  },
  //$toast 는 이제 전역변수로 어디서든 사용가능하게 되었다.
  property: "$toast" // default
});

export default new Vuetify({});
