<template>
  <el-table stripe :data="data" class="clearfix" style="width: 100%" :row-style="showTr">
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :render-header="column.dataIndex === 'completed'? renderHeader: null">
      <el-table-column v-if="column.children" v-for="(item, itemIndex) in column.children" :key="item.dataIndex" :label="item.text" :align="item.align">
        <template slot-scope="scope">
          <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
          <span v-if="toggleIconShow(index,scope.row)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true" @click="toggle(scope.$index)"></i>
            <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true" @click="toggle(scope.$index)"></i>
          </span>
          <span v-else-if="index===0" class="ms-tree-space"></span>
          {{scope.row[item.dataIndex]}}
        </template>
      </el-table-column>
      <template slot-scope="scope" v-if="!column.children">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <span v-if="toggleIconShow(index,scope.row)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true" @click="toggle(scope.$index)"></i>
          <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true" @click="toggle(scope.$index)"></i>
        </span>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>
    <el-table-column align="center" label="有效性" prop="status">
      <template slot-scope="scope">
        <i v-if="scope.row.status == '无效'" style="color: red" class="el-icon-circle-close"></i>
        <i v-else-if="scope.row.status == '有效'" style="color: green" class="el-icon-circle-check"></i>
        {{scope.row.status}}
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <a v-if="index_rootList.indexOf('AUTH_RESOURCE_UPDATE')>-1" @click="handleDetail(scope.row)" class="tableActionStyle">编辑</a>
        <a class="tableActionStyle" @click="setThisAbleClick('START', scope.row)" v-if="scope.row.status!='有效'&&index_rootList.indexOf('AUTH_RESOURCE_COMMAND')>-1">设为有效</a>
        <a class="tableActionStyle" @click="setThisAbleClick('STOP', scope.row)" v-else-if="index_rootList.indexOf('AUTH_RESOURCE_COMMAND')>-1">设为无效</a>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  // import {mapGetters, mapState} from 'vuex'
  import Utils from '../utils/index.js'
  export default {
    name: 'tree-grid-resource',
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
      return {
        paths: ''
      }
    },
    computed: {
      index_rootList () {
        return JSON.parse(localStorage.rootList)
      },
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
    created () {
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
      setThisAbleClick (type, value) {
        this.$emit('setAble', type, value)
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
  .tableActionStyle{
    font-family:PingFangSC-Medium;
    font-size:12px;
    color:#016ad5;
    letter-spacing:0.86px;
    text-align:left;
    margin-left: 10px;
  }
</style>
