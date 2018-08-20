<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
  <el-select v-model="lang" class="langSelectStyle">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!--<el-dropdown class="avatar-container" trigger="click">-->
      <!--<div class="avatar-wrapper">-->
        <!--<i><div class="userSign"></div></i>-->
        <!--&lt;!&ndash;<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">&ndash;&gt;-->
        <!--<i class="el-icon-caret-bottom"></i>-->
      <!--</div>-->
      <!--<el-dropdown-menu class="user-dropdown" slot="dropdown">-->
        <!--<el-dropdown-item divided>-->
          <!--<span @click="logout" style="display:block;">{{$t('common.logout')}}</span>-->
        <!--</el-dropdown-item>-->
      <!--</el-dropdown-menu>-->
    <!--</el-dropdown>-->
    <!---->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper" style="display: flex;">
        <img src="../../../assets/images/pic-head.png" class="userSign" />
        <div style="margin-left: 5px;"><span>{{username}}</span></div>
        <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <!--<el-dropdown-item divided>-->
          <!--<span @click="updataPassword" style="display:block;">{{$t('common.modifyPassword')}}</span>-->
        <!--</el-dropdown-item>-->
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">{{$t('common.logout')}}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="修改密码" @close="closeDialog"
      :visible.sync="dialogVisible"
      width="60%">
      <el-form :model="pwEditForm" :rules="PWEditFormRules" ref="pwEditForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="pwEditForm.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="pwEditForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword">
          <el-input type="password" v-model="pwEditForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('pwEditForm')" class="fontSizeBtW12">提交</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import utils from '@/utils/util'
  import local from '@/lang'
  const viewName = 'i18nView'

  export default {
    data () {
      var validatepw = (rule, value, callback) => {
        if (value != this.pwEditForm.password && value != '') {
          callback(new Error('密码不一致'))
        } else if (value === '') {
          callback(new Error('确认密码不能为空'))
        } else {
          callback()
        }
      }
      return {
        dialogVisible: false,
        pwEditForm: {
          newPassword: '',
          oldPassword: '',
          password: ''
        },
        PWEditFormRules: {
          password: [
            { required: true, message: '新密码不能为空', trigger: 'blur' }
          ],
          oldPassword: [
            { required: true, message: '旧密码不能为空', trigger: 'blur' }
          ],
          newPassword: [
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
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ]),
      username () {
        // return "adminadminadminadminadminadminadminadminadminadminadminadmin"
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
            let params = Object.assign(this.pwEditForm)
            this.getEditPW(params).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('message.edit_success')
              })
              this.dialogVisible = false
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
          console.log('getLogOut')
          debugger
          if (res.data.code == 0 ) {
            this.$router.push({ path: '/login' })
            // window.location.href = './login.html'
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
    height: 72px;
    line-height: 72px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 72px;
      height: 72px;
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
      height: 72px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 30px;
          font-size: 12px;
        }
        .userSign {
          display: inline-block;
          cursor: pointer;
          width: 32px;
          margin-top: 16px;
          height: 32px;
          transition: .38s;
          transform-origin: 50% 50%;
        }
      }
    }
    .langSelectStyle{
      position: absolute;
      margin-left: 10px;
      height:30px;
      width: 170px;
    }
  }
  .el-dropdown-menu__item--divided{
    border-top:1px solid #ffffff
  }
</style>
