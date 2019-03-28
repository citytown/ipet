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
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="id" width="370" sortable>
			</el-table-column>
			<el-table-column prop="username" label="账号" width="370" sortable>
			</el-table-column>
			<el-table-column prop="password" label="密码" width="370" sortable>
			</el-table-column>
			<el-table-column prop="nickName" label="昵称" width="370" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope>
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
      width="35%"
    >
      <el-form label-width="70px" :rules="addFormRules" ref="addForm" :model="addForm">
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
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :auto-upload="true"
              >
                <img v-if="addForm.avatarUrl" :src="addForm.avatarUrl" class="avatar">
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
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import http from "@/api/http.js";

	export default {
		data() {
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
			//校验用户名是否已经被注册
			var validaeUsername = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("请输入账号"));
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
			return {
				users: [],
				queryUsername:"",
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					username: [
						{
							validator: validaeUsername,
							trigger: "blur"
						}
					],
					password: [
						{
							required: true,
							message: "请输入密码",
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
				//新增界面数据
      	addForm: {
        	id:"",
        	username: "",
        	password: "",
       	 	passwordConfirm: "",
        	nickName: "",
        	avatarUrl:"https://www.qqtouxiang.com/d/file/tupian/mx/20170713/jim4yidr31tak.jpg"
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
						this.users = res.result.rows;
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
				this.addFormVisible = true;
				//新增界面数据
      	this.addForm={
					id:"",
        	username: "",
        	password: "",
       	 	passwordConfirm: "",
        	nickName: "",
        	avatarUrl:"https://www.qqtouxiang.com/d/file/tupian/mx/20170713/jim4yidr31tak.jpg"
				};
				http.get('/v1/randomId').then(res=>{
					console.log(res);
        	if(res.status == 'OK')
					this.addForm.id = res.result;
					this.getUsers();
      	}).catch(error=>{
					console.error(error);
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
				var ids = this.sels.map(item => item.id);
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
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style>

</style>