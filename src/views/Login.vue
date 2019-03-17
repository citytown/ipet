<template>
  <section>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <a class="register" @click="showRegisterForm">注册>></a>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  
    <!--注册界面对话框-->
    <el-dialog title="用户注册" v-model="registerFormVisible" :close-on-click-modal="false" width="30%">
      <el-form label-width="70px">
        <el-col :span="9">
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
        <el-col :span="8" :offset="7">
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
        <el-button type="primary" @click.native="addSubmit" :loading="registing">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {
    requestLogin
  } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        registing: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
        },
        rules2: {
          account: [{
              required: true,
              message: '请输入账号',
              trigger: 'blur'
            },
            //{ validator: validaePass }
          ],
          checkPass: [{
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
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = {
              username: this.ruleForm2.account,
              password: this.ruleForm2.checkPass
            };
            requestLogin(loginParams).then(data => {
              this.logining = false;
              //NProgress.done();
              let {
                msg,
                code,
                user
              } = data;
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                sessionStorage.setItem('user', JSON.stringify(user));
                this.$router.push({
                  path: '/table'
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      showRegisterForm() { //显示注册模态框
        this.registerFormVisible = true;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
  
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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