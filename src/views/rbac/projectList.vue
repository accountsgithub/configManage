<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="rProFormInline" ref="rProFormInline" class="text-left form-top searchFormStyle">
      <el-form-item label="项目名称" prop="f_like_name" class="searchitemTF">
        <el-input v-model="rProFormInline.f_like_name" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="最近编辑人" prop="f_like_updaterName" class="searchitemT">
        <el-input v-model="rProFormInline.f_like_updaterName" placeholder="请输入最近编辑人"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="f_like_creatorName" class="searchitemT">
        <el-input v-model="rProFormInline.f_like_creatorName" placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" v-if="index_rootList.indexOf('AUTH_CLIENT_QUERY')>-1" @click="resetFormLine('rProFormInline')" icon="el-icon-refresh" class="fontSizeBtB12">重置</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" v-if="index_rootList.indexOf('AUTH_CLIENT_QUERY')>-1" @click="getRProListFirst" icon="el-icon-search" class="fontSizeBtW12">搜索</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span>项目管理列表</span>
          <el-button type="primary" v-if="index_rootList.indexOf('AUTH_CLIENT_ADD')>-1" @click="createrProject('resourceAddForm')" class="tableButtonStyleW icon iconfont icon-ic-new" style="margin-right: 20px;margin-top: -5px"> 新增项目</el-button>
        </div>
        <el-table :data="index_rThisProjectList" :stripe="true">
          <el-table-column label="项目名称" min-width="10%" align="center" prop="name"></el-table-column>
          <el-table-column label="项目标识" min-width="10%" align="center" prop="sign"></el-table-column>
          <el-table-column label="回调URL" min-width="20%" align="center" prop="redirectUri"></el-table-column>
          <el-table-column label="创建人" min-width="10%" align="center" prop="creatorName"></el-table-column>
          <el-table-column label="最近编辑人" min-width="10%" align="center" prop="updaterName"></el-table-column>
          <el-table-column label="最近编辑时间" min-width="20%" align="center" prop="updateTime">
            <template slot-scope="scope">
              {{timestampToTimeClick(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column label="相关操作" min-width="10%" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" v-if="index_rootList.indexOf('AUTH_CLIENT_UPDATE')>-1" @click="handleEdit(scope.$index,scope.row)">编辑</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rProFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rProFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rProFormModelData.total"></el-pagination>
      </div>
    </el-row>
    <el-dialog
      title="新增项目" @close="closeThisDialog('projectAddForm')" class="dialogStyle"
      :visible.sync="dialogAddVisible"
      width="50%">
      <el-form :model="projectAddForm" :rules="projectEditFormRules" ref="projectAddForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="name">
          <el-select v-model="projectAddForm.name" placeholder="请选择" @change="setSign">
            <el-option v-for="item in index_rProjectSelectList"
                       :key="item.name"
                       :value="item.name"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目标识" prop="sign">
          <el-input maxlength="50" v-model="projectAddForm.sign" disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="回调URL" prop="redirectUri">
          <el-input maxlength="200" v-model="projectAddForm.redirectUri" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目密钥" prop="secret">
          <el-input maxlength="100" v-model="projectAddForm.secret" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="授权类型" prop="supportGrantTypes">
          <el-select v-model="projectAddForm.supportGrantTypes" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in optionsGrantTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权范围" prop="defaultGrantScope">
          <el-select v-model="projectAddForm.defaultGrantScope" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in optionsScope"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitRProForm('projectAddForm')" class="dialogButtonB">提交</el-button>
          <el-button @click="resetForm('projectAddForm')" class="dialogButtonW">重置</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改项目" @close="closeThisDialog('projectEditForm')" class="dialogStyle"
      :visible.sync="dialogEditVisible"
      width="50%">
      <el-form :model="projectEditForm" :rules="projectEditFormRules" ref="projectEditForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="name">
          <el-select v-model="projectEditForm.name" placeholder="请选择" @change="setEditSign">
            <el-option v-for="item in index_rProjectSelectList"
                       :key="item.name"
                       :value="item.name"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目标识" prop="sign">
          <el-input maxlength="50" v-model="projectEditForm.sign" disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="回调URL" prop="redirectUri">
          <el-input maxlength="200" v-model="projectEditForm.redirectUri" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目密钥" prop="secret">
          <el-input maxlength="100" v-model="projectEditForm.secret" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="授权类型" prop="supportGrantTypes">
          <el-select v-model="projectEditForm.supportGrantTypes" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in optionsGrantTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权范围" prop="defaultGrantScope">
          <el-select v-model="projectEditForm.defaultGrantScope" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in optionsScope"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitRProForm('projectEditForm')" class="dialogButtonB">提交</el-button>
        <el-button @click="closeDialog" class="dialogButtonW">取消</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import utils from '@/utils/util'
  export default {
    name: 'project',
    computed: {
      ...mapState({
        rProFormModelData: (index) => index.rbac.rProFormModelData,
        index_rThisProjectList: (index) => index.rbac.index_rThisProjectList,
        index_rProjectSelectList: (index) => index.app.index_rProjectSelectList
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
    },
    mounted () {
      if (this.index_rootList.indexOf('AUTH_CLIENT_QUERY') > -1) {
        this.getRProListFirst()
      }
      this.getrProject()
    },
    data () {
      return {
        rProFormInline: {
          f_like_name: '',
          f_like_updaterName: '',
          f_like_creatorName: '',
          paging: true
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
        }],
        optionsScope: [{
          label: '普通用户权限',
          value: 'public'
        }, {
          label: '管理员权限',
          value: 'admin'
        }],
        optionsGrantTypes: [{
          label: '授权码模式',
          value: 'authorization_code'
        }, {
          label: '隐式模式',
          value: 'implicit'
        }, {
          label: '密码模式',
          value: 'password'
        }, {
          label: '客户端模式',
          value: 'client_credentials'
        }],
        isDisable: true,
        dialogAddVisible: false,
        dialogEditVisible: false,
        projectAddForm: {
          id: '', // 项目id
          name: '', // 项目名称
          creatorName: '', // 创建人
          redirectUri: '', // 回调URL
          updateTime: '', //  最近编辑时间
          secret: '', // 密钥
          sign: '', // 项目标识
          updaterName: '', // 最近编辑人
          defaultGrantScope: '', //  授权范围
          supportGrantTypes: ''//  授权类型
        },
        projectEditForm: {
          id: '', // 项目id
          name: '', // 项目名称
          creatorName: '', // 创建人
          redirectUri: '', // 回调URL
          updateTime: '', //  最近编辑时间
          secret: '',
          sign: '', // 项目标识
          updaterName: '', // 最近编辑人
          defaultGrantScope: '', //  授权范围
          supportGrantTypes: ''//  授权类型
        },
        projectEditFormRules: {
          name: [
            { required: true, message: '项目名称不能为空', trigger: 'change' }
          ],
          sign: [
            { required: true, message: '项目标识不能为空', trigger: 'blur' }
          ],
          redirectUri: [
            { required: true, message: '回调URL不能为空', trigger: 'blur' }
          ],
          supportGrantTypes: [
            { required: true, message: '授权类型不能为空', trigger: 'change' }
          ],
          defaultGrantScope: [
            { required: true, message: '授权范围不能为空', trigger: 'change' }
          ],
          secret: [
            { required: true, message: '项目密钥不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'getRThisProjectList', 'getREditProjects', 'getRAddProjects', 'getRBACList'
      ]),
      closeThisDialog (name) {
        this.$refs[name].resetFields()
      },
      setSign (node) {
        let tempList = this.index_rProjectSelectList
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].name == node) {
            this.projectAddForm.sign = tempList[i].sign
            break
          }
        }
      },
      setEditSign (node) {
        let tempList = this.index_rProjectSelectList
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].name == node) {
            this.projectEditForm.sign = tempList[i].sign
            break
          }
        }
      },
      getrProject () {
        let params = Object.assign({username: localStorage.username})
        this.getRBACList(params)
      },
      createrProject () {
        this.dialogAddVisible = true
      },
      closeDialog () {
        this.dialogEditVisible = false
      },
      handleEdit (index, row) {
        this.projectEditForm.creatorName = row.creatorName
        this.projectEditForm.name = row.name
        this.projectEditForm.id = row.id
        this.projectEditForm.secret = row.secret
        this.projectEditForm.redirectUri = row.redirectUri
        this.projectEditForm.defaultGrantScope = row.defaultGrantScope
        this.projectEditForm.supportGrantTypes = row.supportGrantTypes
        this.projectEditForm.sign = row.sign
        this.dialogEditVisible = true
      },
      timestampToTimeClick (val) {
        if (val) {
          return utils.timestampToTime(val)
        } else {
          return '-----'
        }
      },
      resetFormLine (name) {
        this.$refs[name].resetFields()
      },
      getRProListFirst () {
        this.rProFormModelData.pageNo = 0
        this.getRProList()
      },
      getRProList () {
        let params = Object.assign(this.rProFormModelData, this.rProFormInline)
        this.getRThisProjectList(params)
      },
      resetForm (name) {
        this.$refs[name].resetFields()
      },
      submitRProForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name == 'projectAddForm') {
              let params = Object.assign(this.projectAddForm)
              this.getRAddProjects(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  })
                  this.getRProList()
                  this.dialogAddVisible = false
                } else if (res.data.code == '-1') {
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
              })
            } else {
              let params = Object.assign(this.projectEditForm)
              this.getREditProjects(params).then(res => {
                if (res.data.code == '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.getRProList()
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
      sizeChange (val) {
        this.rProFormModelData.pageSize = val
        this.getRProList()
      },
      currentChange (val) {
        this.rProFormModelData.pageNo = val - 1
        this.getRProList()
      }
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
    margin-left: 10px;
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
</style>
