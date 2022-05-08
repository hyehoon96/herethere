import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,      
      paths: ['usingChat', 'userView']
    }),
  ],
  state: {
    usingChat: false,
    userView: null,
    // globalMarkers: null,
    // globalBounds: null,
    // globalCenterLatlng: null,
    // globalPolygonBundle: null
  },
  mutations: {
    setUsingChat(state, data) {
      state.usingChat = data;
    },
    
    setUserView(state, data) {
      state.userView = data;
    },

    // saveMapData(state, data) {
    //   switch (data.type) {
    //     case 'marker':
    //       state.globalMarkers = data.mapData;
    //       break;
    //     case 'bounds':
    //       state.globalBounds = data.mapData;
    //       break;
    //     case 'center':
    //       state.globalCenterLatlng = data.mapData;
    //       break;
    //     case 'polygon':
    //       state.globalPolygonBundle = data.mapData;
    //       break;
    //   }
    // }
  },
  actions: {
  },
  modules: {
  }
})
