<template>
  <header>
    <i class="iconfont icon-fanhui" @click="goBack"></i>
    <slot>
      <span>我的地址</span>
    </slot>
    <i class="iconfont icon-kefu"></i>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    goBack() {
      if (this.$route.name == 'path-list') {
        this.$router.replace('/path')
      } else {
        this.$router.push('/my')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  color: #fff;
  background-color: #b0352f;
  i {
    padding: 0 15px;
    font-size: 22px;
  }
  span {
    font-weight: 300;
    font-size: 18px;
  }
}
</style>
