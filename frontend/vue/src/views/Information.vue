<template>
  <v-row justify="center"  align="center" class="my-auto" style="height: 100%; background-color: #eeeeee">
    <v-dialog
      v-model="displayDialog"
      max-width="500px"
    >
      <custom-dialog
        header-title="license"
        @hide="displayDialog = false;"
        :footerSubmit="false"
        :footerCloseBtn="false"
      >
        <template v-slot:body>
          <div class="license-list" v-for="item in license" :key="item.module">
            {{item.module}} 
            <div>
              <a :href="item.link"> license</a>
            </div>
          </div>
        </template>
      </custom-dialog>
    </v-dialog>
    <v-col cols="12" sm="8" :style="$vuetify.breakpoint.xs ? 'padding : 0 12px;' : ''">
      <v-card elevation="10">
        <v-toolbar color="primary">
          <v-toolbar-title style="color: white; font-weight: bold;">이용안내</v-toolbar-title>
        </v-toolbar>
        <v-row>
          <v-col cols="12">
            <v-tabs mobile-breakpoint="0" v-model="model">
              <v-tab @click="infoType = 'pc/tablet'" :href="`#tab-1`">PC / Tablet</v-tab>
              <v-tab @click="infoType = 'mobile'" :href="`#tab-2`">MOBILE</v-tab>
              <v-tab @click="infoType = 'inquiry'">소개/문의</v-tab>
            </v-tabs>
          </v-col>
        </v-row>
        <!-- into intro intro intro intro intro intro intro intro intro intro -->
        <div v-if="infoType === 'inquiry'">
          <v-row>
            <v-col cols="12">
              <h3 class="ml-sm-5">약속 장소를 찾아드립니다!</h3>
              <v-row class="mt-3" justify="center">
                <v-col cols="6" class="d-felx justify-center">
                  <v-img
                    src="../../public/logo/logo(basic).png"
                    max-width="400"
                  >
                  </v-img>
                </v-col>
                <v-col cols="6">
                  <v-img
                    src="../../public/logo/logo(none).png"
                    max-width="400"
                  >
                  </v-img>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-card-title style="font-size: 17px;">
                - 서로의 위치를 검색하고, 만나기에 적합한 범위를 찾아보세요. <br>
                - 카테고리를 설정하여 손쉽게 검색할 수 있습니다. <br>
                - 지도를 함께 보며 채팅할 수 있어요. <br>
                - 마음에 드는 장소가 있다면 북마크에 추가해보세요. <br>
                - 투표를 통해 약속 장소를 결정할 수 있어요. <br>
                - 핫플레이스를 조회해보세요.
              </v-card-title>
              
              <v-card-text>
                <v-divider class="my-3"></v-divider>
                문의 버튼 클릭 또는 hungry0developer@gmail.com으로 연락주시면 빠르게 답변드리겠습니다. <br>
                ※ 카카오 맵 API, 여러 오픈소스를 사용하고 있습니다. 
                <div @click="displayDialog = true;" style="color:#039be5"> (라이센스 보기) </div>
              </v-card-text>
              
            </v-col>
          </v-row>
        </div>
        <!-- pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet -->
        <div v-else-if="infoType === 'pc/tablet'">
          <v-row justify="center" class="my-5">
            <v-col cols="12">
              <v-chip  class="ml-sm-5">
                <h3>1. 검색 및 약속 장소 찾기</h3>
              </v-chip>
              
            </v-col>
            <v-col cols="12" sm="5">
              <v-img
                src="../../public/gif/web-search-hq.gif"
                class="ml-sm-5  "
              ></v-img>
            </v-col>

            <v-col cols="12" sm="7">
              <v-card-title style="font-size: 18px;">
                - 지역, 키워드를 검색하고, 클릭해주세요. <br>
                - "어디서 만날까요?" 버튼을 눌러주세요. <br>
                - 카테고리를 설정해주세요.
               </v-card-title>
            </v-col>
          </v-row>
          <v-row justify="center" class="my-5">
            <v-col cols="12">
              <v-chip  class="ml-sm-5">
                <h3>2. 채팅 및 위치 공유, 장소 투표</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="5">
              <v-img
                src="../../public/gif/web-chat-hq.gif"
                class="ml-sm-5"
              ></v-img>
            </v-col>

            <v-col cols="12" sm="7">
              <v-card-title style="font-size: 18px;">
                - 채팅 버튼을 눌러 채팅방을 확인하세요. <br>
                - 채팅방을 새로 생성하거나 기존 채팅방에 접속할 수 있습니다. <br>
                - 내 위치를 공유하거나, 친구의 위치를 공유받을 수 있습니다. <br>
                - 약속 장소를 투표로 결정해보세요.
              </v-card-title>

            </v-col>
          </v-row>
          <v-row justify="center" class="my-5">
            <v-col cols="12">
              <v-chip  class="ml-sm-5">
                <h3>3. 북마크 및 핫플레이스</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="5">
              <v-img
                src="../../public/gif/web-bookmark-hq.gif"
                class="ml-sm-5"
              ></v-img>
            </v-col>

            <v-col cols="12" sm="7">
              <v-card-title style="font-size: 18px;">
                - 마음에 드는 장소를 북마크에 추가하세요. <br>
                - 북마크 버튼을 눌러 북마크를 조회하고, 지도에 나타낼 수 있습니다. <br>
                - 핫플레이스 버튼을 눌러 최근 인기가 많은 지역 (핫플레이스)을 조회해보세요. <br>
              </v-card-title>
            </v-col>
          </v-row>
          <v-row justify="center" class="my-5">
            <v-col cols="12">
              <v-chip  class="ml-sm-5">
                <h3 v-if="$vuetify.breakpoint.xs">※ 메뉴 축소화 버전</h3>
                <h3 v-else>※ 메뉴 버튼을 눌러 지도를 더욱 크게 보실 수 있습니다.</h3>
                
              </v-chip>
            </v-col>
            <v-col cols="12" sm="5">
              <v-img
                src="../../public/gif/tablet-search-hq.gif"
                class="ml-sm-5"
              ></v-img>
            </v-col>

            <v-col cols="12" sm="7">
              <v-card-title style="font-size: 18px;">
                - 지역, 키워드를 검색하고, 클릭해주세요. <br>
                - 아이콘을 클릭하여 목록과 검색 결과를 조회하실 수 있습니다. <br>
                - "어디서 만날까요?" 버튼을 눌러주세요. <br>
                - 카테고리를 설정해주세요.
              </v-card-title>
            </v-col>
          </v-row>
        </div>
        <!-- mobile mobile mobile mobile mobile mobile mobile mobile mobile mobile mobile mobile -->
        <div v-else-if="infoType === 'mobile'">
          <v-row>
            <v-col cols="12">
              <v-chip class="ml-sm-5">
                <h3>1. 검색 및 약속 장소 찾기</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              <v-img
                src="../../public/gif/mobile-search.gif"
                class="ml-sm-5"
              ></v-img>
            </v-col>
            <v-col cols="12" sm="9">
              <v-card-title style="font-size: 18px;">
                - 지역, 키워드를 검색하고, 클릭해주세요. <br>
                - "어디서 만날까요?" 버튼을 눌러주세요. <br>
                - 카테고리를 설정해주세요.
              </v-card-title>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-chip class="ml-sm-5">
                <h3>2. 채팅 및 위치 공유, 장소 투표</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              <v-img
                src="../../public/gif/mobile-chat.gif"
                class="ml-sm-5"
              ></v-img>
            </v-col>
            <v-col cols="12" sm="9">
              <v-card-title style="font-size: 18px;">
                - 하단의 채팅 버튼을 눌러 채팅방을 확인하세요. <br>
                - 채팅방을 새로 생성하거나 기존 채팅방에 접속할 수 있습니다. <br>
                - 내 위치를 공유하거나, 친구의 위치를 공유받을 수 있습니다. <br>
                - 약속 장소를 투표로 결정해보세요.
              </v-card-title>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-chip class="ml-sm-5">
                <h3>3. 북마크 및 핫플레이스</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              <v-img
                src="../../public/gif/mobile-bookmark.gif"
                class="ml-sm-5"
              ></v-img>
            </v-col>

            <v-col cols="12" sm="9">
              <v-card-title style="font-size: 18px;">
                - 마음에 드는 장소를 북마크에 추가하세요. <br>
                - 북마크를 조회하고, 지도에 나타낼 수 있습니다. <br>
                - 북마크 수에 따른 최근 인기가 많은 지역 (핫플레이스)을 조회해보세요. <br>
              </v-card-title>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
