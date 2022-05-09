<template>

  <v-container fluid style="height: 100vh;">
    <v-dialog
      max-width="500"
      v-model="displayDialog"
    > 
      <custom-dialog
        header-title="회원가입 ( * 항목은 필수항목입니다.)"
        @hide="displayDialog = false;"
        @submit="submitDialog"
        :footerSubmitTitle="'가입'"
      >
        <template v-slot:body>
          <v-row class="mt-3" v-for="(item, i) in loginForm" :key="item.label" justify="center">
            <v-col cols="11">
              <v-select
                v-if="item.list"
                :append-icon="item.icon"
                :label="item.label"
                :items="item.list"
                v-model="loginForm[i].model"
                outlined
              />
              <v-text-field
                v-else
                outlined
                :append-icon="item.icon"
                v-model="loginForm[i].model"
                :label="item.label"
                :type="item.label === '비밀번호 *' || item.label === '비밀번호 확인 *' ? 'password' : 'text'"
              />
            </v-col>
          </v-row>
          
        </template>
      </custom-dialog>
    </v-dialog> 
    <v-row justify="center"  align="center" class="my-auto" style="height: 100%;">
      <v-col cols="12" sm="5">
        <v-card>
          
          <v-row justify="center">
            <v-col cols="12" style="padding: 0 12px;">
              <v-toolbar class="mb-5" color="primary" dark height="35">
                <v-toolbar-title > <span class="font-weight-bold" style="font-size: 14px;">Login</span> </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon color="white">mdi-information</v-icon>
                </v-btn>
              </v-toolbar>

            </v-col>
            <v-col cols="8">
              <v-text-field
                outlined
                label="아이디"
                type="string"
                v-model="userid"
                append-icon="mdi-account"
              >
              </v-text-field>
              <v-text-field
                outlined
                label="비밀번호"
                type="password"
                v-model="password"
                append-icon="mdi-lock"
              >
              </v-text-field>

            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <v-btn depressed style="color: #258fff;">비밀번호를 잊어버렸어요!</v-btn>
            </v-col>
            <v-col cols="12" class="justify-center d-flex">
              <v-btn color="primary" @click="login">로그인</v-btn>
              <v-btn color="green" dark @click="displayDialog = true;">회원가입</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  
  data: () => ({
    displayDialog: false,
    loginForm: [
      {label : '아이디 *', prop: 'userid', icon: 'mdi-identifier', model: null},
      {label : '비밀번호 *', prop: 'password',icon: 'mdi-lock', model: null},
      {label : '비밀번호 확인 *', icon: 'mdi-lock-check', model: null},
      {label : '닉네임 *', prop: 'nickname', icon: 'mdi-account', model: null},
      {label : '이름 *', prop: 'name',icon: 'mdi-card-account-details', model: null},
      {label : '질문 *', prop: 'question', icon: 'mdi-account-question', model: null, list: ['애완동물의 이름은?', '좋아하는 음식은?']},
      {label : '답변 *', prop: 'answer', icon: 'mdi-forum', model: null},
      {label : '연령대', prop: 'age', icon: 'mdi-tag-faces', model: null, list: ['10대', '20대', '30대', '40대', '50대', '60대 이상']},
      {label : '성별', prop: 'gender', icon: 'mdi-human-male-female', model: null, list: ['여성', '남성']},
      
    ],
    userid: null,
    password: null
  }),
  methods: {

    async submitDialog() {
      if( this.loginForm[1].model !== this.loginForm[2].model) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      let loginFormArr = [];
      for (let property of this.loginForm) {
        if (property.prop) {
          loginFormArr.push(property.prop);
        }
      }
      let userInfo = {};
      for (let value of loginFormArr) {
        this.loginForm.forEach((item) => {
          if (item.prop === value) {
            userInfo[value] = item.model
          }
        })
      }     
      let res = await this.$axiosAPI('/api/user/', 'post', userInfo);
      if( res.userid ) {
        alert('회원가입이 완료되었습니다.');
        this.displayDialog = false;
      }
    },

    async login() {
      if( !this.userid || !this.password ) {
        alert('아이디와 비밀번호를 입력해주세요.');
        return;
      }
      await this.$axiosAPI('/api/auth/login' ,'post', {userid: this.userid, password: this.password});
      this.$store.commit('setIsLogin', true);
      this.$router.push('/');
    }
  }
}
</script>

<style>

</style>