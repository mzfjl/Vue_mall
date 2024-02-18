<template>
  <div class="login container">
    <Header>
      <span>注册</span>
    </Header>
    <section>
      <div class="login-tel">
        <input
          type="text"
          v-model="userTel"
          placeholder="请输入手机号"
          pattern="[0-9]*"
        />
      </div>
      <div class="login-code">
        <input
          type="text"
          placeholder="请输入短信验证码"
          pattern="[0-9]*"
          v-model="userCode"
        />
        <button :disabled="disabled" @click="sendCode">{{ codeMsg }}</button>
      </div>
      <div class="login-tel">
        <input
          type="text"
          v-model="userPwd"
          placeholder="请设置密码"
          pattern="[0-9]*"
        />
      </div>
      <div class="login-btn" @click="register">注 册</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from 'components/common/Tabbar.vue'
import Header from './Header'
import { Toast } from 'mint-ui'
import http from 'common/api/request.js'
export default {
  data() {
    return {
      disabled: false,
      userTel: '',
      userPwd: '',
      userCode: '',
      //验证规则
      rules: {
        //手机号验证
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: '手机号不能为空，并且是11位数字'
        },
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: '密码不能为空，并且是6-12位'
        }
      },
      codeNum: 6,
      codeMsg: '获取短信验证码',
      code: ''
    }
  },
  components: {
    Header,
    Tabbar
  },
  methods: {
    //点击获取短信验证码按钮
    sendCode() {
      //验证
      if (!this.validate('userTel')) return

      //请求短信验证码接口
      http
        .$axios({
          url: '/api/code',
          method: 'POST',
          data: {
            phone: this.userTel
          }
        })
        .then((res) => {
          if (res.success) {
            this.code = res.data
            console.log(res)
          }
        })
      //禁用按钮
      this.disabled = true
      //倒计时
      let timer = setInterval(() => {
        --this.codeNum
        this.codeMsg = `重新发送 ${this.codeNum}`
      }, 1000)
      //判断什么时候停止定时器
      setTimeout(() => {
        clearInterval(timer)
        this.codeNum = 6
        this.disabled = false
        this.codeMsg = '获取短信验证码'
      }, 6000)
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
    },
    //点击注册
    register() {
      //验证密码
      if (!this.validate('userPwd')) return

      //判断验证码是否正确
      if (this.code != this.userCode) {
        Toast('验证码不正确')
        return
      }
      //如果正确，进行注册
      http
        .$axios({
          url: '/api/register',
          method: 'POST',
          data: {
            phone: this.userTel,
            pwd: this.userPwd
          }
        })
        .then((res) => {
          console.log(res)
          if (res.success) {
            Toast('注册成功')
            this.$router.push('/login')
          } else {
            Toast('注册失败')
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  background-color: #f5f5f5;
  div {
    margin: 10px 0;
    width: 335px;
    height: 44px;
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
      margin-left: 5px;
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
    font-size: 18px;
    text-align: center;
    background-color: #b0352f;
    border-radius: 6px;
  }
}
</style>
