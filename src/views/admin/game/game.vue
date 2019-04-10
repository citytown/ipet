<template slot-scope>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">		
				<el-form-item>
					<el-input v-model="content" placeholder="输入题目内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="queryGames">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addGameForm">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="games" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="序号" width="60">
			</el-table-column>
			<el-table-column prop="content" label="题目" width="900" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
						<el-button type="primary" size="small" @click="editGameForm(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="delGame(scope.$index, scope.row)">删除</el-button>
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
      title="添加游戏题目"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form label-width="78px" :rules="formRules" ref="form" :model="form">
				<el-row>
        <el-col :span="12">
          <el-row>
            <el-form-item label="题目" prop="content">
              <el-input type="textarea" :rows="3" v-model="form.content" placeholder="请输入题目"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="选项一" prop="choiceOne">
              <el-input type="text" v-model="form.choiceOne" placeholder="选项一"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="选项二" prop="choiceTwo">
              <el-input type="text" v-model="form.choiceTwo" placeholder="选项二"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="选项三" prop="choiceThree">
              <el-input type="text" v-model="form.choiceThree" placeholder="选项三"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="选项四" prop="choiceFour">
              <el-input type="text" v-model="form.choiceFour" placeholder="选项四"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="正确选项" prop="rightChoice">
              <el-input type="text" v-model="form.rightChoice" placeholder="只能输入1,2,3,4"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-form-item prop="photoUrl">
                <img :src="imgUrl==''?defaultPhotoUrl:imgUrl" class="avatar">
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :offset="3">
              <el-form-item>
                 <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" :auto-upload="true"> 
                  <el-button type="primary">点击上传头像</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
				</el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click.native="formSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
