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
    // 리스너는 try catch로 감싸도 소용없다.
    // 리스너 뒤에 콜백함수를 통해 에러를 캐치함
    subscribe() {
      this.$firebase.database().ref().child("site").child("footer").child("title").on("value", (snapshot) => {
        const v = snapshot.val();
        if (!v) {
          this.$firebase.database().ref().child("site").child("footer").set({title: this.footerText});
          return;
        }
        this.footerText = v;
      }, (e) => {
        console.log(e.message);
      });
    }
  }

};
</script>
<style lang="scss">
html, body {
  height: 100vh;
}
</style>
