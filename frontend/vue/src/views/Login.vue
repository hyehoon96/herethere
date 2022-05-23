<template>

  <v-container fluid style="height: 100vh;">
    <v-dialog
      max-width="500"
      v-model="displayDialog"
    > 
      <custom-dialog
        :header-title="dialogType === 'regist' ? '회원가입 ( * 항목은 필수항목입니다.)' : '비밀번호 찾기'"
        @hide="initInput()"
        @submit="dialogType === 'regist' ? registUser() : userQuestion ? dialogType === 'reset' ?  resetPassword(): checkUserAnswer() 
         : findUserQuestion() "
        :footerSubmitTitle="dialogType === 'regist' ? '가입' : '찾기'"
      >
        <template v-slot:body>
          <div v-if="dialogType === 'regist'">
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
                  :type="item.label === '비밀번호 (6자리 이상) *' || item.label === '비밀번호 확인 *' ? 'password' : 'text'"
                />
              </v-col>
            </v-row>
          </div>
          <div v-else-if="dialogType === 'forget'">
            <v-row class="mt-3" justify="center" v-if="validUserInfo">
              <v-col cols="11">
                <v-text-field
                  outlined
                  append-icon="mdi-identifier"
                  v-model="forget.userid"
                  label="아이디를 입력해주세요."
                />
              </v-col>
              <v-col cols="11">
                <v-text-field
                  outlined
                  append-icon="mdi-rename-box"
                  v-model="forget.nickname"
                  label="닉네임을 입력해주세요."
                />
              </v-col>
              <v-col cols="11" v-if="userQuestion">
                <h4 class="mb-3">{{userQuestion}}</h4>
                <v-text-field
                  outlined
                  append-icon="mdi-rename-box"
                  v-model="userAnswer"
                  label="답변을 입력해주세요."
                />
              </v-col>
              
            </v-row>
          </div>
          <div v-else>
            <v-row class="mt-3" justify="center">
              <v-col cols="11">
                <v-text-field
                  outlined
                  append-icon="mdi-password"
                  v-model="rePassword"
                  label="새 비밀번호"
                  type="password"
                >
                </v-text-field>
                <v-text-field
                  outlined
                  append-icon="mdi-password"
                  v-model="validRePassword"
                  label="새비밀번호 확인"
                  type="password" 
                />
              </v-col>
            </v-row>
          </div>
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
                @keyup.enter="login"
              >
              </v-text-field>
              <v-checkbox
                label="로그인 기억"
                v-model="remember"
              >
              <!-- v-if android -->
              </v-checkbox>
            </v-col>
            
          </v-row>
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <v-btn depressed style="color: #258fff;" @click="displayDialog = true; dialogType = 'forget'; validUserInfo = true;">비밀번호를 잊어버렸어요!</v-btn>
            </v-col>
            <v-col cols="12" class="justify-center d-flex">
              <v-btn color="primary" @click="login">로그인</v-btn>
              <v-btn color="green" dark @click="displayDialog = true; dialogType = 'regist'">회원가입</v-btn>
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
      {label : '비밀번호 (6자리 이상) *', prop: 'password',icon: 'mdi-lock', model: null},
      {label : '비밀번호 확인 *', icon: 'mdi-lock-check', model: null},
      {label : '닉네임 *', prop: 'nickname', icon: 'mdi-account', model: null},
      {label : '이름 *', prop: 'name',icon: 'mdi-card-account-details', model: null},
      {
        label : '질문 *', 
        prop: 'question', 
        icon: 'mdi-account-question', 
        model: null, 
        list: ['애완동물의 이름은?', '좋아하는 음식은?', '추억의 장소는?' ,'친한 친구의 별명은?', '좋아하는 캐릭터는?', '보물 1호는?']},
      {label : '답변 *', prop: 'answer', icon: 'mdi-forum', model: null},
      {label : '연령대', prop: 'age', icon: 'mdi-tag-faces', model: null, list: ['10대', '20대', '30대', '40대', '50대', '60대 이상']},
      {label : '성별', prop: 'gender', icon: 'mdi-human-male-female', model: null, list: ['여성', '남성']},
      
    ],
    userid: null,
    password: null,
    remember: false,
    dialogType: null,
    forget: {
      userid: null,
      nickname: null
    },
    userQuestion: null,
    userAnswer: null,
    correctAnswer: null,
    rePassword: null,
    validRePassword: null,
    validUserInfo: false,
  }),
  methods: {
    initInput() {
      this.displayDialog = false,
      this.displayDialog = null;
      this.forget = {
        userid: null,
        nickname: null
      },
      this.userQuestion = null;
      this.userAnswer = null;
      this.correctAnswer = null;
      this.rePassword = null;
      this.validRePassword = null;
    },
    async registUser() {
      for ( let j = 0; j < 7; j++) {
        if( this.isEmpty(this.loginForm[j].model)) {
          alert('필수 항목을 모두 입력해주세요.');
          return;
        }
      }
      if( this.loginForm[1].model !== this.loginForm[2].model) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if ( this.loginForm[1].model.length < 6 ) {
        alert('비밀번호는 6자리 이상 입력해주세요.');
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
      let res = await this.$axiosAPI('/api/auth/login' ,'post', {userid: this.userid, password: this.password, remember: this.remember});
      //this.$store.commit('setIsLogin', true);
      localStorage.setItem('isLogin', true);
      this.$store.commit('setUserNickname', res.nickname);
      this.$router.push('/');
    },

    async findUserQuestion() {
      if (this.isEmpty(this.forget.userid) || this.isEmpty(this.forget.nickname)) {
        alert('입력을 확인해주세요.');
        return
      }
      let res = await this.$axiosAPI('/api/user/reset/' + this.forget.userid + '/' + this.forget.nickname, 'get');
      // 닉네임과 아이디로 계정의 질문과 답변을 가져온다.
      this.userQuestion = res.question,
      this.correctAnswer = res.answer;
      
    },

    checkUserAnswer() {
      if ( this.correctAnswer !== this.userAnswer) {
        alert('답변이 맞지 않습니다.');
        return;
      } 
      this.dialogType = 'reset'
    },

    async resetPassword() {
      let newUserInfo = {
        userid: this.forget.userid,
        nickname: this.forget.nickname,
        rePassword: this.rePassword
      }

      if (this.rePassword !== this.validRePassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (this.rePassword.length < 6 ) {
        alert('비밀번호는 6자리 이상 입력해주세요.');
        return;
      }
      await this.$axiosAPI('/api/user/reset/' + this.forget.userid + '/' + this.forget.nickname, 'put', newUserInfo);
      alert('비밀번호가 변경되었습니다!');
    }
  }
}
</script>

<style>

</style>