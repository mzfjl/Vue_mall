<template>
  <header>
    <div class="search-return" @click="goBack">
      <img src="@/assets/img/返回.svg" alt="" />
    </div>
    <div class="search-main">
      <img src="@/assets/img/放大镜.svg" alt="" />
      <form action="" onsubmit="return false" @keyup.enter="goSearchList">
        <input
          type="search"
          placeholder="搜索您喜欢的产品..."
          v-model="searchVal"
          autofocus
        />
      </form>
    </div>
    <div class="serach-btn" @click="goSearchList">搜索</div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      searchVal: this.$route.query.key || '',
      searchArr: []
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    goSearchList() {
      //如果搜索的关键字是没有的，那就直接return
      if (!this.searchVal) return
      //判断之前有没有搜索的本地存储
      if (!localStorage.getItem('searchList')) {
        //没有
        localStorage.setItem('searchList', '[]')
      } else {
        //之前有
        this.searchArr = JSON.parse(localStorage.getItem('searchList'))
      }
      //增加数据
      this.searchArr.unshift(this.searchVal)
      //ES6去重
      let newArr = new Set(this.searchArr)
      //给本地存储赋值
      localStorage.setItem('searchList', JSON.stringify(Array.from(newArr)))

      // 路径如果没有变化，不跳转页面
      if (this.searchVal == this.$route.query.key) return false
      //跳转页面
      this.$router.push({
        name: 'list',
        query: {
          key: this.searchVal
        }
      })
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  color: #fff;
  background-color: red;
}
.search-return,
.serach-btn {
  padding: 0 10px;
}

.search-return img {
  width: 28px;
}
.search-main {
  display: flex;
  align-items: center;
  width: 260px;
  height: 30px;
  border-radius: 12px;
  background-color: #ffffff;
}

.search-main img {
  width: 14px;
  padding: 0 10px;
  color: #666666;
}
.search-main form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.search-main form input {
  width: 100%;
  background: none;
  outline: none;
  border: none;
  color: black;
}

.search-main form input:focus {
  border: none;
}

.serach-btn {
  font-size: 16px;
}
</style>
