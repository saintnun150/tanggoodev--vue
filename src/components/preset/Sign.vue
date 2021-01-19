<template>
  <v-progress-circular color="#f9f7e8" indeterminate v-if="loading"/>
  <v-menu offset-y v-else-if="!$store.state.fireUser">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text>
        <span class="mr-2">Sign-in</span>
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>로그인</v-card-title>
      <v-divider/>
      <v-card-actions>
        <v-btn color="red" dark block @click="signWithGoogle">
          <v-icon left>mdi-google</v-icon>
          Google
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="black" dark block @click="signWithGithub">
          <v-icon left>mdi-github</v-icon>
          Github
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
  <v-menu offset-y v-else>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text>
        <v-avatar size="24">
          <v-img :src="$store.state.fireUser.photoURL"/>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>정보</v-card-title>
      <v-card-actions>
        <v-btn color="" dark block @click="signOut">
          Sign Out
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async signWithGoogle() {
      const provider = new this.$firebase.auth.GoogleAuthProvider();
      this.$firebase.auth().languageCode = 'ko';
      this.loading = true;
      try {
        const result = await this.$firebase.auth().signInWithPopup(provider);
        this.$store.commit('setFireUser', result.user);
      } finally {
        this.loading = false;
      }
    },
    async signWithGithub() {
      const provider = new this.$firebase.auth.GithubAuthProvider();
      this.loading = true;
      try {
        const result = await this.$firebase.auth().signInWithPopup(provider);
        this.$store.commit('setFireUser', result.user);
      } finally {
        this.loading = false;
      }
    },
    signOut() {
      console.log("SignOut complete");
      this.$firebase.auth().signOut();
    }
  }
}
</script>

<style scoped>

</style>