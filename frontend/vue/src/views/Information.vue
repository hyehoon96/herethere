<template>
  <v-row justify="center"  align="center" class="my-auto" style="height: 100%;">
    <v-col cols="12" sm="10">
      <v-card elevation="10">
        <v-toolbar color="primary">
          <v-toolbar-title style="color: white; font-weight: bold;">이용안내</v-toolbar-title>
        </v-toolbar>
        <v-row>
          <v-col cols="12">
            <v-tabs mobile-breakpoint="0" v-model="model">
              <v-tab @click="infoType = 'pc/tablet'" :href="`#tab-1`">PC / Tablet</v-tab>
              <v-tab @click="infoType = 'mobile'" :href="`#tab-2`">MOBILE</v-tab>
              <v-tab @click="infoType = 'inquiry'">기타</v-tab>
            </v-tabs>
          </v-col>
        </v-row>
        <!-- into intro intro intro intro intro intro intro intro intro intro -->
        <div v-if="infoType === 'inquiry'">
          <v-row>
            <v-col cols="12">
              <h3 class="ml-5">약속 장소를 찾아드립니다!</h3>
            </v-col>
            <v-col cols="3">
              GIF
            </v-col>

            <v-col cols="9">
              <v-card-title>aaaaaaaaaaaaaaaaaaa</v-card-title>
              
              <v-card-text>문의 버튼 클릭 또는 hungry0developer@gmail.com으로 연락주시면 빠르게 답변드리겠습니다. <br>
                ※ 카카오 맵 API, 여러 오픈소스를 사용하고 있습니다. (라이센스 보기)
              </v-card-text>
              
            </v-col>
          </v-row>
        </div>
        <!-- pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet pc/tablet -->
        <div v-else-if="infoType === 'pc/tablet'">
          <v-row>
            <v-col cols="12">
              <v-chip  class="ml-5">
                <h3>1. 검색 및 약속 장소 찾기</h3>
              </v-chip>
              
            </v-col>
            <v-col cols="12" sm="3">
              GIF
            </v-col>

            <v-col cols="12" sm="9">
              <v-card-title :style="$vuetify.breakpoint.xs ? 'font-size: 18px' : ''">
                - 지역, 키워드를 검색하고, 클릭해주세요. <br>
                - "어디서 만날까요?" 버튼을 눌러주세요. <br>
                - 카테고리를 설정해주세요.
               </v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-chip  class="ml-5">
                <h3>2. 채팅 및 위치 공유, 장소 투표</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              GIF
            </v-col>

            <v-col cols="12" sm="9">
              <v-card-title :style="$vuetify.breakpoint.xs ? 'font-size: 18px' : ''">
                - 채팅 버튼을 눌러 채팅방을 확인하세요. <br>
                - 채팅방을 새로 생성하거나 기존 채팅방에 접속할 수 있습니다. <br>
                - 내 위치를 공유하거나, 친구의 위치를 공유받을 수 있습니다. <br>
                - 약속 장소를 투표로 결정해보세요.
              </v-card-title>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-chip  class="ml-5">
                <h3>3. 북마크 및 핫플레이스</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              GIF
            </v-col>

            <v-col cols="12" sm="9">
              <v-card-title :style="$vuetify.breakpoint.xs ? 'font-size: 18px' : ''">
                - 마음에 드는 장소를 북마크에 추가하세요. <br>
                - 북마크 버튼을 눌러 북마크를 조회하고, 지도에 나타낼 수 있습니다. <br>
                - 핫플레이스 버튼을 눌러 최근 인기가 많은 지역 (핫플레이스)을 조회해보세요. <br>
              </v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-chip  class="ml-5">
                <h3 v-if="$vuetify.breakpoint.xs">※ 메뉴 축소화 버전</h3>
                <h3 v-else>※ 메뉴 버튼을 눌러 지도를 더욱 크게 보실 수 있습니다.</h3>
                
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              GIF
            </v-col>

            <v-col cols="12" sm="9">
              <v-card-title :style="$vuetify.breakpoint.xs ? 'font-size: 18px' : ''">
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
              <v-chip class="ml-5">
                <h3>1. 검색 및 약속 장소 찾기</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              GIF
            </v-col>
            <v-col cols="12" sm="9">
              <v-card-title :style="$vuetify.breakpoint.xs ? 'font-size: 18px' : ''">
                - 지역, 키워드를 검색하고, 클릭해주세요. <br>
                - "어디서 만날까요?" 버튼을 눌러주세요. <br>
                - 카테고리를 설정해주세요.
              </v-card-title>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-chip class="ml-5">
                <h3>2. 채팅 및 위치 공유, 장소 투표</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              GIF
            </v-col>
            <v-col cols="12" sm="9">
              <v-card-title :style="$vuetify.breakpoint.xs ? 'font-size: 18px' : ''">
                - 하단의 채팅 버튼을 눌러 채팅방을 확인하세요. <br>
                - 채팅방을 새로 생성하거나 기존 채팅방에 접속할 수 있습니다. <br>
                - 내 위치를 공유하거나, 친구의 위치를 공유받을 수 있습니다. <br>
                - 약속 장소를 투표로 결정해보세요.
              </v-card-title>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-chip class="ml-5">
                <h3>3. 북마크 및 핫플레이스</h3>
              </v-chip>
            </v-col>
            <v-col cols="12" sm="3">
              GIF
            </v-col>

            <v-col cols="12" sm="9">
              <v-card-title :style="$vuetify.breakpoint.xs ? 'font-size: 18px' : ''">
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
      model: null
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

<style>


</style>