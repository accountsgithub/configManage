<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="rRoleFormInline" ref="rRoleFormInline" class="text-left form-top">
      <el-form-item label="角色名称" prop="f_like_name" class="searchitemTF">
        <el-input v-model="rRoleFormInline.f_like_name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="最近编辑人" prop="f_like_updaterName" class="searchitemT">
        <el-input v-model="rRoleFormInline.f_like_updaterName" placeholder="请输入最近编辑人"></el-input>
      </el-form-item>
      <el-form-item label="有效性:" prop="f_eq_status" class="searchitemT">
        <el-select v-model="rRoleFormInline.f_eq_status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="moreSearch" class="fontSizeBtB12">高级搜索<i class="el-icon-arrow-down" :class="{['el-icon-arrow-up']:isShowSearch}" style="position: absolute;margin-top: -3px"></i></el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="resetRoleForm('rRoleFormInline')" class="fontSizeBtB12 icon iconfont icon-ic-refresh">重置</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="getrRoleList" class="fontSizeBtW12 icon iconfont icon-ic-search">搜索</el-button>
      </el-form-item>
      <el-form-item :class="{disStyle:!isShowSearch}" label="创建人" prop="f_like_creatorName" class="searchitemMF">
        <el-input v-model="rRoleFormInline.f_like_creatorName" placeholder="请输入创建人"></el-input>
      </el-form-item>
      <el-form-item :class="{disStyle:!isShowSearch}" label="编辑时间" prop="f_gte_updateTime" class="searchitemM">
        <el-date-picker
          v-model="rRoleFormInline.f_gte_updateTime"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" style="width:380px;">
        </el-date-picker>
      </el-form-item>
    </el-form>
    </div>
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span style="padding-top: 5px;position: absolute;">角色管理列表</span>
          <el-button type="primary" :disabled="isDisable" @click="setAbleClick('1')" class="tableButtonStyleW">批量有效</el-button>
          <el-button type="primary" :disabled="isDisable" @click="setAbleClick('0')" class="tableButtonStyleW">批量无效</el-button>
          <el-button type="primary" @click="createRole('userAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new">新增角色</el-button>
        </div>
        <el-table :data="index_rRoleList" border @selection-change="selChange">
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
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="getExaminedApplyClick(2, scope.row, scope.$index)">绑定资源</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('1', scope.row)" v-if="scope.row.status!='1'">设为有效</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('0', scope.row)" v-else>设为无效</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rRoleFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rRoleFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rRoleFormModelData.total"></el-pagination>
      </div>
      <el-dialog
        title="新增角色"
        :visible.sync="dialogAddVisible" @close="closeDialog('roleAddForm')"
        width="40%">
        <el-form :model="roleAddForm" :rules="RoleEditFormRules" ref="roleAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleAddForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色标识" prop="sign">
            <el-input v-model="roleAddForm.sign" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色排序" prop="sortIndex">
            <el-input-number v-model="roleAddForm.sortIndex" controls-position="right" :min="1" auto-complete="off" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item label="备注信息" prop="description">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="roleAddForm.description" auto-complete="off">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('roleAddForm')" class="fontSizeBtW12">保存</el-button>
          <el-button @click="resetRoleForm('roleAddForm')" class="fontSizeBtB12">重置</el-button>
      </span>
      </el-dialog>
      <el-dialog
        title="编辑角色"
        :visible.sync="dialogEditVisible" @close="closeDialog('roleEditForm')"
        width="40%">
        <el-form :model="roleEditForm" :rules="RoleEditFormRules" ref="roleEditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleEditForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色标识" prop="sign">
            <el-input v-model="roleEditForm.sign" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色排序" prop="sortIndex">
            <el-input-number v-model="roleEditForm.sortIndex" controls-position="right" :min="1" auto-complete="off" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item label="备注信息" prop="description">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="roleEditForm.description" auto-complete="off">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('roleEditForm')" class="fontSizeBtW12">提交</el-button>
          <el-button @click="resetRoleForm('roleEditForm')" class="fontSizeBtB12">重置</el-button>
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
        isShowSearch: false,
        rRoleFormInline: {
          f_like_name: '',
          f_like_updaterName: '',
          f_eq_status: '',
          f_like_creatorName: '',
          f_gte_updateTime: '',
          f_lte_updateTime: '',
          paging: true
        },
        dialogAddVisible: false,
        dialogEditVisible: false,
        roleAddForm: {
          id: '', // 角色id
          name: '', // 角色名称
          description: '', // 备注
          sortIndex: '', // 角色排序
          sign: '' // 项目标识
        },
        roleEditForm: {
          id: '', // 角色id
          name: '', // 角色名称
          description: '', // 备注
          sortIndex: '', // 角色排序
          sign: '' // 项目标识
        },
        RoleEditFormRules: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '角色标识不能为空', trigger: 'blur' }
          ],
          sortIndex: [
            { required: true, message: '角色排序不能为空', trigger: 'blur' }
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
        'getRRoleList', 'getRAddRole', 'getSetRoleAble', 'getREditRole'
      ]),
      moreSearch () {
        if (this.isShowSearch) {
          this.isShowSearch = false
        } else {
          this.isShowSearch = true
        }
      },
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
            if (name === 'roleAddForm') {
              let params = Object.assign(this.roleAddForm)
              this.getRAddRole(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getRoleList()
                this.dialogAddVisible = false
              })
            } else if (name === 'roleEditForm') {
              let params = Object.assign(this.roleEditForm)
              this.getREditRole(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.getRoleList()
                this.dialogEditVisible = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getrRoleList () {
        let params = Object.assign(this.rRoleFormModelData, this.rRoleFormInline)
        this.getRRoleList(params)
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
        this.getRoleList()
      },
      sizeChange (val) {
        this.rRoleFormModelData.pageSize = val
        this.getrRoleList()
      },
      currentChange (val) {
        this.rRoleFormModelData.pageNo = val
        this.getRoleList()
      },
      getRoleList () {
        let params = Object.assign(this.rRoleFormModelData, this.formInline)
        this.getRRoleList(params)
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
        this.roleEditForm.sign = row.sign
        this.roleEditForm.name = row.name
        this.roleEditForm.id = row.id
        this.roleEditForm.sortIndex = row.sortIndex
        this.roleEditForm.description = row.description
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
        rRoleFormModelData: (index) => index.rbac.rRoleFormModelData,
        index_rRoleList: (index) => index.rbac.index_rRoleList
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
