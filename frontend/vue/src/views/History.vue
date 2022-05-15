<template>
<div id="wrapper" style="background-color: #eeeeee; height: 100%; overflow-y: hidden;">
  <v-row justify="center"  align="center" class="my-auto" style="">
    
    <v-col cols="10" sm="6">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="d-sm-none">
      <v-data-table
        :headers="headersM"
        :items="cookedList"
        :page.sync="page"
        :items-per-page="10"
        class="elevation-1"
        mobile-breakpoint="0"
        @page-count="pageCount = $event"
        :search="search"
      >
        <!-- eslint-disable-next-line -->
        <template v-slot:item.title="{ item }">
          <v-chip outlined pill color="indigo" @click="showTargetPlace(item)" style="font-weight: bold;">
            {{item.title}}
          </v-chip>
        </template>
        <!-- eslint-disable-next-line -->
        <template v-slot:item.category="{ item }">
          {{item.category.split('>')[item.category.split('>').length-1]}}
        </template>
        <!-- eslint-disable-next-line -->
        <template v-slot:item.action="{ item }">
          <v-btn icon @click="delList(item)" color="pink">
            <v-icon>mdi-delete-forever</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="10" class="d-none d-sm-flex" style="flex-direction: column;">
      <v-data-table
        :headers="headers"
        :items="cookedList"
        :page.sync="page"
        :items-per-page="10"
        class="elevation-1"
        @page-count="pageCount = $event"
        :search="search"
      >
        <!-- eslint-disable-next-line -->
        <template v-slot:item.title="{ item }">
          <v-chip outlined pill color="indigo" @click="showTargetPlace(item)" style="font-weight: bold;">
            {{item.title}}
          </v-chip>
        </template>
        <!-- eslint-disable-next-line -->
        <template v-slot:item.url="{ item }">
          <v-chip>
            <a :href="item.url" target="_blank">링크</a>
          </v-chip>
        </template>
        <!-- eslint-disable-next-line -->
        <template v-slot:item.action="{ item }">
          <v-btn icon @click="delList(item)" color="pink">
            <v-icon>mdi-delete-forever</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <div class="text-center pt-sm-2">
        <v-pagination
          v-model="page"
          :length="pageCount"
        ></v-pagination>
      </div>
    </v-col>
  </v-row>
<BottomNav/>
</div>

</template>

<script>
import BottomNav from '@/components/BottomNav.vue'

export default {
  data() {
    return {
      page: 1,
      pageCount: 0,
      search: null,
      itemsPerPage: 10,
      headers: [
        { text: '이름', value: 'title', align: 'center' },
        { text: '주소', value: 'addr', align: 'center' },
        { text: '분류', value: 'category', sortable: false, align: 'center' },
        { text: '연락처', value: 'phone', sortable: false, align: 'center' },
        { text: '링크', value: 'url', sortable: false, align: 'center' },
        { text: '삭제', value: 'action', sortable: false, align: 'center'},
      ],
      headersM: [
        { text: '이름', value: 'title', align: 'center' },
        { text: '분류', value: 'category', sortable: false, align: 'center' },
        { text: '삭제', value: 'action', sortable: false, align: 'center'},
      ],
      cookedList: [],
    }
  },
  mounted() {
    this.$store.commit('setUserView', 'bookmark');
    this.getList();
  },
  components: {
    BottomNav
    
  },
  methods: {
    async getList() {
      let rawList = await this.$axiosAPI('/api/history', 'get');
      this.cookedList = [];
      for (let i = 0; i < rawList.length; i++ ) {
        this.cookedList.push({
          placeId: rawList[i].id,
          title: rawList[i].name,
          addr: rawList[i].road_address_name,
          category: rawList[i].category_name,
          phone: rawList[i].phone,
          url: rawList[i].url
        });
      }
    },
    async delList(item) {
      await this.$axiosAPI('/api/history/' + item.placeId, 'delete');
      this.getList();
    },

    showTargetPlace(item) {
      this.$router.push({ name: 'Home', params: {place: item.title} });
    },
  },
}
</script>

<style lang="scss" scoped>


</style>