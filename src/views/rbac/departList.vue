<template>
  <el-row class="main">
    <div class="divStyle_tree">
      <el-input placeholder="部门管理" clearable v-model="filterText" class="treeInputStyle"></el-input>
      <div class="wrapper treelist-style" ref="wrapper">
          <el-tree class="filter-tree treeStyle" style="overflow: hidden;margin-top: 14px" :data="treeDData" @node-click="getList" @node-collapse="treeCollapse" @node-expand="treeExpand" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2"></el-tree>
      </div>
    </div>
    <div class="divStyle_show">
      <div class="content-search">
        <el-form :inline="true" :model="formRDepartInline" class="text-left form-top">
          <el-form-item class="searchitemB">
            <el-button v-if="index_rootList.indexOf('AUTH_DEPARTMENT_UPLOAD')>-1" type="primary" @click="exportForm()" class="tableButtonStyleW icon iconfont icon-ic-import"> 导入表格</el-button>
          </el-form-item>
          <el-form-item class="searchitemB">
            <el-button v-if="index_rootList.indexOf('AUTH_DEPARTMENT_ADD')>-1" type="primary" @click="rDeptAdd" class="tableButtonStyleW icon iconfont icon-ic-new"> 新增部门</el-button>
          </el-form-item>
        </el-form>
      </div>
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span>部门管理列表</span>
        </div>
        <el-table :data="index_departList" border :stripe="true">
          <el-table-column label="部门编号" min-width="10%" align="center"  prop="code"></el-table-column>
          <el-table-column label="部门名称" min-width="15%" align="center" prop="name"></el-table-column>
          <el-table-column label="上级部门" min-width="15%" align="center" prop="parent.name"></el-table-column>
          <el-table-column label="角色权限" min-width="15%" align="center" prop="roles">
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
          <el-table-column label="操作" min-width="15%" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" v-if="index_rootList.indexOf('AUTH_DEPARTMENT_UPDATE')>-1" :disabled="isDisabledFun(scope.row)" @click="getEditClick(scope.row, scope.$index)">编辑</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('START', scope.row)" v-if="scope.row.status!='1'&&index_rootList.indexOf('AUTH_DEPARTMENT_COMMAND')>-1">设为有效</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="setAbleClick('STOP', scope.row)" v-else-if="index_rootList.indexOf('AUTH_DEPARTMENT_COMMAND')>-1">设为无效</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rDeptFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rDeptFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rDeptFormModelData.total"></el-pagination>
      </div>
    </el-row>
    <!--新增-->
    <el-dialog
      title="新增部门" class="dialogStyle"
      :visible.sync="dialogAddVisible" @close="closeDialog('departAddForm')"
      width="50%">
      <el-scrollbar class="list1">
      <el-form :model="departAddForm" :rules="deptFormRules" ref="departAddForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="单位编号" prop="code">
          <el-input maxlength="50" v-model="departAddForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input maxlength="50" v-model="departAddForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级单位" prop="parent.id">
          <el-select v-model="departAddForm.parent.id" placeholder="请选择">
            <el-option
              v-for="item in dialogDeptData"
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
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" maxlength="100"
                    :autosize="{ minRows: 3, maxRows: 3}"
                    v-model="departAddForm.description"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </el-form>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('departAddForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="resetDepartForm('departAddForm')" class="dialogButtonW">重置</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog
      title="编辑部门" class="dialogStyle"
      :visible.sync="dialogEditVisible" @close="closeDialog('departEditForm')"
      width="50%">
      <el-scrollbar class="list1">
      <el-form :model="departEditForm" :rules="deptFormRules" ref="departEditForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="单位编号" prop="code">
          <el-input maxlength="50" v-model="departEditForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input maxlength="50" v-model="departEditForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属单位" prop="parent.id">
          <el-select v-model="departEditForm.parent.id" placeholder="请选择">
            <el-option
              v-for="item in dialogDeptData"
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
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" maxlength="100"
                    :autosize="{ minRows: 3, maxRows: 3}"
                    v-model="departAddForm.description"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </el-form>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('departEditForm')" class="dialogButtonB">保存</el-button>
          <el-button @click="closethisDialog" class="dialogButtonW">取消</el-button>
      </span>
    </el-dialog>
    <!--导入-->
    <el-dialog
      title="导入"
      :visible.sync="dialogExpoVisible"
      :before-close="beforeClose"
      width="60%">
      <a id="download" :href="downloadPath" style="float: left;margin-right: 20px;color: #016ad5">部门导入模板.xlsx</a>
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
  import BScroll from 'better-scroll'
  export default {
    name: 'project',
    data () {
      return {
        filterMethod (query, item) {
          return item.label.indexOf(query) > -1
        },
        filterText: '',
        windowHeight: document.body.scrollHeight - 150,
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogExpoVisible: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        searchFrom: {
          f_eq_id: '',
          f_eq_status: '',
          f_like_name: ''
        },
        // 导入_开始
        url: this.g_Config.BASE_URL + '/department/import',
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
          status: '1', // 状态
          sign: '', // 项目标识
          description: ''
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
          sign: '', // 项目标识
          description: ''
        },
        formRDepartInline: {
          paging: true,
          pageSize: 10,
          pageNo: 0
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
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },
    methods: {
      ...mapActions([
        'getTreeDeptList', 'getDeptList', 'getRAddDepart', 'getREditDepart', 'getDelProjects', 'getPersonList', 'getExamined', 'getExaminedApply', 'getPersonIsAdmin', 'getSetDepartAble', 'getRRoleList', 'getrDownloadFile', 'getRSelectRoleList'
      ]),
      // 下载模板
      downloadFile () {
        let params = Object.assign({filename: 'department_import_zh.xlsx'})
        this.getrDownloadFile(params)
      },
      closethisDialog () {
        this.dialogEditVisible = false
      },
      // 树展开方法
      treeExpand (data, node, value) {
        /* var ops = document.querySelectorAll('.el-tree-node__content span')
        for (let p of ops) {
          if (p.className && p.className.indexOf('el-icon-caret-right') > -1 && p.className.indexOf('expanded') > -1) {
            p.classList.remove('el-icon-caret-right')
            p.classList.remove('expanded')
            p.classList.add('el-icon-remove-outline')
          } else if (p.className && p.className.indexOf('el-icon-caret-bottom') > -1 && p.className.indexOf('expanded') > -1) {
            p.classList.remove('el-icon-caret-bottom')
            p.classList.add('el-icon-circle-plus-outline')
          }
        } */
      },
      // 树收起方法
      treeCollapse () {
        /* var ops = document.querySelectorAll('.el-tree-node__content span')
        for (let p of ops) {
          if (p.className && p.className.indexOf('el-icon-caret-right') > -1 && p.className.indexOf('expanded') > -1) {
            p.classList.remove('el-icon-caret-right')
            p.classList.remove('expanded')
            p.classList.add('el-icon-remove-outline')
          } else if (p.className && p.className.indexOf('el-icon-caret-bottom') > -1 && p.className.indexOf('expanded') > -1) {
            p.classList.remove('el-icon-caret-bottom')
            p.classList.add('el-icon-circle-plus-outline')
          }
        } */
      },
      timestampToTimeClick (val) {
        if (val) {
          return utils.timestampToTime(val)
        } else {
          return '-----'
        }
      },
      resetDepartForm (name) {
        this.$refs[name].resetFields()
      },
      // 左侧单位树
      getTreeDepartList () {
        let params = Object.assign({paging: false})
        this.getTreeDeptList(params)
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
              let newRoles = []
              let newDepartAddForm = {}
              for (let i = 0; i < this.departAddForm.roles.length; i++) {
                newRoles.push({id: this.departAddForm.roles[i]})
              }
              newDepartAddForm.id = this.departAddForm.id // 部门id
              newDepartAddForm.code = this.departAddForm.code // 单位编号
              newDepartAddForm.parent = {id: this.departAddForm.parent.id}
              newDepartAddForm.roles = newRoles // 角色列表
              newDepartAddForm.name = this.departAddForm.name // 部门名称
              newDepartAddForm.status = '1' // 状态
              newDepartAddForm.sign = this.departAddForm.sign // 项目标识
              newDepartAddForm.description = this.departAddForm.description
              let params = Object.assign(newDepartAddForm)
              this.getRAddDepart(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.getTreeDepartList()
                  this.getDepartList()
                  this.dialogAddVisible = false
                } else if (res.data.code == '-1') {
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
              })
            } else if (name === 'departEditForm') {
              let newRoles = []
              let newDepartAddForm = {}
              for (let i = 0; i < this.departEditForm.roles.length; i++) {
                newRoles.push({id: this.departEditForm.roles[i]})
              }
              newDepartAddForm.id = this.departEditForm.id // 部门id
              newDepartAddForm.code = this.departEditForm.code // 单位编号
              if (this.departEditForm.parent && this.departEditForm.parent.id != '') {
                newDepartAddForm.parent = {id: this.departEditForm.parent.id}
              }
              newDepartAddForm.roles = newRoles // 角色列表
              newDepartAddForm.name = this.departEditForm.name // 部门名称
              newDepartAddForm.status = this.departEditForm.status // 状态
              newDepartAddForm.sign = this.departEditForm.sign // 项目标识
              newDepartAddForm.description = this.departEditForm.description
              let params = Object.assign(newDepartAddForm)
              this.getREditDepart(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.getTreeDepartList()
                  this.getDepartList()
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
      handleEdit (index, row, type) {
        let params = Object.assign(row, {type: type})
        this.getExamined(params).then(res => {
        })
      },
      // 设为有效/无效
      setAbleClick (type, row) {
        this.$confirm(type === 'START' ? '是否确认将此部门设为有效?' : '是否确认将此部门设为无效?', type === 'START' ? '确认设为有效？' : '确认设为无效？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params
          if (row) {
            debugger
            let ids = []
            ids.push(row.id)
            params = Object.assign({id: ids}, {command: type})
            this.getSetDepartAble(params).then(res => {
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
              this.getDepartList()
            })
          }
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
          this.getThisDepartList()
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
      getList (node) {
        if (this.index_rootList.indexOf('AUTH_DEPARTMENT_QUERY') > -1) {
          this.searchFrom.f_eq_id = node.id
          this.searchFrom.f_like_name = node.name
          this.getThisDepartList()
        }
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
      // 导入end
      autoGetRole () {
        let params = Object.assign({paging: false})
        this.getRSelectRoleList(params)
      },
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
        this.rDeptFormModelData.pageNo = val - 1
        this.getDepartList()
      },
      rDeptAdd () {
        this.dialogAddVisible = true
      },
      getThisDepartList () {
        this.rDeptFormModelData.pageNo = 0
        this.getDepartList()
      },
      getDepartList () {
        this.formRDepartInline.pageSize = this.rDeptFormModelData.pageSize
        this.formRDepartInline.pageNo = this.rDeptFormModelData.pageNo
        let params = Object.assign(this.formRDepartInline, this.searchFrom)
        this.getDeptList(params)
      },
      exportForm () {
        this.dialogExpoVisible = true
      },
      changeTreeValue (treeValue, newArray = [], parentID = null) {
        let newJson = {}
        let i = 0
        if (treeValue) {
          for (; i < treeValue.length; i++) {
            newJson.parentid = parentID
            newJson.id = treeValue[i].id
            newJson.name = treeValue[i].name
            newJson.level = treeValue[i].level
            newJson.path = treeValue[i].path
            newJson.status = treeValue[i].status
            newArray.push(newJson)
            newJson = {}
            if (treeValue[i].children) {
              this.changeTreeValue(treeValue[i].children, newArray, treeValue[i].id)
            }
          }
        }
        return newArray
      },
      getEditClick (row, index) {
        this.departEditForm.id = row.id // 部门id
        this.departEditForm.code = row.code // 单位编号
        if (row.parent) {
          this.departEditForm.parent.id = row.parent.id // 上级单位
        }
        let newRoles = []
        for (let i = 0; i < row.roles.length; i++) {
          newRoles.push(row.roles[i].id)
        }
        this.departEditForm.roles = newRoles // 角色列表
        this.departEditForm.name = row.name // 部门名称
        this.departEditForm.status = row.status // 状态
        this.departEditForm.sign = row.sign // 项目标识
        this.dialogEditVisible = true
      }
    },
    mounted () {
      this.getTreeDepartList()
      this.getThisDepartList()
      this.autoGetRole()
      this.downloadFile()
      document.getElementsByClassName('divStyle_tree')[0].style.height = this.windowHeight + 'px'
      document.getElementsByClassName('wrapper')[0].style.height = this.windowHeight + 'px'
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, {scrollY: true, scrollX: true, click: true})
      })
    },
    computed: {
      ...mapState({
        rDeptFormModelData: (index) => index.rbac.rDeptFormModelData,
        index_departList: (index) => index.rbac.index_departList,
        personList: (person) => person.rbac.personList,
        index_treeDepartList: (index) => index.rbac.index_treeDepartList,
        index_rRoleSelectList: (index) => index.rbac.index_rRoleSelectList,
        downLoadHref: (index) => index.rbac.downLoadHref
      }),
      downloadPath () {
        return this.g_Config.BASE_URL + this.downLoadHref
      },
      index_rootList () {
        return JSON.parse(localStorage.rootList)
      },
      treeDData () {
        return this.index_treeDepartList
      },
      getRoleList () {
        let arrayData = []
        let JsonRole = {}
        let arrayRole = this.index_rRoleSelectList
        for (let jsonData in arrayRole) {
          JsonRole.id = arrayRole[jsonData].id.toString()
          JsonRole.label = arrayRole[jsonData].name
          JsonRole.key = arrayRole[jsonData].id
          arrayData.push(JsonRole)
          JsonRole = {}
        }
        return arrayData
      },
      dialogDeptData () {
        return this.changeTreeValue(this.index_treeDepartList)
      }
    }
  }
</script>

<style lang="less" scoped>
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
  //弹出框样式
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
    padding-top: 15px;
    font-family:PingFangSC-Medium;
    font-size:14px;
    color:#686f79;
    letter-spacing:0;
    text-align:left;
    height: 50px;
  }
  // 左侧树滚动条
  .wrapper {
    overflow-x: auto;
    overflow-y: auto;
  }
  /deep/.divStyle_tree .el-scrollbar__wrap{
    overflow: hidden;
  }
  .list1 {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  // 分页
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
    width: 80%;
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
