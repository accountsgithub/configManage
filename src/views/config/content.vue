<template>
  <el-row class="main">
    <!--<div class="content-header">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">{{$t('index.product_name')}}</el-menu-item>
      </el-menu>
    </div>-->
    <!--表单-->
    <div class="content-search">
      <el-form :inline="true" :model="formInline" class="search-form-style">
        <el-form-item :label="$t('index.product_name')" prop="f_like_name" class="first-search-item">
          <el-input v-model="formInline.f_like_name" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('index.unique_identification')" prop="f_like_mark" class="search-item">
          <el-input v-model="formInline.f_like_mark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('index.creator_name')" prop="f_like_creatorName" class="search-item">
          <el-input v-model="formInline.f_like_creatorName"></el-input>
        </el-form-item>
        <el-form-item class="search-item-button">
          <el-button type="primary" @click="buttonConfigList" icon="el-icon-search" class="tableLastButtonStyleB">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
      <el-row class="line"></el-row>
      <el-row :span="24" class="content">
        <div class="content-table">
          <el-table :data="index_projectList" style="width: 100%" :border="false" :stripe="true">
            <el-table-column :label="$t('index.product_name')" min-width="180" align="center"  prop="name"></el-table-column>
            <el-table-column :label="$t('index.unique_identification')" min-width="180" align="center" prop="mark"></el-table-column>
            <el-table-column :label="$t('index.creator_name')" min-width="180" align="center" prop="creatorName"></el-table-column>
            <el-table-column :label="$t('common.deal')" min-width="200" align="center">
              <template slot-scope="scope">
                <a class="tableActionStyle" @click="dialogShow(scope.$index, scope.row)">{{$t('common.show')}}</a>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="formConfigModelData.total != 0" :current-page="formConfigModelData.pageNo + 1" @size-change="sizeChange" @current-change="currentChange" :page-size="formConfigModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formConfigModelData.total" class="paginationStyle"></el-pagination>
        </div>
      </el-row>

    <!--秘钥验证弹窗-->
    <el-dialog
      :title="$t('list.validate_key')"
      :visible.sync="dialogValidateKeyVisible" @close="resetForm('ruleKeyForm')"
      width="30%">
      <el-form :model="ruleKeyForm" :rules="keyFormRules" ref="ruleKeyForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="唯一标识:" class="fontSize12">
          <el-input v-model="ruleKeyForm.mark" auto-complete="off"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="请输入秘钥:" class="fontSize12" prop="key">
          <el-input v-model="ruleKeyForm.key" auto-complete="off" maxlength="253" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleShow('ruleKeyForm')" class="dialogButtonB">{{$t('common.ensure')}}</el-button>
        <el-button @click="resetForm('ruleKeyForm')" class="dialogButtonW">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>

  </el-row>

