<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link style="margin-left: 7px;" v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}" class="bigMenu">
          <i v-if="item.children[0].meta&&item.children[0].meta.icon" :class="'icon iconfont icon-ic-' + item.children[0].meta.icon"></i>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title" class="menuStyle">{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <i v-if="item.meta&&item.meta.icon" :class="'icon iconfont icon-ic-' + item.meta.icon"></i>
          <span v-if="item.meta&&item.meta.title" slot="title" class="menuStyle">{{generateTitle(item.meta.title)}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <i v-if="child.meta&&child.meta.icon" :class="'icon iconfont icon-ic-' + child.meta.icon"></i>
              <span v-if="child.meta&&child.meta.title" slot="title" class="menuStyle">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
  import { generateTitle } from '@/utils/i18n'
  import {mapGetters} from 'vuex'
  import '@/assets/iconfont/iconfont.css' // icon css
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },
    methods: {
      generateTitle,
      hasOneShowingChildren (children) {
        const showingChildren = children.filter(item => {
          return !item.hidden
        })
        if (showingChildren.length === 1) {
          return true
        }
        return false
      }
    }
  }
</script>
<style lang="less" scoped>
  .menuStyle{
    margin-left: 10px;
  }
  .el-menu-item i {
    color: #8494b5;
  }
  .el-menu-item, .el-submenu__title {
    line-height: 45px;
  }
  .bigMenu{}
</style>
