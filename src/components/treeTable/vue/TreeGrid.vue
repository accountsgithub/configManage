<template>
  <el-table :data="data" class="clearfix" border style="width: 100%" :row-style="showTr">
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" align="center" :render-header="column.dataIndex === 'completed'? renderHeader: null">
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <span v-if="toggleIconShow(index,scope.row)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true" @click="toggle(scope.$index)"></i>
          <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true" @click="toggle(scope.$index)"></i>
        </span>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>
    <el-table-column :label="lang.RM_ACTION" v-if="auths.POLICE_CASE_QUERY">
      <template slot-scope="scope">
        <el-button type="text" size="mini" @click="() => handleDetail(scope.row)">{{ lang.POLICE_CASE_LIST }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import {mapGetters} from 'vuex'
  import Utils from '../utils/index.js'
  export default {
    name: 'tree-grid',
    props: {
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        auths: 'getAuths'
      }),
      // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          return data
        }
        return me.dataSource
      }
    },
    methods: {
      /**
       * 表格表头标题自定义渲染
       */
      renderHeader (createElement, { column, $index }) {
        let html = createElement('div', {
          style: 'display:flex;align-items:center;justify-content:flex-start;width:100%;'
        }, [
          createElement('div', {
            domProps: {
              innerHTML: this.lang.ALREADY_TREATED
            }
          }),
          createElement('el-tooltip', {
            attrs: {
              class: 'item',
              effect: 'light',
              content: this.lang.POLICE_CASE_CHANGE,
              placement: 'top'
            }
          }, [
            createElement('span', {
              style: 'cursor:pointer;',
              domProps: {
                innerHTML: '<i class="el-icon-question"></i>'
              }
            })
          ])
        ])
        return html
      },
      handleDetail (value) {
        this.$emit('showHandle', value)
      },
      // 显示行
      showTr: function (row, index) {
        let rows = row.row // 转换
        let show = (rows._parent ? (rows._parent._expanded && rows._parent._show) : true)
        rows._show = show
        return show ? '' : 'display:none;'
      },
      // 展开下级树
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
      // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
      // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      handleDelete () {}
    }
  }
</script>
<style scoped>
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 14px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: ""
  }

  table td {
    line-height: 26px;
  }

  i {
    cursor: pointer;
  }
</style>
