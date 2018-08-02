<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">统一权限管理平台</h3>
      <h3 class="title2">PUBLIC APPLICATION MANAGEMENT PLATFORM</h3>
      <el-form-item prop="username">
        <el-input class="textStyle" placeholder="请输入用户名" v-model="loginForm.username" autoComplete="off">
          <i slot="prefix" class="icon iconfont icon-ic-name"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input class="textStyle" name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off" placeholder="请输入密码">
          <i slot="prefix" class="icon iconfont icon-ic-lock"></i>
          <i slot="suffix" class="show-pwd el-icon-view" @click="showPwd"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox>保存密码</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;background:#016ad5;border-radius:4px;height:50px;" :loading="loadingStatus" @click.native.prevent="handleLogin">{{logButtonLabel}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// import utils from '@/utils/util'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: 'NUR7kI26Bs6T9q10'// UbHJ7UHJAtPYJG2C
      },
      loginRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      loadingStatus: false,
      logButtonLabel: '登录',
      pwdType: 'password'
    }
  },
  methods: {
    ...mapActions([
      'getCheckLogin', 'getLogin', 'getRootList'
    ]),
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loadingStatus = true
          this.logButtonLabel = '登录中'
          localStorage.setItem('username', this.loginForm.username)
          let params = Object.assign(this.loginForm)
          this.getCheckLogin(params).then(res => {
            if (res.data.code == '-1') {
              this.$message({
                message: res.data.message
              })
            } else if (res.data.code == '0') {
              this.getLogin(params).then(res => {
                if (res.data.code == '-1') {
                  this.$message({
                    message: res.data.message
                  })
                } else if (res.data.code == '0') {
                  this.getRootList().then(res => {
                    if (res.data.code == 0) {
                      // this.$router.push({path: '/view/department'})
                      window.location.href = '/cloud-rbac/#/view/department'// ../rbac/department
                    } else {
                      this.$message({
                        message: res.data.message
                      })
                    }
                  })
                } else if (res.data.code == '3002') {
                  window.location.href = res.data.message
                } else {
                  this.handleLogin()
                }
              })
            }
            this.loadingStatus = false
            this.logButtonLabel = '登录'
          })
          // this.$store.dispatch('Login', this.loginForm).then(() => {
          //   this.loading = false
          //   this.$router.push({ path: '/' })
          // }).catch(() => {
          //   this.loading = false
          // })
        } else {
          console.log('error submit!!')
          this.loadingStatus = false
          this.logButtonLabel = '登录'
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 44px;
      input {
        background: transparent;
        -webkit-appearance: none;
        border: 1px solid #d8d8d8;
        border-radius: 4px;
        color: #000000;
        height: 44px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
  }
  .title {
    font-family:MFDianHei_Noncommercial-ExLight;
    font-size:24px;
    color:#333333;
    margin: 0 auto 0 auto;
    text-align: center;
    font-weight: 500;
  }
  .title2 {
    font-size:12px;
    -webkit-transform:scale(0.9);
    color:#aaaaaa;
    margin: 8px auto 40px auto;
    text-align: center;
    font-weight: 500;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#081C3E;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: relative;
      left: 0;
      right: 0;
      width: 25%;
      margin-left: 55%;
      margin-top: 12%;
    }
    .tips {
      font-size: 14px;
      color: #000000;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .set-language {
        color: #000000;
        position: absolute;
        top: 5px;
        right: 0;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 16px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
    background-image: url("../../assets/images/login-box-01.png");
    background-repeat: no-repeat;
    background-size: 70% 90%;
    background-position-x: center;
    background-position-y: center;
  }
</style>
