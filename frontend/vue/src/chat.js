// import axios from "axios";
// import mixin from "@/mixin.js";
export default {

  methods: {
    async createRoom() {
      let room = await this.$axiosAPI('/api/room/' + this.roomNumber ,'get');
      if (!room.empty) {
        alert('다른 비밀번호를 사용해주세요.');
      } else {
        let roomObj = {
          owner: '',
          title: this.roomTitle,
          max: this.roomMax,
          password: this.roomNumber
        }
        await this.$axiosAPI('/api/room/', 'post', roomObj);
        try {
          this.$router.push({ name: 'ChatRoom', params: {roomNumber: btoa(this.roomNumber), roomMax: Number(this.roomMax), role: 'owner'} });
          this.$store.commit('setUserView', 'chat');
        } catch (e) {
          alert(e);
        }
        
        this.displayDialog = false;
      }
    },

    async findRoom() {
      let room = await this.$axiosAPI('/api/room/' + this.roomNumber ,'get');
      if(!room.empty) {
        if(room.max === room.currentClient) {
          alert('채팅방 인원이 초과하였습니다.');
          return;
        }
        try {
          this.$router.push({ name: 'ChatRoom', params: {roomNumber: btoa(this.roomNumber), roomMax: room.max, user: this.userName, role: 'guest'} });
        this.$store.commit('setUserView', 'chat');
        
        } catch(e) {
          alert(e);
        }
        this.displayDialog = false;
      } else {
        alert('채팅방을 찾을 수 없습니다.');
      }
    },

    connectChatRoom() {
      this.beforeConnect = true;
      this.dialogType = 'find';

    }

  }
}