<template>
  <div v-show="$store.state.userView === 'chat'">
     <v-dialog
      v-model="displayDialog"
      max-width="500"
      :persistent="!verification"
    >
      <custom-dialog
        :header-title="dialogType === 'verification' ? '재인증' : '최대 5개 선택'"
        @hide="displayDialog = false;"
        :footerSubmit="true"
        :footerSubmitTitle="dialogType === 'verification' ? '전송' : '생성'"
        :footerCloseBtn="dialogType === 'verification' ? false : true"
        @submit="dialogType === 'verification' ? verificationEnter() : createVote()"
      >
      <!-- @submit="createVote" -->
        <template v-slot:body v-if="dialogType ==='verification'">
          <v-row justify="center">
            <v-col cols="11">
              <v-text-field
                v-model="reNickname"
                outlined
                hide-details
                label="채팅방에서 사용할 이름"
                class="mb-5"
              />
              <v-text-field
                v-model="rePassword"
                outlined
                hide-details
                label="채팅방 비밀번호"
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:body v-else>
          <div v-if="cookedVoteList.length === 0" class="text-center">지역을 먼저 검색해주세요.</div>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="cookedVoteList"
            item-key="name"
            show-select
            class="elevation-1"
            mobile-breakpoint="0"
            
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.category="{ item }">
              <v-chip pill outlined color="accent" :style="$vuetify.breakpoint.xs ? 'font-size: 12px;' : null">
                {{item.category}}
              </v-chip>
            </template>
            <!-- eslint-disable-next-line -->
            <template v-slot:item.addr="{ item }" class="d-none">
              {{item.addr}}
            </template>
          </v-data-table>
        </template>
      </custom-dialog>
    </v-dialog>
    
    
    
    <v-btn fab class="float-btn" 
      @click="displayChatRoom = true;" 
      v-if="displayChatRoom === false && !$vuetify.breakpoint.xs"
    >
      <v-icon>mdi-chat-processing</v-icon>
      <div>채팅</div>
    </v-btn>
    <v-card class="chat-card" 
      :style="$vuetify.breakpoint.lgAndUp 
      ? 'width: 25vw;' 
      : $vuetify.breakpoint.xs 
        ? 'width: 100vw; height: calc(100vh - 56px);'
        : 'width: 30vw;'" 
      v-if="displayChatRoom"
    >
      <v-toolbar color="primary" height="35">
        <v-toolbar-title style="color: white;">
          <span>채팅방</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon height="35" width="35" color="white" @click="closeChatRoom">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div 
        :style="$vuetify.breakpoint.xs ? 'height: 70vh; overflow-y: auto;' : 'height: 30vh; overflow-y: scroll;'"
        id="chat-area"
      >
        <div class="d-flex my-1" v-for="(item, i) in chatArr" :key="i">
          <v-chip
            class="ma-2"
            color="primary"
            outlined
            v-if="item.user && item.vapidKey !== vapidKey"
          >
            {{item.user}}
          </v-chip>
          <div :class="item.isMine ? 'd-flex justify-end mx-2 w-100' : ''">
            <p :class="item.isMine ? 'my-chat': 'other-chat'" v-if="item.chat && !item.voteList">
              {{item.chat}} 
              <span v-if="item.locate">
                <v-avatar
                  color="white"
                  size="36"
                  @click="showOthersLocate(item.locate)"
                  style="cursor: pointer;"
                >
                  <span>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </span>
                </v-avatar>
              </span>
            </p>
            <v-card v-if="item.voteList">
              <v-toolbar
                color="pink"
                dark
                height="32px"
              >
              <v-toolbar-title style="font-size: 16px;">
                투표 목록
              </v-toolbar-title>
              </v-toolbar>
              <v-list two-line>
                <v-list-item-group
                  v-model="voteSelected"
                  active-class="pink--text"
                  multiple
                >
                  <template v-for="(item) in item.voteList">
                    <v-list-item :key="item.title">
                      <template v-slot:default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-chip outlined color="indigo darken-3">
                              {{item.name}}
                            </v-chip>

                          </v-list-item-title>

                          <v-list-item-subtitle
                            class="ml-2"
                            v-text="item.category"
                          ></v-list-item-subtitle>

                          <!-- <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle> -->
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-list-item-action-text v-if="isSubmit">
                            <v-chip label color="pink" text-color="white">
                              {{item.vote}}
                            </v-chip>
                          </v-list-item-action-text>
                          <v-list-item-action-text v-else>
                            선택
                          </v-list-item-action-text>
                          <v-icon
                            v-if="!active"
                            color="grey lighten-1"
                          >
                            mdi-star-outline
                          </v-icon>

                          <v-icon
                            v-else
                            color="yellow darken-3"
                          >
                            mdi-star
                          </v-icon>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </template>
                  <div class="text-center">
                    <v-btn color="pink" dark @click="sendSelected">SUBMIT</v-btn>
                  </div>
                </v-list-item-group>
              </v-list>
            </v-card>
          </div>
          <div v-if="item.systemMsg">
            <p class="pa-2" style="color: #6c757d; white-space: break-spaces">{{item.systemMsg}}</p>
          </div>
        </div>
      </div>
      
      <div v-if="showMenu" class="text-center">
        <v-chip
          label
          class="ma-2"
          @click="sendMyLocate"
        >
          내 위치 공유
        </v-chip>
        <v-chip
          label
          @click="getVoteItem"
        >
          투표 생성
        </v-chip>
        
      </div>
      <div class="d-flex" style="border-top: 1px solid #dcdcdc; max-height: 30vh;">
        <v-textarea 
          flat
          solo
          hide-details
          no-resize
          v-model="chatInput"
          @keyup.enter="sendMessage"
        >
          <template slot="append">
            <div class="d-flex" style="flex-direction: column;">
              <v-icon @click="sendMessage">mdi-send</v-icon>
              <v-icon class="my-5" @click="showMenu = !showMenu;">mdi-dots-vertical</v-icon>
            </div>
          </template>
        </v-textarea>      
      
      </div>
    </v-card>
  </div>
