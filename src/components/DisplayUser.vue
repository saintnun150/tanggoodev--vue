<template>
  <v-tooltip bottom v-if="user">
    <template v-slot:activator="{on}">
      <v-chip v-on="on" color="accent">
        <v-avatar left>
          <v-img :src="user.photoURL"/>
        </v-avatar>
        {{user.displayName}}
      </v-chip>
    </template>
    <span>{{ user.email }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ['user']
}
</script>