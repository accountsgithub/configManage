<template>
  <el-row class="main">
    <div class="divStyle_tree">
      <el-input placeholder="人员管理" clearable v-model="filterText" class="treeInputStyle" style="border-radius:10px"></el-input>
      <div class="list">
        <el-tree class="filter-tree treeStyle" :data="treeData" @node-click="getList" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2"></el-tree>
      </div>
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
            <el-button type="primary" v-if="index_rootList.indexOf('AUTH_PERSON_QUERY')>-1" @click="resetPersonForm('rPersonFormInline')" icon="el-icon-refresh" class="fontSizeBtB12">重置</el-button>
          </el-form-item>
          <el-form-item class="searchitemB">
            <el-button type="primary" v-if="index_rootList.indexOf('AUTH_PERSON_QUERY')>-1" @click="getThisrPersonListFirst" class="fontSizeBtW12" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    <!--表格-->
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span style="padding-top: 5px;position: absolute;">人员管理列表</span>
          <el-button type="primary" v-if="index_rootList.indexOf('AUTH_PERSON_UPLOAD')>-1" @click="expoFiles" class="tableButtonStyleW icon iconfont icon-ic-import"> 导入表格</el-button>
          <el-button type="primary" v-if="index_rootList.indexOf('AUTH_PERSON_ADD')>-1" @click="createPerson('personAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new"> 新增人员</el-button>
        </div>
        <el-table :data="index_rPersonList" :stripe="true">
          <el-table-column label="人员编号" min-width="10%" align="center"  prop="code"></el-table-column>
          <el-table-column label="人员姓名" min-width="10%" align="center" prop="name"></el-table-column>
          <el-table-column label="人员邮箱" min-width="10%" align="center" prop="email"></el-table-column>
          <el-table-column label="性别" min-width="10%" align="center" prop="sex">
            <template slot-scope="scope">
              {{convertSex(scope.row.sex)}}
            </template>
          </el-table-column>
          <el-table-column label="所属单位" min-width="10%" align="center" prop="department.name"></el-table-column>
          <el-table-column label="有效性" min-width="10%" align="center" prop="status">
            <template slot-scope="scope">
              <i v-if="scope.row.status == 0" style="color: red" class="el-icon-circle-close"></i>
              <i v-else-if="scope.row.status == 1" style="color: green" class="el-icon-circle-check"></i>
              {{convertStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="相关操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" v-if="index_rootList.indexOf('AUTH_PERSON_UPDATE')>-1" :disabled="isDisabledFun(scope.row)" @click="getEidtClick(scope.row, scope.$index)">编辑</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('START', scope.row)" v-if="scope.row.status!='1'&&index_rootList.indexOf('AUTH_PERSON_COMMAND')>-1">设为有效</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('STOP', scope.row)" v-else-if="index_rootList.indexOf('AUTH_PERSON_COMMAND')>-1">设为无效</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rPersonFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rPersonFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rPersonFormModelData.total"></el-pagination>
      </div>
      <!--新增-->
      <el-dialog
        title="新增人员" class="dialogStyle"
        :visible.sync="dialogAddVisible" @close="closeDialog('personAddForm')"
        width="50%">
        <el-form :model="personAddForm" :rules="PersonFormRules" ref="personAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人员编号" prop="code">
            <el-input maxlength="50" v-model="personAddForm.code" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员姓名" prop="name">
            <el-input maxlength="50" v-model="personAddForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员邮箱" prop="email">
            <el-input maxlength="50" v-model="personAddForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="personAddForm.sex" placeholder="请选择">
              <el-option
                v-for="item in optionSex"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位" prop="department.id">
            <el-select v-model="personAddForm.department.id"  placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dialogDeptData"
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
        title="编辑人员" class="dialogStyle"
        :visible.sync="dialogEditVisible" @close="closeDialog('personEditForm')"
        width="50%">
        <el-form :model="personEditForm" :rules="PersonFormRules" ref="personEditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人员编号" prop="code">
            <el-input maxlength="50" v-model="personEditForm.code" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员姓名" prop="name">
            <el-input maxlength="50" v-model="personEditForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员邮箱" prop="email">
            <el-input maxlength="50" v-model="personEditForm.email" auto-complete="off"></el-input>
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
          <el-form-item label="所属单位" prop="department.id">
            <el-select v-model="personEditForm.department.id" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dialogDeptData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('personEditForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="closethisDialog" class="dialogButtonW">取消</el-button>
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
          :on-error="handleError"
          :limit="1"
          :format="['properties','xlsx','xls']"
          :on-exceed="onexceed"
          :auto-upload="false">
          <a id="download" :href="downloadPath" @click="downloadFile" style="float: left;margin-right: 20px;color: #016ad5">人员导入模板.xlsx</a>
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
//  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item'
//  import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
//  import ElOption from '../../../node_modules/element-ui/packages/select/src/option'
  import '@/assets/iconfont/iconfont.css' // icon css

  export default {
//    components: {
//      ElOption,
//      ElInput,
//      ElFormItem},
    name: 'user',
    data () {
      var validateEmail = (rule, value, callback) => {
        let myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!myreg.test(value) && value) {
          callback(new Error('请输入正确邮箱格式'))
        } else {
          callback()
        }
      }
      return {
        filterMethod (query, item) {
          return item.id.indexOf(query) > -1
        },
        windowHeight: document.body.scrollHeight - 150,
        // 导入begin
        url: this.g_Config.BASE_URL + '/person/import',
        expofiledata: {
          projectId: ''
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultUploadList: [],
        fileList: [],
        // 导入end
        rPersonFormInline: {
          'f_eq_department.id': '',
          'f_like_department.name': '',
          f_like_name: '',
          f_like_code: '',
          paging: true
        },
        filterText: '',
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogExpoVisible: false,
        personAddForm: {
          id: '', // 人员id
          department: {
            id: '',
            code: ''
          }, // 管理单位
          name: '', // 人员名称
          code: '', // 人员编号
          status: '1', // 状态
          sex: '' // 性别
        },
        personEditForm: {
          id: '', // 人员id
          department: {
            id: '',
            code: ''
          }, // 管理单位
          name: '', // 人员名称
          code: '', // 人员编号
          status: '', // 状态
          sex: '' // 性别
        },
        PersonFormRules: {
          code: [
            { required: true, message: '人员编码不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '人员名不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '性别不能为空', trigger: 'change' }
          ],
          email: [
            { required: false, validator: validateEmail, trigger: 'blur' }
          ],
          'department.id': [
            { required: true, message: '所属部门不能为空', trigger: 'change' }
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
        'getRPersonList', 'getRAddPerson', 'getSetPersonAble', 'getREditPerson', 'getTreeDeptList', 'getrDownloadFile'
      ]),
      // 左侧单位树
      getTreeDepartList () {
        let params = Object.assign({})
        this.getTreeDeptList(params)
      },
      // 下载模板
      downloadFile () {
        let params = Object.assign({filename: 'person_import_zh.xlsx'})
        this.getrDownloadFile(params)
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
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
      // 左侧单位树 end
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
      closethisDialog () {
        this.dialogEditVisible = false
      },
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'personAddForm') {
              for (let i = 0; i < this.dialogDeptData.length; i++) {
                if (this.dialogDeptData[i].id == this.personAddForm.department.id) {
                  this.personAddForm.department.code = this.dialogDeptData[i].code ? this.dialogDeptData[i].code : ''
                }
              }
              let params = Object.assign(this.personAddForm)
              this.getRAddPerson(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.getThisrPersonList()
                  this.getTreeDepartList()
                  this.dialogAddVisible = false
                } else if (res.data.code == '-1') {
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
              })
            } else if (name === 'personEditForm') {
              for (let i = 0; i < this.dialogDeptData.length; i++) {
                if (this.dialogDeptData[i].id == this.personEditForm.department.id) {
                  this.personEditForm.department.code = this.dialogDeptData[i].code ? this.dialogDeptData[i].code : ''
                }
              }
              let params = Object.assign(this.personEditForm)
              this.getREditPerson(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.getThisrPersonList()
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
          this.personAddForm.password = password
        } else {
          this.personEditForm.password = password
        }
      },
      getThisrPersonListFirst () {
        this.rPersonFormModelData.pageNo = 0
        this.getThisrPersonList()
      },
      getThisrPersonList () {
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
        this.getThisrPersonList()
      },
      currentChange (val) {
        this.rPersonFormModelData.pageNo = val - 1
        this.getThisrPersonList()
      },
      changeTreeValue (treeValue, newArray = [], parentID = null) {
        let newJson = {}
        let i = 0
        if (treeValue) {
          for (;i < treeValue.length; i++) {
            newJson.parentid = parentID
            newJson.id = treeValue[i].id
            newJson.name = treeValue[i].name
            newJson.level = treeValue[i].level
            newJson.path = treeValue[i].path
            newJson.status = treeValue[i].status
            newJson.code = treeValue[i].code
            newArray.push(newJson)
            newJson = {}
            if (treeValue[i].children) {
              this.changeTreeValue(treeValue[i].children, newArray, treeValue[i].id)
            }
          }
        }
        return newArray
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
        console.log(file)
        if (file.status != '200') {
          this.$message({
            message: '上传失败!',
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
          this.getThisrPersonListFirst()
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
      expoFiles () {
        this.dialogExpoVisible = true
      },
      // 导入end
      getList (node) {
        if (this.index_rootList.indexOf('AUTH_PERSON_QUERY') > -1) {
          this.rPersonFormInline['f_eq_department.id'] = node.id
          this.rPersonFormInline['f_like_department.name'] = node.name
          this.getThisrPersonListFirst()
        }
      },
      // 编辑
      getEidtClick (row, index) {
        this.personEditForm.code = row.code
        this.personEditForm.name = row.name
        this.personEditForm.id = row.id
        this.personEditForm.sex = row.sex
        this.personEditForm.email = row.email
        if (row.department) {
          this.personEditForm.department.id = row.department.id
        }
        this.personEditForm.status = row.status
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
        this.$confirm(type === 'START' ? '是否确认将此人员设为有效?' : '是否确认将此人员设为无效?', type === 'START' ? '确认设为有效？' : '确认设为无效？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params
          if (row) {
            let ids = []
            ids.push(row.id)
            params = Object.assign({id: ids}, {command: type})
            this.getSetPersonAble(params).then(res => {
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
              this.getThisrPersonList()
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          })
        })
      }
    },
    mounted () {
      if (this.index_rootList.indexOf('AUTH_PERSON_QUERY') > -1) {
        this.getTreeDepartList()
        this.getThisrPersonListFirst()
      }
      this.downloadFile()
      document.getElementsByClassName('divStyle_tree')[0].style.height = this.windowHeight + 'px'
      document.getElementsByClassName('list')[0].style.height = this.windowHeight + 'px'
    },
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },
    computed: {
      ...mapState({
        rPersonFormModelData: (index) => index.rbac.rPersonFormModelData,
        index_rPersonList: (index) => index.rbac.index_rPersonList,
        index_treeDepartList: (index) => index.rbac.index_treeDepartList,
        downLoadHref: (index) => index.rbac.downLoadHref
      }),
      downloadPath () {
        console.log(this.g_Config.BASE_URL + this.downLoadHref)
        return this.g_Config.BASE_URL + this.downLoadHref
      },
      index_rootList () {
        return JSON.parse(localStorage.rootList)
      },
      treeData () {
        return this.index_treeDepartList
      },
      dialogDeptData () {
        return this.changeTreeValue(this.index_treeDepartList)
      }
    }
  }
</script>

<style lang="less" scoped>
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
  // 弹出框样式
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
  }  // 分页
  .el-pagination {
    color: #575a5f;
    font-weight: 500;
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
  // 左侧树滚动条
  .list {
    overflow-x: auto;
    overflow-y: auto;
  }
  /deep/.divStyle_tree .el-scrollbar__wrap{
    overflow: hidden;
  }
  .treeInputStyle{
    /deep/.el-input__inner {
      border-radius:25px;
    }
  }
  // 左侧树样式
  .divStyle_tree{
    float: left;
    width: 19%;
    background: #ffffff;
    margin-right:0.5%;
    margin-top: 10px;
  }
  // 树搜索框样式
  .treeInputStyle {
    margin-left: 10%;
    margin-top: 14px;
    width: 200px;
  }
  .treeInputStyle{
    /deep/.el-input__inner {
      border-radius:100px;
      height: 32px;
      font-family:PingFangSC-Regular;
      font-size:12px;
      color:#6c737d;
    }
  }
  /deep/.el-tree-node__label {
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#686f79;
  }
</style>
