<template >
	<section>
		<el-row>
			<el-col :offset="20"><el-button type="primary" @click="showForm()">提出建议</el-button></el-col>
		</el-row>
		<div class="main-cons">
				<div v-for="item in adviceList" :key="item.id" class="box">
					<el-col :span="5">
						<el-row>
							<img class="avatar" :src="item.avatarUrl">
						</el-row>
						<el-row>
							<div class="name">昵称：{{item.nickName}}</div>
						</el-row>
					</el-col >
					<el-col :span="19">
						<el-row class="date-txt">{{item.signDate}}</el-row>
						<el-row >
							<div class="content-txt">{{item.content}}</div>
						</el-row>
						<el-row v-if="loginUser.roleId == 1">
							<div class="email-txt">邮箱：{{item.email}}</div>
						</el-row>
					</el-col>
				</div>
		</div>
    <!--注册界面对话框-->
    <el-dialog
      title="意见反馈"
      :visible.sync="adviceFormVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form label-width="70px" :rules="adviceFormRules" ref="adviceForm" :model="adviceForm">
          <el-row>
            <el-form-item label="建议" prop="content">
              <el-input type="textarea" :rows="7"  v-model="adviceForm.content" placeholder="请输入你的反馈意见"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="邮箱" prop="email">
              <el-input type="text" v-model="adviceForm.email" placeholder="请输入你的联系邮箱"></el-input>
            </el-form-item>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="adviceFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="adviceSubmit" :loading="adding">提交</el-button>
      </div>
    </el-dialog>
	<!--工具条-->
	<el-col :span="24" class="toolbar">
		<el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="pageSize" :total="total" style="float:right;">
		</el-pagination>
	</el-col>
	</section>
</template>

<script>
import http from "@/api/http.js";
import path from "@/common/constants/path.js"
	export default {
		mounted(){
			this.loginUser = JSON.parse(sessionStorage.getItem("user"));
			console.log('当前登录用户：'+ sessionStorage.getItem("user"))
			if(this.loginUser){
				this.adviceForm.userId = this.loginUser.id;
				this.getAdviceList();
			}
		},
		data() {
			return {
				page:1,
				pageSize:10,//如果每页大小是0的话，则返回全部
				total:0,
				adviceList:[],
				adviceFormVisible:false,
				adviceForm:{id:'',userId:'',content:'',email:'',signDate:''},
				//adviceForm:{content:'',email:'',signDate:''},
				adviceFormRules: {
					content: [
						{
							required: true,
							message:'请输入你的建议与意见',
							trigger: "blur"
						}
					],
					email: [
						{
							type: 'email', 
							message: '请输入正确的邮箱地址', 
							trigger: ['blur', 'change'] 
						}
					],
				},
				adding:false,
			}
		  
		},
		methods:{
			//获取意见列表
			getAdviceList(){
				http.get("/v1/advices/"+this.page + "/" + this.pageSize).then(res=>{
					if(res.status == 'OK'){
						this.adviceList = res.result.rows;
						this.total = res.result.total;
					}
				}).catch(err=>{
					this.$message.error("服务器出错！");
				})
			},
			//换页
			pageChange(val) {
				this.page = val;
			},
			showForm(){
				this.adviceFormVisible = true;
				this.adding = false;
				this.adviceForm={id:'',userId:this.loginUser.id,content:'',email:'',signDate:''};
				this.$nextTick(()=>{
   				this.$refs.adviceForm.resetFields();
				})
			},
			//提交建议
			adviceSubmit(){
				this.adding = true;
				this.$refs.adviceForm.validate(valid=>{
					if(valid){
						 http.post("/v1/advice", this.adviceForm).then(res => {
              this.adding = false;
              if (res.status == "OK") {
                this.$message.success("反馈成功！");
              }
							this.getAdviceList();
              this.addLoading = false;
							this.adviceFormVisible = false;
            }).catch(error => {
              console.log(error);
              this.$message.error("服务器出错");
            }); 
					}else{
						console.log("error submit!!");
          				return false;
					}
				})
			}

		}
	}

</script>

<style >
	.main-cons{
		padding: 20px 0;
	}
	.box{
		width: 1500px;
    	height: 250px;
    	border-radius: 4px;
    	margin-left: 30px;
    	margin-top: 10px;
    	box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	}
	.avatar{
		width:150px;
		height:150px;
		object-fit:cover;
		border-style: solid;
    	border-width: 0.1em;
		border-color: #a39e9e;
	}
	.name{
		font-size: 15px;
    	margin-left: 70px;
    	margin-top: 10px;
	}
	.date-txt{
		padding-left: 1000px;
		padding-top: 20px;
    	font-size: 17px;
	}
	.content-txt{
		padding-top: 15px;
		font-size: 17px;
		position: absolute;
	}
	.email-txt{
		padding-left: 950px;
		margin-top:170px;
    	font-size: 17px;
	}

</style>
