<template>
  <v-card elevation="48" tile :width="$vuetify.breakpoint.xs ? '100%' : '360px'" >
    <v-dialog
      v-model="displayDialog"
      max-width="500"
    >
      <custom-dialog
        :header-title="dialogType === 'inquiry' ? '문의/버그' : dialogType === 'ranking' ? '핫플레이스' : '채팅방'"
        @hide="displayDialog = false;"
        @submit="dialogType === 'create' ? createRoom() : dialogType === 'find' ? findRoom() : sendInquiry()"
        :footerSubmit="beforeConnect"
        :footerSubmitTitle="'접속'"
        :footerCloseBtn="beforeConnect"
      >
        <template v-slot:body>
          <v-row v-if="dialogType === 'inquiry'" justify="center">
            <v-col cols="11" class="mt-5">
              <v-text-field
                solo
                label="제목"
                v-model="inquiry.title"
              ></v-text-field>
              {{inquiryLength}} / 100
              <v-textarea
                solo
                label="내용을 입력해주세요."
                v-model="inquiry.text"
              >
              </v-textarea>
              <div class="text-end">
                <v-btn color="primary" @click="sendInquiry">SUBMIT</v-btn>
                <v-btn @click="displayDialog = false; dialogType = null;">CLOSE</v-btn>
              </div>
            </v-col>
          </v-row>

          <v-card v-if="!beforeConnect && dialogType !== 'inquiry' && dialogType !== 'ranking'">
            <div class="d-flex" >
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                class="px-3"
              ></v-text-field>
              <div class="text-end">
                <v-btn
                  color="primary"
                  dark
                  class="my-5 pa-3 mr-3"
                  @click="validLogin"
                >
                  채팅방 생성
                </v-btn>
              </div>
            </div>
              
            <v-data-table
              :headers="headers"
              :items="chatList"
              :search="search"
              mobile-breakpoint="0"
              @click:row="validConnection"
            >
              
              <!-- eslint-disable-next-line -->
              <template v-slot:item.title="{ item }">
                <v-chip
                  dark
                  :color="item.max <= item.current_client ? 'amber' : 'success'"
                >
                  {{ item.title }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>

          <v-row class="mt-3"  justify="center" v-if="beforeConnect">
            <v-col cols="11" v-if="dialogType === 'find'">
              <v-text-field
                v-model="userName"
                outlined
                hide-details
                type="string"
                label="채팅방에서 사용할 이름을 입력하세요."
              />
            </v-col>
            <div class="d-flex justify-center" style="width: 100%;" v-else>
              <v-col cols="7">
                <v-text-field
                  v-model="roomTitle"
                  disabled
                  outlined
                  hide-details
                  type="string"
                  label="채팅방 제목"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="roomMax"
                  outlined
                  hide-details
                  :items="[1, 2, 3, 4]"
                  label="인원"
                />
              </v-col>
            </div>
            

            <v-col cols="11">
              <v-text-field
                v-model="roomNumber"
                outlined
                hide-details
                type="password"
                label="비밀번호 (숫자 6자 이상)"
              />
            </v-col>
          </v-row>
          <v-row v-if="dialogType === 'ranking'" justify="center">
            <v-col cols="11">
              <v-card class="mt-5" v-for="(place, index) in ranking" :key="index" elevation="10">
                <v-card-title class="mb-3">
                  <v-chip outlined color="primary">
                    {{place.name}}
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-row justify="space-between">
                    <v-btn icon color="primary" class="my-auto" @click="searchText = place.name; callSearchFunc(); hideShowSideNav();">
                      <v-icon>mdi-map-marker</v-icon>
                    </v-btn>
                    <v-avatar :color="index === 0 ? 'indigo' : index === 1 ? 'accent' : index === 2 ? 'success' : 'pink'" style="color: white;"
                    :size="$vuetify.breakpoint.xs ? '28' : '48'">
                      {{index+1}}
                    </v-avatar>
                  </v-row>
                  
                </v-card-title>
                <v-card-subtitle>
                  {{place.category_name}}
                </v-card-subtitle>
                <v-card-text>
                  <div>
                    <div class="mb-3">
                      <h4>북마크 수 :<v-chip class="ml-3">{{place.views}}</v-chip></h4>
                    </div>
                    <div>
                      <h4>최근 추가일 :<v-chip class="ml-3">{{place.updated_date.substr(0, 10)}}</v-chip></h4>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </custom-dialog>
    </v-dialog>

    <div class="pa-5 mini-bar" v-if="$vuetify.breakpoint.lgAndDown && !showSideNav">
      <v-toolbar dense width="100%">
        <v-btn  
          style="height: 100%;"
          elevation="0" 
          @click="showSideNav = !showSideNav; $emit('relayout', 'pc');"
          icon
        >
          <v-icon v-text="'mdi-menu'"></v-icon>
        </v-btn>
        <v-toolbar-title class="d-flex justify-center align-center" style="width: 100%;">
          <v-text-field
            solo
            label="장소를 검색해주세요!"
            append-icon="mdi-magnify"
            light
            flat
            hide-details
            @click="showList = true; "
            @click:append="callSearchFunc"
            @keyup.enter="callSearchFunc"
            v-model="searchText"
          >
          </v-text-field>
          <v-btn
            :color="showSearchResult ? 'green' : 'primary'"
            fab
            dark
            small
            right
            style="z-index: 13;"
            @click="showSearchResult = !showSearchResult"
          >
            <v-icon v-text="showSearchResult ? 'mdi-basket': 'mdi-format-list-bulleted'"></v-icon>
            <div v-if="showSearchResult">{{resultBundle}}</div>
          </v-btn>
        </v-toolbar-title>
      </v-toolbar>
      <!-- tablet / mobile ui -->
      <div v-if="searchResult.length > 0 && showList">
        <v-card
          class="mx-auto"
          max-height="250"
          flat
          tile
        >
          <!-- 검색 결과 -->
          <v-list v-if="showSearchResult">
            <v-list-item-group v-model="targetLocate">
              <v-list-item
                v-for="(item, i) in searchResult"
                :key="i"
                style="border-bottom: 1px solid #eaeaea;"
              >
                <v-list-item-icon>
                  <v-btn icon tile @click="addBookmark(item)">
                    <v-icon color="primary">mdi-bookmark-plus-outline</v-icon>
                    <div class="font-weight-black" style="font-size: 13px;">북마크</div>
                  </v-btn>
                </v-list-item-icon>
                <v-list-item-content 
                  @mouseover="moveMaptoTarget(item, i)"
                  @mouseout="closeInfowindow"
                  @click="pushInCalcBundle(item)"  
                >
                  <v-list-item-title class="font-weight-black">{{item.place_name}}</v-list-item-title>
                  <v-list-item-subtitle>
                    <div style="color: #3d75cc;">{{item.address_name}}</div>
                    <div style="color: green;" v-if="item.road_address">{{item.road_address.zone_no}}</div>
                    <div style="color: green;">{{item.phone}}</div>
                    
                  </v-list-item-subtitle>
                </v-list-item-content>
                <div style="font-size: 11px;" v-if="item.category_name">
                  {{item.category_name.split('>')[item.category_name.split('>').length-1]}}
                </div>
                
              </v-list-item>
              <div class="text-center" v-if="searchResult.length > 0">
                <!-- <ul id="placesList"></ul>
                <div id="pagination">
                </div> -->
                <v-pagination
                  v-model="page"
                  :length="pageLength"
                  @input="paginationObj.gotoPage(page)"
                  circle
                  style="box-shadow: none;"
                ></v-pagination>
              </div>
            </v-list-item-group>
          </v-list>

          <v-list v-else style="max-height: 35vh; overflow-y: scroll;">
            <v-list-item
              v-for="(item, i) in latlngBundle"
              :key="item.place_name"
              style="border-bottom: 1px solid #eaeaea;"
            >
              <v-list-item-icon @click="latlngBundle.splice(i,1)">
                <v-icon color="accent">mdi-minus</v-icon>
              </v-list-item-icon>
              <v-list-item-content @mouseover="moveMaptoTarget(item, i)" @mouseout="closeInfowindow">
                <v-list-item-title class="font-weight-black">{{item.place_name}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
            <div v-if="showList">
              <v-btn block color="primary" @click="getCenterLatlng">어디서 만날까요?</v-btn>
            </div>
          </v-list>
        </v-card>
      </div>
    </div>
    
    <!-- pc ui -->
    <v-navigation-drawer
      app
      :width="'360px'"
      id="sideNav"
      :permanent="showSideNav"
      v-show="showSideNav"
      style="overflow-y: hidden;"
    >
      <v-card color="primary" dark tile>
        <div class="d-flex justify-center py-3">
          <div style="width: 80%; text-align: center;">
            <h1 @click="getInquiry">HereThere</h1>
          </div>
          <div class="text-end" style="width: 10%;">
            <v-btn icon @click="showSideNav = !showSideNav; $emit('relayout', 'tab');">
              <v-icon size="36px">mdi-menu</v-icon>
            </v-btn>
          </div>
        </div>
        <v-row>
          <v-col cols="12" class="d-flex">
            
            <v-btn 
              icon
              background-color="#0097A7"
              color="white"
              class="flex-grow-1 d-flex flex-column" 
              v-for="item in menuGroup" :key="item.text"
              :to="item.route"
              :rounded="false"
              tile
              @click="item.text === '문의/버그' 
                      ? (displayDialog = true, dialogType = 'inquiry') 
                      : item.text ==='로그아웃' 
                      ? logout()
                      : null"
              min-height="40"
            >
              <v-icon size="20">{{item.icon}}</v-icon>
              <div class="font-weight-black" style="font-size: 13px;">{{item.text}}</div>
            </v-btn>

              
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="d-flex" cols="11">
            <v-text-field
              solo
              label="장소를 검색해주세요!"
              append-icon="mdi-magnify"
              light
              v-model="searchText"
              @click:append="callSearchFunc"
              @keyup.enter="callSearchFunc"
              hide-details
            >
            </v-text-field>

          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex mb-3" cols="12">
            <v-btn 
              icon
              background-color="#258fff"
              class="flex-grow-1 d-flex flex-column" 
              v-for="item in roomBtnGroup" :key="item.text"
              :rounded="false"
              tile
              @click="item.onClick"
              min-height="40"
            >
              
              <v-icon size="20">{{item.icon}}</v-icon>
              <div class="font-weight-black" style="font-size: 13px;">{{item.text}}</div>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-row no-gutters>
        <v-col cols="12" >
          
          <v-card
            class="mx-auto"
            max-height="250"
            flat
            tile
            
          >
            <!-- 검색 결과 -->
            <v-list v-if="searchResult">
              <v-list-item-group v-model="targetLocate">
                <v-list-item
                  v-for="(item, i) in searchResult"
                  :key="i"
                  style="border-bottom: 1px solid #eaeaea;"
                >
                  <v-list-item-icon>
                    <v-btn tile icon @click="addBookmark(item)">
                      <v-icon  color="primary">mdi-bookmark-plus-outline</v-icon>
                      <div class="font-weight-black" style="font-size: 13px;">북마크</div>
                    </v-btn>
                  </v-list-item-icon>
                  <v-list-item-content 
                    @mouseover="moveMaptoTarget(item, i)"
                    @mouseout="closeInfowindow"
                    @click="pushInCalcBundle(item)"  
                  >
                    <v-list-item-title class="font-weight-black">{{item.place_name}}</v-list-item-title>
                    <v-list-item-subtitle>
                      <div style="color: #3d75cc;">{{item.address_name}}</div>
                      <div style="color: green;" v-if="item.road_address">{{item.road_address.zone_no}}</div>
                      <div style="color: green;">{{item.phone}}</div>
                      
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <div style="font-size: 11px;" v-if="item.category_name">
                    {{item.category_name.split('>')[item.category_name.split('>').length-1]}}
                  </div>
                  
                </v-list-item>
                <div class="text-center" v-if="searchResult.length > 0">
                  <v-pagination
                    v-model="page"
                    :length="pageLength"
                    circle
                    @input="paginationObj.gotoPage(page)"
                    style="box-shadow: none;"
                  ></v-pagination>
                </div>
              </v-list-item-group>
            </v-list>
            <div class="text-center" v-if="isEmpty(searchResult)"> 
              클릭: 사용법을 <span @click="$router.push('/info');" style="color: #1876D0; font-weight: bold; cursor: pointer;">안내</span>해드릴게요!
            </div>
          </v-card>
          <v-divider class="my-3"></v-divider> 
        </v-col>
        
      </v-row>
      
      <v-row>
        <v-col cols="12" class="my-5 ">
          <v-card 
            :style="$vuetify.breakpoint.xs ? 'max-height: 15vh; overflow-y: scroll;' : 'max-height: 25vh; overflow-y: scroll;'"
            :elevation="latlngBundle.length > 0 ? 4 : 0"  
          >
            <transition-group name="list" tag="p" style="padding: 0; margin: 0;">
              <v-list-item
                v-for="(item, i) in latlngBundle"
                :key="item.place_name"
                style="border-bottom: 1px solid #eaeaea;"
              >
                <v-list-item-icon @click="latlngBundle.splice(i,1)">
                  <v-icon color="accent">mdi-minus</v-icon>
                </v-list-item-icon>
                <v-list-item-content @mouseover="moveMaptoTarget(item, i)" @mouseout="closeInfowindow">
                  <v-list-item-title class="font-weight-black">{{item.place_name}}</v-list-item-title>
                </v-list-item-content>
                <!-- <v-list-item-icon @click="linkToKakaMap(item.id)">
                  <v-btn tile depressed> 
                    <v-icon color="primary">mdi-navigation-variant-outline</v-icon>
                    <div>길찾기</div>
                  </v-btn>
                </v-list-item-icon> -->
              </v-list-item>
            </transition-group>
          </v-card>
        </v-col>
      </v-row>

      <div>
        <v-btn fixed bottom block color="primary" style="bottom: 0;" @click="getCenterLatlng">어디서 만날까요?</v-btn>
      </div>
      
      
    </v-navigation-drawer>
  </v-card>
</template>

<script>
//https://stackoverflow.com/questions/46966689/how-can-i-call-method-from-data-on-vue-js
import chat from '@/chat.js';
export default {
  mixins: [chat],
  data() {
    var self = this;
    return {
      page: 1,
      pageLength: null,
      pageOnclick: null,
      displayDialog: false,
      showSearchResult: true,
      showSideNav: true,
      beforeConnect: false,
      userName: null,
      roomMax: 4,
      roomNumber: null,
      roomTitle: null,
      search: '',
      dialogType: 'find',
      showList: true,
      headers: [
        { text: '제목', align: 'center', sortable: false, value: 'title',},
        { text: '최대인원', align: 'center', sortable: false, value: 'max' },
        { text: '현재인원', align: 'center', sortable: false, value: 'current_client' },
      ],
      chatList: [],
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 6 || 'Max 20 characters',
      },
      menuGroup: [
        { text:'로그인', icon: 'mdi-login', route: '/login' },
        { text:'로그아웃', icon: 'mdi-logout'},
        { text:'안내', icon: 'mdi-information-outline', route: '/info' },
        { text:'북마크', icon: 'mdi-history', route: '/history' },
        { text:'문의/버그', icon: 'mdi-bug-outline', },
      ],
      roomBtnGroup: [
        { text: '내 위치', 
          icon: 'mdi-crosshairs-gps', 
          onClick: function() {
            self.getCurrentLocate();
          }
        },
        { text: '채팅방', 
          icon: 'mdi-folder-plus',
          onClick: async () => {
            if(self.$store.state.usingChat) {
              this.$store.commit('setUserView', 'chat');
              if(!this.$vuetify.breakpoint.xs) {
                alert('먼저 채팅방을 종료해주세요. 문제가 계속되면 새로고침해주세요.');
              }
              return;
            } else {
              self.chatList = await self.$axiosAPI('api/room', 'get');  
              self.displayDialog = true;
            }
            self.roomTitle = self.$store.state.nickname + '님의 채팅방' // user Id
            self.dialogType = 'find';
          }
        },
        { 
          text: '핫플레이스', 
          icon: 'mdi-card-search',
          onClick: async function() {
            self.dialogType = 'ranking';
            self.displayDialog = true;
            self.ranking = await self.$axiosAPI('/api/history/ranking');
          }  
        },
      ],
      searchText: null,
      targetLocate: null,
      searchResult: [],
      paginationObj : {},
      currentPage: 1,
      latlngBundle: [],
      inquiry: {
        title: '문의',
        text: '또는 hungry0developer@gmail.com    ' +'(숫자 0)으로 메일주시면 감사하겠습니다.'
      },
      debounce1: null,
      debounce2: null,
      inqCount: 0,
      searchChanged: false,
      ranking: null
    }
  },
  
  watch: {
    '$vuetify.breakpoint.lgAndUp': {
      handler() {
        this.showSideNav = this.$vuetify.breakpoint.lgAndUp;
      }
    },
    
    
  },
  mounted() {
    this.showSideNav = this.$vuetify.breakpoint.lgAndUp;
    
    if (localStorage.getItem('isLogin')) {
      return this.menuGroup.splice(0, 1);
    } else {
      return this.menuGroup.splice(1, 1);
    }
  },
  computed: {
    resultBundle() {
      return this.latlngBundle.length;
    },
    inquiryLength() {
      if(this.inquiry.text) {
        return this.inquiry.text.length;
      } else {
        return '0'; 
      }
    },
    
  },
  methods: {
    async logout() {
      await this.$axiosAPI('/api/auth/logout', 'get');
      //this.$store.commit('setIsLogin', false);
      localStorage.removeItem('isLogin');
      this.menuGroup.shift();
      this.menuGroup.unshift({ text:'로그인', icon: 'mdi-login', route: '/login' });
      alert('로그아웃이 완료되었습니다.');
    },
    // showMiniBar() {
    //   // let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    //   if( this.$vuetify.breakpoint.xs ) {
    //     this.$router.push('/login')
    //   } else {
    //     this.showSideNav = !this.showSideNav
    //   }
    // },
    
    getCurrentLocate() {
      if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.$emit('serachAddrFromCoords', {y: position.coords.latitude, x: position.coords.longitude});
        },
        error => alert(error, '에러가 발생하였습니다.'),
        {enableHighAccuracy: true});
      } else {
        alert('지원하지 않는 브라우저입니다.');
      }
    },
    pushCurrentLocate(obj) {
      this.searchResult = [];
      this.searchResult.push(obj);
    },
    getListItem(item) {
      this.searchResult = item;

    },
    getGeoListItem(item) {
      let temp = {
        place_name : item.address_name,
        address_name: item.address.address_name,
        road_address : item.road_address,
        category_name : '지역',
        x: item.x,
        y: item.y
      }
      this.searchResult = [];
      this.searchResult[0] = temp;
    },

    callSearchFunc() {
      if (this.isEmpty(this.searchText)) {
        alert('키워드를 입력해주세요!');
        return false;
      }
      this.$emit('searchLocation', this.searchText);
    },
    
    displayPagination(pagination) {
      this.paginationObj = pagination;
      this.pageLength = pagination.last;
    },
    
    closeInfowindow() {
      clearTimeout(this.debounce2);
      this.debounce2 = setTimeout(() => {
        this.$emit('closeInfowindow');  
      }, 300) ;
      
    },
    pushInCalcBundle(item) {
      const isNew = (element) =>  element.address_name !== item.address_name;
      //console.log(this.latlngBundle);
      if(this.latlngBundle.every(isNew)) {
        this.latlngBundle.push(item);
      }
      this.$emit('displayMarker', item);

    },

    moveMaptoTarget(item, i) {
      clearTimeout(this.debounce1);
      this.debounce1 = setTimeout(() => {
        this.$emit('moveMap', item);
        this.$emit('displayInfowindow', item, null, i)
      }, 300);
      
    },
    getCenterLatlng() {
      if ( this.latlngBundle.length < 2) {
        alert('장소를 최소 두 곳 입력해주세요!');
        return;
      }
      let latlngArr = [];
      this.latlngBundle.forEach( (element) => {
        let temp = {
          x: element.x,
          y: element.y
        };
        latlngArr.push(temp);
      })
      let xSort = latlngArr.sort(function(a, b) {
        return a.x - b.x;
      })
      let ySort= latlngArr.sort(function(a, b) {
        return a.y - b.y;
      })
      let xLargest = Number(xSort[xSort.length - 1].x);  
      let xSmallest = Number(xSort[0].x);
      let yLargest = Number(ySort[ySort.length - 1].y);
      let ySmallest = Number(ySort[0].y);
      
      let centerOfSquare = {
        x: (xSmallest + ((xLargest - xSmallest) / 2)).toFixed(6),
        y: (ySmallest + ((yLargest - ySmallest) /2)).toFixed(6)
      }
      
      this.$emit('markCenterLatlng', centerOfSquare, this.latlngBundle);
    },
    setSearchText(text) {
      this.searchText = text;
    },
    async getInquiry() {
      if(this.inqCount === 13) {
        let inq = await this.$axiosAPI('/api/inquiry', 'get');
        console.log(inq);
        this.inqCount = 0;
      }
      this.inqCount += 1;

    },

    async addBookmark(item) {
      if (this.isEmpty(localStorage.getItem('isLogin')) || this.isEmpty(this.$store.state.nickname) ) {
        alert('로그인 후 이용할 수 있습니다.');
        return;
      }
      let cookedItem = JSON.parse(JSON.stringify(item));
      delete cookedItem.distance;
      await this.$axiosAPI('/api/history', 'post', cookedItem);
      alert('북마크가 추가되었습니다!');
    },
    async sendInquiry() {
      if(this.inquiry.title.length > 100 ) {
        alert(' 100자 이내로 작성해주세요. 감사합니다. ');
        return;
      }
      await this.$axiosAPI('/api/inquiry/', 'post', this.inquiry);
      this.displayDialog = false;
      this.inquiry = {};
    },
    hideShowSideNav(){
      if(this.$vuetify.breakpoint.xs) {
        this.showSideNav = false;
      }
    }
  }
}
</script>

<style scoped>
nav {
  box-shadow: 0px 0px 2px 2px rgba(0,0,0,0.35);
}
::v-deep .v-navigation-drawer__content {
 overflow: hidden
}

.v-item-group {
  max-height: 35vh;
  overflow-y: scroll;
}
#pagination {
  margin:10px auto !important;
  text-align: center !important;
}
#pagination >>> a {
  display:inline-block !important;
  margin-right:10px !important;
}
#pagination >>> .on {
  font-weight: bold !important; 
  cursor: default !important;
  color:#777 !important;
}
a {
  text-decoration: none !important;
  color:#000 !important;
}
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.mini-bar {
  position: absolute; 
  z-index:12;
}

@media screen and (max-width: 600px ) {
  .mini-bar {
    width: 100vw
  }

}

</style>