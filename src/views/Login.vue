<template slot-scope="slot-scope">
  <section>
    <el-form
      :model="loginForm"
      :rules="loginRule"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-container"
    >
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <a class="register" @click="showRegisterForm">注册>></a>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          type="primary"
          style="width:100%;"
          @click.native.prevent="loginSubmit"
          :loading="logining"
        >登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>

    <!--注册界面对话框-->
    <el-dialog
      title="用户注册"
      :visible.sync="registerFormVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form label-width="70px" :rules="registerRule" ref="registerForm" :model="registerForm">
        <el-col :span="12">
          <el-row>
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="registerForm.username" placeholder="账号"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码" prop="password" class="pass">
              <el-input type="text" v-model="registerForm.password" placeholder="密码"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码确认" prop="passwordConfirm">
              <el-input type="text" v-model="registerForm.passwordConfirm" placeholder="密码确认"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="昵称" prop="nickName">
              <el-input type="text" v-model="registerForm.nickName" placeholder="昵称"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-form-item prop="avatarUrl">
                <img  :src="imgUrl" style="width:150px;height:150px">
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :offset="3">
              <el-form-item>
                 <el-upload
                class="myavatar"
                ref="upload"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :auto-upload="true"
                > 
                  <el-button type="primary">点击上传头像</el-button>
                </el-upload>
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
import http from "@/api/http.js";
import path from "@/common/constants/path.js"

export default {
  data() {  
    //校验用户名是否已经被注册
    var validaeUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      }else if(value.length > 20){
        callback(new Error("用户名长度不能超过20个字符"));
      } else {
        http
          .get("/v1/checkUser/" + value)
          .then(res => {
            console.log(res.status);
            if (res.status == "OK") {     
                callback();
            }else{
              callback(new Error("该用户名已存在"));
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    };
    //校验密码格式 
    var passPatternValid = (rule, value, callback) => {
      var pattern = /^[a-zA-Z0-9_]{1,}$/; 
      if (value.length < 3) {
        callback(new Error("密码长度不能小于3位"));
      } else if (!value.match(pattern)) {
        callback(new Error("密码只能包含数字，字母大小写和下划线"));
      } else {
        callback();
      }
    };
    //校验确认密码
    var validatePassConfirm = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      logining: false,
      registing: false,
      loginForm: { username: "", password: "" },
      loginRule: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      imgUrl: path.API_PATH + 'image/default/default.jpg',//默认照片,
      registerForm: {id:"",username: "",password: "",passwordConfirm: "",nickName: "",avatarUrl:""},
      registerRule: {
        username: [
          {
            validator: validaeUsername,
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: passPatternValid,
            trigger: "blur"
          }
        ],
        passwordConfirm: [
          {
            validator: validatePassConfirm,
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          }
        ]
      },
      checked: true,
      registerFormVisible: false, //注册界面可见判断
      uploadUrl:'', //文件上传路径
    };
  },
  methods: {
    handleReset2() {
      this.$refs.loginForm.resetFields();
    },

    //用户登录
    loginSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          var loginParam = {
            username: this.loginForm.username,
            password: this.loginForm.password
          };   
          this.logining = true;
          http
            .post("/v1/login", loginParam)
            .then(res => {
              console.log(res.status);
              this.logining = false;
              if (res.status == "OK") {
                sessionStorage.setItem("user", JSON.stringify(res.result));
                this.$router.push({
                  path: "/public/home"
                });
              }else{
                this.$message.error(res.result);
              }
            })
            .catch(error => {
              console.log(error);
              var content = "服務器異常，連接碼： " + error.response.status;
              this.$alert(content, "警告", {});
            });
           
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //显示注册模态框
    showRegisterForm() {
      this.imgUrl = path.API_PATH + 'image/default/default.jpg',//默认照片,
      this.registerForm={id:"",username: "",password: "",passwordConfirm: "",nickName: "",avatarUrl:""};
      http.get('/v1/randomId').then(res=>{
        console.log(res);
        if(res.status == 'OK')
        this.registerForm.id = res.result;
        this.uploadUrl = '/v1/file/upload/user/'+res.result;
      }).catch(error=>{
        console.error(error);
        this.$message.error("服务器出错！");
      })
      this.registerFormVisible = true;
      this.$nextTick(()=>{
        this.$refs.registerForm.clearValidate();
      })
    },

    //上传照片前
    beforeAvatarUpload(file) {
      //判断照片类型
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //上传成功后
    handleAvatarSuccess(res, file) {
      if(res.status == 'OK'){
        this.registerForm.avatarUrl = res.result[0].url;
        //this.imgUrl = URL.createObjectURL(file.raw);
        this.imgUrl = path.API_PATH + res.result[0].url;
        console.log(this.imgUrl);
        this.$message.success('上传头像成功！');
      }else{
        console.log(res);
        this.$message.error('上传头像失败！请联系管理员');
      }
    },
    registerSubmit() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.registering = true;
          http
            .post("/v1/user", this.registerForm)
            .then(res => {
              console.log(res.status);
              this.logining = false;
              if (res.status == "OK") {
                this.$message({
                  message: "注册成功！",
                  type: "success"
                });
              }
              this.registering = false;
              this.registerFormVisible = false;
            })
            .catch(error => {
              console.log(error);
              var content = "服務器異常，連接碼： " + error.response.status;
              this.$alert(content, "警告", {});
            }); 
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
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
 
  .myavatar {
    width: 178px;
    height: 178px;
  }
}
</style>