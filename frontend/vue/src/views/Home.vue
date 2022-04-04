<template>
  <v-container style="padding: 0; margin: 0;">
    <Map/>
  </v-container>
  
</template>

<script>
// @ is an alias to /src
import Map from '@/components/KakaoMap.vue'

export default {
  name: 'Home',
  components: {
    Map
  }
}
</script>
