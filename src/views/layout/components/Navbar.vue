<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <div class="right-style">
      <div class="langSelectStyle">
        <lang-select :lang="lang" class="international right-menu-item"></lang-select>
      </div>
      <div class="dropdown-style">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper" style="display: flex;">
            <img src="../../../assets/images/pic-head.png" class="userSign" />
            <div style="margin-left: 5px;"><span>{{username}}</span></div>
            <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <!--<el-dropdown-item divided>
              <span @click="updataPassword" style="display:block;text-align: center;">{{$t('common.modifyPassword')}}</span>
            </el-dropdown-item>-->
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;text-align: center;">{{$t('common.logout')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dialog
          :title="$t('common.modifyPassword')"
          @close="closeDialog"
          :visible.sync="dialogVisible"
          width="60%">
          <el-form :model="pwEditForm" :rules="PWEditFormRules" ref="pwEditForm" label-width="100px" class="dialogStyle">
            <el-form-item :label="$t('list.oldPW_label')" prop="oldPwd">
              <el-input type="password" v-model="pwEditForm.oldPwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('list.newPW_label')" prop="password">
              <el-input type="password" v-model="pwEditForm.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('list.surlyPW_label')" prop="newPwd">
              <el-input type="password" v-model="pwEditForm.newPwd" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('pwEditForm')" class="dialogButtonB">{{$t('list.submit_button')}}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </el-menu>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import LangSelect from '@/components/langSelect'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import utils from '@/utils/util'
  import local from '@/lang'
  const viewName = 'i18nView'

  export default {
    data () {
      var validatepw = (rule, value, callback) => {
        if (value != this.pwEditForm.password && value != '') {
          callback(new Error(this.$t('list.pwsame_message')))
        } else if (value === '') {
          callback(new Error(this.$t('list.surlyPW_validate')))
        } else {
          callback()
        }
      }
      return {
        dialogVisible: false,
        pwEditForm: {
          newPwd: '',
          oldPwd: '',
          password: ''
        },
        PWEditFormRules: {
          password: [
            { required: true, message: this.$t('list.newPW_validate'), trigger: 'blur' }
          ],
          oldPwd: [
            { required: true, message: this.$t('list.oldPW_validate'), trigger: 'blur' }
          ],
          newPwd: [
            { required: true, validator: validatepw, trigger: 'blur' }
          ]
        },
        options: [
          {
            label: '中文',
            value: 'zh'
          },
          {
            label: 'ENGLISH',
            value: 'en'
          }
        ]
      }
    },
    components: {
      LangSelect,
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ]),
      username () {
        // return localStorage.username
        return localStorage.getItem('username')
      },
      lang: {
        get () {
          return this.$store.state.config.language
        },
        set (lang) {
          this.$i18n.locale = lang
          this.$store.dispatch('setLanguage', lang)
        }
      }
    },
    created () {
      if (!this.$i18n.getLocaleMessage('en')[viewName]) {
        this.$i18n.mergeLocaleMessage('zh', local.zh)
        this.$i18n.mergeLocaleMessage('en', local.en)
      }
    },
    methods: {
      ...mapActions([
        'ToggleSideBar', 'LogOut', 'getLogOut', 'getEditPW'
      ]),
      closeDialog () {
        this.$refs['pwEditForm'].resetFields()
      },
      toggleSideBar () {
        this.ToggleSideBar()
      },
      updataPassword () {
        this.dialogVisible = true
      },
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = Object.assign({oldPwd: this.pwEditForm.oldPwd, newPwd: this.pwEditForm.newPwd})
            this.getEditPW(params).then(res => {
              if (res.data && res.data.result) {
                this.$message({
                  type: 'success',
                  message: this.$t('message.edit_success')
                })
                this.dialogVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: this.$t('message.edit_error')
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      logout () {
        localStorage.clear('username')
        this.getLogOut().then(res => {
          if (res.data.code == 0 ) {
            this.$router.push({ path: '/login' })
            // window.location.href = './login'
          }
        })
        // this.$router.push('/login')
        // this.LogOut().then(() => {
        //   location.reload() // 为了重新实例化vue-router对象
        // })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 60px;
    /*line-height: 60px;*/
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 60px;
      height: 60px;
      float: left;
      padding-left: 21px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .avatar-container {
      height: 60px;
      display: inline-block;
      /*position: absolute;*/
      right: 10px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        display: flex;
        margin-right: 30px;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 24px;
          font-size: 12px;
        }
        .userSign {
          display: inline-block;
          cursor: pointer;
          width: 32px;
          margin-top: 10px;
          height: 32px;
          transition: .38s;
          transform-origin: 50% 50%;
        }
      }
    }
    // 右侧样式
    .right-style {
      height: 60px;
      width: auto;
      display: inline-block;
      flex-wrap:wrap;
      justify-content:space-between;
      position: absolute;
      right: 0;
    }
    .dropdown-style {
      position: relative;
      display: inline-table;
      top: 5px;
    }
    .langSelectStyle{
      top: 0;
      position: relative;
      display: inline-table;
      width: 83px;
      right: 20px;
      line-height: 60px;
      /deep/.el-input {
        background:#ffffff;
        border:1px solid #dcdfe6;
        border-radius:4px;
        height:30px !important;
        width: 83px;
        font-size: 12px;
      }
      /deep/.el-input__inner{
        background:#ffffff;
        border:1px solid #dcdfe6;
        border-radius:4px;
        height:30px !important;
        width: 83px;
        font-size: 12px;
      }
      /deep/.el-input--suffix .el-input__inner{
        height:30px !important;
      }
    }
  }

  // dropdown style begin
  .user-dropdown{
    margin-top: -12px;
    width: 120px;
    /deep/.el-dropdown-menu{
      padding: 0;
    }
  }
  /deep/.el-dropdown-menu__item--divided:before{
    height: 0;
    display: none;
  }
  /deep/.el-dropdown-menu__item{
    font-family:PingFangSC-Medium;
    font-size:12px;
    color:#666666;
    line-height: 40px;
  }
  .el-dropdown-menu__item--divided{
    border-top:1px solid #ffffff;
    margin-top: 0;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    color: #666666;
  }
  // dropdown style end
  .el-dropdown-menu__item--divided{
    border-top:1px solid #ffffff
  }
</style>
