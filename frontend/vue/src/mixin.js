import axios from "axios";

export default {

  methods: {
    isEmpty(value) {
      if( value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length ) ){ return true }
      else{ return false }
    },

    async $axiosAPI(url, method, data) {
      //axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
      //axios.defaults.withCredentials = true;
      return (await axios({
        baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080',
        method,
        url,
        data,
        withCredentials: true
        // headers: {
        //   Authorization: `Bearer ${this.$store.state.accessToken}`
        // },
      }).catch ( e => {
        let isAlert = false;
        if ( e.response.data.message) {
          alert( e.response.data.message );
          isAlert = true;
        }
        switch(e.response.status) {
          case 400 :
            if (!isAlert) {
              alert('입력이 유효하지 않습니다. 필수 입력란을 모두 채워주세요. (400)');
            }
            break;
          case 401 :
            if (!isAlert) {
              alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            }
            localStorage.removeItem('isLogin');
            if (this.$route.name === "Home") {
              this.$router.go();
            } else {
              this.$router.push('/');
            }
            break;
          case 403 :
            if (!isAlert) {
              alert('권한이 없습니다. (403)');  
            }
            break;
          case 404 :
            if (!isAlert) {
              alert('요청 경로 또는 데이터가 존재하지 않습니다. (404)'); 
            }
            break;
          case 405 :
            if (!isAlert) {
              alert('지원하지 않는 메소드를 호출하였습니다. (405)'); 
            }
            break;
          case 409 :
            if (!isAlert) {
              alert('해당 정보로 등록된 정보가 이미 있습니다. (409)');
            }
            break;
          case 500 :
            if (!isAlert) {
              alert('서버 오류가 발생하였습니다. 잠시후 다시 시도해주세요. (500)' );  
            }
            break;
          default :
            if (!isAlert) {
              alert('오류가 발생하였습니다. 잠시후 다시 시도해주세요.');    
            }
            break;
        }
      })).data;
    },
    
    // dateInfo() {
    //   // yyyy-mm-dd
    //   return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
    // },
    
    
  }
}