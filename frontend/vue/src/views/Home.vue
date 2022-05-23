<template>
  <v-container style="width: 100vw; hegiht: 100vh; padding: 0; margin: 0;">
    <Map
      ref="map"
    />
    <keep-alive>
      <router-view 
        @sendCoordToMap="sendCoordToMap"
        @getVoteItem="getVoteItem"
        @validMoved="validMoved"
        :voteList="voteList"
      >
      </router-view>
    </keep-alive>
    <BottomNav
      :isMoved="isMoved"
    />
  </v-container>
  
</template>

<script>
// @ is an alias to /src
import Map from '@/components/KakaoMap.vue'
import BottomNav from '@/components/BottomNav.vue'
// import ChatRoom from '@/components/ChatRoom.vue'
export default {
  name: 'Home',
  data() {
    return {
      voteList: [],
      isMoved: false,
    }
  },
  components: {
    Map,
    BottomNav
    // ChatRoom
  },
  props: {
    place: {
      type: String
    }
  },
  mounted() {
    // console.log(document.cookie); httpOnly cookie는 스크립트로 읽을 수 없음
    this.$store.commit('setUsingChat', false);
    this.$store.commit('setChatRole', null);
    if (this.place) {
      this.$refs.map.searchLocation(this.place);
    }
  },
  methods:{
    sendCoordToMap(item) {
      this.$refs.map.serachAddrFromCoords(item);
    },
    async getVoteItem() {
      this.voteList = await this.$refs.map.returnSearchResult();
    },
    validMoved(isMoved) {
      this.isMoved = isMoved;
    }
  },
  
}
</script>
