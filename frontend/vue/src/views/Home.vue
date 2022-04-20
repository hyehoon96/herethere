<template>
  <v-container style="padding: 0; margin: 0;">
    <Map/>
    <router-view :key="$route.fullpath"></router-view>
  </v-container>
  
</template>

<script>
// @ is an alias to /src
import Map from '@/components/KakaoMap.vue'
// import ChatRoom from '@/components/ChatRoom.vue'
export default {
  name: 'Home',
  components: {
    Map,
    // ChatRoom
  },
  mounted() {
    
  },
  methods:{
    
  }
}
</script>
