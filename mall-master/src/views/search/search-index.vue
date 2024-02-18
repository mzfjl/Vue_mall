<template>
  <div class="search-index">
    <Header></Header>
    <section>
      <div class="search-history" v-if="searchArr.length">
        <h2>
          <img src="@/assets/img/时 间.svg" alt="" />
          <span>历史搜索</span>
          <span @click="deleteStorage">清空历史记录</span>
        </h2>
        <ul>
          <li
            v-for="(item, index) in searchArr"
            :key="index"
            @click="goSearchList(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div v-else>暂无搜索记录...</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>
<script>
import Header from 'components/search/Header'
import Tabbar from 'components/common/Tabbar'
import { MessageBox } from 'mint-ui'
export default {
  data() {
    return {
      searchArr: []
    }
  },
  components: {
    Header,
    Tabbar
  },
  created() {
    this.searchArr = JSON.parse(localStorage.getItem('searchList')) || []
  },
  methods: {
    deleteStorage() {
      MessageBox({
        title: '提示',
        message: '确定执行此操作?',
        showCancelButton: true
      }).then((res) => {
        if (res == 'confirm') {
          //删除本地存储
          localStorage.removeItem('searchList')
          //清除数据
          this.searchArr = []
        }
      })
    },
    // 点击历史搜索，进入搜索页面
    goSearchList(item) {
      this.$router.push({
        name: 'list',
        query: {
          key: item
        }
      })
    }
  }
}
</script>
<style scoped>
.search-index {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
section {
  flex: 1;
  background-color: #f5f5f5;
  overflow: hidden;
}
.search-history h2 {
  position: relative;
  padding: 20px;
  font-weight: 400;
  font-size: 18px;
}
.search-history h2 img {
  position: relative;
  top: 2px;
  padding-right: 3px;
  color: red;
  width: 18px;
}
.search-history h2 span:last-child {
  position: absolute;
  right: 20px;
}
.search-history ul {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
}
.search-history ul li {
  margin: 10px;
  padding: 3px 6px;
  font-size: 14px;
  border: 1px solid #ccc;
}
</style>
