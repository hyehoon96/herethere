<template>
  <v-card>
    <v-card-title style="background-color: #1976D2; color: white;">
      <h4>{{ headerTitle }}</h4>
    </v-card-title>
    <v-card-text>
      <slot name="body">
        
      </slot>
    </v-card-text>
    <v-card-actions class="justify-end mr-2 pb-4">
        <template v-if="footerSubmit">
            <v-btn
                color="success"
                rounded
                small
                @click="$emit('submit')"
            >
                {{ footerSubmitTitle }}
            </v-btn>
        </template>
        <v-btn 
            v-if="footerCloseBtn"
            color="amber"
            dark
            rounded
            small
            @click="$emit('hide')"
        >
            닫기
        </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
  export default {
    name: 'CustomDialog',
    props: {
      footerSubmit: {
        type: Boolean,
        default: true,
      },
      headerTitle: {
        type: String,
        default: '제목',
      },
      footerSubmitTitle: {
        type: String,
        default: '저장',
      },
      footerCloseBtn: {
        type: Boolean,
        default: true
      }
    },
  }
</script>

<style>

</style>