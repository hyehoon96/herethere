<template>
  <v-container style="padding: 0; margin: 0;">
    <Map/>
    <ChatRoom/>
  </v-container>
  
</template>

<script>
// @ is an alias to /src
import Map from '@/components/KakaoMap.vue'
import ChatRoom from '@/components/ChatRoom.vue'
export default {
  name: 'Home',
  components: {
    Map,
    ChatRoom
  },
  mounted() {
    
  },
  methods:{
    
  }
}
</script>
