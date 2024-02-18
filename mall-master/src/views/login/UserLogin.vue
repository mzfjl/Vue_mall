<template>
  <div class="login container">
    <Header></Header>
    <section>
      <div class="login-tel">
        <input
          type="text"
          v-model="userTel"
          placeholder="请输入手机号"
          pattern="[0-9]*"
        />
      </div>
      <div class="login-tel">
        <input type="text" v-model="userPwd" placeholder="请输入密码" />
      </div>
      <div class="login-btn" @click="login">登 录</div>
      <div class="tab">
        <span @click="goLogin">短信登录</span>
        <span @click="goRecovery">找回密码</span>
        <span @click="goRegister">快速注册</span>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from 'components/common/Tabbar'
import Header from './Header'
import { Toast } from 'mint-ui'
import http from 'common/api/request.js'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      userTel: '', //用户输入的手机号
      userPwd: '', //用户输入的密码
      //验证规则
      rules: {
        //手机号验证
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: '手机号不能为空，并且是11位数字'
        },
        //密码验证
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: '密码不能为空，并且要求6,12位'
        }
      }
    }
  },
  components: {
    Header,
    Tabbar
  },
  methods: {
    ...mapMutations(['userLogin']),
    //点击登录按钮
    login() {
      //前端验证
      if (!this.validate('userTel')) return
      if (!this.validate('userPwd')) return
      //发送请求，后端验证
      http
        .$axios({
          url: '/api/login',
          method: 'POST',
          data: {
            userTel: this.userTel,
            userPwd: this.userPwd
          }
        })
        .then((res) => {
          //提示信息
          Toast(res.msg)
          //登录失败
          if (!res.success) return
          //登录成功 ==》跳转页面，存储用户信息
          this.userLogin(res.data)
          //跳转到我的页面中
          this.$router.push('/my')
        })
    },
    //注册
    goRegister() {
      this.$router.push('/register')
    },
    //找回密码
    goRecovery() {
      this.$router.push('/recovery')
    },
    //密码登录
    goLogin() {
      this.$router.push('/login')
    },
    //验证信息提示
    validate(key) {
      let bool = true
      if (!this.rules[key].rule.test(this[key])) {
        //提示信息
        Toast(this.rules[key].msg)
        bool = false
        return false
      }
      return bool
    }
  }
}
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  div {
    margin: 10px 0;
    width: 335px;
    height: 44px;
    font-size: 12px;
  }
  input {
    box-sizing: border-box;
    padding: 0 10px;
    line-height: 44px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .login-tel {
    margin-top: 30px;
    input {
      width: 335px;
    }
  }
  .login-code {
    display: flex;
    input {
      flex: 1;
    }
    button {
      padding: 0 20px;
      line-height: 44px;
      color: #fff;
      background-color: #b0352f;
      border: 0;
      border-radius: 6px;
    }
  }
  .login-btn {
    line-height: 44px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    background-color: #b0352f;
    border-radius: 6px;
  }
  .tab {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
}
</style>
