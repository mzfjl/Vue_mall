<template>
  <div class="home">
    <div class="headers">
      <div class="headers-main">
        <Header></Header>
        <ly-tabs
          v-model="selectedId"
          :activeColor="options.activeColor"
          @change="handleTabClick"
        >
          <ly-tab-item
            :name="index"
            :title="item.label"
            v-for="(item, index) in items"
            :key="index"
          />
        </ly-tabs>
      </div>
    </div>
    <section class="scroll-wrapper">
      <div>
        <div v-for="(item, index) in newData" :key="index">
          <Swiper
            v-if="item.type == 'swiperList'"
            :swiperList="item.data"
          ></Swiper>

          <Icons v-if="item.type == 'iconsList'" :iconsList="item.data"></Icons>

          <Recommend
            v-if="item.type == 'recommendList'"
            :recommendList="item.data"
          ></Recommend>

          <Ad v-if="item.type == 'adList'" :adList="item.data"></Ad>

          <Like v-if="item.type == 'likeList'" :likeList="item.data"></Like>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from 'components/home/Header'
import Swiper from 'components/common/Swiper'
import Icons from 'components/home/Icons'
import Recommend from 'components/home/Recommend'
import Like from 'components/home/Like'
import Ad from 'components/home/Ad'
import Tabbar from 'components/common/Tabbar'
// 插件
import BScroll from 'better-scroll'
import http from 'common/api/request.js'

export default {
  name: 'Home',
  data() {
    return {
      selectedId: 0,
      topBar: [],
      items: [],
      newData: [],
      oBScroll: '',
      tBScroll: '',
      options: {
        activeColor: '#b0352f'
      }
    }
  },
  components: {
    Header,
    Swiper,
    Icons,
    Recommend,
    Like,
    Ad,
    Tabbar
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    async getData() {
      let res = await http.$axios({
        url: '/api/index_list/0/data/1'
      })
      this.items = Object.freeze(res.topBar)
      this.newData = Object.freeze(res.data)
      // 当dom都加载完毕后再去执行 这时候节点高度才被算出来
      this.$nextTick(() => {
        this.oBScroll = new BScroll('.scroll-wrapper', {
          // 配置懒加载，延迟加载视图内的内容，例如图片、视频等，提高页面加载速度和性能。
          lazyLoad: true,
          movable: true,
          click: true,
          zoom: true
        })
      })
    },
    async addData(index) {
      let res = await http.$axios({
        url: '/api/index_list/' + index + '/data/1'
      })
      if (res.constructor != Array) {
        this.newData = res.data
      } else {
        this.newData = res
      }
      // 当dom都加载完毕后再去执行
      this.$nextTick(() => {
        this.tBScroll = new BScroll('.scroll-wrapper', {
          // 配置懒加载，延迟加载视图内的内容，例如图片、视频等，提高页面加载速度和性能。
          lazyLoad: true,
          movable: true,
          click: true,
          zoom: true
        })
      })
    },
    handleTabClick(index) {
      this.addData(index)
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.headers {
  width: 100%;
  height: 98px;
}
.headers-main {
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0;
}
section {
  flex: 1;
  overflow: hidden;
}
::v-deep .ly-tabs {
  box-shadow: none;
  border-bottom: none;
}
</style>
