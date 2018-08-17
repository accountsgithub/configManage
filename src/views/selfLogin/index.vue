<template>
  <div class="login-background">
    <div class="login-form-background">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h3 class="title">统一配置中心</h3>
        <h3 class="title2">CLOUDCONFIG</h3>
        <el-form-item prop="username">
          <el-input class="textStyle" placeholder="请输入用户名" v-model="loginForm.username" autoComplete="off">
            <i slot="prefix" class="icon iconfont icon-ic-name" style="margin: 0 15px 15px 13px;font-size: 20px;"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="textStyle" name="password" :type="pwdType" @keyup.enter.native="handleSelfLogin" v-model="loginForm.password" autoComplete="off" placeholder="请输入用密码">
            <i slot="prefix" class="icon iconfont icon-ic-lock" style="margin: 0 15px 15px 13px;font-size: 20px;"></i>
            <i slot="suffix" class="show-pwd el-icon-view" @click="showPwd" style="margin: 10px 15px 15px 15px;font-size: 20px"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isSavePW"><span style="font-size: 12px;">记住密码</span></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     style="width:100%;background:#016ad5;border-radius:4px;height:50px;font-size: 16px"
                     :loading="loading"
                     @click.native.prevent="handleSelfLogin">登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import {getCookie, setCookie, delCookie} from '@/utils/helps'

export default {
  name: 'login',

  created () {
    this.thisIsLogin()
  },

  data () {
    return {
      isSavePW: !!getCookie('isSavePW'),
      loginForm: {
        username: getCookie('username') ? getCookie('username') : '',// admin
        password: getCookie('PW') ? getCookie('PW') : ''// 111111
      },
      loginRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    ...mapActions([
      'getLogin', 'getSelfLogin', 'isLogin'
    ]),

    thisIsLogin () {
      this.isLogin().then(res => {
        if(res.data && res.data.code != '401') {
          this.$router.push({path: '/homePage'})
        }
      })
    },

    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },


    handleSelfLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.getSelfLogin(this.loginForm).then(res => {
            console.log(res.data.code)
            if(res.data.code == 0){
              sessionStorage.setItem('username',this.loginForm.username)
              if (this.isSavePW) {
                if (!getCookie('username') || getCookie('username') != this.loginForm.username) {
                  setCookie('username', this.loginForm.username)
                }
                if (!getCookie('PW')|| getCookie('PW') != this.loginForm.password) {
                  setCookie('PW', this.loginForm.password)
                }
                if (!getCookie('isSavePW')) {
                  setCookie('isSavePW', 'true')
                }
              } else {
                delCookie('isSavePW')
                delCookie('username')
                delCookie('PW')
              }
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              this.$router.push({ path: '/homePage' })
            }else{
              this.$message.error('用户名密码输入错误！')
            }
          })
        } else {
          this.loading = false
          return false
        }
      })
    },

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
  .login-background {
    position: fixed;
    background-image: url("~@/assets/images/login-bg-1920.png");
    background-repeat: no-repeat;
    height: 100%;
    width: 100%;
    background-position-x: center;
    background-position-y: center;
  }
  .login-form-background {
    background-image: url("~@/assets/images/login-box-01.png");
    background-repeat: no-repeat;
    width:950px;
    height:560px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-position-x: center;
    background-position-y: center;
    .login-form {
      // background:#ffffff;
      border:0px solid #d8d8d8;
      border-radius:4px;
      margin-left: 538px;
      padding-top: 86px;
      width:350px;
      height:auto;
    }
  }
  .textStyle{
    width: 350px;
    height: 44px;
    /deep/.el-input__inner{
      height: 44px!important;
    }
    /deep/.el-input--prefix .el-input__inner{
      padding-left: 50px;
    }
  }
</style>
