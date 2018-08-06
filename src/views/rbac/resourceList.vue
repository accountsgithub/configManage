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
        <el-button type="primary" @click="resetRoleForm('rRoleFormInline')"  class="fontSizeBtB12 icon iconfont icon-ic-refresh">重置</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="getResList" class="fontSizeBtW12 icon iconfont icon-ic-search">搜索</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span style="padding-top: 5px;position: absolute;">资源管理列表</span>
          <el-button type="primary" @click="createRole('resourceAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new">新增资源</el-button>
        </div>
        <el-table :data="index_rResourceList" border @selection-change="selChange">
          <el-table-column type="selection" min-width="5%"></el-table-column>
          <el-table-column label="角色ID" min-width="10%" align="center"  prop="id"></el-table-column>
          <el-table-column label="角色名称" min-width="10%" align="center" prop="name"></el-table-column>
          <el-table-column label="创建人" min-width="10%" align="center" prop="creatorName"></el-table-column>
          <el-table-column label="最近编辑人" min-width="10%" align="center" prop="updaterName"></el-table-column>
          <el-table-column label="最近编辑时间" min-width="20%" align="center" prop="updateTime">
            <template slot-scope="scope">
              {{timestampToTimeClick(scope.row.updateTime)}}
            </template>
          </el-table-column>
          <el-table-column label="有效性" min-width="10%" align="center" prop="c"></el-table-column>
          <el-table-column label="相关操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="getEidtClick(scope.row, scope.$index)">编辑</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('1', scope.row)" v-if="scope.row.status!='1'">设为有效</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('0', scope.row)" v-else>设为无效</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="rResourceFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rResourceFormModelData.pageNo" layout="prev, pager, next" :total="rResourceFormModelData.total"></el-pagination>
      </div>
      <el-dialog
        title="新增资源"
        :visible.sync="dialogAddVisible" @close="closeDialog('resourceAddForm')"
        width="40%">
        <el-form :model="resourceAddForm" :rules="resourceEditFormRules" ref="resourceAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="resourceAddForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级资源" prop="parent">
            <el-input v-model="resourceAddForm.parent" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-input v-model="resourceAddForm.type" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源标识" prop="sign">
            <el-input v-model="resourceAddForm.sign" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源地址" prop="url">
            <el-input v-model="resourceAddForm.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源排序" prop="sortIndex">
            <el-input-number v-model="resourceAddForm.sortIndex" controls-position="right" :min="1" auto-complete="off"></el-input-number>
          </el-form-item>
          <el-form-item label="页面字段" prop="field">
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('resourceAddForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetRoleForm('resourceAddForm')" class="dialogButtonW">重置</el-button>
      </span>
      </el-dialog>
      <el-dialog
        title="编辑资源"
        :visible.sync="dialogEditVisible" @close="closeDialog('resourceEditForm')"
        width="40%">
        <el-form :model="resourceEditForm" :rules="resourceEditFormRules" ref="resourceEditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="resourceEditForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级资源" prop="parent">
            <el-input v-model="resourceEditForm.parent" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-input v-model="resourceEditForm.type" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源标识" prop="sign">
            <el-input v-model="resourceEditForm.sign" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源地址" prop="url">
            <el-input v-model="resourceEditForm.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源排序" prop="sortIndex">
            <el-input-number v-model="resourceEditForm.sortIndex" controls-position="right" :min="1" auto-complete="off"></el-input-number>
          </el-form-item>
          <el-form-item label="页面字段" prop="field">
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('resourceEditForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="resetRoleForm('resourceEditForm')" class="dialogButtonB">重置</el-button>
      </span>
      </el-dialog>
    </el-row>
  </el-row>
</template>

<script>
  import utils from '@/utils/util'
  import {mapState, mapActions} from 'vuex'
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item'
  import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
  export default {
    components: {
      ElInput,
      ElFormItem},
    name: 'role',
    data () {
      return {
        rResourceFormInline: {
          f_like_name: '',
          f_eq_status: '',
          paging: true
        },
        dialogAddVisible: false,
        dialogEditVisible: false,
        resourceAddForm: {
          id: '', // 角色id
          name: '', // 角色名称
          sortIndex: '', // 角色排序
          sign: '', // 项目标识
          type: '', // 类型
          url: '', // 地址
          parent: '', // 父级
          field: {} // 字段
        },
        resourceEditForm: {
          id: '', // 角色id
          name: '', // 角色名称
          sortIndex: '', // 角色排序
          sign: '', // 项目标识
          type: '', // 类型
          url: '', // 地址
          parent: '', // 父级
          field: {} // 字段
        },
        resourceEditFormRules: {
          name: [
            { required: true, message: '资源名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '资源类型不能为空', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '资源标识不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '资源地址不能为空', trigger: 'blur' }
          ],
          sortIndex: [
            { required: true, message: '资源排序不能为空', trigger: 'blur' }
          ]
        },
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
    methods: {
      ...mapActions([
        'getResourceList', 'getRAddRole', 'getSetRoleAble', 'getREditRole'
      ]),
      timestampToTimeClick (val) {
        if (val) {
          return utils.timestampToTime(val)
        } else {
          return '-----'
        }
      },
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'resourceAddForm') {
              let params = Object.assign(this.resourceAddForm)
              this.getRAddResource(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getResList()
                this.dialogAddVisible = false
              })
            } else if (name === 'resourceEditForm') {
              let params = Object.assign(this.resourceEditForm)
              this.getREditRole(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.getResList()
                this.dialogEditVisible = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getResList () {
        let params = Object.assign(this.rResourceFormModelData, this.rRoleFormInline)
        this.getResourceList(params)
      },
      resetRoleForm (name) {
        this.$refs[name].resetFields()
      },
      closeDialog (name) {
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
        this.rResourceFormModelData.pageNo = val
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
      getEidtClick (row, index) {
        this.resourceEditForm.sign = row.sign
        this.resourceEditForm.name = row.name
        this.resourceEditForm.id = row.id
        this.resourceEditForm.sortIndex = row.sortIndex
        this.resourceEditForm.url = row.url
        this.resourceEditForm.type = row.type
        this.resourceEditForm.parent = row.parent
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
      // 设为有效/无效
      setAbleClick (type, row) {
        this.$confirm(type === '1' ? '是否确认将此角色设为有效?' : '是否确认将此角色设为无效?', type === '1' ? '确认设为有效？' : '确认设为无效？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params
          if (row) {
            let ids = []
            ids.push(row.id)
            params = Object.assign(ids, {command: type})
          } else {
            params = Object.assign(this.ids, {command: type})
          }
          this.getSetRoleAble(params).then(res => {
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
            this.getProList()
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
      isDisabled () {
        if (this.selectCount > 0) {
          return true
        } else {
          return false
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
    line-height: 0.5;
  }
  .el-table{
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#909399;
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
  .form-top{
    margin-top: 0;
    margin-right: 22px;
    /deep/.el-form-item__label {
      font-family:PingFangSC-Regular;
      font-size:12px;
      color:#606266;
      letter-spacing:0;
      text-align:right;
    };
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
</style>