export default {
  data() {
    return {
      infoType: null,
      model: null,
      displayDialog: false,
      license: [
        { module:'axios', link:'https://github.com/axios/axios/blob/master/LICENSE'},
        { module:'express', link:'https://github.com/expressjs/express/blob/master/LICENSE'},
        { module:'vue', link:'https://v3.ko.vuejs.org/'},
        { module:'vue-router', link:'https://github.com/vuejs/router/blob/main/LICENSE'},
        { module:'vuex', link:'https://github.com/vuejs/vuex/blob/main/LICENSE'},
        { module:'vuex-persistedstate', link:'https://github.com/robinvdvleuten/vuex-persistedstate/blob/master/LICENSE'},
        { module:'socket.io-client', link:'https://github.com/socketio/socket.io-client/blob/main/LICENSE'},
        { module:'vuetify', link:'https://github.com/vuetifyjs/vuetify/blob/master/LICENSE.md'},
        
        { module:'socket.io', link:'https://github.com/socketio/socket.io/blob/main/LICENSE'},
        { module:'mysql', link:'https://github.com/mysqljs/mysql/blob/master/License'},
        { module:'morgan', link:'https://github.com/expressjs/morgan/blob/master/LICENSE'},
        { module:'http-errors', link:'https://github.com/jshttp/http-errors/blob/master/LICENSE'},
        { module:'express-session', link:'https://github.com/expressjs/session/blob/master/LICENSE'},

        { module:'dotenv', link:'https://github.com/motdotla/dotenv/blob/master/LICENSE'},
        { module:'debug', link:'https://github.com/debug-js/debug/blob/master/LICENSE'},
        { module:'cookie-parser', link:'https://github.com/expressjs/cookie-parser/blob/master/LICENSE'},
        { module:'bcrypt', link:'https://github.com/kelektiv/node.bcrypt.js/blob/master/LICENSE'},
        { module:'pug', link:'https://github.com/pugjs/pug/blob/master/packages/pug/LICENSE'},
      ]
    }
  },
  mounted() {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log(isMobile);
    if (isMobile) {
      this.infoType = 'mobile';
      this.model = 'tab-2';
    } else {
      this.infoType = 'pc/tablet';
      this.model = 'tab-1';
    }
  }
}
</script>

<style lang="scss" scoped>
.license-list {
  border-radius: 5px;
  margin-top: 16px;
  overflow: auto;
  padding: 2px;
  background-color: rgb(232, 240, 254);
  color: rgb(23, 78, 166);
  justify-content: space-between;
  display: flex;
}
body {
  overflow-y: unset !important;
}
</style>