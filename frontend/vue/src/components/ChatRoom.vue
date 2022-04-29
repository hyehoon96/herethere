<template>
  <div>
    <v-btn fab class="float-btn" @click="displayChatRoom = true;" v-if="displayChatRoom === false">채팅</v-btn>
    <v-card style="z-index: 11; position: absolute; bottom: 0; min-width: 350px;" v-if="displayChatRoom">
      <v-toolbar color="primary" height="35">
        <v-toolbar-title style="color: white;">
          <span>Group</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon height="35" width="35" color="white" @click="displayChatRoom = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class style="height: 300px; overflow-y: scroll;">
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
            </p>
          </div>
          <div v-if="item.systemMsg">
            <p style="color: #6c757d; text-align: center;">{{item.systemMsg}}</p>
          </div>
        </div>
      </div>
      
      <div v-if="showMenu">
        <v-chip
          label
          class="ma-2"
        >
          지도 공유
        </v-chip>
        <v-chip
          label
        >
          투표
        </v-chip>
      </div>
      <div class="d-flex" style="border-top: 1px solid #eaeaea;">
        <v-textarea 
          flat
          solo
          hide-details
          no-resize
          height="120"
          v-model="chatInput"
          @keyup="sendMessage"
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
export default {
  name: 'ChatRoom',
  data() {
    return {
      displayChatRoom: true,
      textarea: '',
      myMessage: '',
      vapidKey: null,
      socket: null,
      chatRoom: null,
      userNameInChat: null,
      showMenu: false,
      chatArr: [
        // { user:'이혜훈', chat: 'hello my name is .... long sentence, im not robot btw ', isMine: false},
        // { user:'', chat: 'hello', isMine: true },
        // { user:'', chat: 'hello', isMine: true },
        // { user:'이혜훈1', chat: 'hi', isMine: false },
        { user:'', chat: '', isMine: false, systemMsg: '환영합니다. 채팅방에 접속한 사람이 없으면 방이 삭제됩니다.' }
      ],
      chatInput: [],
    }
  },
  props: {

    roomNumber: {
      type: String,
    },
    roomMax: {
      type: Number,
      default: 4
    },
    user: {
      type: String
    },
    role: {
      type: String,
    }
  },

  async mounted() {
    this.chatRoom = atob(this.roomNumber);
    console.log(this.chatRoom);
    let findRoom = await this.$axiosAPI('/api/room/'+ this.chatRoom, 'get');
    
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
    console.log(findRoom);
    this.socket.emit('roomId', {roomId: this.chatRoom, user: this.userNameInChat, currentClient: findRoom.currentClient + 1});
    this.socket.on('chat', (data) => {
      console.log('chat received', data);
      if( data.vapidKey === this.vapidKey ) {
        data.isMine = true;
      }
      this.chatArr.push(data);
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
 
  async destroyed() {
    
  },

  methods: {
    async sendMessage() {
      let msg = {
        user: this.userNameInChat,
        chat: this.chatInput,
        vapidKey: this.vapidKey,
        systemMsg: null
      }
      await this.$axiosAPI('/api/room/'+ this.chatRoom, 'post', msg)
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

.float-btn {
  position: absolute;
  width: 64px !important;
  height: 64px !important;
  bottom: 100px;
  right: 18px;
  background-color: #e91e63 !important;
  color: #FFF !important;
  border-radius: 50px;
  text-align: center;
  box-shadow: 2px 2px 3px #999;
  z-index: 12;
}
</style>