// import mixin from "@/mixin.js";
export default {
  watch: {
    'displayDialog': {
      handler() {
        this.beforeConnect = !this.displayDialog;
        if ( this.displayDialog === false && this.$store.state.usingChat === false) {
          this.value = 1;
        }
      }
    },
    '$store.state.usingChat': {
      handler() {
        if ( this.$store.state.usingChat ) {
          this.value = 0;
        } else {
          this.$store.commit('initSearchResult');
        }
      }
    }
  },
  methods: {
    async createRoom() {
      if(this.roomNumber.length < 6) {
        alert('비밀번호는 6자리 이상이어야 합니다.');
        return;
      }
      
      let room = await this.$axiosAPI('/api/room/' + this.roomNumber ,'get');
      if (!room.empty) {
        alert('다른 비밀번호를 사용해주세요.');
      } else {
        let roomObj = {
          owner: '',
          title: this.$store.state.nickname + '님의 채팅방',
          max: this.roomMax,
          password: this.roomNumber
        }
        await this.$axiosAPI('/api/room/', 'post', roomObj);
        try {
          let roomParams = {
            roomNumber : btoa(this.roomNumber),
            role: 'owner'
          }
          this.$router.push({ name: 'ChatRoom', params: roomParams });
          this.$store.commit('setUserView', 'chat');
        } catch (e) {
          alert(e);
        }
        
        this.displayDialog = false;
      }
    },

    async findRoom() {
      try {
        let roomParams = {
          roomNumber: btoa(this.roomNumber),
          user: this.userName,
          role: 'guest'
        }
        this.$router.push({ name: 'ChatRoom', params: roomParams });
        this.$store.commit('setUserView', 'chat');
        this.$store.commit('setUserNickname', this.userName);
      } catch(e) {
        alert(e);
      }
      this.displayDialog = false;
      
    },

    validConnection(item) {
      if (item.currentClient >= item.max) {
        alert('채팅방 인원이 초과하였습니다.');
        return;
      }
      this.beforeConnect = true;
      this.dialogType = 'find';

    },

    closeChatRoom() {
      
      let result = window.confirm('채팅방을 종료하시겠습니까?');
      if (result) {
        this.socket.disconnect();
        this.$store.commit('setUsingChat', false);
        this.$store.commit('setUserView', 'map');
        this.$router.push('/');
        this.value = 1;
        
      }
    },

    showOthersLocate(item) {
      this.$emit('sendCoordToMap', item);
    },
    
    async getVoteItem() {
      if ( this.$store.state.chatRole !== 'owner' || localStorage.getItem('isLogin') === false) {
        alert('투표 목록 생성은 로그인 후 이용하실 수 있습니다. 투표는 진행하실 수 있습니다.');
        return;
      }
      this.$emit('getVoteItem');
      this.displayDialog = true;
    }
  }
}