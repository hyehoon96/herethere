<template>
  <v-card  max-width='500px' style="z-index: 99; position: absolute; bottom: 0;">
    <div>
      <v-toolbar  height="30px">
        <v-toolbar-title>
          other message
        </v-toolbar-title>
      </v-toolbar>
    </div>
    <div>
      <v-textarea
        v-model="textarea" 
        disabled 
      >
      </v-textarea>
    </div>
    <div>
      <v-toolbar  height="30px">
        <v-toolbar-title>
          my message
        </v-toolbar-title>
      </v-toolbar>
    </div>
    <div>
      <v-text-field
        v-model="myMessage"
      >
      </v-text-field>
      <v-btn
        @click="sendMessage"
        :color="'primary'"
      >Submit</v-btn>
    </div>

  </v-card>
</template>

<script>
import io from 'socket.io-client'
export default {
  data() {
    return {
      textarea: '',
      myMessage: '',
      socket: null
    }
  },
  created() {
    this.socket = io('http://localhost:8080');

  },
  mounted() {
    this.socket.on('chat', (data) => {
      this.textarea += data.message + "\n";
    })
  },
  methods: {
    sendMessage() {
      this.socket.emit('send', {
        message: this.myMessage
      });
      this.textarea += this.myMessage + "\n";
      this.myMessage = '';
    }
  }
}
</script>

<style>

</style>