</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'indexContent',
    data () {
      return {
        activeIndex: '1',
        dialogValidateKeyVisible: false,
        index_copy:{},
        row_copy:{},
        formInline: {
          f_like_name: '',
          f_like_mark: '',
          f_like_creatorName: ''
        },
        ruleKeyForm: {
          key: '',
          mark: ''
        }
      }
    },
    methods: {
      ...mapActions([
        'getConfigsList', 'getValidateKey'
      ]),
      sizeChange (val) {
        this.formConfigModelData.pageSize = val
        this.getProList()
      },
      currentChange (val) {
        this.formConfigModelData.pageNo = val
        this.getProList()
      },
      dialogShow (index, row) {
        sessionStorage.setItem('id', row.id)
        this.index_copy = index
        this.row_copy = row
        this.ruleKeyForm.mark = row.mark
        // if(row.confirm == 0 || row.confirm == 1 || row.confirm == 2 || row.confirm == 3){
        //   this.dialogValidateKeyVisible = false
        //   this.$router.push({name: 'list', params: {id: this.row_copy.id, mark: this.row_copy.mark}})
        // }else{
        //   this.dialogValidateKeyVisible = true
        // }

          this.dialogValidateKeyVisible = false
          this.$router.push({name: 'list', params: {id: this.row_copy.id, mark: this.row_copy.mark}})

      },
      handleShow (name) {
        this.ruleKeyForm.mark = this.row_copy.mark
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.getValidateKey(this.ruleKeyForm).then(res => {
              this.dialogValidateKeyVisible = false
              sessionStorage.setItem('confirmKey', res.data.result)
              if (res.data.result) {
                this.dialogValidateKeyVisible = false
                this.$router.push({name: 'list', params: {id: this.row_copy.id, mark: this.row_copy.mark}})
              }else{
                // this.$router.push({path: '/404'})
                this.$message.error(this.$t('message.badKey'))
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getProList () {
        let params = Object.assign(this.formInline, this.formConfigModelData)
        this.getConfigsList(params)
      },
      buttonConfigList () {
        this.formConfigModelData.pageNo = 1
        this.getProList()
      },
      openAddForm () {
        this.ruleKeyForm.key = ''
        this.ruleKeyForm.mark = ''
      },
      resetForm (name) {
        this.dialogValidateKeyVisible = false
        this.ruleKeyForm.key = ''
        this.ruleKeyForm.mark = ''
        if (this.$refs[name]) {
          this.$refs[name].resetFields()
        }
      },
    },
    computed: {
      ...mapState({
        formConfigModelData: (index) => index.config.formConfigModelData,
        index_projectList: (index) => index.config.index_projectList
      }),

      keyFormRules () {
        return {
          key: [{required: true, message: this.$t('message.validateKey'), trigger: 'blur'}]
        }
      }


    },
    mounted () {
      this.getProList()
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #f0f4f8;
    min-height: 93vh;
  }
  // 搜索框样式
  .search-form-style {
    display: flex;
    flex-wrap:wrap;
    justify-content:space-between;
    /deep/.el-form-item__label {
      font-family:PingFangSC-Regular;
      font-size:12px;
      color:#606266;
      letter-spacing:0;
      font-weight: 500;
      text-align:right;
    };
    /deep/.el-input__inner {
      background:#ffffff;
      border:1px solid #dcdfe6;
      border-radius:4px;
      width:170px;
      height:30px;
    }
  }
  // 首个搜索框样式
  .first-search-item {
    margin-left: 20px;
    margin-top: 15px;
  }
  // 单个搜索框样式
  .search-item {
    margin-top: 15px;
  }
  // 搜索按键样式
  .search-item-button {
    margin-right: 20px;
    margin-top: 20px;
  }
  // 搜索按键样式
  .tableLastButtonStyleB{
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color: #ffffff;
    background:#016ad5;
    border:1px solid #e7e9f0;
    border-radius:4px;
    padding: 0 10px 0 10px;
    height:32px;
    float: right;
  }



  .content-table {
    height: 72px;
    background: #ffffff;
    margin: 10px 10px;
  }
  .content-search{
    height: 72px;
    background: #ffffff;
    margin: 10px 10px 0 10px;
  }
  .content-header{
    height: 72px;
    margin: 10px 10px 0 10px;
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
    }
  }
  .demo-form-inline {
    margin-left: 20px;
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
  .fontSizeTitle12{
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#7e828c;
  }
  .searchButtonW12{
    font-size: 12px;
    color: #ffffff;
    background:#016ad5;
    border-radius:4px;
    width:80px;
    height:32px;
    float: right;
  }
  .fontSizeBtB12{
    font-size: 12px;
    color:#666666;;
    background:#f0f4f8;
    border:1px solid #dfe6ed;
    border-radius:4px;
    width:77px;
    height:32px;
  }
  .el-input__inner{
    background:#ffffff;
    border:1px solid #dcdfe6;
    border-radius:4px;
    width:198px;
    height:30px;
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
  .tableActionStyle{
    font-family:PingFangSC-Medium;
    font-size:12px;
    color:#016ad5;
    letter-spacing:0.86px;
    text-align:left;
  }
  .el-dialog__title{
    line-height: 24px;
    font-size: 16px;
    color: #333333;
  }
  .dialogButtonW {
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 59px;
    height: 30px;
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
    padding: 20px 5px;
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
</style>
