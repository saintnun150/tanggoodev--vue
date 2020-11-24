<template>
  <v-app>
    <AppHeader/>
    <v-main>
      <Home />
    </v-main>
    <AppFooter/>
  </v-app>
</template>

<script>
import Home from "@/components/Home";
import AppHeader from "@/components/preset/AppHeader";
import AppFooter from "@/components/preset/AppFooter";
export default {
  name: "App",

  components: {
    AppFooter,
    AppHeader,
    Home
  },

  data: () => ({
    //
  })
};
</script>
