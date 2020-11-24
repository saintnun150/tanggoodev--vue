<template>
  <div>
    <v-app-bar app color="teal darken-2" dark>
      <v-app-bar-nav-icon @click="changeState"></v-app-bar-nav-icon>
      <v-img
          class="shrink mr-2"
          alt="TangGooDev Logo"
          contain src="@/assets/dev-logo.png"
          transition="scale-transition"
          width="150"
      />
      <v-spacer></v-spacer>
      <v-btn text>
        <span class="mr-2">Sign-in</span>
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <AppLeftDrawer></AppLeftDrawer>
  </div>
</template>

<script>
import AppLeftDrawer from "@/components/preset/AppLeftDrawer";
export default {
  name: "AppHeader",
  components: {AppLeftDrawer},
  data() {
    return {
      drawer: false
    }
  },
  methods: {
    changeState:function () {
      this.drawer = !this.drawer;
      this.$store.commit('change', this.drawer);
    }
  },
}
</script>