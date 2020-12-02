<template>
  <v-app>
    <AppHeader/>
    <v-main>
      <v-container id="main-container">
        <router-view></router-view>
      </v-container>
    </v-main>
    <AppFooter/>
  </v-app>
</template>

<script>
import AppHeader from "@/components/preset/AppHeader";
import AppFooter from "@/components/preset/AppFooter";
export default {
  name: "App",
  components: {
    AppFooter,
    AppHeader
  },

  data: () => ({
    //
  }),
  mounted() {
    console.log(this.$firebase)
  }
};
</script>
