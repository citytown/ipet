<template>
	<section>
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
			console.log('当前登录用户：'+ this.loginUser)
			if(this.loginUser){
				this.queryCollections();
			}
		},
		data() {
			return {
				pageNum:1,
				pageSize:0,//如果每页大小是0的话，则返回全部
				dogList:[],
			}
		  
		},
		methods:{
			//获取用户收藏
			queryCollections(){
				console.log("获取我的收藏")
				this.dogList = [];
				let url = '/v1/collections/' + this.loginUser.id + "/" + this.pageNum + '/' + this.pageSize;
				http.get(url).then((res)=>{
					console.log(res);
					if(res.status == 'OK'){
						for(let item of res.result.rows){
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
					path:'/public/detail',
					query:{id:dogId}
				})
			},
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
		object-fit:cover
	}
	.photo-text{
		text-align:center;
		font-size:13px;
		line-height:28px;
		color:#fff;
	}
</style>
