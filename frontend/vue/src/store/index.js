import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,      
    }),
  ],
  state: {
    usingChat: false,
    userView: null
  },
  mutations: {
    setUsingChat(state, data) {
      state.usingChat = data;
    },
    
    setUserView(state, data) {
      state.userView = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
