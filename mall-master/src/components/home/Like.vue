<template>
  <div class="like">
    <Card>
      <span>猜你喜欢</span>
    </Card>
    <ul>
      <li
        v-for="(item, index) in likeList"
        :key="index"
        @click="goDetail(item.id)"
      >
        <h2>
          <img v-lazy="item.imgUrl" alt="" />
        </h2>
        <h3>{{ item.name }}</h3>
        <div>
          <span>¥</span>
          <b>{{ item.price }}</b>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import Card from 'components/home/Card'
export default {
  props: {
    likeList: Array
  },
  components: {
    Card
  },
  methods: {
    goDetail(id) {
      this.$router.push({
        path: '/detail',
        query: {
          id: id
        }
      })
    }
  }
}
</script>
<style scoped>
.like ul {
  display: flex;
  flex-wrap: wrap;
}
.like ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
}
.like h3 {
  padding: 0 6px;
  width: 93%;
  font-size: 14px;
  font-weight: 400;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.like ul li > div {
  width: 93%;
  padding: 6px;
  text-align: left;
  color: #ff0000;
}
.like ul li > div span {
  font-size: 12px;
}
.like ul li > div b {
  font-weight: 600;
  font-size: 16px;
}
.like img {
  width: 176px;
  height: 176px;
}
.like img[lazy='loading'] {
  background-color: #f7f7f7;
}
</style>
