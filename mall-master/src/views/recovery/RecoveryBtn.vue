<template>
  <div class="login container">
    <Header>
      <span>找回密码</span>
    </Header>
    <section>
      <div class="login-tel">
        <input type="text" v-model="userPwd" placeholder="请输入新的密码" />
      </div>
      <div class="login-btn" @click="submitBtn">确认</div>
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
      userPwd: '',
      //验证规则
      rules: {
        //手机号验证
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: '密码不能为空，并且是6-12位'
        }
      }
    }
  },
  components: {
    Header,
    Tabbar
  },
  methods: {
    submitBtn() {
      if (!this.validate('userPwd')) return
      //确认修改
      http
        .$axios({
          url: '/api/recovery',
          method: 'POST',
          data: {
            phone: this.$route.query.phone,
            pwd: this.userPwd
          }
        })
        .then((res) => {
          Toast('修改成功')

          if (res.success) {
            this.$router.push({
              path: '/login'
            })
          }
        })
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
