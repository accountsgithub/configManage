<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="rResourceFormInline" ref="rRoleFormInline" class="text-left form-top">
      <el-form-item label="资源名称" prop="f_like_name" class="searchitemTF">
        <el-input v-model="rResourceFormInline.f_like_name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="有效性:" prop="f_eq_status" class="searchitemT">
        <el-select v-model="rResourceFormInline.f_eq_status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" v-if="index_rootList.indexOf('AUTH_RESOURCE_QUERY')>-1" @click="resetRoleForm('rRoleFormInline')"  class="fontSizeBtB12 icon iconfont icon-ic-refresh"> 重置</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" v-if="index_rootList.indexOf('AUTH_RESOURCE_QUERY')>-1" @click="getResList" class="fontSizeBtW12 icon iconfont icon-ic-search"> 搜索</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span style="padding-top: 5px;position: absolute;">资源管理列表</span>
          <el-button type="primary" v-if="index_rootList.indexOf('AUTH_RESOURCE_ADD')>-1 && resourceAddForm.clientSign.length>0" @click="createRole('resourceAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new"> 新增资源</el-button>
        </div>
        <tree-grid-resource :columns="columns" :tree-structure="true" :data-source="dataTreeList" @showHandle="getEidtClick" @setAble="setAbleClick"></tree-grid-resource>
      </div>
      <el-dialog
        title="新增资源" class="dialogStyle"
        :visible.sync="dialogAddVisible" @close="closeDialog('resourceAddForm')"
        width="50%">
        <el-scrollbar class="list">
        <el-form :model="resourceAddForm" :rules="resourceEditFormRules" ref="resourceAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="资源名称" prop="name" maxlength="50">
            <el-input v-model="resourceAddForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级资源" prop="parent.id">
            <el-select v-model="resourceAddForm.parent.id" filterable placeholder="请选择">
              <el-option v-for="item in index_rResourceList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="资源类型" prop="type">-->
            <!--<el-select v-model="resourceAddForm.type" placeholder="请选择">-->
              <!--<el-option v-for="item in rResourceTypeList"-->
                         <!--:key="item.id"-->
                         <!--:label="item.name"-->
                         <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="资源标识" prop="sign">
            <el-input maxlength="50" v-model="resourceAddForm.sign" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源地址" prop="url">
            <el-input maxlength="200" v-model="resourceAddForm.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求方法" prop="method">
            <el-select v-model="resourceAddForm.method" placeholder="请选择">
              <el-option v-for="item in rResourceMethodList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源排序" prop="sortIndex">
            <el-input-number v-model="resourceAddForm.sortIndex" controls-position="right" :min="1" auto-complete="off"></el-input-number>
          </el-form-item>
          <el-form-item label="页面字段" prop="field">
            <span style="color: red;margin-left: 80px">* </span>
            <span>字段名称</span>
            <span style="color: red;margin-left: 80px">* </span>
            <span>字段标识</span>
            <el-button type="mini" @click="textAddMthod('resourceAddForm')" icon="el-icon-plus" style="margin-left: 80px"></el-button>
            <div id="textAdd"></div>
          </el-form-item>
          <!--动态字段-->
          <el-form-item
            v-for="(domain, index) in resourceAddForm.field"
            :key="domain.key">
            <el-form-item style="float: left;"
                          :prop="'field.' + index + '.name'"
                          :rules="{required: true, message: '字段名不能为空', trigger: 'blur'}">
              <el-input maxlength="50" :id="'two'+index" v-model="domain.name" style="width: 160px;margin-left: 20px;"></el-input>
            </el-form-item>
            <el-form-item style="float: left;"
              :prop="'field.' + index + '.description'"
              :rules="{required: true, message: '字段标识不能为空', trigger: 'blur'}">
            <el-input maxlength="50" :id="'one'+index" v-model="domain.description" style="width: 160px;margin-left: 20px;"></el-input>
            </el-form-item>
            <a @click.prevent="removeDomain(domain, 'resourceAddForm')" class="tableActionStyle">删除</a>
            <a :id="'button'+index" @click.prevent="EditText(index)" class="tableActionStyle">确认</a>
          </el-form-item>
        </el-form>
        </el-scrollbar>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('resourceAddForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetRoleForm('resourceAddForm')" class="dialogButtonW">重置</el-button>
      </span>
      </el-dialog>
      <el-dialog
        title="编辑资源" class="dialogStyle"
        :visible.sync="dialogEditVisible" @close="closeDialog('resourceEditForm')"
        width="50%">
        <el-scrollbar class="list">
        <el-form :model="resourceEditForm" :rules="resourceEditFormRules" ref="resourceEditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="资源名称" prop="name" maxlength="50">
            <el-input v-model="resourceEditForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级资源" prop="parent.id">
            <el-select v-model="resourceEditForm.parent.id" filterable placeholder="请选择">
              <el-option v-for="item in index_rResourceList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="资源类型" prop="type">
            <el-select v-model="resourceEditForm.type" placeholder="请选择">
              <el-option v-for="item in rResourceTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="资源标识" prop="sign">
            <el-input maxlength="50" v-model="resourceEditForm.sign" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源地址" prop="url">
            <el-input maxlength="200" v-model="resourceEditForm.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求方法" prop="method">
            <el-select v-model="resourceEditForm.method" placeholder="请选择">
              <el-option v-for="item in rResourceMethodList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源排序" prop="sortIndex">
            <el-input-number v-model="resourceEditForm.sortIndex" controls-position="right" :min="1" auto-complete="off"></el-input-number>
          </el-form-item>
          <el-form-item label="页面字段" prop="field">
            <span style="color: red;margin-left: 80px">* </span>
            <span>字段名称</span>
            <span style="color: red;margin-left: 80px">* </span>
            <span>字段标识</span>
            <el-button type="mini" @click="textAddMthod('resourceEditForm')" icon="el-icon-plus" style="margin-left: 80px"></el-button>
            <div id="textEdit"></div>
          </el-form-item>
          <!--动态字段-->
          <el-scrollbar class="list1">
          <el-form-item
            v-for="(domain, index) in resourceEditForm.field"
            :key="domain.key">
            <el-form-item style="float: left;"
                          :prop="'field.' + index + '.name'"
                          :rules="{required: true, message: '字段名不能为空', trigger: 'blur'}">
              <el-input maxlength="50" :id="'two'+index" v-model="domain.name" style="width: 160px;margin-left: 20px;"></el-input>
            </el-form-item>
            <el-form-item style="float: left;"
                          :prop="'field.' + index + '.description'"
                          :rules="{required: true, message: '字段标识不能为空', trigger: 'blur'}">
              <el-input maxlength="50" :id="'one'+index" v-model="domain.description" style="width: 160px;margin-left: 20px;"></el-input>
            </el-form-item>
            <a @click.prevent="removeDomain(domain, 'resourceEditForm')" class="tableActionStyle">删除</a>
            <a :id="'button'+index" @click.prevent="EditText(index)" class="tableActionStyle">确认</a>
          </el-form-item>
          </el-scrollbar>
        </el-form>
        </el-scrollbar>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('resourceEditForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="closethisDialog" class="dialogButtonW">取消</el-button>
      </span>
      </el-dialog>
    </el-row>
  </el-row>
</template>

<script>
  import utils from '@/utils/util'
  import {mapState, mapActions} from 'vuex'
  import TreeGridResource from '@/components/treeTable/vue/TreeGridResource'
  import Vue from 'vue/dist/vue.js'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  export default {
    components: {
      ElButton,
      TreeGridResource},
    name: 'role',
    data () {
      return {
        rResourceFormInline: {
          f_like_name: '',
          f_eq_status: '',
          f_eq_clientSign: utils.getCookie('checkPathSign') ? utils.getCookie('checkPathSign') : '-1',
          paging: false
        },
        dialogAddVisible: false,
        dialogEditVisible: false,
        rResourceTypeList: [ // 资源类型
          {id: '10', name: 'MENU'},
          {id: '20', name: 'ACTION'}],
        rResourceMethodList: [ // 请求方法
          {id: 'GET', name: 'GET'},
          {id: 'HEAD', name: 'HEAD'},
          {id: 'POST', name: 'POST'},
          {id: 'PATCH', name: 'PATCH'},
          {id: 'DELETE', name: 'DELETE'},
          {id: 'OPTIONS', name: 'OPTIONS'},
          {id: 'TRACE', name: 'TRACE'}],
        resourceAddForm: {
          id: '', // 角色id
          name: '', // 角色名称
          sortIndex: '', // 角色排序
          sign: '',
          clientSign: utils.getCookie('checkPathSign') ? utils.getCookie('checkPathSign') : '', // 项目标识
          // type: '', // 类型
          url: '', // 地址
          parent: {
            id: ''
          }, // 父级
          status: '1',
          method: '', // 请求方法
          field: [] // 字段
        },
        resourceEditForm: {
          id: '', // 角色id
          name: '', // 角色名称
          sortIndex: '', // 角色排序
          sign: '',
          clientSign: utils.getCookie('checkPathSign') ? utils.getCookie('checkPathSign') : '', // 项目标识
          // type: '', // 类型
          url: '', // 地址
          parent: {
            id: ''
          }, // 父级
          status: '',
          method: '', // 请求方法
          field: [] // 字段
        },
        resourceEditFormRules: {
          name: [
            { required: true, message: '资源名称不能为空', trigger: 'blur' }
          ],
          /* type: [
            { required: true, message: '资源类型不能为空', trigger: 'change' }
          ], */
          sign: [
            { required: true, message: '资源标识不能为空', trigger: 'blur' }
          ],
          sortIndex: [
            { required: true, message: '资源排序不能为空', trigger: 'change' }
          ]
        },
        columns: [
          {
            text: '资源名称',
            dataIndex: 'name',
            align: 'center'
          },
          /* {
            text: '资源类型',
            dataIndex: 'type',
            align: 'center'
          }, */
          {
            text: '资源标识',
            dataIndex: 'sign',
            align: 'center'
          },
          {
            text: '资源地址',
            dataIndex: 'url',
            align: 'center'
          },
          {
            text: '资源排序',
            dataIndex: 'sortIndex',
            align: 'center'
          }
        ],
        isAdmin: false,
        isOwn: null,
        options: [{
          label: '请选择',
          value: null
        }, {
          label: '有效',
          value: 1
        }, {
          label: '无效',
          value: 0
        }],
        isDisable: true,
        ids: []
      }
    },
    mounted () {
      if (this.index_rootList.indexOf('AUTH_RESOURCE_QUERY') > -1) {
        this.getResList()
      }
    },
    watch: {
      $route () {
        if (utils.getCookie('checkPathSign')) {
          this.rResourceFormInline.f_eq_clientSign = utils.getCookie('checkPathSign')
          this.getResList()
        }
      }
    },
    methods: {
      ...mapActions([
        'getResourceList', 'getSetResourceAble', 'getREditResource', 'getRAddResource'
      ]),
      // 时间格式化
      timestampToTimeClick (val) {
        if (val) {
          return utils.timestampToTime(val)
        } else {
          return '-----'
        }
      },
      closethisDialog () {
        this.dialogEditVisible = false
      },
      // 保存、修改
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'resourceAddForm') {
              let tempParams = {}
              tempParams.id = this.resourceAddForm.id
              tempParams.name = this.resourceAddForm.name
              tempParams.sortIndex = this.resourceAddForm.sortIndex
              tempParams.sign = this.resourceAddForm.sign
              tempParams.clientSign = this.resourceAddForm.clientSign
              // tempParams.type = this.resourceAddForm.type
              tempParams.url = this.resourceAddForm.url
              tempParams.status = this.resourceAddForm.status
              tempParams.field = this.resourceAddForm.field
              tempParams.method = this.resourceAddForm.method
              if (this.resourceAddForm.parent.id != '') {
                tempParams.parent = {id: this.resourceAddForm.parent.id}
              }
              let params = Object.assign(tempParams)
              this.getRAddResource(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.getResList()
                  this.dialogAddVisible = false
                } else if (res.data.code == '-1') {
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
              })
            } else if (name === 'resourceEditForm') {
              let tempParams = {}
              tempParams.id = this.resourceEditForm.id
              tempParams.name = this.resourceEditForm.name
              tempParams.sortIndex = this.resourceEditForm.sortIndex
              tempParams.sign = this.resourceEditForm.sign
              tempParams.clientSign = this.resourceEditForm.clientSign
              // tempParams.type = this.resourceEditForm.type
              tempParams.url = this.resourceEditForm.url
              tempParams.status = this.resourceEditForm.status
              tempParams.field = this.resourceEditForm.field
              tempParams.method = this.resourceAddForm.method
              if (this.resourceEditForm.parent.id != '') {
                tempParams.parent = {id: this.resourceEditForm.parent.id}
              }
              let params = Object.assign(tempParams)
              this.getREditResource(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.getResList()
                  this.dialogEditVisible = false
                } else if (res.data.code == '-1') {
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      testFunction () {
        let a = document.getElementById('testDiv')
        a.innerHTML = a.innerHTML + '<select>' +
          '<option v-for="item in [{id: 1,name:1}]" :key="item.id" :label="item.name" :value="item.id"></option></select>'
      },
      // 获取资源列表
      getResList () {
        let params = Object.assign(this.rResourceFormModelData, this.rResourceFormInline)
        this.getResourceList(params)
      },
      resetRoleForm (name) {
        var MyComponent = Vue.extend({
          template: '<div id="textAdd"></div>'
        })
        new MyComponent().$mount('#textAdd')
        this.$refs[name].resetFields()
      },
      closeDialog (name) {
        var MyComponent = Vue.extend({
          template: '<div id="textAdd"></div>'
        })
        new MyComponent().$mount('#textAdd')
        this.$refs[name].resetFields()
      },
      createRole (name) {
        this.dialogAddVisible = true
      },
      onSubmit () {
        this.getResList()
      },
      sizeChange (val) {
        this.rResourceFormModelData.pageSize = val
        this.getResList()
      },
      currentChange (val) {
        this.rResourceFormModelData.pageNo = val - 1
        this.getResList()
      },
      // 判断权限是否可以审批
      isDisabledFun (row) {
        if (row.examinedState == 3) {
          return true
        }
        if (row.examinedState == 2) {
          if (this.isAdmin) {
            return false
          } else {
            return true
          }
        }
        if (row.examinedState == 1) {
          if (this.isAdmin || row.departmentLeader.id == this.isOwn) {
            return false
          } else {
            return true
          }
        }
      },
      // 编辑
      getEidtClick (row) {
        this.resourceEditForm.sign = row.sign
        this.resourceEditForm.name = row.name
        this.resourceEditForm.id = row.id
        this.resourceEditForm.sortIndex = row.sortIndex
        this.resourceEditForm.url = row.url
        this.resourceEditForm.method = row.method
        /* if (row.type == 'ACTION') {
          this.resourceEditForm.type = '20'
        } else if (row.type == 'MENU') {
          this.resourceEditForm.type = '10'
        } */
        if (row.parent) {
          this.resourceEditForm.parent.id = row.parent.id
        }
        this.resourceEditForm.status = row.status == '有效' ? '1' : '0'
        this.resourceEditForm.field = row.field ? row.field : []
        this.dialogEditVisible = true
      },
      selChange (val) {
        if (val.length > 0) {
          this.isDisable = false
        } else {
          this.isDisable = true
        }
        this.ids = val.map(item => {
          return item.id
        })
      },
      // 动态添加文本框
      textAddMthod (name) {
        this.$refs[name].model.field.push({
          description: '',
          name: '',
          key: Date.now()
        })
      },
      // 移除dom
      removeDomain (item, name) {
        var index = this.$refs[name].model.field.indexOf(item)
        if (index !== -1) {
          this.$refs[name].model.field.splice(index, 1)
        }
      },
      // 编辑表格状态
      EditText (index) {
        let id1 = 'one' + index
        let id2 = 'two' + index
        let id3 = 'button' + index
        let value1 = true
        let value2 = 'none'
        let value3 = '编辑'
        if (document.getElementById(id3).innerHTML == '确认') {
          value1 = true
          value2 = 'none'
          value3 = '编辑'
        } else {
          value1 = false
          value2 = '1px solid #dcdfe6'
          value3 = '确认'
        }
        document.getElementById(id1).disabled = value1
        document.getElementById(id1).style.border = value2
        document.getElementById(id1).style.outline = value2
        document.getElementById(id2).disabled = value1
        document.getElementById(id2).style.border = value2
        document.getElementById(id2).style.outline = value2
        document.getElementById(id3).innerHTML = value3
      },
      // 数组结构转换
      data2treeDG (datas, dataArray) {
        for (var j = 0; j < dataArray.length; j++) {
          var dataArrayIndex = dataArray[j]
          var childrenArray = []
          var CATL_CODEP = dataArrayIndex.id
          for (var i = 0; i < datas.length; i++) {
            var data = datas[i]
            var CATL_PARENT = data.parentid
            if (CATL_PARENT == CATL_CODEP) { // 判断是否为儿子节点
              data.parentid = CATL_PARENT
              childrenArray.push(data)
            }
          }
          dataArrayIndex.children = childrenArray
          if (childrenArray.length > 0) { // 有儿子节点则递归
            this.data2treeDG(datas, childrenArray)
          }
        }
        return dataArray
      },
      // 设为有效/无效
      setAbleClick (type, row) {
        this.$confirm(type === 'START' ? '是否确认将此资源设为有效?' : '是否确认将此资源设为无效?', type === 'START' ? '确认设为有效？' : '确认设为无效？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params
          if (row) {
            let ids = []
            ids.push(row.id)
            params = Object.assign({id: ids}, {command: type})
          } else {
            params = Object.assign(this.ids, {command: type})
          }
          this.getSetResourceAble(params).then(res => {
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
            this.getResList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          })
        })
      }
    },
    computed: {
      ...mapState({
        rResourceFormModelData: (index) => index.rbac.rResourceFormModelData,
        index_rResourceList: (index) => index.rbac.index_rResourceList
      }),
      index_rootList () {
        return JSON.parse(localStorage.rootList)
      },
      isDisabled () {
        if (this.selectCount > 0) {
          return true
        } else {
          return false
        }
      },
      dataTreeList () {
        let i = 0
        let dataList = []
        for (let j = 0; j < this.index_rResourceList.length; j++) {
          dataList.push(this.index_rResourceList[j])
        }
        for (;i < dataList.length; i++) {
          if (dataList[i].parent) {
            dataList[i].parentid = dataList[i].parent.id
          }
          if (this.index_rResourceList[i].status == '0' || this.index_rResourceList[i].status == '无效') {
            dataList[i].status = '无效'
          } else {
            dataList[i].status = '有效'
          }
          /* if (this.index_rResourceList[i].type == '10' || this.index_rResourceList[i].status == 'MENU') {
            dataList[i].type = 'MENU'
          } else if (this.index_rResourceList[i].type == '20' || this.index_rResourceList[i].status == 'ACTION') {
            dataList[i].type = 'ACTION'
          } */
        }
        if (dataList.length > 0) {
          let tempArray = []
          let j = 0
          for (;j < dataList.length; j++) {
            if (!dataList[j].parent) {
              tempArray.push(dataList[j])
            }
          }
          return this.data2treeDG(dataList, tempArray)
        } else {
          return []
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .divStyle_tree{
    float: left;
    width: 19%;
    background: #ffffff;
    margin-right:0.5%;
    margin-top: 10px;
  }
  .divStyle_show{
    float: right;
    width: 80%;
  }
  .main{
    margin: 0 10px;
  }
  .content-search{
    min-height: 72px;
    background: #ffffff;
    margin: 10px 0;
  }
  .searchitemT {
    margin-top: 20px;
    margin-left: 49px;
  }
  .searchitemTF {
    margin-top: 20px;
    margin-left: 20px;
  }
  .searchitemMF {
    margin-left: 20px;
  }
  .searchitemM {
    margin-left: 49px;
  }
  .searchitemB {
    margin-top: 20px;
    margin-left: 10px;
    float: right;
  }
  .fontSize14{
    font-size: 14px;
    color: #4a525e;
  }
  .fontSize12{
    font-family:PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
  }
  .fontSizeBtW12{
    font-size: 12px;
    color: #ffffff;
    background:#016ad5;
    border-radius:4px;
    width:90px;
    height:32px;
  }
  .fontSizeBtB12{
    font-size: 12px;
    color:#666666;;
    background:#f0f4f8;
    border:1px solid #dfe6ed;
    border-radius:4px;
    width:90px;
    height:32px;
  }
  .tableButtonStyleW{
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#666666;
    background:#f9fbfd;
    border:1px solid #e7e9f0;
    border-radius:4px;
    width:90px;
    height:32px;
    float: right;
    margin-left: 10px;
  }
  .tableButtonStyleB{
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#ffffff;
    background:#016ad5;
    border:1px solid #e7e9f0;
    border-radius:4px;
    width:90px;
    height:32px;
    float: right;
    margin-left: 10px;
  }
  .el-button {
    padding: 0;
  }
  .el-table{
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#606266;
    letter-spacing:0.86px;
    text-align:left;
  }
  .cell{
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#606266;
    letter-spacing:0.86px;
    text-align:left;
  }
  .dialogButtonW {
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width:60px;
    height:32px;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #606266;
    letter-spacing: 0;
    text-align: center;
  }
  .dialogButtonB{
    background:#016ad5;
    border-radius:4px;
    width:60px;
    height:32px;
    font-family:PingFangSC-Semibold;
    font-size:14px;
    color:#ffffff;
    letter-spacing:0;
    text-align:center;
  }
  .paginationStyle{
    text-align: right;
    padding-top: 20px;
    /deep/.el-pagination__total{
      font-size: 12px;
    };
    /deep/.el-input__inner{
      font-size: 12px;
    };
    /deep/.number{
      font-size: 12px;
    };
    /deep/.el-pagination__jump{
      font-size: 12px;
    };
  }
  // 弹出框标题样式
  /deep/.el-dialog__title{
    font-weight: bolder;
    font-size: 16px;
    color:#333333;
    font-family:PingFangSC-Medium;
  }
  // 弹出框标题样式
  /deep/.el-dialog__title{
    font-weight: bolder;
    font-size: 16px;
    color:#333333;
    font-family:PingFangSC-Medium;
  }
  // 表单样式
  .form-top{
    margin-top: 0;
    margin-right: 22px;
    /deep/.el-form-item__label {
      font-family:PingFangSC-Regular;
      font-size:12px;
      color:#333333;
      letter-spacing:0;
      text-align:right;
    };
    // 表单输入框样式
    /deep/.el-input__inner {
      background:#ffffff;
      border:1px solid #dcdfe6;
      border-radius:4px;
      width:170px;
      height:30px;
      font-size: 12px;
    };
    /deep/.el-form-item{
      margin-right: 0;
    }
  }
  .tableActionStyle{
    font-family:PingFangSC-Medium;
    font-size:12px;
    color:#016ad5;
    letter-spacing:0.86px;
    text-align:left;
    margin-left: 10px;
    float: right;
  }
  .content-table{
    background: #ffffff;
  }
  .tableInfo{
    margin-left: 21px;
    padding-top: 10px;
    font-family:PingFangSC-Medium;
    font-size:14px;
    color:#686f79;
    letter-spacing:0;
    text-align:left;
    height: 50px;
    margin-right: 22px;
  }
  .disStyle{
    display: none;
  }
  .necessary:before {
    content: '*';
    color: red;
  }
  .list {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .dialogStyle{}
  //弹出框样式
  .dialogStyle {
    /deep/.el-input__inner {
      background:#ffffff;
      border:1px solid #dcdfe6;
      border-radius:4px;
      height:30px;
      font-size: 12px;
    };
    // 弹出框调节器样式
    /deep/.el-input-number__increase{
      top:5px;
      line-height:14px
    };
    /deep/.el-input-number__decrease{
      bottom:4px
    }
  }
</style>