import util from '@/common/js/util.js'
import path from "@/common/constants/path.js"
import http from "@/api/http.js";
export default {
	mounted() {
	this.loginUser = JSON.parse(sessionStorage.getItem("user"));
      if(this.loginUser.roleId == 0){
        this.$router.push({
          path:'/non-privileged'
        })
      }else{
				this.getGames();
				this.uploadUrl = '/v1/file/upload/user/' + this.loginUser.id;
		}
	},
	data() {
		//校验确认密码
		var rightChoiceVali = (rule, value, callback) => {
			if (value != '1' || alue != '2'|| alue != '3'|| alue != '4') {
				callback(new Error("只能填写1,2,3,4四个数字"));
			}else {
				callback();
			}
		};
		return {
			id: "",
			games: [],
			content: "",
			total: 0,
			page: 1,
			listLoading: false,
			sels: [], //列表选中列
			formVisible: false, //新增编辑界面是否显示
			formType: "", //表单类型
			addLoading: false,
			formRules: {
				content: [{
					required: true,
					message: "请输入题目内容",
					trigger: "blur"
				}],
				choiceOne: [{
					required: true,
					message: "请输入选项一",
					trigger: "blur"
				}],
				choiceTwo: [{
					required: true,
					message: "请输入选项二",
					trigger: "blur"
				}],
				choiceThree: [{
					required: true,
					message: "请输入选项三",
					trigger: "blur"
				}],
				choiceFour: [{
					required: true,
					message: "请输入选项四",
					trigger: "blur"
				}],
				rightChoice: [{
					trigger: "blur",
					validator:rightChoiceVali,
				}]
			},
			imgUrl:'',
			defaultPhotoUrl: path.API_PATH + 'image/default/default.jpg',
			uploadUrl: '',
			//新增界面数据
			form: {id: '',content: "",choiceOne: "",choiceTwo: "",choiceThree: "",choiceFour: "",rightChoice: "",photoUrl: ''}, //默认照片
		}
	},
	methods: {
		handleCurrentChange(val) {
			this.page = val;
			this.getGames();
		},

		//获取游戏题目列表
		getGames() {
			this.listLoading = true;
			http.get('/v1/games/' + this.page + '/20').then((res) => {
				if (res.status == 'OK') {
					this.total = res.result.total;
					this.games = res.result.rows;
					this.listLoading = false;
				} else {
					this.$message.error("查询游戏题目列表失败!");
				}
			}).catch(err => {
				console.log(err);
				this.$message.error("服务器出错");
			});
		},

		//相似题目查询
		queryGames() {
			this.listLoading = true;
			if (this.content == '') {
				this.getGames();
			} else {
				http.get('/v1/likeContent/' + this.content).then((res) => {
					console.log(res);
					if (res.status == 'OK') {
						this.total = res.result.length;
						this.games = res.result;
						this.listLoading = false;
					} else {
						this.$message.error("查询用户失败!");
					}
				}).catch(err => {
					console.log(err);
					this.$message.error("服务器出错");
				});
			}
		},
		//显示新增界面
		addGameForm: function() {
			this.formType = 'add';
			this.formVisible = true;
			this.imgUrl='';
			//新增界面数据
			this.form = {
				content: "",
				choiceOne: "",
				choiceTwo: "",
				choiceThree: "",
				choiceFour: "",
				rightChoice: "",
				photoUrl: '', //默认照片
			};
		},
		//diag提交
		formSubmit: function() {
			this.$refs.form.validate(valid => {
				if (valid) {
					if (this.formType == 'add') {
						this.addGame();
					} else if (this.formType == 'edit') {
						this.editGame();
					}
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},

		addGame() {
			this.addLoading = true;
			http
				.post("/v1/game", this.form)
				.then(res => {
					this.logining = false;
					if (res.status == "OK") {
						this.$message({
							message: "增加成功！",
							type: "success"
						});
					}
					this.getGames();
					this.addLoading = false;
					this.formVisible = false;
				})
				.catch(error => {
					console.log(error);
					this.$message.error("服务器出错");
				});
		},
	

		//编辑游戏题目
		editGameForm(index, row) {
			this.formType = 'edit';
			this.formVisible = true;
			this.imgUrl = path.API_PATH + this.games[index].photoUrl;
			this.form = this.games[index];
		},

		//提交修改游戏题目
		editGame() {
			this.addLoading = true;
			http
				.put("/v1/game", this.form)
				.then(res => {
					this.logining = false;
					if (res.status == "OK") {
						this.$message({
							message: "修改成功！",
							type: "success"
						});
					}
					this.getGames();
					this.addLoading = false;
					this.formVisible = false;
				})
				.catch(error => {
					console.log(error);
					this.$message.error("服务器出错");
				});
		},
		//删除游戏
		delGame: function(index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				let delids = [row.id];
				console.log(delids);
				http.del('/v1/game', { ids: delids }).then((res) => {
					this.listLoading = false;
					if (res.status == "OK") {
						this.$message({
							message: "删除成功！",
							type: "success"
						});
						this.getGames();
					} else {
						this.$message.error("删除用户失败!");
					}
				});
			}).catch((error) => {
				console.log(error);
			});
		},
		selsChange: function(sels) {
			this.sels = sels;
		},
		//批量删除
		batchRemove: function() {
			var ids = this.sels.map(item => item.id);
			console.log(ids);
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				http.del('/v1/game', { ids: ids }).then((res) => {
					this.listLoading = false;
					if (res.status == "OK") {
						this.$message({
							message: "批量删除题目成功！",
							type: "success"
						});
						this.getGames()
					} else {
						this.$message.error("批量删除题目失败!");
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
			if (res.status == 'OK') {
				this.form.photoUrl = res.result[0].url;
				this.imgUrl = path.API_PATH + res.result[0].url;
				console.log(this.imgUrl);
				this.$message.success('上传头像成功！');
			} else {
				console.log(res);
				this.$message.error('上传头像失败！请联系管理员');
			}
		},
	}
}
</script>

<style slot-scope="scope">
.avatar {
	width: 150px;
	height: 150px;
}
</style>