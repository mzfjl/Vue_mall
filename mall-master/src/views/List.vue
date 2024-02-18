<template>
  <div class="list">
    <header v-show="isShow">
      <div class="returns">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div class="search">
        <i class="iconfont icon-fangdajing"></i>
        <span>搜您喜欢的...</span>
      </div>
      <div class="go-home">
        <img src="@/assets/img/home.png" alt="" />
      </div>
    </header>
    <section>
      <div class="list-l">
        <div>
          <ul class="l-item">
            <li
              v-for="(item, index) in leftData"
              :key="index"
              :class="{ active: index == currentIndex }"
              @click="goScroll(index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>

      <div class="list-r" ref="right">
        <div>
          <ul v-for="(item, index) in rightData" :key="index" class="shop-list">
            <li v-for="(k, i) in item" :key="i">
              <h2>{{ k.name }}</h2>
              <ul class="r-content">
                <li v-for="(j, idx) in k.list" :key="idx">
                  <img :src="j.imgUrl" alt="" />
                  <span>{{ j.name }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Tabbar from 'components/common/Tabbar'
import http from 'common/api/request'
export default {
  name: 'List',
  data() {
    return {
      isShow: true,
      leftData: [], //左侧数据
      rightData: [], //右侧数据
      rightBScroll: '', //右侧滑动BScroll
      allHeight: [], //承载右侧每一块的高度值
      scrollY: '' //右侧滚动距离
    }
  },
  computed: {
    currentIndex() {
      return this.allHeight.findIndex((item, index) => {
        return this.scrollY >= item && this.scrollY < this.allHeight[index + 1]
      })
    }
  },
  components: {
    Tabbar
  },
  async created() {
    let res = await http.$axios({
      url: '/api/goods/list'
    })

    let leftArr = []
    let rightArr = []

    res.forEach((v) => {
      leftArr.push({
        id: v.id,
        name: v.name
      })
      rightArr.push(v.data)
    })
    this.leftData = leftArr
    this.rightData = rightArr

    this.$nextTick(() => {
      // 初始化 BetterScroll
      new BScroll('.list-l', {
        click: true,
        bounce: false
      })
      this.rightBScroll = new BScroll('.list-r', {
        click: true,
        probeType: 3,
        bounce: false
      })
      //统计右侧所有板块高度值，并且放入数组中
      let height = 0
      this.allHeight.push(height)
      //获取右侧每一块高度
      let uls = this.$refs.right.getElementsByClassName('shop-list')
      //把dom对象转换成功真正的数组
      Array.from(uls).forEach((v) => {
        height += v.clientHeight
        this.allHeight.push(height)
      })
      //得到右侧滚动的值
      this.rightBScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(pos.y)
        if (Math.abs(pos.y) >= 50) {
          this.isShow = false
        } else {
          this.isShow = true
        }
      })
    })
  },
  methods: {
    goScroll(index) {
      // console.log(this.allHeight, index)
      this.rightBScroll.scrollTo(0, -this.allHeight[index], 300)
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  background-color: red;
  .returns {
    line-height: 44px;
    padding: 0 20px;
    i {
      color: #fff;
      font-size: 26px;
    }
  }
  .search {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 6px 10px;
    background-color: #ffffff;
    border-radius: 24px;
    i {
      padding-right: 6px;
      color: #666;
      font-size: 18px;
    }
    span {
      color: #666;
      font-size: 14px;
    }
  }
  .go-home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    line-height: 44px;
    img {
      width: 26px;
      height: 26px;
    }
  }
}
section {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.list-l {
  width: 93px;
  background-color: #fff;
  border-right: 1px solid #cccccc;
  overflow: hidden;
  .l-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    li {
      width: 100%;
      padding: 3px 0;
      margin: 20px 0;
      text-align: center;
      font-size: 14px;
      &.active {
        color: red;
        border-left: 6px solid red;
      }
    }
  }
}

.list-r {
  flex: 1;
  overflow: hidden;
  .shop-list {
    text-align: center;
    h2 {
      padding: 20px 0;
      font-size: 24px;
      font-weight: 400;
    }
    .r-content {
      display: flex;
      flex-wrap: wrap;
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33.33%;
        padding: 10px 0;
        img {
          width: 53px;
          height: 53px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
}
::v-deep.tabbar {
  border-top: 1px solid #cccccc;
}
</style>
