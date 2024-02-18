<template>
  <ul class="icons">
    <li v-for="(item, index) in iconsList" :key="index">
      <img :src="item.imgUrl" alt="" />
      <span>{{ item.title }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    iconsList: Array
  }
}
</script>

<style scoped>
.icons {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
}
.icons li {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icons img {
  width: 35px;
  height: 35px;
}
.icons span {
  padding: 6px;
  font-size: 16px;
}
</style>
