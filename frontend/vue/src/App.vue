<template>
  <v-app>
    <v-main>
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

  methods: {
    
  }
};
</script>
<style scoped>
::v-deep .v-btn__content{
  flex-direction: column;
}
</style>
