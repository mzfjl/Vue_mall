<template>
  <div class="my container">
    <header>
      <div class="user-info" v-if="loginStatus">
        <img :src="userInfo.imgUrl" alt="" />
        <span>{{ userInfo.nickName }}</span>
      </div>
      <div v-else class="login" @click="goLogin">登录/注册</div>
    </header>
    <section>
      <ul>
        <li @click="goPath">地址管理</li>
        <li v-if="loginStatus" @click="loginOut">退出登录</li>
      </ul>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Tabbar from 'components/common/Tabbar'
export default {
  name: 'My',
  components: {
    Tabbar
  },
  computed: {
    ...mapState({
      loginStatus: (state) => state.user.loginStatus,
      userInfo: (state) => state.user.userInfo
    })
  },
  methods: {
    ...mapMutations(['loginOut']),
    goLogin() {
      this.$router.push('/login')
    },
    // 进入地址管理
    goPath() {
      this.$router.push('/path')
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 160px;
  background-color: #b0352f;
  .login {
    padding: 6px 15px;
    font-size: 16px;
    color: #fff;
    background-color: #f6ab32;
    border-radius: 6px;
  }
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 66px;
      height: 66px;
      border-radius: 50%;
    }
    span {
      padding: 20px 0;
      font-size: 18px;
      color: #fff;
    }
  }
}
section {
  flex: 1;
  overflow: hidden;
  ul li {
    padding: 15px;
    font-size: 16px;
  }
}
</style>
