<template>
  <div class="tabbar">
    <ul>
      <li
        v-for="(item, index) in routerList"
        :key="index"
        @click="goToPath(item.path)"
      >
        <!-- $route.path：获取当前路由 -->
        <img
          :src="$route.path.includes(item.path) ? item.selected : item.active"
          alt=""
        />
        <span :class="$route.path.includes(item.path) ? 'active' : ''">{{
          item.title
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routerList: [
        {
          title: '首页',
          path: '/home',
          active: '/img/tabbar/home.svg', // public下
          selected: '/img/tabbar/home_active.svg'
        },
        {
          title: '分类',
          path: '/list',
          active: '/img/tabbar/category.svg',
          selected: '/img/tabbar/category_active.svg'
        },
        {
          title: '购物车',
          path: '/cart',
          active: '/img/tabbar/shopcart.svg',
          selected: '/img/tabbar/shopcart_active.svg'
        },
        {
          title: '我的',
          path: '/my',
          active: '/img/tabbar/profile.svg',
          selected: '/img/tabbar/profile_active.svg'
        }
      ]
    }
  },
  methods: {
    goToPath(path) {
      // 判断是否点击的是同一个路由
      if (this.$route.path == path) return
      //不是同一路由跳转页面
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: white;
}

.tabbar ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.tabbar ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tabbar ul li img {
  width: 31px;
  height: 31px;
}

.tabbar ul li span {
  font-size: 16px;
}

.active {
  color: red;
}
</style>
