<template slot-scope>
	<section>
		<el-form :model="queryForm" label-position="center" label-width="70px" style="margin-top:20px;">
			<el-row :gutter="20">
				<el-col :span="5">
					<el-form-item label="犬类品种">
						<el-input v-model="queryForm.breed" placeholder="请输入犬类品种名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="原产地">
						<el-input v-model="queryForm.original"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="体型">
						<el-select v-model="queryForm.shape" placeholder="体型">
							<el-option label="小型" value="小型"></el-option>
							<el-option label="中型" value="中型"></el-option>
							<el-option label="大型" value="大型"></el-option>
							<el-option label="超大型" value="超大型"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="毛长">
						<el-select v-model="queryForm.woolLength" placeholder="毛长">
							<el-option label="短毛" value="短毛"></el-option>
							<el-option label="长毛" value="长毛"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="功能">
						<el-select v-model="queryForm.function"  placeholder="功能">
							<el-option label="工作犬" value="工作犬"></el-option>
							<el-option label="看家犬" value="看家犬"></el-option>
							<el-option label="牧羊犬" value="牧羊犬"></el-option>
							<el-option label="玩赏犬" value="玩赏犬"></el-option>
							<el-option label="导盲犬" value="导盲犬"></el-option>
							<el-option label="搜索犬" value="搜索犬"></el-option>
							<el-option label="伴侣犬" value="伴侣犬"></el-option>
							<el-option label="雪橇犬" value="雪橇犬"></el-option>
							<el-option label="猎犬" value="猎犬"></el-option>
							<el-option label="梗类犬" value="梗类犬"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="平均寿命">
						<el-col :span="9">
								<el-input v-model="queryForm.minLife"></el-input>
						</el-col>
						<el-col :span="1">~</el-col>
						<el-col :span="9">
								<el-input v-model="queryForm.maxLife"></el-input>
						</el-col>
						<el-col :span="1">年</el-col>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="平均价格">
						<el-col :span="9" :offset="2">
								<el-input v-model="queryForm.minPrice"></el-input>
						</el-col>
						<el-col :span="1">~</el-col>
						<el-col :span="9">
								<el-input v-model="queryForm.maxPrice"></el-input>
						</el-col>
						<el-col :span="1">元</el-col>
					</el-form-item>	
				</el-col>
				<el-col :offset="2" :span="2">
					<el-button type="primary" round @click="queryDog()">查询</el-button>
				</el-col>
				<el-col :offset="1" :span="2">
					<el-button type="default" round @click="queryClear()">清空查询条件</el-button>
				</el-col>
			</el-row>
		</el-form>

		<div class="main-cons">
				<div class="div-photo" v-for="item of dogList">
					<img class="thumb" :src="item.url" @click="queryDogInfo(item.id)">
					<div class="photo-text">{{item.breed}}</div>
				</div>
		</div>
	</section>
</template>

<script>
import http from "@/api/http.js";
import path from "@/common/constants/path.js"
	export default {
	mounted(){
      this.loginUser = JSON.parse(sessionStorage.getItem("user"));
      if(this.loginUser.roleId == 0){
        this.$router.push({
          path:'/non-privileged'
        })
      }else{
		this.queryDog();
	  }
	},
		data() {
			return {
				queryForm:{breed:"",original:"",shape:"",woolLength:"",function:"",minLife:"",maxLife:"",minPrice:"",maxPrice:""},
				pageNum:1,
				pageSize:16,
				dogList:[],
			}
		  
		},
		methods:{
			//找狗
			queryDog(){
				this.dogList = [];
				let url = '/v1/dogs/' + this.pageNum + '/' + this.pageSize;
				http.post(url,this.queryForm).then((res)=>{
					console.log(res);
					if(res.status == 'OK'){
						for(let item of res.result){
							item.url = path.API_PATH + item.url;
							this.dogList.push(item);
						}
					}else{
						this.$message.error("查询错误");
					}
				}).catch(error=>{
					console.error(error);
					this.$message.error('服务器出错，请联系管理员！');
      			})
			},
			queryDogInfo(dogId){
				this.$router.push({
					path:'/dog/edit',
					query:{id:dogId}
				})
			},
			//清空查询条件
			queryClear(){

				this.queryForm={"breed":"","original":"","shape":"","woolLength":"","function":"","minLife":"",
				"maxLife":"","minPrice":"","maxPrice":""};
			}
		}
	}

</script>

<style>
	.main-cons{
		padding: 50px 0;
	}
	.div-photo{
		width:200px;
		height:220px;
		float:left;
		margin-top:10px;
		margin-bottom:5px;
		margin-left:20px;
		text-align:center;
		border-radius: 25px;
		border:solid 2px;
		border-color: #8FBC94;
		background-color:#8FBC94;
		object-fit:cover;
	}
	.thumb{
		width:100%;
		height:85%;
		object-fit:cover;
		border-radius: 25px;
	}
	.photo-text{
		text-align:center;
		font-size:13px;
		line-height:28px;
		color:#fff;
	}
</style>
