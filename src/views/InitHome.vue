<template>
  <div class="chose_container">
    <div class="chose_box">
      <span><h1 style="text-align:center"> 欢迎来到超市会员管理系统</h1></span>

      <!-- 用router-link进行跳转，地址栏不需要刷新 -->
      <el-button type="primary" @click="toRegister">成为会员</el-button>
      <el-button type="success" @click="toUserLogin">会员登陆</el-button>
      <el-button type="info" @click="toAdministratorLogin">管理员登陆</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InitHome',
  methods: {
    toRegister() {
      //使用 query查询参数的时候在页面使用path引入
      this.$router.push({path: '/user/register'});
    },
    toUserLogin() {
      // console.log(this);
      this.$router.push({path: '/user/login'});
    },
    toAdministratorLogin() {
      this.$router.push({path: '/administrator/login'});
    }
  },
}

</script>

<style scoped>
.chose_container {
  text-align: center;
  background:url("../assets/BackgroundPicture.jpg");
  width: 100%;
  height: 100%;
  position:fixed;
  background-size:100% 100%;
  z-index: 1;
  /*filter: brightness(0.9) saturate(1.25);*/
}

.chose_box {
  text-align: center;
  align-items: center;
  color: rgb(36, 60, 121);
  border: 1px solid #dccfcf;
  width: 350px;
  margin: 180px auto;
  padding: 25px 55px 55px 55px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background-color: rgba(255, 255, 255, 0.5);
}

h1 {
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
}
</style>