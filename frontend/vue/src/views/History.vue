<template>
<v-row justify="center"  align="center" class="my-auto" style="height: 100%;">
  <v-col cols="12" sm="10">
    <div>
      <v-row justify="center">
        <v-col cols="5" class="text-h4 font-weight-bold mb-2">
          북마크
        </v-col>

        <v-col cols="5">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="10">
          <v-data-table
            :headers="headers"
            :items="cookedList"
            :page.sync="page"
            :items-per-page="10"
            hide-default-footer
            class="elevation-1"
            @page-count="pageCount = $event"
            :search="search"
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.title="{ item }">
              <v-chip outlined pill color="primary" @click="showTargetPlace(item)">
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
          <div class="text-center pt-2">
            <v-pagination
              v-model="page"
              :length="pageCount"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-col>
</v-row>
</template>

<script>
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
      cookedList: [],
    }
  },
  mounted() {
    this.getList();
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

<style>

</style>