</template>

<script>
import io from 'socket.io-client'
import chat from '@/chat.js'
export default {
  mixins: [chat],
  name: 'roomId',
  data() {
    return {
      displayDialog: null,
      displayChatRoom: true,
      textarea: '',
      myMessage: '',
      vapidKey: null,
      socket: null,
      roomId: null,
      userNameInChat: null,
      showMenu: false,
      chatArr: [
        // { user:'이혜훈', chat: 'hello my name is .... long sentence, im not robot btw ', isMine: false},
        // { user:'', chat: 'hello', isMine: true },
        // { user:'', chat: 'hello', isMine: true },
        // { user:'이혜훈1', chat: 'hi', isMine: false },
        { user:'', chat: '', isMine: false, 
          systemMsg: '환영합니다. 방문해주셔서 감사합니다.\n - 채팅방에 접속한 사람이 없으면 방이 삭제됩니다.\n - 대화 내용은 저장되지 않습니다. ' }
      ],
      chatInput: [],
      headers: [
        { text: '이름', value: 'name', align: 'center' },
        { text: '분류', value: 'category', sortable: false, align: 'center' },

      ],
      cookedVoteList:[], // name, category만 들어간 list
      selected: [], // 투표창에 들어갈 place
      voteSelected: [], // 투표창 안에서 선택된 place의 index
      isSubmit: false, // 투표여부
      currentVoteList: [], // 채팅창 안에 렌더링 된 최근 투표창
      rePassword: null,
      verification: false,
      dialogType: null,
      currentClient: null,
    }
  },
  props: {

    roomNumber: {
      type: String,
    },

    user: {
      type: String
    },
    role: {
      type: String,
    },
    voteList:{
      type: Array,

    }
  },

  async mounted() {
    
    this.$store.commit('setChatRole', this.role);
    
    this.beforeEnter();
    this.socket = io('http://localhost:8080/room', { // 네임스페이스
      path: '/socket.io',
    });
    
    this.socket.on('chat', (data) => {
      console.log('chat received', data);
      if( data.vapidKey === this.vapidKey ) {
        data.isMine = true;
      }
      if( data.voteList) {
        this.isSubmit = false;
        this.currentVoteList = data.voteList;
      }
      this.chatArr.push(data);
      this.$nextTick(() => {
        let chat = document.getElementById("chat-area");
        chat.scrollTo(0, chat.offsetHeight);
      })
      
    })
    this.socket.on('join', (data) => {
      this.chatArr.push(data);
    })
    this.socket.on('exit', (data) => {
      this.chatArr.push(data); 
    })
    this.socket.on('system', (data) => {
      this.chatArr.push(data);
    })
    this.socket.on('voteChat', (data) => {
      let tempData = {
        user: data.user,
        chat: '투표 완료!',
        vapidKey: data.vapidKey
      };
      if( data.vapidKey === this.vapidKey ) {
        tempData.isMine = true;
      }
      console.log(data);
      for(let i = 0; i < data.index.length; i++) {
        this.currentVoteList[data.index[i]].vote +=1;
      }
      this.chatArr.push(tempData);
    })
    
  },
  
  watch: {
    '$route.name': {
      handler () {
        console.log('라우터가 변경되었습니다.');
        this.socket.disconnect();
        this.$store.commit('setUsingChat', false);
      }
      
    },
    'voteList': {
      handler() {
        this.cookedVoteList = [];
        for (let i = 0; i < this.voteList.length; i++) {
          this.cookedVoteList.push({
            name: this.voteList[i].place_name,
            category: this.voteList[i].category_name.split('>')[this.voteList[i].category_name.split('>').length-1],
            vote: 0
          })
        }
        
      }
    },
    selected (val, oldVal) {
      if (val.length > 5) {
        this.$nextTick(() => {
          this.selected = oldVal  
        })
      }
    },

  },
  
  methods: {
    async sendInitValue() {
      await this.socket.emit('roomId', {
        roomId: this.roomId, 
        user: this.userNameInChat, 
        currentClient: this.currentClient + 1
      });
      this.$store.commit('setUsingChat', true);
    },
    async beforeEnter() {
      this.roomId = atob(this.$route.params.roomNumber);
      let findRoom = await this.$axiosAPI('/api/room/'+ this.roomId, 'get');
      console.log(findRoom);
      // 채팅방이 없는 경우
      if (findRoom.empty) {
        alert('잘못된 링크입니다.');
        this.$router.push('/');
      } 
      this.currentClient = findRoom.currentClient;
      // 방장, 로그인한 게스트, 로그인 안한 게스트 - 비번 치고 접속, 로그인 안한 게스트 - 링크 타고 접속
      // if( this.$store.state.chatRole === 'owner' || (this.$store.state.nickname && localStorage.getItem('isLogin') && this.$store.state.chatRole === 'guest')) {
      //   // 방장 + 로그인 한 게스트
      //   this.userNameInChat = this.$store.state.nickname;
      //   this.sendInitValue();
      // } else if ((this.isEmpty(this.$store.state.nickname) || this.isEmpty(localStorage.getItem('isLogin'))) && this.isEmpty(this.user)) {
      //   // 로그인 안한 게스트 - 링크타고 접속 
      //   // 검증 로직
      //   this.displayDialog = true;
      //   this.dialogType = 'verification';
      // } else {
      //   // 로그인 안한 게스트 - 비번 입력 후 접속
      //   this.userNameInChat = this.user;
      //   this.sendInitValue();
      // }
      
      if ((this.isEmpty(this.$store.state.nickname) || this.isEmpty(localStorage.getItem('isLogin'))) && this.isEmpty(this.user)) {
        this.displayDialog = true;
        this.dialogType = 'verification';
      } else {
        this.userNameInChat = this.$store.state.nickname;
        this.sendInitValue();
      }

      this.vapidKey = Math.random().toString(36).substr(2,11); // 메시지 식별 랜덤 키

      
       
    },
    async sendMessage() {
      let msg = {
        user: this.userNameInChat,
        chat: this.chatInput,
        vapidKey: this.vapidKey,
        systemMsg: null
      }
      console.log('chat!', msg);
      await this.$axiosAPI('/api/room/'+ this.roomId, 'post', msg)
      this.chatInput = '';
    },
    async createVote() {
      let msg = {
        user: this.userNameInChat,
        chat: this.chatInput,
        vapidKey: this.vapidKey,
        voteList: this.selected,
      };
      await this.$axiosAPI('/api/room/' + this.roomId, 'post', msg);
      this.displayDialog = false;
      this.showMenu = false;
    },
    
    sendMyLocate() {
      if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition( async (position) => {
          //y: position.coords.latitude, x: position.coords.longitude
          let msg = {
            user: this.userNameInChat,
            chat: '님의 위치입니다.',
            vapidKey: this.vapidKey,
            systemMsg: null,
            locate: {
              y: position.coords.latitude,
              x: position.coords.longitude
            }
          };
          console.log(msg.locate);
          await this.$axiosAPI('/api/room/'+ this.roomId, 'post', msg);
          this.showMenu = false;
        },
        error => alert(error, '에러가 발생하였습니다.'),
        {enableHighAccuracy: true});
        
      } else {
        alert('지원하지 않는 브라우저입니다.');
      }
    },
    async sendSelected() {
      if( this.voteSelected.length === 0) {
        alert('목록을 선택해주세요.');
        return;
      }
      if ( this.isSubmit === true ) {
        alert('이미 투표하셨습니다.');
        return;
      }
      console.log(this.voteSelected);
      let cookedVoteSelected = {
        user: this.userNameInChat,
        vapidKey: this.vapidKey,
        index: this.voteSelected
      };
      
      await this.$axiosAPI('/api/room/vote/' + this.roomId, 'post', cookedVoteSelected);
      this.isSubmit = true;
    },
    verificationEnter() {
      if (this.roomId === this.rePassword) {
        this.verification = true;
        this.displayDialog = false;
        this.$store.commit('setUserNickname', this.reNickname);
        this.sendInitValue();
      } else {
        alert('채팅방 비밀번호가 틀렸습니다.');
      }
    }
    
  },
  // beforeRouteEnter: function (to, from, next) {
  //   console.log('before enter', from, next);
  // },
  // beforeRouteUpdate: function (to, from, next) {
  //   console.log('before update', from, next);
  // },
  beforeRouteLeave: function (to, from, next) { 
    const answer = window.confirm('페이지를 벗어나면 대화 내용이 사라집니다. 페이지를 벗어날까요?') 
    if (answer) { 
      next() 
    } else { 
      next(false) 
    } 
  }
}
</script>

<style>
.other-chat{
  max-width: 200px; background: #e0e0e0; border-radius: 16px; font-size: 14px; padding: 0.75em; line-height: 1.5em;
}

.my-chat{
  max-width: 200px; background: #1976D2; color:white; border-radius: 16px; font-size: 14px; padding: 0.75em; line-height: 1.5em;
}

.w-100 {
  width: 100%;
}

.chat-card{
  z-index: 11; 
  position: absolute; 
  bottom: 0;  
  box-shadow: unset !important;
  margin-bottom: 1px;
}

.float-btn {
  position: absolute;
  width: 64px !important;
  height: 64px !important;
  bottom: 16px;
  left: 18px;
  background-color: #e91e63 !important;
  color: #FFF !important;
  border-radius: 50px;
  text-align: center;
  box-shadow: 2px 2px 3px #999;
  z-index: 12;
}
</style>