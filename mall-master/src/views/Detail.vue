<template>
  <div class="detail">
    <header>
      <div class="header-returns" v-show="isShow">
        <div @click="goBack">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <div>
          <i class="iconfont icon-kefu"></i>
        </div>
      </div>

      <div class="header-bar" v-show="!isShow" :style="styleOption">
        <div @click="goBack">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <div>
          <span>商品详情</span>
          <span>商品评价</span>
        </div>
        <div>
          <i class="iconfont icon-kefu"></i>
        </div>
      </div>
    </header>
    <section ref="wrapper">
      <div>
        <div class="swiper-main">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item, index) in swiperList" :key="index">
              <img :src="item.imgUrl" alt="" />
            </swiper-slide>
          </swiper>
          <div class="swiper-pagination"></div>
        </div>
        <div class="goods-name">
          <h1>{{ goods.name }}</h1>
          <div>性价首选，茶感十足、鲜醇耐泡的大众口粮茶</div>
        </div>
        <div class="goods-price">
          <div class="oprice">
            <span>¥</span>
            <b>{{ goods.price }}</b>
          </div>
          <div class="pprice">
            <span>价格:</span>
            <del>¥{{ goods.price }}</del>
          </div>
        </div>
        <div>
          <img style="width: 100%; height: 500px" :src="goods.imgUrl" alt="" />
          <img style="width: 100%; height: 500px" :src="goods.imgUrl" alt="" />
        </div>
      </div>
    </section>
    <footer>
      <div class="add-cart" @click="addCart">加入购物车</div>
      <div>立即购买</div>
    </footer>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import http from 'common/api/request.js'
import { Toast } from 'mint-ui'
export default {
  data() {
    return {
      id: 0,
      goods: {},
      styleOption: {},
      BetterScroll: '',
      isShow: true,
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
          type: 'fraction',
          clickable: true
        }
      },
      swiperList: [
        {
          imgUrl: './img/goods/goods1.jpg'
        },
        {
          imgUrl: './img/goods/goods2.jpg'
        },
        {
          imgUrl: './img/goods/goods3.jpg'
        }
      ]
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  created() {
    this.id = this.$route.query.id
    this.getData()
  },
  mounted() {
    this.BetterScroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: 3,
      bounce: false
    })
    this.BetterScroll.on('scroll', (pos) => {
      let posY = Math.abs(pos.y)
      let opacity = posY / 180

      opacity = opacity > 1 ? 1 : opacity

      this.styleOption = {
        opacity: opacity
      }

      if (posY >= 50) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    })
  },
  activated() {
    //判断当前url , id和之前id是否一致 解决keep-alive问题
    if (this.$route.query.id != this.id) {
      this.getData()
      this.id = this.$route.query.id
    }
  },
  methods: {
    async getData() {
      let id = this.$route.query.id
      let res = await http.$axios({
        url: '/api/goods/id',
        params: {
          id
        }
      })
      // console.log(res)
      this.goods = res
    },
    // 加入购物车
    addCart() {
      let id = this.$route.query.id
      http
        .$axios({
          url: '/api/addCart',
          method: 'post',
          data: {
            goodsId: id
          },
          headers: {
            token: true
          }
        })
        .then((res) => {
          if (res.success) {
            Toast('添加购物车成功')
          }
        })
    },
    //返回上一页
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 44px;
  .header-returns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 44px;
    div {
      margin: 0 10px;
      width: 35px;
      line-height: 34px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
    }
    i {
      font-size: 26px;
      color: #fff;
    }
  }
  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 44px;
    font-size: 16px;
    background-color: #fff;
    span {
      padding: 0 10px;
    }
    i {
      padding: 0 10px;
      font-size: 22px;
    }
  }
}
section {
  flex: 1;
  overflow: hidden;
}
.swiper-main {
  position: relative;
  width: 100%;
  height: 375px;
  overflow: hidden;
}
.swiper-container {
  width: 100%;
  height: 375px;
}
.swiper-container img {
  width: 100%;
  height: 375px;
}
.swiper-pagination {
  bottom: 10px;
  width: 100%;
  text-align: right;
  color: #ffffff;
  font-size: 16px;
}
.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-container-horizontal > .swiper-pagination-bullets {
  left: -20px;
}
.goods-name {
  padding: 20px 10px;
  border-bottom: 1px solid #cccccc;
  h1 {
    font-size: 20px;
    font-weight: 500;
  }
  div {
    padding: 3px 0;
    font-size: 14px;
    color: #999999;
  }
}
.goods-price {
  padding: 20px 10px;
  .oprice {
    color: red;
    span {
      font-size: 12px;
    }
  }
  .pprice {
    color: #999999;
    font-size: 14px;
  }
}
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 49px;
  border-top: 1px solid #cccccc;
  background-color: #fff;
  div {
    width: 50%;
    line-height: 49px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    background-color: red;
    &.add-cart {
      background-color: #ff9500;
    }
  }
}
</style>
