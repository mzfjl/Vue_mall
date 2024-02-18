import {
  CART_LIST,
  CHECK_ALL,
  UN_CHECK_ALL,
  CHECK_ITEM
} from './mutations-types.js'
import { Toast, Dialog } from 'vant'
import http from 'common/api/request.js'
export default {
  state: {
    list: [], // 购物车数据
    selectList: [] //选中的数据
  },
  getters: {
    isCheckedAll(state) {
      return state.list.length == state.selectList.length
    },
    total(state) {
      let total = {
        num: 0,
        price: 0
      }
      state.list.forEach((item) => {
        if (item.checked) {
          total.num += parseInt(item.goods_num)
          total.price += item.goods_num * item.goods_price
        }
      })
      return total
    }
  },
  mutations: {
    [CART_LIST](state, cartArr) {
      state.list = cartArr
      state.selectList = state.list.map((item) => {
        return item.id
      })
    },
    // 全选
    [CHECK_ALL](state) {
      state.selectList = state.list.map((item) => {
        item.checked = true
        return item.id
      })
    },
    // 全不选
    [UN_CHECK_ALL](state) {
      state.list.forEach((item) => {
        item.checked = false
      })
      state.selectList = []
    },
    // 单选
    [CHECK_ITEM](state, index) {
      let id = state.list[index].id
      // indexOf(id) 返回id在selectList中的位置,id不存在则返回-1
      let i = state.selectList.indexOf(id)
      // console.log(i)
      // 如果能在selectList找到对应的id，
      // 说明之前已经选中了，需要取消选中，就删除
      if (i > -1) {
        return state.selectList.splice(i, 1)
      }
      //如果之前没有选中，就给selectList添加一个id进去
      state.selectList.push(id)
    },
    //删除
    delGoods(state) {
      state.list = state.list.filter((item) => {
        return state.selectList.indexOf(item.id) == -1
      })
    }
  },
  actions: {
    checkAllFn({ commit, getters }) {
      getters.isCheckedAll ? commit('unCheckAll') : commit('checkAll')
    },
    //删除操作
    delGoodsFn({ commit, state }, id) {
      //如果没有选中，则提示信息
      if (state.selectList.length == 0) {
        Toast('请选择商品')
      }

      let arrCart = []
      Dialog.confirm({
        message: '确定要删除这些商品吗？'
      }).then(() => {
        if (typeof id == 'number') {
          //单个删除
          arrCart = [id]
          let index = state.list.findIndex((item) => {
            return item.id == id
          })
          state.list.splice(index, 1)
          commit('checkAll')
        } else {
          //多选删除
          arrCart = state.selectList
          commit('delGoods')
        }

        http
          .$axios({
            url: '/api/deleteCart',
            method: 'post',

            data: {
              arrId: arrCart
            }
          })
          .then((res) => {
            if (res.success) {
              Toast(res.msg)
            }
          })
      })
    }
  }
}
