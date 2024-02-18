<template>
  <header>
    <div @click="goBack">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div>
      <slot>
        <span>登录</span>
      </slot>
    </div>
    <div>
      <i class="iconfont icon-kefu"></i>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  color: #fff;
  background-color: #b0352f;
  span {
    font-size: 18px;
  }
  i {
    padding: 0 15px;
    font-size: 22px;
  }
}
</style>
