<template>
  <div>
    <v-app-bar app color="teal darken-2" dark>
      <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
      <v-img
          class="shrink mr-2"
          alt="TangGooDev Logo"
          contain src="@/assets/dev-logo.png"
          transition="scale-transition"
          width="150"
      />
      <v-spacer></v-spacer>
      <sign></sign>
      <v-btn @click="test">test</v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" width="400">
      <AppLeftDrawer></AppLeftDrawer>
    </v-navigation-drawer>
  </div>
</template>

<script>
import AppLeftDrawer from "@/components/preset/drawer/AppDrawer";
import Sign from "@/components/preset/Sign";

export default {
  name: "AppHeader",
  components: {Sign, AppLeftDrawer},
  data() {
    return {
      drawer: false
    }
  },
  methods: {
    async test() {
      const sn = await this.$firebase.storage().ref().child('boards').child('tt').child('1234567890123456').putString('hi!')
    }
  }
}
</script>