<template>
  <v-navigation-drawer
      app
      v-model="drawer"
  >
    <v-list
        nav
        dense
    >
      <v-list-item-group
          active-class="deep-purple--text text--accent-4"
      >
        <v-list-item>
          <v-list-item-title>Fizz</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Fizz</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Fizz</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Fizz</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "AppLeftDrawer",
 /* props:['drawerProps'],*/
  data() {
    return {
      drawer: this.$store.state.drawerState
    }
  },
  computed:{
    changeDrawer() {
      return this.$store.state.drawerState
    }
  },
  watch:{
    changeDrawer (val) {
      this.drawer = val;
    }
  }

}
</script>