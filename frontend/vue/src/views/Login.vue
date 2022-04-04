<template>
  <v-container fluid style="height: 100vh;">
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
                v-model="nickName"
              >
              </v-text-field>
              <v-text-field
                outlined
                label="비밀번호"
                type="password"
                append-icon="mdi-lock"
                v-model="password"
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
              <v-btn color="green" dark>회원가입</v-btn>
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
    nickName: null,
    password: null,
  }),

  methods:{
    login() {
      
    },
  }
}
</script>

<style>

</style>