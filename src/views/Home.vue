<template>
  <v-container>
    <h1>홈컴포넌트</h1>
    <v-btn @click="save">
      <strong>저장</strong>
      <v-icon>
        mdi-check
      </v-icon>
    </v-btn>
    <v-btn class="ml-2" @click="readOne">
      <strong>읽기</strong>
      <v-icon>
        mdi-book
      </v-icon>
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  methods: {
    save() {
      console.log('sdf');
      // ref => Root 위치
      this.$firebase.database().ref().child('abcd').set({
        title: 'abcd',
        text: 'ttttt'
      })
    },
    read() {
      // 계속 리스닝하고 있음
      this.$firebase.database().ref().child('abcd').on('value', (snapShot) => {
        console.log(snapShot);
        console.log(snapShot.val());
      });
    },
    async readOne() {
      const snapshot = await this.$firebase.database().ref().child('abcd').once('value');
      console.log(snapshot.val());
    }
  }

}
</script>

<style scoped>

</style>