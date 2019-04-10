<template>
	<section>
		<el-row>
			<el-col :offset="8">
				<img :src="imgUrl==''?defaultPhotoUrl:imgUrl" class="img">
			</el-col>
		</el-row>
		<el-row class="title">
			<el-col :offset="7" >题目：{{game.content}}</el-col>
		</el-row>
		<el-row class="choice">
			<el-col :span="3" :offset="7"> <el-radio v-model="mychoice"  border size="medium" label="1">&nbsp;{{game.choiceOne}}</el-radio></el-col>
			<el-col :span="3" :offset="1"> <el-radio v-model="mychoice"  border size="medium" label="2">&nbsp;{{game.choiceTwo}}</el-radio></el-col>
		</el-row>
		<el-row class="choice">
			<el-col :span="3" :offset="7"><el-radio v-model="mychoice"  border size="medium" label="3">&nbsp;{{game.choiceThree}}</el-radio></el-col>
			<el-col :span="3" :offset="1"><el-radio v-model="mychoice"  border size="medium" label="4">&nbsp;{{game.choiceFour}}</el-radio></el-col>
		</el-row>
		<el-row class="choice">
			<el-col :span="3" :offset="9">
				<el-button type="primary" @click="selectedChoice()" v-if="canChoose">确定</el-button>
			</el-col>
		</el-row>
		<el-row  class="choice" v-if="showJudge">
			<el-col :span="2" :offset="8">
				 <img class="judge" src="../../assets/correct.png"  v-if="judge">
				 <img class="judge" src="../../assets/wrong.png"  v-if="!judge">
			</el-col>
			<el-col :span="3" class="tip">
			    <label v-if="judge">恭喜你，正确！</label>
				<label v-if="!judge">回答错误，请重新选择！</label>
			</el-col>
			<el-col :span="3" :offset="3" class="tip">
				<el-button type="primary" @click="nextGame()" v-if="!canChoose">下一题</el-button>
			</el-col>
		</el-row>
	</section>
</template>

<script>
import http from "@/api/http.js";
import path from "@/common/constants/path.js"
	export default {
		mounted(){
			this.loginUser = JSON.parse(sessionStorage.getItem("user"));
			console.log('当前登录用户：'+ this.loginUser)
			if(this.loginUser){
				this.getRandomGame();
			}
		},
		data() {
			return {
				game:{id: '',content: "",choiceOne: "",choiceTwo: "",choiceThree: "",choiceFour: "",rightChoice: "",photoUrl: ''},
				imgUrl:'',
				defaultPhotoUrl: path.API_PATH + 'image/default/default.jpg',
				mychoice:'',
				judge:false,
				showJudge:false,
				canChoose:true,
			}
		  
		},
		methods:{
			//获取用户收藏
			getRandomGame(){
				http.get('/v1/randomGame').then((res)=>{
					console.log(res);
					if(res.status == 'OK'){
						this.game = res.result;
						this.imgUrl = path.API_PATH + this.game.photoUrl;
					}else{
						this.$message.error("查询错误");
					}
				}).catch(error=>{
					console.error(error);
					this.$message.error('服务器出错，请联系管理员！');
      			})
			},
			//选择选项
			selectedChoice(){
				console.log('我的选择：' + this.mychoice);
				if(this.mychoice == ''){
					this.$message.warning("请先选择一个选项");
					return;
				}else{
					if(this.mychoice == this.game.rightChoice){
						this.judge = true;
						this.canChoose = false;
					}else{
						this.judge = false;
					}
					this.showJudge = true;
				}
			},
			//获取下一题
			nextGame(){
				this.mychoice='';
				this.judge=false;
				this.showJudge=false;
				this.canChoose=true;
				this.getRandomGame();
			}
		}
	}

</script>

<style>
.img{
	max-width: 400px;
	max-height: 400px;
	object-fit: cover;
}
.title{
	margin-top:20px;
	font-size: 20px;
}
.choice{
	margin-top:20px;
}
.judge{
	width: 150px;
	height: 150px;
}
.tip{
	margin-top:100px;
	font-size:15px;
	margin-left:20px;
	}
</style>
