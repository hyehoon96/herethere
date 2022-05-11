import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,      
      paths: ['usingChat', 'userView', 'isLogin', 'nickname', 'chatRole']
    }),
  ],
  state: {
    usingChat: false,
    userView: null,
    isLogin: null,
    nickname: null,
    chatRole: null
  },
  mutations: {
    setUsingChat(state, data) {
      state.usingChat = data;
    },
    
    setUserView(state, data) {
      state.userView = data;
    },

    setIsLogin(state, data) {
      state.isLogin = data;
    },
    setUserNickname(state, data) {
      state.nickname = data;
    },
    setChatRole(state, data) {
      state.chatRole = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
