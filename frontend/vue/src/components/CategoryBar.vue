<template>
  <v-speed-dial
    v-model="fab"
    :top="top"
    :bottom="bottom"
    :right="right"
    :left="left"
    :direction="$vuetify.breakpoint.width > 600? 'left' : 'top'"
    :transition="transition"
    absolute
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="blue darken-2"
        dark
        fab
        :large="!$vuetify.breakpoint.xs"
      >
        <v-icon v-if="fab">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-find-replace
        </v-icon>
        <div class="" style="font-size: 13px;">카테고리</div>
      </v-btn>
    </template>
    <v-btn
      fab
      dark
      :large="!$vuetify.breakpoint.xs"
      v-for="item in categoryObj"
      :key="item.label"
      :color="item.color"
      @click="searchCategory(item)"
    >
      <v-icon>{{item.icon}}</v-icon>
      <div class="" style="font-size: 13px;">{{item.label}}</div>
    </v-btn>
    
  </v-speed-dial>

</template>

<script>
// MT1 대형마트
// CS2 편의점
// PS3 어린이집, 유치원
// SC4 학교
// AC5 학원
// PK6 주차장
// OL7 주유소, 충전소
// SW8 지하철역
// BK9 은행
// CT1 문화시설
// AG2 중개업소
// PO3 공공기관
// AT4 관광명소
// AD5 숙박
// FD6 음식점
// CE7 카페
// HP8 병원
// PM9 약국
export default {
  data: () => ({
    category: null,
    categoryObj: [
      { label: '맛집', icon: 'mdi-silverware-fork-knife', code: 'FD6', color: 'green' },
      { label: '카페', icon: 'mdi-coffee', code: 'CE7', color: 'red' },
      { label: '숙박', icon: 'mdi-bed', code: 'AD5', color: 'pink' },
      { label: '지하철역', icon: 'mdi-subway', code: 'SW8', color: 'indigo' },
      { label: '병원', icon: 'mdi-mortar-pestle-plus', code: 'HP8', color: 'purple' },
      { label: '주차장', icon: 'mdi-car', code: 'PK6', color: '#26A69A' },

    ],
    direction: 'right',
    fab: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: 'slide-y-reverse-transition',
  }),
  methods: {
    searchCategory(item) {
      this.$emit('searchCategory', item);

    }
  }
}
</script>

<style>

</style>