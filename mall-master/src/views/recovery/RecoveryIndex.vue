<template>
  <div class="login container">
    <Header>
      <span>找回密码</span>
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
      <div class="login-btn" @click="next">下一步</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from 'components/common/Tabbar'
import Header from 'views/login/Header'
import { Toast } from 'mint-ui'
import http from 'common/api/request.js'
export default {
  data() {
    return {
      disabled: false,
      userTel: '',
      userCode: '',
      //验证规则
      rules: {
        //手机号验证
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: '手机号不能为空，并且是11位数字'
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
    //点击下一步
    next() {
      //如果验证码不正确
      if (this.code != this.userCode) {
        Toast('验证码错误')
        return
      }
      ////告诉后端，用户输入的手机号，存在吗？
      http
        .$axios({
          url: '/api/selectUser',
          method: 'POST',
          data: {
            phone: this.userTel
          }
        })
        .then((res) => {
          if (!res.success) {
            Toast(res.msg)
            return
          }

          this.$router.push({
            name: 'btn',
            query: {
              phone: this.userTel
            }
          })
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
    text-align: center;
    background-color: #b0352f;
    border-radius: 6px;
  }
}
</style>
