<template slot-scope>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-input v-model="queryUsername" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="queryUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="序号" width="60">
			</el-table-column>
			<el-table-column prop="username" label="账号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="password" label="密码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="nickName" label="昵称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="roleType" label="用户身份" width="200" sortable>
			</el-table-column>
			<el-table-column prop="registerDate" label="注册时间" width="200" sortable>
			</el-table-column>
			<el-table-column prop="lastLoginDate" label="最后登陆时间" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
					<el-button type="danger" size="small" @click="delUser(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
    <el-dialog
      title="用户注册"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
      width="42%"
    >
      <el-form label-width="80px" :rules="addFormRules" ref="addForm" :model="addForm">
        <el-col :span="12">
          <el-row>
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="addForm.username" placeholder="账号"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码" prop="password" class="pass">
              <el-input type="text" v-model="addForm.password" placeholder="密码"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码确认" prop="passwordConfirm">
              <el-input type="text" v-model="addForm.passwordConfirm" placeholder="密码确认"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="昵称" prop="nickName">
              <el-input type="text" v-model="addForm.nickName" placeholder="昵称"></el-input>
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
                 <el-upload class="myavatar"
                ref="upload" :action="uploadUrl" :show-file-list="false"
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
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
import util from '@/common/js/util.js'
import http from "@/api/http.js";
import path from "@/common/constants/path.js"

	export default {
		data() {
    //校验用户名是否已经被注册
    var validateUsername = (rule, value, callback) => {
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
      if (value.length < 3 || value.length > 16) {
        callback(new Error("密码长度不能小于3位并且不能大于16位"));
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
				} else if (value !== this.addForm.password) {
					callback(new Error("两次输入密码不一致!"));
				} else {
					callback();
				}
			};
			return {
				users: [],
				queryUsername:"",
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				uploadUrl:'',//头像上传地址


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				imgUrl: path.API_PATH + 'image/default/default.jpg',//默认照片,
				//新增界面数据
				addForm: {id:"",username: "",password: "",passwordConfirm: "",nickName: "",avatarUrl:""},
				addFormRules: {
					username: [
						{
							validator: validateUsername,
							required: true,
							trigger: "blur"
						}
					],
					password: [
						{
							validator: passPatternValid,
							required: true,
							trigger: "blur"
						}
					],
					passwordConfirm: [
						{
							validator: validatePassConfirm,
							required: true,
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
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},

			//获取用户列表
			getUsers() {
				this.listLoading = true;
				http.get('/v1/users/'+this.page + '/20').then((res) => {
					if(res.status == 'OK'){
						this.total = res.result.total;
						this.users = res.result.rows.map(item=>{
							if(item.roleId == 1){
								item.roleType= '管理员';
							}else{
								item.roleType= '普通用户';
							}
							return item;
						});
						this.listLoading = false;
					}else{
						this.$message.error("查询用户失败!");
					}
				});
			},

			//用户查询
			queryUsers(){
				this.listLoading = true;
				if(this.queryUsername == ''){
					this.getUsers();
				}else{
						http.get('/v1/likeUsers/'+this.queryUsername).then((res)=>{
							console.log(res);
						if(res.status == 'OK'){
							this.total = res.result.length;
							this.users = res.result;
							this.listLoading = false;
						}else{
							this.$message.error("查询用户失败!");
						}
					})
				}
			},
			//显示新增界面
			handleAdd: function () {
				this.imgUrl=path.API_PATH + 'image/default/default.jpg',
				this.addForm = {id:"",username: "",password: "",passwordConfirm: "",nickName: "",avatarUrl:""},
				this.addFormVisible = true;
				//新增界面数据
				http.get('/v1/randomId').then(res=>{
					console.log(res);
        	if(res.status == 'OK')
					this.addForm.id = res.result;
					this.uploadUrl = '/v1/file/upload/user/'+this.addForm.id;
      	}).catch(error=>{
					console.error(error);
					this.$message.error('服务器出错');
     	 })
			 this.$nextTick(()=>{
   				this.$refs['addForm'].resetFields();
			})
		},
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addLoading = true;
          http
            .post("/v1/user", this.addForm)
            .then(res => {
              this.logining = false;
              if (res.status == "OK") {
                this.$message({
                  message: "注册成功！",
                  type: "success"
                });
              }
							this.getUsers();
              this.addLoading = false;
							this.addFormVisible = false;
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
			//删除用户
			delUser: function (index, row) {
				if(this.users[index].roleId == 1){
					this.$message.error("管理员账号不能被删除！");
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let delids=[row.id];
					console.log(delids);
					http.del('/v1/user',{ids:delids}).then((res) => {
						this.listLoading = false;
            if (res.status == "OK") {
              this.$message({
                message: "删除成功！",
                 type: "success"
              });
							this.getUsers();
            }else{
							this.$message.error("删除用户失败!");
						}
					});
				}).catch((error) => {
					console.log(error);
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				let ids = [];
				for(let i = 0 ;i< this.sels.length;i++){
					if(this.sels[i].roleId == 1){
						this.$message.error("管理员账号不能被删除！");
						return;
					}else{
						ids.push(this.sels[i].id);
					}
				}
				console.log(ids);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					http.del('/v1/user',{ids:ids}).then((res) => {
						this.listLoading = false;
            if (res.status == "OK") {
              this.$message({
                message: "批量删除用户成功！",
                 type: "success"
              });
							this.getUsers();
            }else{
							this.$message.error("批量删除用户失败!");
						}
					});
				}).catch((error) => {
					console.log(error);
				});
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
        this.addForm.avatarUrl = res.result[0].url;
        //this.imgUrl = URL.createObjectURL(file.raw);
        this.imgUrl = path.API_PATH + res.result[0].url;
        console.log(this.imgUrl);
        this.$message.success('上传头像成功！');
      }else{
        console.log(res);
        this.$message.error('上传头像失败！请联系管理员');
      }
    },
	},
	mounted() {
      this.loginUser = JSON.parse(sessionStorage.getItem("user"));
      if(this.loginUser.roleId == 0){
        this.$router.push({
          path:'/non-privileged'
        })
      }else{		
				this.getUsers();
			}
	}
}

</script>

<style>

</style>