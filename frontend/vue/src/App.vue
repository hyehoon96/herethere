<template>
  <v-app style="width: 100vw; hegiht: 100vh; padding: 0; margin: 0; overflow-y: hidden;">
    <v-main >
      <v-scroll-x-transition mode="out-in">
        <router-view/>
      </v-scroll-x-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    
  }),
  mounted() {
    //this.$store.commit('checkMobileConnect', /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  },
  methods: {
    
  }
};
</script>
<style scoped>
::v-deep .v-btn__content{
  flex-direction: column;
}
</style>
