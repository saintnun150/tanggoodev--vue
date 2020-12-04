<template>
  <v-app>
    <app-header/>
    <v-main>
      <v-container id="main-container">
        <router-view></router-view>
      </v-container>
    </v-main>
    <app-footer :footerText="footerText"/>
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
  data() {
    return {
      footerText: "TangGooDev"
    }
  },
  created() {
    this.subscribe();
  },
  methods: {
    subscribe() {
      console.log("구독 실행");
      this.$firebase.database().ref().child("site").child("footer").child("title").on("value", (snapshot) => {
        const v = snapshot.val();
        if (!v) {
          this.$firebase.database().ref().child("site").child("footer").set({title: this.footerText});
          return;
        }
        this.footerText = v;
      })
    }
  }

};
</script>
