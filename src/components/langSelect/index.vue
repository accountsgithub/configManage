<template>
  <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
    <div style="margin-top: 5px;">
      <img v-if="lang=='zh'" src="@/assets/images/pic-CN.png"/>
      <img v-else-if="lang=='en'" src="@/assets/images/pic-EN.png"/>
      <!--<svg-icon class-name='international-icon' icon-class="language" />-->
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="lang==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="lang==='en'">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    props: ["lang"],
    computed: {
      language() {
        return this.$store.getters.language
      }
    },
    methods: {
      handleSetLanguage(lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-popper{
    margin-top: -12px;
    /deep/.el-dropdown-menu{
      padding: 0;
    }
  }
  .international-icon {
    font-size: 20px;
    cursor: pointer;
    vertical-align: -5px!important;
  }
</style>
