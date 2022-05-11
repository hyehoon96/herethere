import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,      
      paths: ['usingChat', 'userView', 'isLogin', 'nickname', 'chatRole', 'searchResult']
    }),
  ],
  state: {
    usingChat: false,
    userView: null,
    isLogin: null,
    nickname: null,
    chatRole: null,
    searchResult: []
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
    },
    initSearchResult(state) {
      // 검색 값이 바뀌거나
      // 채팅 종료시 초기화됨
      state.searchResult = [];
    },
    setSearchResult(state, data) {
      for ( let i = 0; i < data.length; i++) {
        state.searchResult.push(data[i]);
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
