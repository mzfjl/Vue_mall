<template>
  <div id="app">
    <!-- 要缓存的路由 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <!-- 不缓存的路由 -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
export default {
  created() {
    this.$store.commit('initUser')
  }
}
</script>
