<template>
  <v-navigation-drawer app v-model="drawer">
    <v-system-bar />
    <v-list>
      <v-list-item link href="https://tangoo91.tistory.com" target="_blank">
        <v-list-item-avatar>
          <v-img src="@/assets/kakao_lion_card_after.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            탱구데브
          </v-list-item-title>
          <v-list-item-subtitle>
            https://tangoo91.tistory.com
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item-group>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-human-greeting</v-icon>
          </v-list-item-icon>
          <v-list-item-title>프로필</v-list-item-title>
        </v-list-item>
      </v-list-item-group>

      <v-list-group prepend-icon="mdi-tools" :value="true">
        <template v-slot:activator>
          <v-list-item-title>개발</v-list-item-title>
        </template>
        <v-list-item
          class="ml-7"
          v-for="(develop, i) in develops"
          :key="i"
          link
          :to="develop.to"
        >
          <v-list-item-icon>
            <v-icon v-text="develop.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="develop.title"></v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-list dense>
      <v-list-item-group> </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "AppLeftDrawer",
  data() {
    return {
      develops: [
        { title: "게시판", icon: "mdi-numeric-1-circle", to: "/board" },
        { title: "키워드 검색", icon: "mdi-numeric-2-circle", to: "/search" }
      ]
    };
  },
  computed: {
    drawer: {
      get() {
        console.log("drawerL getter:", this.$store.state.drawerState);
        return this.$store.state.drawerState;
      },
      set(value) {
        console.log("setter:", value);
        this.$store.commit("change", value);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.border {
  border: 2px dashed orange;
}
</style>
