<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="rUserFormInline" ref="rUserFormInline" class="text-left form-top">
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
        <div>
      <el-form-item label="用户名称" prop="f_like_username" class="searchitemTF">
        <el-input v-model="rUserFormInline.f_like_username" placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item label="人员姓名" class="searchitemT">
        <el-input v-model="rUserFormInline['f_like_person.name']" placeholder="请输入人员姓名"></el-input>
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
        </div>
        <div>
      <el-form-item class="searchitemB">
        <el-button type="primary" v-if="index_rootList.indexOf('AUTH_USER_QUERY')>-1" @click="getrUserListFirst" class="fontSizeBtW12 icon iconfont icon-ic-search"> 搜索</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" v-if="index_rootList.indexOf('AUTH_USER_QUERY')>-1" @click="resetUserForm('rUserFormInline')" class="fontSizeBtB12 icon iconfont icon-ic-refresh">重置</el-button>
      </el-form-item>
        </div>
      </div>
    </el-form>
    </div>
    <!--表格-->
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span style="padding-top: 5px;position: absolute;">用户管理列表</span>
          <el-button v-if="index_rootList.indexOf('AUTH_USER_COMMAND')>-1" type="primary" :disabled=isDisable @click="setAbleClick('START', null)" class="tableButtonStyleW">批量有效</el-button>
          <el-button v-if="index_rootList.indexOf('AUTH_USER_COMMAND')>-1" type="primary" :disabled=isDisable @click="setAbleClick('STOP', null)" class="tableButtonStyleW">批量无效</el-button>
          <el-button v-if="index_rootList.indexOf('AUTH_USER_UPLOAD')>-1" type="primary" @click="expoFiles" class="tableButtonStyleW icon iconfont icon-ic-import"> 导入表格</el-button>
          <el-button v-if="index_rootList.indexOf('AUTH_USER_ADD')>-1" type="primary" @click="createUser('userAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new"> 新增用户</el-button>
        </div>
        <el-table :data="index_rUserList" @selection-change="selChange" :stripe="true">
          <el-table-column type="selection" align="center" min-width="5%"></el-table-column>
          <el-table-column v-if="index_rUseFieldList.indexOf('id')>-1" label="用户ID" min-width="10%" align="center"  prop="id"></el-table-column>
          <el-table-column label="用户名称" min-width="10%" align="center" prop="username"></el-table-column>
          <el-table-column label="人员姓名" min-width="10%" align="center" prop="person.name"></el-table-column>
          <el-table-column label="人员编号" min-width="10%" align="center" prop="person.code"></el-table-column>
          <el-table-column label="所属单位" min-width="10%" align="center" prop="person.department.name"></el-table-column>
          <el-table-column label="用户角色" min-width="10%" align="center" prop="roles">
            <template slot-scope="scope">
              {{convertRoles(scope.row.roles)}}
            </template>
          </el-table-column>
          <el-table-column label="有效性" min-width="10%" align="center" prop="status">
            <template slot-scope="scope">
              <i v-if="scope.row.status == 0" style="color: red" class="el-icon-circle-close"></i>
              <i v-else-if="scope.row.status == 1" style="color: green" class="el-icon-circle-check"></i>
              {{convertStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="相关操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" v-if="index_rootList.indexOf('AUTH_USER_UPDATE')>-1" :disabled="isDisabledFun(scope.row)" @click="getEidtClick(scope.row, scope.$index)">编辑</a>
              <a class="tableActionStyle" v-if="index_rootList.indexOf('AUTH_USER_BINDRESOURCE')>-1" :disabled="isDisabledFun(scope.row)" @click="resourceBuilding(scope.row, scope.$index)">绑定资源</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('START', scope.row)" v-if="scope.row.status!='1'&&index_rootList.indexOf('AUTH_USER_COMMAND')>-1">设为有效</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('STOP', scope.row)" v-else-if="index_rootList.indexOf('AUTH_USER_COMMAND')>-1">设为无效</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rUserFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rUserFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rUserFormModelData.total"></el-pagination>
      </div>
      <!--新增-->
      <el-dialog
        title="新增用户" class="dialogStyle"
        :visible.sync="dialogAddVisible" @close="closeDialog('userAddForm')"
        width="50%">
        <el-scrollbar class="list">
        <el-form :model="userAddForm" :rules="UserEditFormRules" ref="userAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人员" prop="person.id">
            <el-select v-model="userAddForm.person.id" filterable @change="setDept">
              <el-option v-for="item in dialogPerson"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位" prop="department">
            <el-input v-model="department" auto-complete="off" disabled=false></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input maxlength="50" v-model="userAddForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="初始密码" prop="password">
            <el-input maxlength="50" v-model="userAddForm.password" auto-complete="off" style="width: 81%"></el-input>
            <el-button type="primary" @click="buildPassword('add')" class="dialogButtonB" style="float: right;width: 90px;margin-top: 4px;">随机生成</el-button>
          </el-form-item>
          <el-form-item label="角色列表" prop="roles">
            <el-transfer
              filterable
              :filter-method="filterMethod"
              filter-placeholder="可选角色列表"
              v-model="userAddForm.roles"
              :data="RoleListData">
            </el-transfer>
          </el-form-item>
        </el-form>
        </el-scrollbar>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('userAddForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetUserForm('userAddForm')" class="dialogButtonW">重置</el-button>
      </span>
      </el-dialog>
      <!--编辑-->
      <el-dialog
        title="编辑用户" class="dialogStyle"
        :visible.sync="dialogEditVisible" @close="closeDialog('userEditForm')"
        width="50%">
        <el-scrollbar class="list">
        <el-form :model="userEditForm" :rules="UserEditFormRules" ref="userEditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人员" prop="person.id">
            <el-select v-model="userEditForm.person.id" disabled="false" placeholder="">
              <el-option v-for="item in dialogPersonTemp"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位">
            <el-input v-model="department" auto-complete="off" disabled=false></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input maxlength="50" v-model="userEditForm.username" auto-complete="off" style="width: 80%"></el-input>
            <el-button type="primary" @click="resetPassword" class="dialogButtonB" style="float: right;width: 90px;margin-top: 4px;">重置密码</el-button>
          </el-form-item>
          <el-form-item label="初始密码" style="display: none">
            <el-input maxlength="50" v-model="userEditForm.password" auto-complete="off" style="width: 80%"></el-input>
            <el-button type="primary" @click="buildPassword('edit')" class="dialogButtonB" style="float: right;width: 90px">随机生成</el-button>
          </el-form-item>
          <el-form-item label="角色列表" prop="roles">
            <el-transfer
              filterable
              :filter-method="filterMethod"
              filter-placeholder="可选角色列表"
              v-model="userEditForm.roles"
              :data="RoleListData">
            </el-transfer>
          </el-form-item>
        </el-form>
        </el-scrollbar>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('userEditForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="closethisDialog" class="dialogButtonW">取消</el-button>
      </span>
      </el-dialog>
      <!--导入-->
      <el-dialog
        title="导入"
        :visible.sync="dialogExpoVisible"
        :before-close="beforeClose"
        width="60%">
        <a id="download" :href="downloadPath" style="float: left;margin-right: 20px;color: #016ad5">用户导入模板.xlsx</a>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action='url'
          :data="expofiledata"
          :default-file-list="defaultUploadList"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-error="handleError"
          :on-success="handleSuccess"
          :limit="1"
          :format="['properties','xlsx','xls']"
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
          return item.label.indexOf(query) > -1
        },
        rUserFormInline: {
          f_like_username: '',
          setClientSign: '',
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
        mountedType: this.$route.params.mountedType ? this.$route.params.mountedType : '',
        selectPerson: [],
        url: this.g_Config.BASE_URL + '/user/import',
        expofiledata: {
          projectId: ''
        },
        defaultUploadList: [],
        fileList: [],
        // 导入end
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogExpoVisible: false,
        department: '',
        userAddForm: {
          person: {
            id: ''
          }, // 人员
          roles: [], // 角色列表
          username: '', // 用户名
          name: '', // 人员名称
          password: '', // 密码
          status: '1' // 状态
        },
        userEditForm: {
          id: '', // 角色id
          person: {
            id: ''
          }, // 人员
          roles: [], // 角色列表
          username: '', // 用户名称
          status: '', // 状态
          sign: '' // 项目标识
        },
        UserEditFormRules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '初始密码不能为空', trigger: 'change' }
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
    mounted () {
      this.autoGetRole()
      this.downloadUserFile()
      if (this.index_rootList.indexOf('AUTH_USER_QUERY') > -1) {
        if (this.mountedType == '') {
          this.getrUserListFirst()
        }
      }
    },
    /* watch: {
      $route () {
        if (utils.getCookie('checkPathSign')) {
          this.setClientSign = utils.getCookie('checkPathSign')
        }
      }
    }, */
    methods: {
      ...mapActions([
        'getRUserList', 'getRAddUser', 'getSetUserAble', 'getREditUser', 'getRRoleList', 'getResetPW', 'getRPersonSelectList', 'getSetUserAbleOnce', 'getrDownloadFile'
      ]),
      // 下载模板
      downloadUserFile () {
        let params = Object.assign({filename: 'user_import_zh.xlsx'})
        this.getrDownloadFile(params)
      },
      setDept (node) {
        let i = 0
        let personData = this.index_rPersonSelectList
        for (;i < personData.length; i++) {
          if (personData[i].id == node) {
            this.department = personData[i].department.name
            break
          }
        }
      },
      closethisDialog () {
        this.dialogEditVisible = false
      },
      // 角色类型转换
      convertRoles (data) {
        if (data) {
          let backStr = ''
          for (let i = 0; i < data.length; i++) {
            backStr += data[i].name + ','
          }
          if (backStr.length > 0) {
            return backStr.substring(0, backStr.length - 1)
          } else {
            return ''
          }
        }
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
        this.fileList = []
        done()
      },
      handlePreview (file) {
        console.log('file')
      },
      handleRemove (file, fileList) {
        console.log('file, fileList')
      },
      handleError (file, fileList) {
        if (file.status != '200') {
          this.$message({
            message: '上传失败！',
            type: 'error'
          })
          this.defaultUploadList = []
          this.fileList = []
          this.dialogExpoVisible = false
        }
      },
      handleSuccess (file, fileList) {
        if (file.status == '200' && file.code != '-1') {
          if (file.result.message.indexOf('成功0') > -1) {
            this.$message({
              message: file.result.message,
              type: 'error'
            })
          } else {
            this.$message({
              message: file.result.message,
              type: 'success'
            })
          }
          this.dialogExpoVisible = false
          this.getrUserListFirst()
          this.defaultUploadList = []
          this.fileList = []
        } else {
          this.$message({
            message: '上传失败！',
            type: 'error'
          })
          this.defaultUploadList = []
          this.fileList = []
          this.dialogExpoVisible = false
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
        this.fileList = []
      },
      // 导入end
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'userAddForm') {
              let newRoles = []
              let newDepartAddForm = {}
              for (let i = 0; i < this.userAddForm.roles.length; i++) {
                newRoles.push({id: this.userAddForm.roles[i]})
              }
              newDepartAddForm.id = this.userAddForm.id // 部门id
              newDepartAddForm.username = this.userAddForm.username // 单位编号
              newDepartAddForm.password = this.userAddForm.password // 密码
              if (this.userAddForm.person && this.userAddForm.person.id != '') {
                newDepartAddForm.person = {id: this.userAddForm.person.id}
              }
              newDepartAddForm.roles = newRoles // 角色列表
              newDepartAddForm.status = '1' // 状态
              newDepartAddForm.sign = this.userAddForm.sign // 项目标识
              let params = Object.assign(newDepartAddForm)
              this.getRAddUser(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.getrUserList()
                  this.dialogAddVisible = false
                } else if (res.data.code == '-1') {
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
              })
            } else if (name === 'userEditForm') {
              let newRoles = []
              let newDepartAddForm = {}
              for (let i = 0; i < this.userEditForm.roles.length; i++) {
                newRoles.push({id: this.userEditForm.roles[i]})
              }
              newDepartAddForm.id = this.userEditForm.id // 部门id
              newDepartAddForm.username = this.userEditForm.username // 单位编号
              if (this.userEditForm.person && this.userEditForm.person.id != '') {
                newDepartAddForm.person = {id: this.userEditForm.person.id}
              }
              newDepartAddForm.roles = newRoles // 角色列表
              newDepartAddForm.status = this.userEditForm.status // 状态
              newDepartAddForm.sign = this.userEditForm.sign // 项目标识
              let params = Object.assign(newDepartAddForm)
              this.getREditUser(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.getrUserList()
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
      getrUserListFirst () {
        this.rUserFormModelData.pageNo = 0
        this.getrUserList()
      },
      getrUserList () {
        this.rUserFormInline.pageNo = this.rUserFormModelData.pageNo
        this.rUserFormInline.pageSize = this.rUserFormModelData.pageSize
        let params = Object.assign(this.rUserFormInline)
        this.getRUserList(params)
      },
      resetUserForm (name) {
        this.$refs[name].resetFields()
        this.department = ''
        this.rUserFormInline['f_like_person.department.name'] = ''
        this.rUserFormInline['f_like_person.name'] = ''
      },
      closeDialog (name) {
        this.department = ''
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
        this.rUserFormModelData.pageNo = val - 1
        this.getrUserList()
      },
      // 密码重置
      resetPassword () {
        debugger
        let params = Object.assign({id: this.userEditForm.id})
        this.getResetPW(params).then(res => {
          this.$message({
            type: 'success',
            message: '密码已重置为123456'
          })
        })
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
        this.userEditForm.id = row.id
        if (row.person && row.person.department) {
          this.department = row.person.department.name
        }
        this.userEditForm.username = row.username
        if (row.person) {
          this.selectPerson = []
          this.selectPerson.push(row.person)
          this.userEditForm.person.id = row.person.id
        }
        this.userEditForm.id = row.id
        let newRoles = []
        for (let i = 0; i < row.roles.length; i++) {
          newRoles.push(row.roles[i].id)
        }
        this.userEditForm.roles = newRoles
        this.userEditForm.status = row.status
        this.userEditForm.name = row.name
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
      autoGetRole () {
        let params = Object.assign({paging: false})
        this.getRRoleList(params)
        this.getRPersonSelectList(params)
      },
      // 资源绑定
      resourceBuilding (row) {
        this.$router.push({name: 'resourceBuilding', params: {id: row.id, name: row.name, clientSign: utils.getCookie('checkPathSign'), settingForType: 'USER'}})
      },
      // 设为有效/无效
      setAbleClick (type, row) {
        this.$confirm(type === 'START' ? '是否确认将此用户设为有效?' : '是否确认将此用户设为无效?', type === 'START' ? '确认设为有效？' : '确认设为无效？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params
          if (row) {
            let ids = []
            ids.push(row.id)
            params = Object.assign({id: ids}, {command: type})
            this.getSetUserAbleOnce(params).then(res => {
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
              this.getrUserList()
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
              this.getSetUserAble(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                })
                this.getrUserList()
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
      }
    },
    computed: {
      ...mapState({
        rUserFormModelData: (index) => index.rbac.rUserFormModelData,
        index_rUserList: (index) => index.rbac.index_rUserList,
        index_rPersonSelectList: (index) => index.rbac.index_rPersonSelectList,
        index_rRoleList: (index) => index.rbac.index_rRoleList,
        index_rUseFieldList: (index) => index.rbac.index_rUseFieldList,
        downLoadHref: (index) => index.rbac.downLoadHref
      }),
      dialogPersonTemp () {
        return this.selectPerson
      },
      downloadPath () {
        return this.g_Config.BASE_URL + this.downLoadHref
      },
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
      RoleListData () {
        let arrayData = []
        let JsonRole = {}
        let arrayRole = this.index_rRoleList
        for (let jsonData in arrayRole) {
          JsonRole.id = arrayRole[jsonData].id.toString()
          JsonRole.label = arrayRole[jsonData].name
          JsonRole.key = arrayRole[jsonData].id
          arrayData.push(JsonRole)
          JsonRole = {}
        }
        return arrayData
      },
      dialogPerson () {
        let returnData = []
        for (let i = 0; i < this.index_rPersonSelectList.length; i++) {
          returnData.push(this.index_rPersonSelectList[i])
          returnData[i].name = this.index_rPersonSelectList[i].name + ' / ' + this.index_rPersonSelectList[i].code
        }
        return returnData
      }
    }
  }
</script>

<style lang="less" scoped>
  // 左侧树样式
  .divStyle_tree{
    float: left;
    width: 19%;
    background: #ffffff;
    margin-right:0.5%;
    margin-top: 10px;
  }
  // 存在树右侧样式
  .divStyle_show{
    float: right;
    width: 80%;
  }
  .main{
    margin: 0 10px;
  }
  // 查询条件整体样式
  .content-search{
    min-height: 72px;
    background: #ffffff;
    margin: 10px 0;
  }
  // 查询条件样式
  .searchitemT {
    margin-top: 20px;
    margin-left: 49px;
  }
  // 查询第一个查询条件样式
  .searchitemTF {
    margin-top: 20px;
    margin-left: 20px;
  }
  // 查询item样式
  .searchitemB {
    margin-top: 20px;
    margin-left: 10px;
    float: right;
  }
  // 十四号字体样式
  .fontSize14{
    font-size: 14px;
    color: #4a525e;
  }
  // 十二号字体样式
  .fontSize12{
    font-family:PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
  }
  // 按键蓝色样式十二号字体
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
  // 信息展示白色演示
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
  // 展示蓝色按键样式
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
  // table样式
  .el-table{
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#606266;
    letter-spacing:0.86px;
    text-align:left;
  }
  // table表头样式
  .el-table thead {
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#606266;
  }
  .cell{
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#606266;
    letter-spacing:0.86px;
    text-align:left;
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
  // 弹出框白色button
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
  // 弹出框蓝色button
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
  // 分页样式
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
    // 输入框样式
    /deep/.el-input__inner {
      background:#ffffff;
      border:1px solid #dcdfe6;
      border-radius:4px;
      width:170px;
      height:30px;
      font-size: 12px;
    };
    // 弹出框元素对齐
    /deep/.el-form-item{
      margin-right: 0;
    }
  }
  // table操作按键样式
  .tableActionStyle{
    font-family:PingFangSC-Medium;
    font-size:12px;
    color:#016ad5;
    letter-spacing:0.86px;
    text-align:left;
    margin-left: 10px;
  }
  // 数据展示整体样式
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
  // 弹出框滚动条
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
