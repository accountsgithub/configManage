<template>
  <div class="app-container">
    <el-input placeholder="Filter keyword" v-model="filterText" class="treeInputStyle"></el-input>
    <span>单位列表</span>
    <el-tree class="filter-tree treeStyle" :data="treeData" @node-click="getList" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2"></el-tree>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      filterText: '',
      data2: [{
        id: 1,
        label: 'Level one 1',
        children: [{
          id: 4,
          label: 'Level two 1-1',
          children: [{
            id: 9,
            label: 'Level three 1-1-1'
          }, {
            id: 10,
            label: 'Level three 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        children: [{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 6,
          label: 'Level two 2-2'
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    ...mapActions([
      'getTreeDeptList', 'getDeptList'
    ]),
    getTreeDepartList () {
      console.log('fdsafdsafsafdsafdsafdsafds')
      let params = Object.assign({})
      this.getTreeDeptList(params)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    chaneType (dataJson, idStr, pidStr, chindrenStr) {
      let treeData = []
      let hash = {}
      let id = idStr
      let pid = pidStr
      let children = chindrenStr
      let i = 0
      let j = 0
      let len = 0
      if (dataJson) {
        len = dataJson.length
      }
      for (; i < len; i++) {
        dataJson[i].label = dataJson[i].name
        if (dataJson[i].parent) {
          dataJson[i].parentid = dataJson[i].parent.id
        }
        hash[dataJson[i][id]] = dataJson[i]
      }
      for (; j < len; j++) {
        let aVal = dataJson[j]
        let hashVP = hash[aVal[pid]]
        if (hashVP) {
          !hashVP[children] && (hashVP[children] = [])
          hashVP[children].push(aVal)
        } else {
          treeData.push(aVal)
        }
      }
      return treeData
    },
    getList () {
      console.log(this.$refs['departList'])
      this.$refs['departList'].getDepartList()
    }
  },
  computed: {
    ...mapState({
      index_treeDepartList: (index) => index.rbac.index_treeDepartList
    }),
    treeData () {
      return this.chaneType(this.index_treeDepartList, 'id', 'parentid', 'children')
    }
  },
  mounted () {
    this.getTreeDepartList()
  }
}
</script>
<style lang="less" scoped>
  .treeInputStyle{
    margin-bottom:10px;
  }
  .treeStyle{
    height: 100%;
    overflow: auto;
  }
</style>
