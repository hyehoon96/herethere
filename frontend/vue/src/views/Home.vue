<template>
  <v-container style="width: 100%; hegiht: 100%; padding: 0; margin: 0;">
    <Map
      ref="map"
    />
    <keep-alive>
      <router-view 
        @sendCoordToMap="sendCoordToMap"
      >
      </router-view>
    </keep-alive>
    <BottomNav/>
  </v-container>
  
</template>

<script>
// @ is an alias to /src
import Map from '@/components/KakaoMap.vue'
import BottomNav from '@/components/BottomNav.vue'
// import ChatRoom from '@/components/ChatRoom.vue'
export default {
  name: 'Home',
  components: {
    Map,
    BottomNav
    // ChatRoom
  },
  mounted() {
    // console.log(document.cookie); httpOnly cookie는 스크립트로 읽을 수 없음
    
  },
  methods:{
    sendCoordToMap(item) {
      this.$refs.map.serachAddrFromCoords(item);
    }
  }
}
</script>
