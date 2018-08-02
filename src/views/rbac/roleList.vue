<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="rRoleFormInline" ref="rRoleFormInline" class="text-left form-top">
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
      <div>
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
      </div>
      <div>
        <el-form-item class="searchitemB">
        <el-button type="primary" v-if="index_rootList.indexOf('AUTH_ROLE_QUERY')>-1" @click="getrRoleListFirst" class="fontSizeBtW12 icon iconfont icon-ic-search"> 搜索</el-button>
      </el-form-item>
        <el-form-item class="searchitemB">
        <el-button type="primary" v-if="index_rootList.indexOf('AUTH_ROLE_QUERY')>-1" @click="resetRoleForm('rRoleFormInline')" class="fontSizeBtB12 icon iconfont icon-ic-refresh"> 重置</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="moreSearch" class="fontSizeBtB12">高级搜索<i class="el-icon-arrow-down" :class="{['el-icon-arrow-up']:isShowSearch}" style="position: absolute;"></i></el-button>
      </el-form-item>
      </div>
      </div>
      <el-row>
      <el-form-item :class="{disStyle:!isShowSearch}" label="创建人" prop="f_like_creatorName" class="searchitemMF">
        <el-input v-model="rRoleFormInline.f_like_creatorName" placeholder="请输入创建人"></el-input>
      </el-form-item>
      <el-form-item :class="{disStyle:!isShowSearch}" label="开始时间" prop="f_gte_updateTime" style="margin-left: 40px">
        <el-date-picker
          v-model="rRoleFormInline.f_gte_updateTime"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item :class="{disStyle:!isShowSearch}" label="结束时间" prop="f_lte_updateTime">
        <el-date-picker
          v-model="rRoleFormInline.f_lte_updateTime"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      </el-row>
    </el-form>
    </div>
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span style="padding-top: 5px;position: absolute;font-family:PingFangSC-Medium;font-size:14px;color:#686f79;">角色管理列表</span>
          <el-button type="primary" v-if="index_rootList.indexOf('AUTH_ROLE_COMMAND')>-1" :disabled="isDisable" @click="setAbleClick('START')" class="tableButtonStyleW">批量有效</el-button>
          <el-button type="primary" v-if="index_rootList.indexOf('AUTH_ROLE_COMMAND')>-1" :disabled="isDisable" @click="setAbleClick('STOP')" class="tableButtonStyleW">批量无效</el-button>
          <el-button type="primary" v-if="index_rootList.indexOf('AUTH_ROLE_ADD')>-1&&roleAddForm.clientSign.length>0" @click="createRole('userAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new"> 新增角色</el-button>
        </div>
        <el-table :data="index_rThisRoleList" @selection-change="selChange" :stripe="true">
          <el-table-column type="selection" min-width="5%"></el-table-column>
          <el-table-column label="角色名称" min-width="10%" align="center" prop="name"></el-table-column>
          <el-table-column label="创建人" min-width="10%" align="center" prop="creatorName"></el-table-column>
          <el-table-column label="最近编辑人" min-width="10%" align="center" prop="updaterName"></el-table-column>
          <el-table-column label="最近编辑时间" min-width="20%" align="center" prop="updateTime">
            <template slot-scope="scope">
              {{timestampToTimeClick(scope.row.updateTime)}}
            </template>
          </el-table-column>
          <el-table-column label="有效性" min-width="10%" align="center" prop="c">
            <template slot-scope="scope">
              <i v-if="scope.row.status == 0" style="color: red" class="el-icon-circle-close"></i>
              <i v-else-if="scope.row.status == 1" style="color: green" class="el-icon-circle-check"></i>
              {{convertStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="相关操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" v-if="index_rootList.indexOf('AUTH_ROLE_UPDATE')>-1" :disabled="isDisabledFun(scope.row)" @click="getEidtClick(scope.row, scope.$index)">编辑</a>
              <a class="tableActionStyle" v-if="index_rootList.indexOf('AUTH_ROLE_BINDRESOURCE')>-1" :disabled="isDisabledFun(scope.row)" @click="resourceBuilding(scope.row, scope.$index)">绑定资源</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('START', scope.row)" v-if="scope.row.status!='1'&&index_rootList.indexOf('AUTH_ROLE_COMMAND')>-1">设为有效</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('STOP', scope.row)" v-else-if="index_rootList.indexOf('AUTH_ROLE_COMMAND')>-1">设为无效</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rRoleFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rRoleFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rRoleFormModelData.total"></el-pagination>
      </div>
      <el-dialog
        title="新增角色" class="dialogStyle"
        :visible.sync="dialogAddVisible" @close="closeDialog('roleAddForm')"
        width="40%">
        <el-form :model="roleAddForm" :rules="RoleEditFormRules" ref="roleAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="name">
            <el-input maxlength="50" v-model="roleAddForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色标识" prop="sign">
            <el-input maxlength="50" v-model="roleAddForm.sign" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色排序" prop="sortIndex">
            <el-input-number v-model="roleAddForm.sortIndex" controls-position="right" :min="1" auto-complete="off" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item label="备注信息" prop="description">
            <el-input
              type="textarea" maxlength="100"
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="roleAddForm.description" auto-complete="off">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary":disabled=isDisableSave @click="submitForm('roleAddForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetRoleForm('roleAddForm')" class="dialogButtonW">重置</el-button>
      </span>
      </el-dialog>
      <el-dialog
        title="编辑角色" class="dialogStyle"
        :visible.sync="dialogEditVisible" @close="closeDialog('roleEditForm')"
        width="40%">
        <el-form :model="roleEditForm" :rules="RoleEditFormRules" ref="roleEditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="name">
            <el-input maxlength="50" v-model="roleEditForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色标识" prop="sign">
            <el-input maxlength="50" v-model="roleEditForm.sign" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色排序" prop="sortIndex">
            <el-input-number v-model="roleEditForm.sortIndex" controls-position="right" :min="1" auto-complete="off" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item label="备注信息" prop="description">
            <el-input
              type="textarea" maxlength="100"
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="roleEditForm.description" auto-complete="off">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('roleEditForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="closethisDialog" class="dialogButtonW">取消</el-button>
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
        editTemp: {
          name: '',
          sign: ''
        },
        mountedType: this.$route.params.mountedType ? this.$route.params.mountedType : '',
        isDisableSave: false,
        rRoleFormInline: {
          f_like_name: '',
          f_like_updaterName: '',
          f_eq_status: '',
          f_like_creatorName: '',
          f_gte_updateTime: '',
          f_lte_updateTime: '',
          f_eq_clientSign: utils.getCookie('checkPathSign') ? utils.getCookie('checkPathSign') : '-1',
          paging: true
        },
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogResBuildingVisible: false,
        roleAddForm: {
          id: '', // 角色id
          name: '', // 角色名称
          description: '', // 备注
          sortIndex: '', // 角色排序
          sign: '', // 项目标识
          clientSign: utils.getCookie('checkPathSign') ? utils.getCookie('checkPathSign') : '', // 项目标识
          status: '1'
        },
        roleEditForm: {
          id: '', // 角色id
          name: '', // 角色名称
          description: '', // 备注
          sortIndex: '', // 角色排序
          status: '',
          sign: '', // 标识
          clientSign: utils.getCookie('checkPathSign') ? utils.getCookie('checkPathSign') : '' // 项目标识
        },
        RoleEditFormRules: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '角色标识不能为空', trigger: 'blur' }
          ],
          sortIndex: [
            { required: true, message: '角色排序不能为空', trigger: 'change' }
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
    watch: {
      $route () {
        if (utils.getCookie('checkPathSign')) {
          this.rRoleFormInline.f_eq_clientSign = utils.getCookie('checkPathSign')
          this.roleEditForm.clientSign = utils.getCookie('checkPathSign')
          this.roleAddForm.clientSign = utils.getCookie('checkPathSign')
          this.getrRoleListFirst()
        }
      }
    },
    methods: {
      ...mapActions([
        'getRRoleList', 'getRAddRole', 'getSetRoleAble', 'getREditRole', 'getSetRoleAbleAll', 'getRThisRoleList', 'clumbDilidata'
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
      closethisDialog () {
        this.dialogEditVisible = false
      },
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'roleAddForm') {
              this.isDisableSave = true
              let paramsVilible = Object.assign({value: this.roleAddForm.name, clientSign: this.roleAddForm.clientSign, clumb: 'name'})
              this.clumbDilidata(paramsVilible).then(res => {
                if (res.data.code == '0' && res.data.result) {
                  let paramsVilible = Object.assign({
                    value: this.roleAddForm.sign,
                    clientSign: this.roleAddForm.clientSign,
                    clumb: 'sign'
                  })
                  this.clumbDilidata(paramsVilible).then(res => {
                    if (res.data.status == 200 && res.data.result) {
                      let params = Object.assign(this.roleAddForm)
                      this.getRAddRole(params).then(res => {
                        if (res.data.code == '0') {
                          this.$message({
                            type: 'success',
                            message: '添加成功!'
                          })
                          this.isDisableSave = false
                          this.getrRoleList()
                          this.dialogAddVisible = false
                        } else if (res.data.code == '-1') {
                          this.$message({
                            type: 'error',
                            message: res.data.message
                          })
                        }
                      })
                    } else {
                      this.$message({
                        type: 'error',
                        message: '角色标识已存在!'
                      })
                      this.isDisableSave = false
                    }
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '角色名称已存在!'
                  })
                  this.isDisableSave = false
                }
              })
            } else if (name === 'roleEditForm') {
              if (this.editTemp.name == this.roleEditForm.name && this.editTemp.sign == this.roleEditForm.sign) {
                let params = Object.assign(this.roleEditForm)
                this.getREditRole(params).then(res => {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.getrRoleList()
                  this.dialogEditVisible = false
                })
              } else if (this.editTemp.name != this.roleEditForm.name && this.editTemp.sign == this.roleEditForm.sign) {
                let paramsVilible = Object.assign({value: this.roleEditForm.name, clientSign: this.roleEditForm.clientSign, clumb: 'name'})
                this.clumbDilidata(paramsVilible).then(res => {
                  if (res.data.code == '0' && res.data.result) {
                    let params = Object.assign(this.roleEditForm)
                    this.getREditRole(params).then(res => {
                      this.$message({
                        type: 'success',
                        message: '修改成功!'
                      })
                      this.getrRoleList()
                      this.dialogEditVisible = false
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: '角色名称已存在!'
                    })
                  }
                })
              } else if (this.editTemp.name == this.roleEditForm.name && this.editTemp.sign != this.roleEditForm.sign) {
                let paramsVilible = Object.assign({
                  value: this.roleEditForm.sign,
                  clientSign: this.roleEditForm.clientSign,
                  clumb: 'sign'
                })
                this.clumbDilidata(paramsVilible).then(res => {
                  if (res.data.code == '0' && res.data.result) {
                    let params = Object.assign(this.roleEditForm)
                    this.getREditRole(params).then(res => {
                      this.$message({
                        type: 'success',
                        message: '修改成功!'
                      })
                      this.getrRoleList()
                      this.dialogEditVisible = false
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: '角色标识已存在!'
                    })
                  }
                })
              } else {
                let paramsVilible = Object.assign({value: this.roleEditForm.name, clientSign: this.roleEditForm.clientSign, clumb: 'name'})
                this.clumbDilidata(paramsVilible).then(res => {
                  if (res.data.code == '0' && res.data.result) {
                    let paramsVilible = Object.assign({
                      value: this.roleEditForm.sign,
                      clientSign: this.roleEditForm.clientSign,
                      clumb: 'sign'
                    })
                    this.clumbDilidata(paramsVilible).then(res => {
                      if (res.data.status == 200 && res.data.result) {
                        let params = Object.assign(this.roleEditForm)
                        this.getREditRole(params).then(res => {
                          this.$message({
                            type: 'success',
                            message: '编辑成功!'
                          })
                          this.getrRoleList()
                          this.dialogAddVisible = false
                        })
                      } else {
                        this.$message({
                          type: 'error',
                          message: '角色标识已存在!'
                        })
                      }
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: '角色名称已存在!'
                    })
                  }
                })
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getrRoleList () {
        let params = Object.assign(this.rRoleFormModelData, this.rRoleFormInline)
        this.getRThisRoleList(params)
      },
      getrRoleListFirst () {
        this.rRoleFormModelData.pageNo = 0
        this.getrRoleList()
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
        this.getrRoleList()
      },
      sizeChange (val) {
        this.rRoleFormModelData.pageSize = val
        this.getrRoleList()
      },
      currentChange (val) {
        this.rRoleFormModelData.pageNo = val - 1
        this.getrRoleList()
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
        this.editTemp.name = row.name
        this.editTemp.sign = row.sign
        this.roleEditForm.sign = row.sign
        this.roleEditForm.name = row.name
        this.roleEditForm.id = row.id
        this.roleEditForm.sortIndex = row.sortIndex
        this.roleEditForm.description = row.description
        this.roleEditForm.status = row.status
        this.dialogEditVisible = true
      },
      selChange (val) {
        if (val.length > 0) {
          this.isDisable = false
        } else {
          this.isDisable = true
        }
        this.ids = val
      },
      convertStatus (data) {
        if (data == '1') {
          return '有效'
        } else if (data == '0') {
          return '无效'
        } else {
          return ''
        }
      },
      // 设为有效/无效
      setAbleClick (type, row) {
        this.$confirm(type === 'START' ? '是否确认将此角色设为有效?' : '是否确认将此角色设为无效?', type === 'START' ? '确认设为有效？' : '确认设为无效？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params
          if (row) {
            let ids = []
            ids.push(row.id)
            params = Object.assign({id: ids}, {command: type})
            this.getSetRoleAble(params).then(res => {
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
              this.getrRoleList()
            })
          } else {
            let tempID = []
            for (let i = 0; i < this.ids.length; i++) {
              if (this.ids[i].status == '1' && type == 'STOP') {
                tempID.push(this.ids[i].id)
              } else if (this.ids[i].status == '0' && type == 'START') {
                tempID.push(this.ids[i].id)
              }
            }
            if (tempID.length > 0) {
              params = Object.assign({ids: tempID}, {command: type})
              this.getSetRoleAbleAll(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                })
                this.getrRoleList()
              })
            } else {
              this.$message({
                type: 'success',
                message: '无数据可设置!'
              })
            }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          })
        })
      },
      resourceBuilding (row) {
        this.$router.push({name: 'resourceBuilding', params: {id: row.id, name: row.name, clientSign: row.clientSign ? row.clientSign : '', settingForType: 'ROLE'}})
      }
    },
    mounted () {
      if (this.mountedType == '') {
        this.getrRoleListFirst()
      }
    },
    computed: {
      ...mapState({
        rRoleFormModelData: (index) => index.rbac.rRoleFormModelData,
        index_rRoleList: (index) => index.rbac.index_rRoleList,
        index_rThisRoleList: (index) => index.rbac.index_rThisRoleList
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
  // table复选框
  /deep/.el-table-column--selection .cell {
    padding-right: 10px;
  }
  // 分页
  .el-pagination {
    color: #575a5f;
    font-weight: 500;
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
    //float: right;
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
  // 查询条件样式
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
