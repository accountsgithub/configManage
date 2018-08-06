<template>
  <el-row class="main">
    <div class="divStyle_tree">
      <tree></tree>
    </div>
    <div class="divStyle_show">
      <div class="content-search">
        <el-form :inline="true" :model="formRDepartInline" class="text-left form-top">
          <el-form-item class="searchitemB">
            <el-button type="primary" @click="exportForm()" class="fontSizeBtW12">导入</el-button>
          </el-form-item>
          <el-form-item class="searchitemB">
            <el-button type="primary" @click="rDeptAdd" class="fontSizeBtW12">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span>部门管理列表</span>
        </div>
        <el-table :data="index_departList" border >
          <el-table-column label="部门编号" min-width="180" align="center"  prop="code"></el-table-column>
          <el-table-column label="部门名称" min-width="180" align="center" prop="name"></el-table-column>
          <el-table-column label="上级部门" min-width="180" align="center" prop="parent"></el-table-column>
          <el-table-column label="角色权限" min-width="100" align="center" prop="roles.name"></el-table-column>
          <el-table-column label="有效性" min-width="180" align="center" prop="status"></el-table-column>
          <el-table-column label="操作" min-width="180" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="getExaminedApplyClick(1, scope.row, scope.$index)">编辑</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('1', scope.row)" v-if="scope.row.status!='1'">设为有效</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('0', scope.row)" v-else>设为无效</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rDeptFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rDeptFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rDeptFormModelData.total"></el-pagination>
      </div>
    </el-row>
    <!--新增-->
    <el-dialog
      title="新增部门"
      :visible.sync="dialogAddVisible" @close="closeDialog('departAddForm')"
      width="50%">
      <el-form :model="departAddForm" :rules="deptFormRules" ref="departAddForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="单位编号" prop="code">
          <el-input v-model="departAddForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="departAddForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级单位" prop="departmentName">
          <el-select v-model="departAddForm.departmentName" placeholder="请选择">
            <el-option
              v-for="item in index_departList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roles">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="可选角色列表"
            v-model="departAddForm.roles"
            :data="getRoleList">
          </el-transfer>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3}"
                    v-model="departAddForm.remark"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('departAddForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetUserForm('departAddForm')" class="dialogButtonW">重置</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog
      title="编辑部门"
      :visible.sync="dialogEditVisible" @close="closeDialog('departEditForm')"
      width="50%">
      <el-form :model="departEditForm" :rules="deptFormRules" ref="departEditForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="单位编号" prop="code">
          <el-input v-model="departEditForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="departEditForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属单位" prop="departmentName">
          <el-select v-model="departEditForm.departmentName" placeholder="请选择">
            <el-option
              v-for="item in index_departList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roles">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="可选角色列表"
            v-model="departEditForm.roles"
            :data="getRoleList">
          </el-transfer>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3}"
                    v-model="departAddForm.remark"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('departEditForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetUserForm('departEditForm')" class="dialogButtonW">重置</el-button>
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
    </div>
  </el-row>
</template>

<script>
  import utils from '@/utils/util'
  import {mapState, mapActions} from 'vuex'
  import tree from '@/views/tree'
  export default {
    name: 'project',
    data () {
      return {
        filterMethod (query, item) {
          return item.id.indexOf(query) > -1
        },
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogExpoVisible: false,
        // 导入begin
        url: this.g_Config.BASE_URL + '/files/config_file_import',
        expofiledata: {
          projectId: ''
        },
        defaultUploadList: [],
        fileList: [],
        // 导入end
        departAddForm: {
          id: '', // 部门id
          code: '', // 单位编号
          parent: {
            id: ''
          }, // 上级单位
          roles: [], // 角色列表
          name: '', // 部门名称
          status: '', // 状态
          sign: '' // 项目标识
        },
        departEditForm: {
          id: '', // 部门id
          code: '', // 单位编号
          parent: {
            id: ''
          }, // 上级单位
          roles: [], // 角色列表
          name: '', // 部门名称
          status: '', // 状态
          sign: '' // 项目标识
        },
        formRDepartInline: {
          f_eq_examinedState: '',
          paging: true,
          pageSize: 10,
          pageNo: 1
        },
        deptFormRules: {
          code: [
            {required: true, message: '部门编号不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '部门名称不能为空', trigger: 'blur'}
          ]
        },
        ids: [],
        isAdmin: false,
        isOwn: null,
        options: [{
          label: '全部',
          value: null
        }, {
          label: '待审批',
          value: 1
        }, {
          label: '审批中',
          value: 2
        }, {
          label: '已完成',
          value: 3
        }]
      }
    },
    methods: {
      ...mapActions([
        'getDeptList', 'getRAddDepart', 'getREditDepart', 'getDelProjects', 'getPersonList', 'getExamined', 'getExaminedApply', 'getPersonIsAdmin'
      ]),
      timestampToTimeClick (val) {
        if (val) {
          return utils.timestampToTime(val)
        } else {
          return '-----'
        }
      },
      closeDialog (name) {
        this.$refs[name].resetFields()
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
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'departAddForm') {
              let params = Object.assign(this.departAddForm)
              this.getRAddDepart(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getDepartList()
                this.dialogAddVisible = false
              })
            } else if (name === 'departEditForm') {
              let params = Object.assign(this.departEditForm)
              this.getREditDepart(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.getDepartList()
                this.dialogEditVisible = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleEdit (index, row, type) {
        let params = Object.assign(row, {type: type})
        this.getExamined(params).then(res => {
          console.log(res)
        })
      },
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
      },
      // 导入begin
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
      handleDel (index, row) {
        let params = {
          id: []
        }
        params.id.push(row.id)
        this.getDelProjects(params).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getDepartList()
        })
      },
      sizeChange (val) {
        this.rDeptFormModelData.pageSize = val
        this.getDepartList()
      },
      currentChange (val) {
        this.rDeptFormModelData.pageNo = val
        this.getDepartList()
      },
      rDeptAdd () {
        this.dialogAddVisible = true
      },
      getDepartList () {
        this.formRDepartInline.pageSize = this.rDeptFormModelData.pageSize
        this.formRDepartInline.pageNo = this.rDeptFormModelData.pageNo
        let params = Object.assign(this.formRDepartInline)
        this.getDeptList(params)
      },
      exportForm () {
        this.dialogExpoVisible = true
      },
      getExaminedApplyClick (type, row, index) {
        let params
        if (row) {
          let aa = []
          aa.push(row.id)
          params = Object.assign(aa, {type: type})
        } else {
          params = Object.assign(this.ids, {type: type})
        }
        this.getExamined(params).then(res => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.getDepartList()
        })
      }
    },
    components: {
      tree
    },
    computed: {
      ...mapState({
        rDeptFormModelData: (index) => index.rbac.rDeptFormModelData,
        index_departList: (index) => index.rbac.index_departList,
        personList: (person) => person.rbac.personList
      }),
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
    height: 72px;
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
    width:80px;
    height:32px;
  }
  .fontSizeBtB12{
    font-size: 12px;
    color:#666666;;
    background:#f0f4f8;
    border:1px solid #dfe6ed;
    border-radius:4px;
    width:93px;
    height:32px;
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
  }
  .content-table{
    background: #ffffff;
  }
  .tableInfo{
    margin-left: 21px;
    padding-top: 15px;
    font-family:PingFangSC-Medium;
    font-size:14px;
    color:#686f79;
    letter-spacing:0;
    text-align:left;
    height: 50px;
  }
</style>
