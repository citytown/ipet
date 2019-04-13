<template>
	<section>
		<el-row>
			<el-col :offset="7" :span="6" style="text-align:center">
				<img :src="imgUrl==''?defaultPhotoUrl:imgUrl" class="img">
			</el-col>
		</el-row>
		<el-row >
			<el-col :offset="7" :span="6" class="gameTitle">题目：{{game.content}}</el-col>
		</el-row>
		<el-row class="choice">
			<el-col :span="4" :offset="6"> <el-radio v-model="mychoice"  border size="medium" label="1">&nbsp;{{game.choiceOne}}</el-radio></el-col>
			<el-col :span="3" :offset="1"> <el-radio v-model="mychoice"  border size="medium" label="2">&nbsp;{{game.choiceTwo}}</el-radio></el-col>
		</el-row>
		<el-row class="choice">
			<el-col :span="4" :offset="6"><el-radio v-model="mychoice"  border size="medium" label="3">&nbsp;{{game.choiceThree}}</el-radio></el-col>
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
			<el-col :span="4" class="tip">
			    <label v-if="judge">恭喜你，正确！</label>
				<label v-if="!judge">正确选项是：{{rightLabel}}</label>
			</el-col>
			<el-col :span="2" :offset="3" class="tip">
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
				rightLabel:'',//正确选项名称
			}
		  
		},
		methods:{
			//获取用户收藏
			getRandomGame(){
				http.get('/v1/randomGame').then((res)=>{
					if(res.status == 'OK'){
						this.game = res.result;
						this.imgUrl = path.API_PATH + this.game.photoUrl;
						if(this.game.rightChoice == 1){
							this.rightLabel = this.game.choiceOne;
						}else if(this.game.rightChoice == 2){
							this.rightLabel = this.game.choiceTwo;
						}else if(this.game.rightChoice == 3){
							this.rightLabel = this.game.choiceThree;
						}else if(this.game.rightChoice == 4){
							this.rightLabel = this.game.choiceFour;
						}
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
				if(this.mychoice == ''){
					this.$message.warning("请先选择一个选项");
					return;
				}else{
					if(this.mychoice == this.game.rightChoice){
						this.judge = true;
					}else{
						this.judge = false;
					}
					this.canChoose = false;
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
	min-width: 250px;
	min-height: 250px;
	max-width: 250px;
	max-height: 250px;
	object-fit: cover;
}
.gameTitle{
	margin-top:20px;
	font-size: 20px;
	text-align:center;
}
.choice{
	margin-top:20px;
	text-align: center;
}
.judge{
	width: 150px;
	height: 150px;
}
.tip{
	margin-top:100px;
	font-size:15px;
	margin-left:40px;
	}
</style>
