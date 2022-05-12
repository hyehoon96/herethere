<template>
  <v-container>
    <v-dialog
      v-model="displayDialog"
    >
      <custom-dialog
        :header-title="'채팅 방 목록'"
        @hide="displayDialog = false;"
        @submit="dialogType === 'create' ? createRoom() : findRoom()"
        :footerSubmit="beforeConnect"
        :footerSubmitTitle="dialogType === 'create' ? '생성' : '접속'"
        :footerCloseBtn="beforeConnect"
      >
        <template v-slot:body>
          <v-card v-if="!beforeConnect">
            <div class="d-flex">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                class="px-3"
              ></v-text-field>
              <div class="text-end">
                <v-btn
                  color="primary"
                  dark
                  class="my-5 pa-3 mr-3"
                  @click="beforeConnect = true; dialogType = 'create';"
                >
                  채팅방 생성
                </v-btn>
              </div>
            </div>
              
            <v-data-table
              :headers="headers"
              :items="chatList"
              :search="search"
              mobile-breakpoint="0"
              @click:row="validConnection"
            >
              
              <!-- eslint-disable-next-line -->
              <template v-slot:item.title="{ item }">
                <v-chip
                  dark
                  :color="item.max === item.currentClient ? 'amber' : 'success'"
                >
                  {{ item.title }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>

          <v-row class="mt-3"  justify="center" v-if="beforeConnect">
            <v-col cols="11" v-if="dialogType === 'find'">
              <v-text-field
                v-model="userName"
                outlined
                hide-details
                type="string"
                label="채팅방에서 사용할 이름을 입력하세요."
              />
            </v-col>
            <div class="d-flex justify-center" style="width: 100%;" v-else>
              <v-col cols="7">
                <v-text-field
                  v-model="roomTitle"
                  disabled
                  outlined
                  hide-details
                  type="string"
                  label="채팅방 제목"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="roomMax"
                  outlined
                  hide-details
                  :items="[1, 2, 3, 4]"
                  label="인원"
                />
              </v-col>
            </div>
            

            <v-col cols="11">
              <v-text-field
                v-model="roomNumber"
                outlined
                type="number"
                hide-details
                label="비밀번호 (6자 이상)"
              />
            </v-col>
          </v-row>
          
        </template>
      </custom-dialog>
    </v-dialog>
      <v-bottom-navigation
        v-model="selectedBtn"
        :value="value"
        color="blue darken-2"
        grow
        app
        fixed
        v-if="$vuetify.breakpoint.xs"
        min-height="50px;"
        style="z-index:100; top: calc(100vh - 56px)"
      >


        <v-btn
          v-for="(item) in [
            {text : '채팅창', label: 'chat', icon: 'mdi-chat-processing', value : 0},
            {text : '지도', label: 'map', icon: 'mdi-map', value :  1},
            {text : '북마크', label: 'bookmark', icon: 'mdi-bookmark-check' , value : 2, route: '/history'}
          ]"
          :value="item.value"
          :key="item.label"
          :to="item.route ? item.route : null"
          class="font-weight-black btn-bottom"
          style="font-size: 13px;"
          @click="setPage(item)"
        >
          <span >{{item.text}}</span>
          <v-icon>{{item.icon}}</v-icon>
        </v-btn>

      </v-bottom-navigation>
  </v-container>
</template>

<script>
import chat from '@/chat.js';

export default {
  mixins: [chat],
  props: {
    isMoved: {
      type: Boolean
    }
  },
  data: () => (
    { 
      selectedBtn: 1,
      value: 1,
      displayDialog: false,
      beforeConnect: false,
      userName: null,
      roomMax: 4,
      roomNumber: null,
      roomTitle: null,
      dialogType: 'find',
      search: '',
      headers: [
        { text: '제목', align: 'center', sortable: false, value: 'title',},
        { text: '최대인원', align: 'center', sortable: false, value: 'max' },
        { text: '현재인원', align: 'center', sortable: false, value: 'currentClient' },
      ],
      chatList: [],
      
    }
    
  ),

  mounted() {
    
  },
  watch: {
    '$route.name': {
      handler () {
        console.log('라우터가 변경되었습니다.');
      }
    },
    '$store.state.userView': {
      handler() {
        console.log(this.$store.state.userView);
        switch(this.$store.state.userView) {
          case 'chat':
            this.value = 0;
            break;
          case 'map':
            this.value = 1;
            break;
          case 'bookmark':
            this.value = 2;
            break;
        }
      }
    },
    'value': {
      handler() {
        console.log(this.value);
      }
    }
  },
  methods: {
    async setPage(item) {
      if (this.$store.state.userView === 'bookmark' && item.label !== 'bookmark') {
        this.$router.push('/');
      }
      if(item.label === 'chat') {
        if (this.$store.state.usingChat === false ) {
          this.chatList = await this.$axiosAPI('api/room', 'get');  
          this.displayDialog = true;
        } 
        this.roomTitle = `${this.$store.state.nickname} 님의 채팅방`;
      }
      if ((this.$store.state.userView === 'map' && item.label === 'chat') || 
          (this.$store.state.userView === 'chat' && item.label === 'map')) {
        this.$store.commit('setUserView', item.label);
      } else {
        if (this.isMoved) {
          this.$store.commit('setUserView', item.label);
        }
      }
      
    },
    
  }
}
</script>

<style>

</style>