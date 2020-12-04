<template>
  <div>
    <v-system-bar/>
    <drawer-top :top="site.top"/>
    <v-divider/>
    <drawer-menu :items="site.menu"/>
  </div>
</template>

<script>
import DrawerMenu from "@/components/preset/drawer/DrawerMenu";
import DrawerTop from "@/components/preset/drawer/DrawerTop";

export default {
  name: "AppLeftDrawer",
  components: {DrawerTop, DrawerMenu},
  data() {
    return {
      site: {
        top: {
          title: "탱구데브",
          topButtons: [
            {
              to: "https://github.com/saintnun150/tanggoodev--vue",
              icon: "mdi-github"
            },
            {
              to: "https://www.youtube.com/channel/UC8b_aKaepF-72QcfScaMnHA",
              icon: "mdi-youtube"
            }
          ]
        },
        menu: [
          {
            title: "프로필",
            icon: "mdi-human-greeting"
          },
          {
            title: "개발",
            active: true,
            icon: "mdi-tools",
            subItems: [
              {
                title: "게시판",
                icon: "mdi-numeric-1-circle",
                to: "/board"
              },
              {
                title: "키워드 검색",
                icon: "mdi-numeric-2-circle",
                to: "/search"
              }
            ]
          }
        ],
      }
    }
  },
  created() {
    this.subscribe();
  },
  methods: {
    // 이렇게 firebase의 데이터를 읽어오는 것을 구독(subscribe)이라 한다.
    subscribe() {
      this.$firebase.database().ref().child("site").on("value", (snapshot) => {
        const v = snapshot.val();
        if (!v) {
          this.$firebase.database().ref().child("site").set(this.site);
          return;
        }
        this.site = v;
      }, (e) => {
        // 리스너 에러처리
        console.log(e.message);
      })
    }
  }
};
</script>
<style scoped lang="scss">
.border {
  border: 2px dashed orange;
}
</style>
