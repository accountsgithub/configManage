<template>
  <el-row class="main">
    <div class="divStyle_tree">
      <tree></tree>
    </div>
    <div class="divStyle_show">
      <div class="content-search">
        <el-form :inline="true" :model="rPersonFormInline" ref="rPersonFormInline" class="text-left form-top">
          <el-form-item label="人员姓名" prop="f_like_name" class="searchitemTF">
            <el-input v-model="rPersonFormInline.f_like_name" placeholder="请输入人员姓名"></el-input>
          </el-form-item>
          <el-form-item label="人员编号" prop="f_like_code" class="searchitemT">
            <el-input v-model="rPersonFormInline.f_like_code" placeholder="请输入人员编号"></el-input>
          </el-form-item>
          <el-form-item class="searchitemB">
            <el-button type="primary" @click="resetPersonForm('rPersonFormInline')" icon="el-icon-refresh" class="fontSizeBtB12">重置</el-button>
          </el-form-item>
          <el-form-item class="searchitemB">
            <el-button type="primary" @click="getrPersonList" class="fontSizeBtW12" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    <!--表格-->
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span style="padding-top: 5px;position: absolute;">人员管理列表</span>
          <el-button type="primary" @click="expoFiles" class="tableButtonStyleW icon iconfont icon-ic-import">导入表格</el-button>
          <el-button type="primary" @click="createPerson('personAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new">新增人员</el-button>
        </div>
        <el-table :data="index_rPersonList" border>
          <el-table-column label="人员编号" min-width="10%" align="center"  prop="code"></el-table-column>
          <el-table-column label="人员姓名" min-width="10%" align="center" prop="name"></el-table-column>
          <el-table-column label="人员邮箱" min-width="10%" align="center" prop="email"></el-table-column>
          <el-table-column label="性别" min-width="10%" align="center" prop="sex">
            <template slot-scope="scope">
              {{convertSex(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="所属单位" min-width="10%" align="center" prop="department.name"></el-table-column>
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
        <el-pagination class="paginationStyle" v-if="rPersonFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rPersonFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rPersonFormModelData.total"></el-pagination>
      </div>
      <!--新增-->
      <el-dialog
        title="新增用户"
        :visible.sync="dialogAddVisible" @close="closeDialog('personAddForm')"
        width="50%">
        <el-form :model="personAddForm" :rules="PersonEditFormRules" ref="personAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人员编号" prop="code">
            <el-input v-model="personAddForm.code" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员姓名" prop="name">
            <el-input v-model="personAddForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员邮箱" prop="email">
            <el-input v-model="personAddForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="personAddForm.sex"  placeholder="请选择">
              <el-option
                v-for="item in optionSex"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位" prop="sex">
            <el-select v-model="personAddForm.sex"  placeholder="请选择">
              <el-option
                v-for="item in index_departList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('personAddForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetPersonForm('personAddForm')" class="dialogButtonW">重置</el-button>
      </span>
      </el-dialog>
      <!--编辑-->
      <el-dialog
        title="编辑用户"
        :visible.sync="dialogEditVisible" @close="closeDialog('personEditForm')"
        width="50%">
        <el-form :model="personEditForm" :rules="PersonEditFormRules" ref="personEditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人员编号" prop="code">
            <el-input v-model="personEditForm.code" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员姓名" prop="name">
            <el-input v-model="personEditForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员邮箱" prop="email">
            <el-input v-model="personEditForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="personEditForm.sex"  placeholder="请选择">
              <el-option
                v-for="item in optionSex"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位" prop="sex">
            <el-select v-model="personAddForm.sex"  placeholder="请选择">
              <el-option
                v-for="item in index_departList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('personEditForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="resetPersonForm('personEditForm')" class="dialogButtonW">重置</el-button>
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
    </div>
  </el-row>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item'
  import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
  import tree from '@/views/tree'
  import ElOption from '../../../node_modules/element-ui/packages/select/src/option'
  import '@/assets/iconfont/iconfont.css' // icon css
  export default {
    components: {
      ElOption,
      tree,
      ElInput,
      ElFormItem},
    name: 'user',
    data () {
      return {
        filterMethod (query, item) {
          return item.id.indexOf(query) > -1
        },
        // 导入begin
        url: this.g_Config.BASE_URL + '/files/config_file_import',
        expofiledata: {
          projectId: ''
        },
        defaultUploadList: [],
        fileList: [],
        // 导入end
        rPersonFormInline: {
          f_like_name: '',
          f_like_code: '',
          paging: true
        },
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogExpoVisible: false,
        personAddForm: {
          id: '', // 人员id
          department: {}, // 管理单位
          name: '', // 人员名称
          code: '', // 人员编号
          status: '', // 状态
          sex: '' // 性别
        },
        personEditForm: {
          id: '', // 人员id
          department: {}, // 管理单位
          name: '', // 人员名称
          code: '', // 人员编号
          status: '', // 状态
          sex: '' // 性别
        },
        PersonEditFormRules: {
          code: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '初始密码不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '初始密码不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '初始密码不能为空', trigger: 'blur' }
          ],
          department: [
            { required: true, message: '初始密码不能为空', trigger: 'blur' }
          ]
        },
        isAdmin: false,
        isOwn: null,
        optionSex: [{
          label: '男',
          value: 1
        }, {
          label: '女',
          value: 0
        }],
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
        ids: []
      }
    },
    methods: {
      ...mapActions([
        'getRPersonList', 'getRAddPerson', 'getSetPersonAble', 'getREditPerson'
      ]),
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
      submitForm (name) {
        console.log(this.personAddForm)
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'roleAddForm') {
              let params = Object.assign(this.personAddForm)
              this.getRAddPerson(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getPersonList()
                this.dialogAddVisible = false
              })
            } else if (name === 'personEditForm') {
              let params = Object.assign(this.personEditForm)
              this.getREditPerson(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.getPersonList()
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
          this.personAddForm.password = password
        } else {
          this.personEditForm.password = password
        }
      },
      getrPersonList () {
        this.rPersonFormModelData.pageNo = 1
        let params = Object.assign(this.rPersonFormModelData, this.rPersonFormInline)
        this.getRPersonList(params)
      },
      resetPersonForm (name) {
        this.$refs[name].resetFields()
      },
      closeDialog (name) {
        this.$refs[name].resetFields()
      },
      createPerson (name) {
        this.dialogAddVisible = true
      },
      sizeChange (val) {
        this.rPersonFormModelData.pageSize = val
        this.getrPersonList()
      },
      currentChange (val) {
        this.rPersonFormModelData.pageNo = val
        this.getPersonList()
      },
      getPersonList () {
        let params = Object.assign(this.rPersonFormModelData, this.formInline)
        this.getRPersonList(params)
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
      expoFiles () {
        this.dialogExpoVisible = true
      },
      // 导入end
      // 编辑
      getEidtClick (row, index) {
        this.personEditForm.code = row.code
        this.personEditForm.name = row.name
        this.personEditForm.id = row.id
        this.personEditForm.sex = row.sex
        this.personEditForm.email = row.email
        this.personEditForm.department = row.department
        this.dialogEditVisible = true
      },
      convertSex (data) {
        if (data == '1') {
          return '男'
        } else if (data == '0') {
          return '女'
        } else {
          return ''
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
        rPersonFormModelData: (index) => index.rbac.rPersonFormModelData,
        index_rPersonList: (index) => index.rbac.index_rPersonList,
        index_departList: (index) => index.rbac.index_departList
      })
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
