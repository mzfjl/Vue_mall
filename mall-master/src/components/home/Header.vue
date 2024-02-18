<template>
  <header>
    <h1>
      <img src="@/assets/img/logo.png" alt="" />
    </h1>
    <div class="search" @click="goSearch">
      <img src="@/assets/img/放大镜.svg" alt="" />
      <span>搜索商品/店铺</span>
    </div>
    <div class="kefu">
      <img src="@/assets/img/客服.svg" alt="" />
    </div>
  </header>
</template>
<script>
export default {
  methods: {
    goSearch() {
      this.$router.push('/search')
    }
  }
}
</script>
<style scoped>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: red;
  height: 60px;
  width: 100%;
}

header h1 {
  width: 85px;
  height: 50px;
}

header h1 img {
  width: 100%;
  height: 100%;
}

.search {
  width: 246px;
  height: 30px;
  background-color: white;
  border-radius: 12px;
}

.search img {
  padding: 7px 16px;
  width: 16px;
}

.search span {
  position: relative;
  font-size: 14px;
  color: #8a8a8a;
  top: -10px;
}
.kefu img {
  width: 36px;
}
</style>
