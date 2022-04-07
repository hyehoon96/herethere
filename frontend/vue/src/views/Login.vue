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
      >
        <template v-slot:body>
          <v-row class="mt-3" v-for="item in loginForm" :key="item.label" justify="center">
            <v-col cols="11">
              <v-select
                v-if="item.list"
                append-icon="mdi-account"
                :label="item.label"
                :items="item.list"
                outlined
              />
              <v-text-field
                v-else
                outlined
                append-icon="mdi-account"
                :label="item.label"
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
                append-icon="mdi-account"
              >
              </v-text-field>
              <v-text-field
                outlined
                label="비밀번호"
                type="password"
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
              <v-btn color="primary">로그인</v-btn>
              <v-btn color="green" dark @click="displayDialog = true;">회원가입</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomDialog from '@/components/CustomDialog'
export default {
  components: {
    CustomDialog,
  },
  data: () => ({
    displayDialog: false,
    loginForm: [
      {label : '아이디 *', icon: 'mdi-account', model: null},
      {label : '비밀번호 *', icon: 'mdi-account', model: null},
      {label : '비밀번호 확인 *', icon: 'mdi-account', model: null},
      {label : '연령대', icon: 'mdi-account', model: null, list: ['10대', '20대', '30대', '40대', '50대', '60대 이상']},
      {label : '성별', icon: 'mdi-account', model: null, list: ['여성', '남성']},
      {label : '질문 *', icon: 'mdi-account', model: null, list: ['애완동물의 이름은?', '좋아하는 음식은?']},
      {label : '답변 *', icon: 'mdi-account', model: null},
    ]
  }),
  methods: {

    submitDialog() {
      console.log('submit 완료!')
      this.displayDialog = false;
    },
  }
}
</script>

<style>

</style>