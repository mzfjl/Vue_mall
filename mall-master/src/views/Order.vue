<template>
  <div class="order container">
    <header>
      <i class="iconfont icon-fanhui" @click="$router.back()"></i>
      <span>提交订单</span>
      <i class="iconfont icon-kefu"></i>
    </header>
    <section>
      <div class="path">
        <h3 class="path-title">收货信息</h3>
        <div class="path-content" @click="goPath">
          <div>
            <span>{{ path.name }}</span>
            <span>{{ path.tel }}</span>
          </div>
          <div>
            <span>{{ path.province }}</span>
            <span>{{ path.city }}</span>
            <span>{{ path.county }}</span>
            <span>{{ path.addressDetail }}</span>
          </div>
        </div>
      </div>
      <div class="payment">
        <div class="payment-title">支付方式：</div>
        <van-radio-group v-model="radioPayment">
          <van-radio name="wx">微信支付</van-radio>
          <van-radio name="ali">支付宝支付</van-radio>
        </van-radio-group>
      </div>
      <div class="goods">
        <ul>
          <li v-for="(item, index) in goodsList" :key="index">
            <div>
              <img :src="item.goods_imgUrl" alt="" />
            </div>
            <div class="goods-content">
              <h4>{{ item.goods_name }}</h4>
              <div class="goods-total">
                <span>¥{{ item.goods_price }}</span>
                <span>x{{ item.goods_num }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <footer>
      <div class="order-total">
        <span>共</span>
        <b>{{ total.num }}</b>
        <span>件,</span>
        <span>总金额：</span>
        <em>¥{{ total.price }}</em>
      </div>
      <div class="order-topay" @click="goPayment">提交订单</div>
    </footer>
  </div>
</template>

<script>
import { Toast } from 'vant'
import http from 'common/api/request.js'
import { mapState, mapGetters, mapMutations } from 'vuex'
import bus from 'common/bus.js'
import qs from 'qs'
export default {
  name: 'Header',
  data() {
    return {
      radioPayment: 'wx',
      path: {},
      item: [],
      total: {
        price: 0,
        num: 0
      }
    }
  },
  computed: {
    ...mapState({
      order_id: (state) => state.order.order_id,
      selectList: (state) => state.cart.selectList
    }),
    ...mapGetters(['defaultPath'])
  },
  created() {
    this.goodsList = JSON.parse(this.$route.query.goodsList)
    this.selectAddress()
  },
  activated() {
    //选中的商品id号
    this.item = JSON.parse(this.$route.query.detail)
    this.goodsList = JSON.parse(this.$route.query.goodsList)
    this.selectOrder()
    bus.$on(
      'selectPath',
      function (data) {
        this.path = JSON.parse(data)
      }.bind(this)
    )
  },
  methods: {
    ...mapMutations(['initData', 'initOrder']),
    //查询地址
    selectAddress() {
      http
        .$axios({
          url: '/api/selectAddress',
          method: 'post',
          headers: {
            token: true
          }
        })
        .then((res) => {
          this.initData(res.data)
          //有默认收货地址
          if (this.defaultPath.length) {
            this.path = this.defaultPath[0]
          } else {
            this.path = res.data[0]
          }
        })
    },
    //查询订单
    selectOrder() {
      http
        .$axios({
          url: '/api/selectOrder',
          method: 'post',
          headers: {
            token: true
          },
          data: {
            orderId: this.order_id
          }
        })
        .then((res) => {
          this.initOrder(res.data)

          this.total = {
            price: res.data[0].goods_price,
            num: res.data[0].goods_num
          }
        })
    },
    //选择收货地址
    goPath() {
      this.$router.push({
        path: '/path',
        query: {
          type: 'select'
        }
      })
    },
    //提交订单
    goPayment() {
      //判断是否选择了收货地址
      if (!this.path) return Toast('请填写收货地址')

      //发送请求==》1.修改订单状态2.删除购物车的数据
      http
        .$axios({
          url: '/api/submitOrder',
          method: 'post',
          headers: {
            token: true
          },
          data: {
            orderId: this.order_id,
            shopArr: this.selectList
          }
        })
        .then((res) => {
          let newArr = []
          this.goodsList.forEach((v) => {
            newArr.push(v.goods_name)
          })

          //支付传递的参数
          let dataOrder = {
            orderId: this.order_id,
            name: newArr.join(''),
            price: this.total.price
          }

          if (res.success) {
            //去支付
            http
              .$axios({
                url: '/api/payment',
                method: 'post',
                headers: {
                  token: true,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                //qs是增加安全性的序列化
                data: qs.stringify(dataOrder)
              })
              .then((res) => {
                if (res.success) {
                  //打开支付宝支付的页面
                  window.location.href = res.paymentUrl
                }
              })
          }
        })
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
section {
  background-color: #f7f7f7;
  .path-title {
    padding: 15px;
    font-size: 18px;
  }
  .path-content {
    padding: 6px 15px;
    font-size: 14px;
    background-color: #ffffff;
    span {
      padding-right: 6px;
    }
  }
  .payment {
    padding: 6px 15px;
    margin-top: 15px;
    font-size: 16px;
    background-color: #ffffff;
    .van-radio-group {
      display: flex;
      padding: 6px 0;
      .van-radio {
        padding-right: 10px;
      }
    }
  }
  .goods {
    padding: 6px 15px;
    margin-top: 15px;
    font-size: 16px;
    background-color: #ffffff;
    ul {
      width: 100%;
      li {
        display: flex;
        width: 100%;
        img {
          width: 74px;
          height: 74px;
        }
        .goods-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-left: 15px;
          .goods-total {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 45px;
  border-top: 1px solid #ccc;
  .order-total {
    font-size: 16px;
    span {
      padding: 0 6px;
    }
    b {
      color: #b0352f;
    }
    em {
      font-size: 18px;
      color: #b0352f;
    }
  }
  .order-topay {
    width: 120xp;
    line-height: 45px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background-color: #b0352f;
  }
}
</style>
