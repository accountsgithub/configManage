<template>
  <div>
    <div @click="toggleClick" class="hamburger" :class="{'is-active':!isActive}"></div>
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  cursor: pointer;
  margin-top: 30px;
  width: 22px;
  height: 22px;
  background:url( '../../assets/images/menu-ss.png') no-repeat center top;
  transition: .38s;
  transform-origin: 50% 50%;
}
.hamburger.is-active {
  background:url( '../../assets/images/menu-zk.png') no-repeat center top;
}
</style>
