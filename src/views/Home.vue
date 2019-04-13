<template>
  <section>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col
        :span="10"
        class="logo"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      >{{collapsed?'':sysUserName}}</el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="sysUserAvatar">
            您好，{{sysNickName}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided @click.native="showInfoModifyForm">个人信息修改</el-dropdown-item>
            <el-dropdown-item divided @click.native="showPasswordModifyForm">密码更改</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          unique-opened
          router
          v-show="!collapsed"
        >
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>
                {{item.name}}
              </template>
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.path"
                v-if="!child.hidden"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
              <i :class="item.iconCls"></i>
              {{item.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li
            v-for="(item,index) in $router.options.routes"
            v-if="!item.hidden"
            class="el-submenu item"
          >
            <template v-if="!item.leaf">
              <div
                class="el-submenu__title"
                style="padding-left: 20px;"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <i :class="item.iconCls"></i>
              </div>
              <ul
                class="el-menu submenu"
                :class="'submenu-hook-'+index"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <li
                  v-for="child in item.children"
                  v-if="!child.hidden"
                  :key="child.path"
                  class="el-menu-item"
                  style="padding-left: 40px;"
                  :class="$route.path==child.path?'is-active':''"
                  @click="$router.push(child.path)"
                >{{child.name}}</li>
              </ul>
            </template>
            <template v-else>
              <li class="el-submenu">
                <div
                  class="el-submenu__title el-menu-item"
                  style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                  :class="$route.path==item.children[0].path?'is-active':''"
                  @click="$router.push(item.children[0].path)"
                >
                  <i :class="item.iconCls"></i>
                </div>
              </li>
            </template>
          </li>
        </ul>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
  <!--信息修改-->
  <el-dialog
    title="信息修改"
    :visible.sync="infoModifyFormVisible"
    :close-on-click-modal="false"
    width="40%"
  >
    <el-form
      label-width="70px"
      ref="infoModifyForm"
    >
      <el-col :span="12">
        <el-row>
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="sysUserName" placeholder="账号" :disabled="true"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="昵称" prop="nickName">
            <el-input type="text" v-model="sysNickName" placeholder="昵称"></el-input>
          </el-form-item>
        </el-row>
      </el-col>
        <el-col :span="12">
          <el-row>
            <el-form-item prop="sysUserAvatar">
                <img v-if="sysUserAvatar" :src="sysUserAvatar" style="width:150px;height:150px">
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
      <el-button @click.native="infoModifyFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="infoModifySubmit" :loading="modifying">提交</el-button>
    </div>
  </el-dialog>

      <!--密码修改-->
    <el-dialog
      title="密码修改"
      :visible.sync="passwordFormVisible"
      :close-on-click-modal="false"
      width="35%"
    >
      <el-form :model="passwordForm" label-width="78px" :rules="modifyPasswordRule" ref="passwordForm" >
          <el-row>
            <el-form-item label="旧密码" prop="oldPassword" class="pass">
              <el-input type="text" v-model="passwordForm.oldPassword" placeholder="旧密码"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="新密码" prop="newPassword" class="pass">
              <el-input type="text" v-model="passwordForm.newPassword" placeholder="旧密码"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码确认" prop="passwordConfirm">
              <el-input type="text" v-model="passwordForm.passwordConfirm" placeholder="密码确认"></el-input>
            </el-form-item>
          </el-row>
	  </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="passwordFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="modifyPasswordSubmit" :loading="modifying">提交</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
import http from "@/api/http.js";
import path from "@/common/constants/path.js"
export default {
  data() {

    //校验密码格式 
    var passPatternValid = (rule, value, callback) => {
      var pattern = /^[a-zA-Z0-9_]{1,}$/; 
      console.log(value);
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
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      collapsed: false,
      sysUserName: "",
      sysUserAvatar: "",
      sysNickName: "",
      avatarUrl:"",
	  infoModifyFormVisible: false,
	  modifying:false,
    passwordFormVisible: false,
    passwordForm:{oldPassword: "",newPassword: "",passwordConfirm: ""},
	  modifyPasswordRule:{
        oldPassword: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            trigger: "blur",
            required: true,
            validator:passPatternValid
          }
        ],
        passwordConfirm: [
          {
            trigger: "blur",
            required: true,
            validator:validatePassConfirm
          }
        ]
      },
      uploadUrl:'',//头像上传地址
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleopen() {
      //console.log('handleopen');
    },
    handleclose() {
      //console.log('handleclose');
    },
    handleselect: function(a, b) {},
    //打开修改信息模块框
    showInfoModifyForm() {
    console.log('打开修改信息');
      this.uploadUrl = '/v1/file/upload/user/'+this.sysUserId;
      this.infoModifyFormVisible = true;
    },

    //修改个人信息
    infoModifySubmit(){
        console.log('xiugai');
          let params={id:this.sysUserId,nickName:this.sysNickName,avatarUrl:this.avatarUrl};
            http.put('/v1/user',params).then((res)=>{
              console.log(res);
              if(res.status == 'OK'){
                this.$message.success('修改个人信息成功！');
                this.infoModifyFormVisible = false;
              }else{
                this.$message.success('修改个人信息错误！请联系管理员');
              }
            }).catch(error=>{
              console.log(error);
              this.$message.error("服务器出错")
            })
    },

    //打开修改密码模块框
    showPasswordModifyForm() {
      	this.passwordFormVisible = true;
    },
    //提交修改密码
    modifyPasswordSubmit(){
      let params = {username:this.sysUserName,oldPassword:this.passwordForm.oldPassword,newPassword:this.passwordForm.newPassword};
      http.post('/v1/updatePassword',params).then(res=>{
        console.log(res);
        if(res.status == 'OK'){
          this.$message.success("密码修改成功！")
        }else{
          this.$message.error("密码修改失败！")
        }
      }).catch(error=>{
        console.log(error);
         this.$message.error("服务器出错")
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
        this.avatarUrl = res.result[0].url;
        //this.imgUrl = URL.createObjectURL(file.raw);
        this.sysUserAvatar = path.API_PATH + res.result[0].url;
        this.$message.success('上传头像成功！');
      }else{
        console.log(res);
        this.$message.error('上传头像失败！请联系管理员');
      }
    },
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          _this.$router.push("/login");
        }).catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.sysUserId = user.id||"";
      this.sysUserName = user.username || "";
      this.sysNickName = user.nickName || "";
      this.sysUserAvatar = path.API_PATH + user.avatarUrl || "";
      console.log(this.sysUserAvatar);
    }
  }
};
</script>

<style slot-scope lang="scss">
@import "~scss_vars";

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>