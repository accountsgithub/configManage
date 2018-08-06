<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="rProFormInline" ref="rProFormInline" class="text-left form-top searchFormStyle">
      <el-form-item label="项目名称" prop="name" class="searchitemTF">
        <el-input v-model="rProFormInline.name" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="最近编辑人" prop="updater_id" class="searchitemT">
        <el-input v-model="rProFormInline.updater_id" placeholder="请输入最近编辑人"></el-input>
      </el-form-item>
      <el-form-item label="资源名称" prop="creator_id" class="searchitemT">
        <el-input v-model="rProFormInline.creator_id" placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="resetFormLine('rProFormInline')" icon="el-icon-refresh" class="fontSizeBtW12">重置</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="getRProList" icon="el-icon-search" class="fontSizeBtW12">搜索</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-row :span="24" class="content table-top">
      <div class="content-table">
        <div class="tableInfo">
          <span>项目管理列表</span>
        </div>
        <el-table :data="index_rProjectList" border>
          <el-table-column label="项目ID" min-width="10%" align="center"  prop="id"></el-table-column>
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
              <a class="tableActionStyle" @click="handleEdit(scope.$index,scope.row)">编辑</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="paginationStyle" v-if="rProFormModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="rProFormModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rProFormModelData.total"></el-pagination>
      </div>
    </el-row>
    <el-dialog
      title="修改项目"
      :visible.sync="dialogEditVisible"
      width="40%">
      <el-form :model="projectEditForm" :rules="projectEditFormRules" ref="projectEditForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectEditForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目标识" prop="sign">
          <el-input v-model="projectEditForm.sign" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转URL" prop="redirectUri">
          <el-input v-model="projectEditForm.redirectUri" auto-complete="off"></el-input>
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
          <el-button @click="resetForm('projectEditForm')" class="dialogButtonW">重置</el-button>
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
        index_rProjectList: (index) => index.rbac.index_rProjectList
      }),
      isDisabled () {
        if (this.selectCount > 0) {
          return true
        } else {
          return false
        }
      }
    },
    data () {
      return {
        rProFormInline: {
          name: '',
          updater_id: '',
          creator_id: '',
          pageSize: 10,
          pageNo: 1,
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
        dialogEditVisible: false,
        projectEditForm: {
          id: '', // 项目id
          name: '', // 项目名称
          creatorName: '', // 创建人
          redirectUri: '', // 回调URL
          updateTime: '', //  最近编辑时间
          sign: '', // 项目标识
          updaterName: '', // 最近编辑人
          defaultGrantScope: '', //  授权范围
          supportGrantTypes: ''//  授权类型
        },
        projectEditFormRules: {
          name: [
            { required: true, message: '项目名称不能为空', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '项目标识不能为空', trigger: 'blur' }
          ],
          redirectUri: [
            { required: true, message: '回调URL不能为空', trigger: 'blur' }
          ],
          supportGrantTypes: [
            { required: true, message: '授权类型不能为空', trigger: 'blur' }
          ],
          defaultGrantScope: [
            { required: true, message: '授权范围不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'getRProjectList', 'getREditProjects'
      ]),
      handleEdit (index, row) {
        this.projectEditForm.creatorName = row.creatorName
        this.projectEditForm.name = row.name
        this.projectEditForm.id = row.id
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
      getRProList () {
        this.rProFormInline.pageSize = this.rProFormModelData.pageSize
        this.rProFormInline.pageNo = this.rProFormModelData.pageNo
        let params = Object.assign(this.rProFormInline)
        this.getRProjectList(params)
      },
      resetForm (name) {
        this.$refs[name].resetFields()
      },
      submitRProForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = Object.assign(this.projectEditForm)
            // console.log(params)
            this.getREditProjects(params).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.getRProList()
              this.dialogEditVisible = false
            })
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
        this.rProFormModelData.pageNo = val
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
