<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="rUserFormInline" ref="rUserFormInline" class="text-left form-top">
      <el-form-item label="用户名称" prop="f_like_name" class="searchitemTF">
        <el-input v-model="rUserFormInline.f_like_name" placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item label="人员" class="searchitemT">
        <el-input v-model="rUserFormInline['f_like_person.name']" placeholder="请输入人员"></el-input>
      </el-form-item>
      <el-form-item label="所属单位" class="searchitemT">
        <el-input v-model="rUserFormInline['f_like_person.department.name']" placeholder="请输入所属单位"></el-input>
      </el-form-item>
      <el-form-item label="有效性:" prop="f_eq_status" class="searchitemT">
        <el-select v-model="rUserFormInline.f_eq_status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="resetUserForm('rUserFormInline')" class="fontSizeBtB12 icon iconfont icon-ic-refresh">重置</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="getrUserList" class="fontSizeBtW12 icon iconfont icon-ic-search">搜索</el-button>
      </el-form-item>
    </el-form>
    </div>
    <!--表格-->
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span style="padding-top: 5px;position: absolute;">用户管理列表</span>
          <el-button type="primary" :disabled="isDisable" @click="setAbleClick('1')" class="tableButtonStyleW">批量有效</el-button>
          <el-button type="primary" :disabled="isDisable" @click="setAbleClick('0')" class="tableButtonStyleW">批量无效</el-button>
          <el-button type="primary" @click="expoFiles" class="tableButtonStyleW icon iconfont icon-ic-import">导入表格</el-button>
          <el-button type="primary" @click="createUser('userAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new">新增用户</el-button>
        </div>
        <el-table :data="index_rUserList" border @selection-change="selChange">
          <el-table-column type="selection" min-width="5%"></el-table-column>
          <el-table-column label="用户ID" min-width="10%" align="center"  prop="id"></el-table-column>
          <el-table-column label="用户名称" min-width="10%" align="center" prop="username"></el-table-column>
          <el-table-column label="人员姓名" min-width="10%" align="center" prop="name"></el-table-column>
          <el-table-column label="人员编号" min-width="10%" align="center" prop="person.code"></el-table-column>
          <el-table-column label="所属单位" min-width="10%" align="center" prop="person.department.name"></el-table-column>
          <el-table-column label="用户角色" min-width="10%" align="center" prop="roles">
            <template slot-scope="scope">
              {{getStrValue(scope.row.roles,"name")}}
            </template>
          </el-table-column>
          <el-table-column label="有效性" min-width="10%" align="center" prop="status">
            <template slot-scope="scope">
              {{convertStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="相关操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="getEidtClick(scope.row, scope.$index)">编辑</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('1', scope.row)" v-if="scope.row.status!='1'">设为有效</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('0', scope.row)" v-else>设为无效</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rUserFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rUserFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rUserFormModelData.total"></el-pagination>
      </div>
      <!--新增-->
      <el-dialog
        title="新增用户"
        :visible.sync="dialogAddVisible" @close="closeDialog('userAddForm')"
        width="50%">
        <el-form :model="userAddForm" :rules="UserEditFormRules" ref="userAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人员" prop="name">
            <el-input v-model="userAddForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="departmentName">
            <el-input v-model="userAddForm.departmentName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userAddForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="初始密码" prop="password">
            <el-input v-model="userAddForm.password" auto-complete="off" style="width: 76%"></el-input>
            <el-button type="primary" @click="buildPassword('add')" class="dialogButtonB" style="float: right;width: 90px">随机生成</el-button>
          </el-form-item>
          <el-form-item prop="roles">
            <el-transfer
              filterable
              :filter-method="filterMethod"
              filter-placeholder="可选角色列表"
              v-model="userAddForm.roles"
              :data="getRoleList">
            </el-transfer>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('userAddForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetUserForm('userAddForm')" class="dialogButton">重置</el-button>
      </span>
      </el-dialog>
      <!--编辑-->
      <el-dialog
        title="编辑用户"
        :visible.sync="dialogEditVisible" @close="closeDialog('userEditForm')"
        width="50%">
        <el-form :model="userEditForm" :rules="UserEditFormRules" ref="userEditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人员" prop="name">
            <el-input v-model="userEditForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="departmentName">
            <el-input v-model="userEditForm.departmentName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userEditForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="初始密码" prop="password">
            <el-input v-model="userEditForm.password" auto-complete="off" style="width: 76%"></el-input>
            <el-button type="primary" @click="buildPassword('edit')" class="dialogButtonB" style="float: right;width: 90px">随机生成</el-button>
          </el-form-item>
          <el-form-item prop="roles">
            <el-transfer
              filterable
              :filter-method="filterMethod"
              filter-placeholder="可选角色列表"
              v-model="userEditForm.roles"
              :data="getRoleList">
            </el-transfer>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('userEditForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="resetUserForm('userEditForm')" class="dialogButtonW">重置</el-button>
      </span>
      </el-dialog>
      <!--导入-->
      <el-dialog
        title="导入"
        :visible.sync="dialogExpoVisible"
        :before-close="beforeClose"
        width="60%">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action='url'
          :data="expofiledata"
          :default-file-list="defaultUploadList"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-success="handleSuccess"
          :limit="1"
          :format="['properties','yaml','yml']"
          :on-exceed="onexceed"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传Excel文件，且不超过10MB</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogExpoClose" class="dialogButtonW">取消</el-button>
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
    name: 'user',
    data () {
      return {
        filterMethod (query, item) {
          return item.id.indexOf(query) > -1
        },
        rUserFormInline: {
          f_like_username: '',
          f_like_name: '',
          'f_eq_person.department.id': '',
          'f_like_person.name': '',
          'f_like_person.department.name': '',
          'f_like_person.code': '',
          f_eq_status: '',
          paging: true,
          pageSize: 10,
          pageNo: 1
        },
        // 导入begin
        url: this.g_Config.BASE_URL + '/files/config_file_import',
        expofiledata: {
          projectId: ''
        },
        defaultUploadList: [],
        fileList: [],
        // 导入end
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogExpoVisible: false,
        userAddForm: {
          id: '', // 角色id
          person: {}, // 人员
          department: {}, // 管理单位
          departmentName: '', // 管理单位名称
          roles: [], // 角色列表
          name: '', // 人员名称
          password: '', // 密码
          status: '', // 状态
          sign: '' // 项目标识
        },
        userEditForm: {
          id: '', // 角色id
          person: {}, // 人员
          department: {}, // 管理单位
          roles: [], // 角色列表
          name: '', // 角色名称
          password: '', // 密码
          status: '', // 状态
          sign: '' // 项目标识
        },
        UserEditFormRules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '初始密码不能为空', trigger: 'blur' }
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
        'getRUserList', 'getRAddUser', 'getSetUserAble', 'getREditUser'
      ]),
      convertStatus (data) {
        if (data == '1') {
          return '有效'
        } else if (data == '0') {
          return '无效'
        } else {
          return ''
        }
      },
      getStrValue (arrayData, type) {
        if (arrayData) {
          let nameStr = ''
          for (let jsonData in arrayData) {
            let {name} = jsonData
            if (name) {
              nameStr = name + ','
            }
          }
          if (type === 'name') {
            return nameStr.substr(0, nameStr.length - 1)
          } else {
            return ''
          }
        } else {
          return ''
        }
      },
      // 导入begin
      expoFiles () {
        this.dialogExpoVisible = true
      },
      beforeClose (done) {
        this.defaultUploadList = []
        done()
      },
      handlePreview (file) {
        console.log(file)
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handleSuccess (file, fileList) {
        if (file.status == '200') {
          this.$message({
            message: this.$t('message.success'),
            type: 'success'
          })
          this.dialogExpoVisible = false
          this.getConfigList()
          this.defaultUploadList = []
        }
      },
      onexceed (files, fileList) {
        this.$message({
          message: this.$t('message.only_upload_file'),
          type: 'warning'
        })
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      dialogExpoClose () {
        this.dialogExpoVisible = false
        this.defaultUploadList = []
      },
      // 导入end
      submitForm (name) {
        console.log(this.userAddForm)
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'roleAddForm') {
              let params = Object.assign(this.userAddForm)
              this.getRAddUser(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getrUserList()
                this.dialogAddVisible = false
              })
            } else if (name === 'userEditForm') {
              let params = Object.assign(this.userEditForm)
              this.getREditUser(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.getrUserList()
                this.dialogEditVisible = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      buildPassword (type) {
        let password = ''
        for (let i = 0; i < 6; i++) {
          password += Math.floor(Math.random() * 10)
        }
        if (type === 'add') {
          this.userAddForm.password = password
        } else {
          this.userEditForm.password = password
        }
      },
      getrUserList () {
        this.rUserFormInline.pageNo = this.rUserFormModelData.pageNo
        this.rUserFormInline.pageSize = this.rUserFormModelData.pageSize
        let params = Object.assign(this.rUserFormInline)
        this.getRUserList(params)
      },
      resetUserForm (name) {
        this.$refs[name].resetFields()
        this.rUserFormInline['f_like_person.department.name'] = ''
        this.rUserFormInline['f_like_person.name'] = ''
      },
      closeDialog (name) {
        this.$refs[name].resetFields()
      },
      createUser (name) {
        this.dialogAddVisible = true
      },
      onSubmit () {
        this.getrUserList()
      },
      sizeChange (val) {
        this.rUserFormModelData.pageSize = val
        this.getrUserList()
      },
      currentChange (val) {
        this.rUserFormModelData.pageNo = val
        this.getrUserList()
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
        this.userEditForm.sign = row.sign
        this.userEditForm.name = row.name
        this.userEditForm.id = row.id
        this.userEditForm.sortIndex = row.sortIndex
        this.userEditForm.description = row.description
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
          this.getSetUserAble(params).then(res => {
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
        rUserFormModelData: (index) => index.rbac.rUserFormModelData,
        index_rUserList: (index) => index.rbac.index_rUserList,
        index_rRoleList: (index) => index.rbac.index_rRoleList
      }),
      isDisabled () {
        if (this.selectCount > 0) {
          return true
        } else {
          return false
        }
      },
      getRoleList () {
        let arrayData = []
        let JsonRole = {}
        let arrayRole = this.index_rRoleList
        for (let jsonData in arrayRole) {
          console.log(arrayRole[jsonData].id)
          JsonRole.id = arrayRole[jsonData].id
          JsonRole.label = arrayRole[jsonData].name
          JsonRole.key = arrayRole[jsonData].id
          arrayData.push(JsonRole)
          JsonRole = {}
        }
        return arrayData
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
</style>
