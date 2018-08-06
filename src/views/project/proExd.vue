<template>
  <el-row class="main">
    <div class="content-search">
    <el-form :inline="true" :model="formInline" class="text-left form-top">
      <el-form-item label="筛选:" prop="f_eq_examinedState" class="searchitemTF">
        <el-select v-model="formInline.f_eq_examinedState" placeholder="请筛选项目">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" :disabled="isDisable" icon="el-icon-upload" @click="getExaminedApplyClick(1)" class="fontSizeBtB12">一键审批</el-button>
      </el-form-item>
      <el-form-item class="searchitemB">
        <el-button type="primary" @click="getProList" icon="el-icon-search" class="fontSizeBtW12">搜索</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-row :span="24" class="content">
      <div class="content-table table-top">
        <el-table :data="index_examList" border @selection-change="selChange">
          <el-table-column type="selection" min-width="35"></el-table-column>
          <el-table-column label="项目名称" min-width="180" align="center"  prop="name"></el-table-column>
          <el-table-column label="项目标识" min-width="180" align="center" prop="mark"></el-table-column>
          <el-table-column label="GIT地址" min-width="180" align="center" prop="gitUrl"></el-table-column>
          <el-table-column label="部门负责人" min-width="100" align="center" prop="departmentLeader.name"></el-table-column>
          <el-table-column label="创建时间" min-width="180" align="center" prop="createTime">
            <template slot-scope="scope">
              {{timestampToTimeClick(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" align="center">
            <template slot-scope="scope">
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="getExaminedApplyClick(1, scope.row, scope.$index)">审批</a>
              <a class="tableActionStyle" :disabled="isDisabledFun(scope.row)" @click="getExaminedApplyClick(2, scope.row, scope.$index)" style="margin-left: 10px">退回</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="formProjectModelData.total != 0" @size-change="sizeChange" @current-change="currentChange" :page-size="formProjectModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formProjectModelData.total" class="paginationStyle"></el-pagination>
      </div>
    </el-row>
  </el-row>
</template>

<script>
  import utils from '@/utils/util'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'project',
    data () {
      return {
        formInline: {
          f_eq_examinedState: '',
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
        isDisable: true
      }
    },
    methods: {
      ...mapActions([
        'getExaminedList', 'getAddProjects', 'getEditProjects', 'getDelProjects', 'getPersonList', 'getExamined', 'getExaminedApply', 'getPersonIsAdmin'
      ]),
      timestampToTimeClick (val) {
        if (val) {
          return utils.timestampToTime(val)
        } else {
          return '-----'
        }
      },
      onSubmitApply () {
        this.dialogAddVisible = true
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
      handleEdit (index, row, type) {
        let params = Object.assign(row, {type: type})
        this.getExamined(params).then(res => {
          console.log(res)
        })
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
          this.getProList()
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
        this.getExaminedList(params)
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
      // 审批，退回，一键审批
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
          this.getProList()
        })
      }
    },
    computed: {
      ...mapState({
        formProjectModelData: (index) => index.project.formProjectModelData,
        index_examList: (index) => index.project.index_examList,
        personList: (person) => person.project.personList
      }),
      isDisabled () {
        if (this.selectCount > 0) {
          return true
        } else {
          return false
        }
      }
    },
    mounted () {
      this.getPersonIsAdmin().then(res => {
        this.isAdmin = res.data.result.admin
        this.isOwn = res.data.result.personId
        this.getProList()
        this.getPersonList()
      })
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
  }
  .fontSizeBtB12{
    font-size: 12px;
    color:#666666;
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
</style>
