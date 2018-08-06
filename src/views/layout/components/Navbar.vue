<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-select v-model="lang" class="langSelectStyle">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <i><div class="userSign"></div></i>
        <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">{{$t('common.logout')}}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img src="../../../assets/images/pic-head.png" class="userSign" />
        <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">{{$t('common.logout')}}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Cookies from 'js-cookie'
import local from '@/lang'
const viewName = 'i18nView'

export default {
  data () {
    return {
      options: [
        {
          label: '中文',
          value: 'zh'
        },
        {
          label: 'ENGLISH',
          value: 'en'
        }
      ]
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    lang: {
      get () {
        return this.$store.state.language
      },
      set (lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
      }
    }
  },
  created () {
    if (!this.$i18n.getLocaleMessage('en')[viewName]) {
      this.$i18n.mergeLocaleMessage('zh', local.zh)
      this.$i18n.mergeLocaleMessage('en', local.en)
    }
  },
  methods: {
    ...mapActions([
      'ToggleSideBar', 'LogOut', 'getLogOut'
    ]),
    toggleSideBar () {
      this.ToggleSideBar()
    },
    logout () {
      this.getLogOut().then(res => {
        if (res.data.code === '0') {
          location.reload()
          // this.$router.push({ path: '/login' })
        }
      })
      // this.$router.push('/login')
      // this.LogOut().then(() => {
      //   location.reload() // 为了重新实例化vue-router对象
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 72px;
  line-height: 72px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 72px;
    height: 72px;
    float: left;
    padding-left: 21px;

  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 72px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 30px;
        font-size: 12px;
      }
      .userSign {
        display: inline-block;
        cursor: pointer;
        width: 32px;
        margin-top: 22px;
        height: 32px;
        transition: .38s;
        transform-origin: 50% 50%;
      }
    }
  }
  .langSelectStyle{
    float: right;
    margin-right: 100px;
    width: 170px;
    height: 30px;
  }
}
</style>
