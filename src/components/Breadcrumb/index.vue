<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{generateTitle(item.meta.title)}}</span>
        <router-link v-else :to="item.redirect||item.path">{{generateTitle(item.meta.title)}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
    <span v-if="index_showList.length > 0" style="margin-left: 10px">{{thisPathName}}</span>
    <el-button class="icon iconfont icon-ic-change" :class="[{tableButtonStyleB: true},{showStyle: isShowStyle}]" v-if="index_showList.length > 0" @click="openDialog">切换</el-button>
    <el-dialog
      title="切换平台"
      :visible.sync="dialogChangeVisible"
      width="60%">
      <el-row :gutter="20">
        <el-col v-for="(item, index) in index_showList" :span="6">
          <div class="hamburger2" @click="emitGetChange(item)"><span style="height: 20px; position: absolute;margin-top: 50px">{{item.name}}</span></div>
          <!--<image src = '../../assets/images/pic-equipment.png' style="width: 100px;height: 100px;float: left;" />-->
        </el-col>
      </el-row>
    </el-dialog>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import {mapActions, mapState} from 'vuex'
import utils from '@/utils/util'
import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
export default {
  components: {ElButton},
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: null,
      dialogChangeVisible: false,
      checkPathName: '',
      isShow: false
    }
  },
  computed: {
    ...mapState({
      index_showList: (index) => index.app.index_showList
    }),
    thisPathName () {
      return this.checkPathName
    },
    isShowStyle () {
      return this.isShow
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
      let pathType = location.href
      if (pathType.indexOf('view/resourceBuilding') > -1) {
        this.isShow = true
      } else if (pathType.indexOf('view/resourceBuilding') < 0 && utils.getCookie('checkPathSign')) {
        this.isShow = false
      }
    }
  },
  mounted () {
    this.getThisRBACList()
  },
  methods: {
    ...mapActions([
      'getRootList', 'getRBACList'
    ]),
    generateTitle,
    openDialog () {
      this.dialogChangeVisible = true
    },
    getThisRBACList () {
      let params = Object.assign({username: localStorage.username})
      this.getRBACList(params).then(res => {
        if (this.index_showList && this.index_showList.length > 0) {
          utils.setCookie('checkPathName', this.index_showList[0].name)
          utils.setCookie('checkPathSign', this.index_showList[0].sign)
          this.checkPathName = ' / ' + this.index_showList[0].name
        } else {
          utils.delCookie('checkPathName')
          utils.delCookie('checkPathSign')
        }
      })
    },
    emitGetChange (val) {
      let pathType = location.href
      let pathStr = ''
      if (pathType.indexOf('view/user') > -1) {
        pathStr = '用户管理'
      } else if (pathType.indexOf('view/role') > -1) {
        pathStr = '角色管理'
      } else if (pathType.indexOf('view/department') > -1) {
        pathStr = '部门管理'
      } else if (pathType.indexOf('view/person') > -1) {
        pathStr = '人员管理'
      } else if (pathType.indexOf('view/resource') > -1) {
        pathStr = '资源管理'
      } else if (pathType.indexOf('view/client') > -1) {
        pathStr = '项目管理'
      }
      this.$router.push({name: pathStr, query: {id: val.sign}})
      if (val) {
        utils.delCookie('checkPathName')
        utils.delCookie('checkPathSign')
        utils.setCookie('checkPathName', val.name)
        utils.setCookie('checkPathSign', val.sign)
        this.checkPathName = ' / ' + val.name
      }
      this.dialogChangeVisible = false
    },
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{path: '/', meta: { title: 'homePage' }}].concat(matched)
      }
      // let pathTemp = location.href
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .showStyle {
    display: none;
  }
  .el-button {
    padding: 0;
  }
  .tableButtonStyleB{
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#016ad5;
    background:#ffffff;
    border:1px solid #c2defb;
    border-radius:4px;
    width:64px;
    height:24px;
    float: right;
    margin-left: 10px;
    margin-top: 23px;
  }
  .el-button {
    line-height: 0.5;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 72px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
  .hamburger1 {
    display: inline-block;
    cursor: pointer;
    margin-top: 30px;
    width: 100px;
    height: 100px;
    background:url( '../../assets/images/pic-equipment.png') no-repeat center top;
    transition: .38s;
    transform-origin: 50% 50%;
  }
  .hamburger2 {
     display: inline-block;
     cursor: pointer;
     margin-top: 30px;
     width: 100px;
     height: 100px;
     background:url( '../../assets/images/pic-notes.png') no-repeat center top;
     transition: .38s;
     transform-origin: 50% 50%;
   }
  .hamburger3 {
      display: inline-block;
      cursor: pointer;
      margin-top: 30px;
      width: 100px;
      height: 100px;
      background:url( '../../assets/images/pic-permissions.png') no-repeat center top;
      transition: .38s;
      transform-origin: 50% 50%;
    }
  .hamburger4 {
    display: inline-block;
    cursor: pointer;
    margin-top: 30px;
    width: 100px;
    height: 100px;
    background:url( '../../assets/images/pic-setting.png') no-repeat center top;
    transition: .38s;
    transform-origin: 50% 50%;
  }
  .hamburger5 {
    display: inline-block;
    cursor: pointer;
    margin-top: 30px;
    width: 100px;
    height: 100px;
    background:url( '../../assets/images/pic-video.png') no-repeat center top;
    transition: .38s;
    transform-origin: 50% 50%;
  }
</style>
