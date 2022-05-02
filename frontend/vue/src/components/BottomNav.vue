<template>
  <div>
    <v-dialog
      v-model="displayDialog"
    >
      <custom-dialog
        :header-title="'채팅 방 목록'"
        @hide="displayDialog = false;"
        @submit="dialogType === 'create' ? createRoom() : findRoom()"
        :footerSubmit="beforeConnect"
        :footerSubmitTitle="'접속'"
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
                  class="my-5 px-3"
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
                  :color="item.max === item.current ? 'amber' : 'success'"
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
                  outlined
                  hide-details
                  type="string"
                  label="채팅방 제목"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="roomMax"
                  outlined
                  hide-details
                  type="number"
                  label="인원"
                />
              </v-col>
            </div>
            

            <v-col cols="11">
              <v-text-field
                v-model="roomNumber"
                outlined
                hide-details
                label="비밀번호"
              />
            </v-col>
          </v-row>
          
        </template>
      </custom-dialog>
    </v-dialog>
  
    <v-bottom-navigation
      v-model="value"
      color="primary"
      grow
      app
      v-if="$vuetify.breakpoint.xs"
    >


      <v-btn
        v-for="(item, i) in [
          {text : '채팅창', label: 'chat', icon: 'mdi-chat-processing', value : 0},
          {text : '지도', label: 'map', icon: 'mdi-map', value :  1},
          {text : '북마크', label: 'bookmark', icon: 'mdi-bookmark-check' , value : 2}
        ]"
        :value="i"
        :key="item.value"
        class="font-weight-black"
        style="font-size: 15px;"
        @click="setPage(item)">
        <span >{{item.text}}</span>
        <v-icon>{{item.icon}}</v-icon>
      </v-btn>

    </v-bottom-navigation>
  </div>
</template>

<script>
import chat from '@/chat.js';

export default {  
  mixins: [chat],
  data: () => (
    { 
      value: 1,
      roomList: [],
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
        { text: '현재인원', align: 'center', sortable: false, value: 'current' },
      ],
      chatList: [
        {
          title: 'new chat room',
          max: 4,
          current: 1,
        },
      ],
    }
    
  ),
  watch: {
    '$store.state.userView': {
      handler() {
        console.log(this.$store.state.userView);
      }
    },
    'displayDialog': {
      handler() {
        console.log(this.displayDialog);
        if (this.displayDialog === false) {
          if( this.$store.state.usingChat === false) {
            this.value = 1;
          }
          this.beforeConnect = false
        } 
      }
    },
    
  },
  methods: {
    async setPage(item) {
      this.$store.commit('setUserView', item.label);
      if(item.label === 'chat') {
        if (this.$store.state.usingChat === false ) {
          this.chatList = await this.$axiosAPI('api/room', 'get');  
          this.displayDialog = true;
        } 
      }
      this.$store.commit('setUserView', item.label); 
    },
    // validConnection() {
    //   this.beforeConnect = true;
    //   this.dialogType = 'find';

    // }
  }
}
</script>

<style>

</style>