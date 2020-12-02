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
  computed: {
    drawer: {
      get() {
        console.log('getter', this.$store.state.drawerState);
        return this.$store.state.drawerState;
      },
      set(value) {
        console.log('drawerL setter:', value);
        this.$store.commit('change', value);
      }
    }
  }
}
</script>