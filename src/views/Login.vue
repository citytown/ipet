<template>
  <section>
    <el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username"  placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <a class="register" @click="showRegisterForm">注册>></a>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="loginSubmit" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  
    <!--注册界面对话框-->
    <el-dialog title="用户注册" :visible.sync="registerFormVisible" :close-on-click-modal="false" width="35%">
      <el-form label-width="70px" >
        <el-col :span="10">
          <el-row>
            <el-form-item label="用户名" prop="username">
              <el-input></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码" prop="password" class="pass">
              <el-input></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码确认" prop="passwordConfirm">
              <el-input></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="昵称" prop="nickName">
              <el-input></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="8" :offset="5">
          <el-row>
            <el-form-item prop="nickName">
              <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" 
              :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" 
              :auto-upload="true">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
              </el-upload>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :offset="4">
              <el-form-item>
                <el-button type="primary">上传头像</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="registerFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="registerSubmit" :loading="registing">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {
    get
  } from '../api/api';
  import http from '@/api/http.js'
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        registing: false,
        loginForm: {username: '',password: ''},
        rules2: {
          username: [{
              required: true,
              message: '请输入账号',
              trigger: 'blur'
            },
            //{ validator: validaePass }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            //{ validator: validaePass2 }
          ]
        },
        checked: true,
        registerFormVisible: false, //注册界面可见判断
        imageUrl: 'https://www.qqtouxiang.com/d/file/tupian/mx/20170713/jim4yidr31tak.jpg',
      };
    },
    methods: {
      handleReset2() {
        this.$refs.loginForm.resetFields();
      },

      //用户登录
      loginSubmit() {
        var _this = this;
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParam = {
              username: this.loginForm.username,
              password: this.loginForm.password
            };
            http.post('/v1/login',loginParam).then(
              res => {
                console.log(res.status)
                this.logining = false;
                if(res.status == 'OK'){
                   sessionStorage.setItem('user', JSON.stringify(res.result));
                   this.$router.push({
                     path: '/table'
                   });
                }
              }).catch(error => {
                console.log(error)
                var content = '服務器異常，連接碼： ' + error.response.status
              this.$alert(content, "警告", {})
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      showRegisterForm() { //显示注册模态框
        console.log('我被点击了')
        this.registerFormVisible = true;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {  //判断照片类型
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
  
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //提交注册
      registerSubmit(){
        console.log('触发方法');
        let url = '';
        http.get('/v1/users/1/0',{}).then(
          res => {
            console.log(res)
          }).catch(error => {
            console.log(error)
          var content = '服務器異常，連接碼： ' + error.response.status
          this.$alert(content, "警告", {})
        })
      }
    }
  }
</script>

<style lang="scss" slot-scope>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }

    .register {
      padding-left: 275px;
      font-size: 20px;
      font-weight: bold;
    }
  }
</style>