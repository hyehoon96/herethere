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
      // eslint-disable-next-line
      if (!room.empty) {
        alert('다른 비밀번호를 사용해주세요.');
        this.roomNumber = null;
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
        this.roomNumber = null;
        if(this.$vuetify.breakpoint.xs) {
          this.showSideNav = false;
        }
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
      if(this.$vuetify.breakpoint.xs) {
        this.showSideNav = false;
      }
    },

    validConnection(item) {
      if (item.current_client >= item.max) {
        alert('채팅방 인원이 초과하였습니다.');
        return;
      }
      this.beforeConnect = true;
      this.dialogType = 'find';

    },
    validLogin() {
      if(!this.$store.state.nickname || !localStorage.getItem('isLogin')) {
        alert('로그인된 유저만 채팅방을 생성할 수 있습니다. 비로그인 유저는 채팅방 참여만 가능합니다.');
        return;
      }
      this.beforeConnect = true; 
      this.dialogType = 'create';
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
      this.$store.commit('setUserView', 'map');
      
    },
    
    async getVoteItem() {
      if ( localStorage.getItem('isLogin') === false) {
        alert('투표 목록 생성은 로그인 후 이용하실 수 있습니다. 투표는 진행하실 수 있습니다.');
        return;
      }
      this.$emit('getVoteItem');
      this.displayDialog = true;
    }
  }
}