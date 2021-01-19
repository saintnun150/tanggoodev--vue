<template>
  <v-tooltip bottom>
    <template v-slot:activator="{on}">
      <span v-on="on">{{displayTime}}</span>
    </template>
    <span>{{ time.toLocaleString() }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ['time'],
  computed: {
    displayTime() {
      const btime = this.$moment(this.time)
      const ctime = this.$moment()
      const diff = ctime.diff(btime, 'days')
      if (diff > 0) {
        return btime.toDate().toLocaleDateString();
      }
      return btime.fromNow();
    }
  }
}
</script>