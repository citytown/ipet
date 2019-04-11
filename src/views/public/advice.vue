<template >
	<section>
		<div class="main-cons">
			<div v-for="item in adviceList" :key="item.id" class="box">
				<el-col :span="5">
					<el-row>
						<img class="avatar" :src="item.avatarUrl">
					</el-row>
					<el-row>
						<div class="name">{{item.nickName}}</div>
					</el-row>
				</el-col >
				<el-col :span="19">
					<el-row class="date-txt">{{item.signDate}}</el-row>
					<el-row class="content-txt">{{item.content}}</el-row>
				</el-col>
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
				page:1,
				pageSize:0,//如果每页大小是0的话，则返回全部
				total:0,
				adviceList:[{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'},
				{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'},
				{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'},
				{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'},
				{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'},
				{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'},
				{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'},
				{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'},
				{id:'1',userId:'1',nickName:'苏大强',avatarUrl:'http://www.xinhuanet.com/politics/2019-04/02/1124313587_15541622213671n.jpg',content:'我不吃，我不喝，我就要钱，给我钱！',email:'sudaqiang@163.com',signDate:'2019-04-04 11:00:00'}],
			}
		  
		},
		methods:{
			handleCurrentChange(val) {
				this.page = val;
			},
		}
	}

</script>

<style >
	.main-cons{
		padding: 50px 0;
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
	}

</style>
