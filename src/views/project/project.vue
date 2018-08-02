<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="formInline" class="text-left form-top">
      <el-form-item label="项目名称:" prop="f_like_name" class="searchitemTF">
        <el-input v-model="formInline.f_like_name" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目标识:"  prop="f_like_mark" class="searchitemT">
        <el-input v-model="formInline.f_like_mark" placeholder="请输入项目标识"></el-input>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="onSubmitApply" icon="el-icon-upload" class="fontSizeBtB12">申请项目</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="getProList" icon="el-icon-search" class="fontSizeBtW12">搜索</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-row :span="24" class="content">
      <div class="content-table table-top">
        <el-table :data="index_pProjectList" border>
          <el-table-column type="selection" min-width="35"></el-table-column>
          <el-table-column label="项目名称" min-width="180" align="center"  prop="name"></el-table-column>
          <el-table-column label="项目标识" min-width="180" align="center" prop="mark"></el-table-column>
          <el-table-column label="GIT地址" min-width="180" align="center" prop="gitUrl"></el-table-column>
          <el-table-column label="部门负责人" min-width="100" align="center" prop="departmentLeader.name"></el-table-column>
          <el-table-column label="状态" min-width="100" align="center" prop="examinedState">
            <template slot-scope="scope">
              <span v-if="scope.row.examinedState==0">
                <el-button type="primary" @click="applyExam(scope.row)">{{examinedChange(scope.row.examinedState)}}</el-button>
              </span>
              <span v-else>{{examinedChange(scope.row.examinedState)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="180" align="center" prop="createTime">
            <template slot-scope="scope">
              {{timestampToTimeClick(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" :disabled="scope.row.examinedState==0?false:true" @click="handleEdit(scope.$index, scope.row)">修改</a>
              <a class="tableActionStyle" :disabled="scope.row.examinedState==0?false:true" @click="handleDel(scope.$index, scope.row)" style="margin-left: 10px">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="formProjectModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="formProjectModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formProjectModelData.total" class="paginationStyle"></el-pagination>
      </div>
    </el-row>
    <!--添加配置-->
    <el-dialog
    title="添加项目" @close="resetForm('ruleAddForm')"
    :visible.sync="dialogAddVisible"
    width="60%">
    <el-form :model="ruleAddForm" :rules="addFormRules" ref="ruleAddForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="项目标识" prop="mark">
        <el-input v-model="ruleAddForm.mark" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="项目名" prop="name">
        <el-input v-model="ruleAddForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="git路径" prop="gitUrl">
        <el-input v-model="ruleAddForm.gitUrl" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="项目负责人" prop="responsibleUserIds">
        <el-select multiple v-model="ruleAddForm.responsibleUserIds" filterable placeholder="请选择">
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门负责人" prop="departmentLeaderId" style="width: 400px">
        <el-select v-model="ruleAddForm.departmentLeaderId" filterable placeholder="请选择" >
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleAddForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="resetForm('ruleAddForm')" class="dialogButtonW">重置</el-button>
      </span>
  </el-dialog>
    <!--修改配置-->
    <el-dialog
      title="添加项目"
      :visible.sync="dialogEditVisible"
      width="60%">
      <el-form :model="ruleEditForm" :rules="editFormRules" ref="ruleEditForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目标识" prop="mark">
          <el-input v-model="ruleEditForm.mark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目名" prop="name">
          <el-input v-model="ruleEditForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="git路径" prop="gitUrl">
          <el-input v-model="ruleEditForm.gitUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人" prop="responsibleUserIds">
          <el-select multiple v-model="ruleEditForm.responsibleUserIds" filterable placeholder="请选择">
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门负责人" prop="departmentLeaderId" style="width: 400px">
          <el-select v-model="ruleEditForm.departmentLeaderId" filterable placeholder="请选择" >
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleEditForm')" class="dialogButtonB">立即创建</el-button>
          <el-button @click="resetForm('ruleEditForm')" class="dialogButtonW">重置</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import utils from '@/utils/util'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'project',
    data () {
      var validateGit = (rule, value, callback) => {
        let myreg = /(git)@[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
        if (!myreg.test(value) && value != '') {
          callback(new Error('请输入SSH格式的地址'))
        } else if (value === '') {
          callback(new Error('git路径不能为空'))
        } else {
          callback()
        }
      }
      var validateResponsible = (rule, value, callback) => {
        if (value.length == 0) {
          callback(new Error('请选择项目负责人'))
        } else {
          callback()
        }
      }
      var validateDepartment = (rule, value, callback) => {
        if (value.length == 0) {
          callback(new Error('请选择部门负责人'))
        } else {
          callback()
        }
      }
      var validataProjectMark = (rule, value, callback) => {
        let myreg = /^[a-z][a-z0-9_-]{3,31}$/
        if (!myreg.test(value) && value != '') {
          callback(new Error('项目标识名称不能为空, 4-32位，以英文字母开头，只能包含小写英文字母、数字、下划线、中划线'))
        } else if (value === '') {
          callback(new Error('项目标识名称不能为空'))
        } else {
          callback()
        }
      }
      return {
        dialogAddVisible: false,
        dialogEditVisible: false,
        activeIndex: '1',
        formInline: {
          f_like_name: '',
          f_like_mark: '',
          paging: true
        },
        ruleAddForm: {
          mark: '',
          name: '',
          gitUrl: '',
          remark: '',
          responsibleUserIds: [],
          departmentLeaderId: ''
        },
        addFormRules: {
          mark: [
            { required: true, validator: validataProjectMark, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '项目名不能为空', trigger: 'blur' }
          ],
          gitUrl: [
            { required: true, validator: validateGit, trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          responsibleUserIds: [
            { required: true, validator: validateResponsible, trigger: 'change' }
          ],
          departmentLeaderId: [
            { required: true, validator: validateDepartment, trigger: 'change' }
          ]
        },
        ruleEditForm: {
          mark: '',
          name: '',
          gitUrl: '',
          remark: '',
          responsibleUserIds: [],
          departmentLeaderId: ''
        },
        editFormRules: {
          mark: [
            { required: true, message: '项目标识不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '项目名不能为空', trigger: 'blur' }
          ],
          gitUrl: [
            { required: true, message: 'git路径不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          responsibleUserIds: [
            { required: true, validator: validateResponsible, trigger: 'change' }
          ],
          departmentLeaderId: [
            { required: true, validator: validateDepartment, trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'getpProjectList', 'getAddProjects', 'getEditProjects', 'getDelProjects', 'getPersonSelectList', 'getExaminedApply'
      ]),
      timestampToTimeClick (val) {
        if (val) {
          return utils.timestampToTime(val)
        } else {
          return '-----'
        }
      },
      applyExam (row) {
        let ids = []
        ids.push(row.id)
        this.getExaminedApply(ids).then(res => {
          this.getProList()
        })
      },
      onSubmitApply () {
        this.dialogAddVisible = true
      },
      resetForm (name) {
        this.$refs[name].resetFields()
      },
      handleEdit (index, row) {
        this.ruleEditForm.departmentLeaderId = row.departmentLeader.id
        this.ruleEditForm.mark = row.mark
        this.ruleEditForm.id = row.id
        this.ruleEditForm.name = row.name
        this.ruleEditForm.gitUrl = row.gitUrl
        this.ruleEditForm.remark = row.remark
        this.ruleEditForm.responsibleUserIds = row.responsibleUserIds
        this.dialogEditVisible = true
      },
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'ruleAddForm') {
              let params = Object.assign(this.ruleAddForm)
              this.getAddProjects(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getProList()
                this.dialogAddVisible = false
              })
            } else if (name === 'ruleEditForm') {
              let params = Object.assign(this.ruleEditForm)
              // console.log(params)
              this.getEditProjects(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.getProList()
                this.dialogEditVisible = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onSubmit () {
        this.getProList()
      },
      handleDel (index, row) {
        let aa = []
        aa.push(row.id)
        this.$confirm('此操作将删除这个项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.getDelProjects(aa).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getProList()
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
      },
      sizeChange (val) {
        this.formProjectModelData.pageSize = val
        this.getProList()
      },
      currentChange (val) {
        this.formProjectModelData.pageNo = val
        this.getProList()
      },
      getProList () {
        let params = Object.assign(this.formProjectModelData, this.formInline)
        this.getpProjectList(params)
      },
      getExaminedApplyClick (scope) {
        console.log(scope)
      },
      examinedChange (val) {
        switch (val) {
        case 0:
          return '申请中'
        case 1:
          return '待审批'
        case 2:
          return '审批中'
        case 3:
          return '已完成'
        }
      }
    },
    computed: {
      ...mapState({
        formProjectModelData: (index) => index.project.formProjectModelData,
        index_pProjectList: (index) => index.project.index_pProjectList,
        personList: (person) => person.project.index_ProsonList
      })
    },
    mounted () {
      let params = Object.assign({paging: false})
      this.getProList()
      this.getPersonSelectList(params)
    }
  }
</script>

<style lang="less" scoped>
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
    margin-left: 10px;
  }
  .searchitemTF {
    margin-top: 20px;
    margin-left: 20px;
  }
  .searchitemB {
    margin-top: 20px;
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
    margin-left: 10px;
    padding: 0px;
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
    padding: 0px;
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
    padding: 0px;
  }
  .dialogButtonB{
    background:#016ad5;
    border-radius:4px;
    width:96px;
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
</style>
