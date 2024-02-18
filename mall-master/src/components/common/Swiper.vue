<template>
  <div class="swiper-main">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(item, index) in swiperList" :key="index">
        <img :src="item.imgUrl" alt="" />
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
  name: 'Swiper',
  props: {
    swiperList: Array
  },
  data() {
    return {
      swiperOption: {
        autoplay: {
          // 手动切换后重新启动 autoplay
          disableOnInteraction: false,
          delay: 3000
        },
        speed: 1000,
        loop: true, //循环
        // 分页器
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style scoped>
.swiper-main {
  position: relative;
  width: 100%;
  height: 165px;
}
.swiper-container {
  width: 100%;
  height: 165px;
}
.swiper-main img {
  width: 100%;
  height: 165px;
}
.swiper-pagination {
  width: 100%;
  bottom: 0px;
}
::v-deep .swiper-pagination-bullet {
  margin: 0 3px;
}
::v-deep .swiper-pagination-bullet-active {
  background-color: #b0352f;
}
</style>
