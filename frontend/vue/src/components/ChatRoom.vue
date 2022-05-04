<template>
  <div v-show="$store.state.userView === 'chat'">
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
            <p :class="item.isMine ? 'my-chat': 'other-chat'" v-if="item.chat">
              {{item.chat}} 
              <span >님의 현재 위치
                <v-avatar
                  color="white"
                  size="36"
                >
                  <span>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </span>
                </v-avatar>
              </span>
            </p>
          </div>
          <div v-if="item.systemMsg">
            <p class="pa-2" style="color: #6c757d; white-space: break-spaces">{{item.systemMsg}}</p>
          </div>
        </div>
      </div>
      
      <div v-if="showMenu" class="text-center">
        <v-chip
          label
        >
          지도 공유
        </v-chip>
        <v-chip
          label
          class="ma-2"
        >
          내 위치 공유
        </v-chip>
        <v-chip
          label
        >
          약속장소 투표
        </v-chip>
        
      </div>
      <div class="d-flex" style="border-top: 1px solid #dcdcdc; max-height: 30vh;">
        <v-textarea 
          flat
          solo
          hide-details
          no-resize
          :height="$vuetify.breakpoint.xs ? 'height: 30vh;' : 'height: 15vh;'"
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
    }
  },

  async mounted() {
    this.roomId = atob(this.roomNumber);
    let findRoom = await this.$axiosAPI('/api/room/'+ this.roomId, 'get');
    console.log(findRoom);
    if (findRoom.empty) {
      alert('잘못된 링크입니다.');
      this.$router.push('/');
    } 
    
    this.vapidKey = Math.random().toString(36).substr(2,11); // 메시지 식별 랜덤 키
    this.socket = io('http://localhost:8080/room', { // 네임스페이스
      path: '/socket.io',
    });

    if (this.role === 'guest') {
      this.userNameInChat = this.user;
    } else {
      this.userNameInChat = 'user' + Math.floor(Math.random() * 100);
    }
    if (this.$store.state.usingChat === false) {
      console.log('usingChat change');
      await this.socket.emit('roomId', {
        roomId: this.roomId, 
        user: this.userNameInChat, 
        currentClient: findRoom.currentClient + 1
      });
      this.$store.commit('setUsingChat', true);
    } else {
      // show dialog
      console.log('show dialog');
    }
    
    this.socket.on('chat', (data) => {
      console.log('chat received', data);
      if( data.vapidKey === this.vapidKey ) {
        data.isMine = true;
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
    
    
  },
  
  watch: {
    '$route.name': {
      handler () {
        console.log('라우터가 변경되었습니다.');
        this.socket.disconnect();
        this.$store.commit('setUsingChat', false);
      }
      
    }
  },
  unmounted() {
    console.log('unmount!!');
  },
  
  methods: {
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
    
    confirmLeave(event) {
      event.preventDefault();
      // Chrome에서는 returnValue 설정이 필요함
      event.returnValue = '';
      
    },
    
    
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