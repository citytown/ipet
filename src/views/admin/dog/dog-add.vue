<template slot-scope>
	<section>
		<el-row style="margin:20px;">
			<el-col :span="2">
				<el-button type="warning" @click="backPage">返回</el-button>					
			</el-col>
		</el-row>
		<el-row>
			<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:80%;min-width:600px;">
				<el-col :span="20" :offset="1">
					<el-row>
						<el-col :span="8">
							<el-form-item label="犬类品种">
								<el-input v-model="form.breed"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7" :offset="2">
							<el-form-item label="原产地">
								<el-input v-model="form.original"></el-input>
							</el-form-item>
						</el-col>
					</el-row >
					<el-row>
						<el-col :span="5">
							<el-form-item label="活动区域">
								<el-select v-model="form.shape" placeholder="体型">
									<el-option label="小型" value="小型"></el-option>
									<el-option label="中型" value="中型"></el-option>
									<el-option label="大型" value="大型"></el-option>
									<el-option label="超大型" value="超大型"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="毛长">
								<el-select v-model="form.woolLength" placeholder="毛长">
									<el-option label="短毛" value="短毛"></el-option>
									<el-option label="长毛" value="长毛"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="功能">
								<el-select v-model="funcSelected" multiple  placeholder="功能">
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
					<el-row>
						<el-col :span="9">
						<el-form-item label="平均寿命">
							<el-col :span="7">
									<el-input v-model="form.minLife"></el-input>
							</el-col>
							<el-col :span="4">
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~
							</el-col>
							<el-col :span="7">
									<el-input v-model="form.maxLife"></el-input>
							</el-col>
						</el-form-item>
						</el-col>
						<el-col :span="7">
						<el-form-item label="平均价格">
							<el-col :span="7" :offset="2">
									<el-input v-model="form.minPrice"></el-input>
							</el-col>
							<el-col :span="4">
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~
							</el-col>
							<el-col :span="7">
									<el-input v-model="form.maxPrice"></el-input>
							</el-col>
						</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="15" >
							<el-form-item label="犬类介绍">
								<el-input type="textarea" :rows="8" placeholder="请输入介绍内容" v-model="form.description"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="图片相册">
								<el-upload
								class="upload-demo"
								ref="batchUpload"
								multiple
								:action="uploadPhotosUrl"
								list-type="picture"
								:on-preview="handlePreview"
								:on-remove="handleRemove"
								:on-success="uploadPhotoSuccess"
								:file-list="fileList"
								:auto-upload="false">
								<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
								<el-button style="margin-left: 10px;" size="small" type="success" @click="submitBatchUpload">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
								</el-upload>
							</el-form-item>
						</el-col>
					</el-row>	
					<el-row style="padding-top:200px">
						<el-col :offset="24">
						<el-form-item>
							<el-button type="primary" @click="addSubmit">立即创建</el-button>
						</el-form-item>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="2">
					<el-row>
						<el-form-item prop="avatarUrl">
							<img  :src="avatarUrl==''?defaultPhotoUrl:avatarUrl" style="width:200px;height:200px">
						</el-form-item>
					</el-row>
					<el-row>
						<el-col :span="2" :offset="5">
							<el-form-item>
								<el-upload class="myavatar" ref="upload" :action="uploadAvatarUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload" :auto-upload="true"> 
									<el-button type="primary">点击上传封面图</el-button>
								</el-upload>
							</el-form-item>
						</el-col>
					</el-row>
				</el-col>
			</el-form>
	</el-row>
	</section>
</template>

<script>
import http from "@/api/http.js";
import path from "@/common/constants/path.js"
	export default {
		data() {
			return {
				form:{id:'',breed:'',original:'',shape:'',woolLength:'',function:''},
				uploadAvatarUrl:'',//上传封面地址
				uploadPhotosUrl:'',//上传相册地址
				defaultPhotoUrl: path.API_PATH + 'image/default/default.jpg',//默认照片
				avatarUrl:path.API_PATH + 'image/default/default.jpg',//默认照片,
				fileList: [],//狗照片相册列表
				photoList:[],
				funcSelected:[],
			}
		},
	//初始化
	mounted() {
		http.get('/v1/randomId').then(res=>{
        	console.log(res);
        	if(res.status == 'OK')
			this.form.id = res.result;
			this.uploadAvatarUrl="/v1/file/upload/dogAvatar/" + this.form.id;
			this.uploadPhotosUrl="/v1/file/upload/dogPhotos/" + this.form.id;
     		}).catch(error=>{
			console.error(error);
			this.$message.error('服务器出错，请联系管理员！');
      	})
	},	
	methods: {
		//提交狗
		addSubmit(){
			this.form.function = '';
			this.$confirm('是否确认此犬类信息', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					for(let i = 0;i< this.funcSelected.length;i++){
						if(i == 0){
							this.form.function =   this.funcSelected[i];
						}else{
							this.form.function =  this.form.function + "," + this.funcSelected[i];
						}
					}
					console.log(JSON.stringify(this.form));
					http.post('/v1/dog',this.form).then((res) => {
						if (res.status == "OK") {
							this.$message.success("添加成功!");
						}else{
							this.$message.error("添加失败!");
						}
					}).catch(err=>{
						this.$message.error("服务器出错");
					});
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

		//上传狗封面照片成功后
		handleAvatarSuccess(res, file) {
			if(res.status == 'OK'){
				this.avatarUrl = path.API_PATH + res.result[0].url;
				console.log(this.avatarUrl);
				this.$message.success('上传头像成功！');
			}else{
				console.log(res);
				this.$message.error('上传头像失败！请联系管理员');
			}
		},
		handleRemove(file, fileList) {
			console.log(file);
			let ids =[file.id];
			http.del('/v1/file/batchDel',{ids:ids}).then((res) => {
				if (res.status != "OK") {
					this.$message.error("删除图片失败!");
				}
			});
      	},
      	handlePreview(file) {
		},
		//上传狗相册
		uploadPhotoSuccess(res, file,fileList){//
			let uploading =false;
		 	for(let i = 0; i < fileList.length; i++){
				var upload = fileList[i];
			 	if(upload.status != 'success'){  //当所有照片都上传完后再进行相关操作
					uploading = true;
					break;
				}
			}
			if(!uploading){
				for(let i = 0; i < fileList.length; i++){
					var upload = fileList[i];
					let exist = false;
					let photo = {id:upload.response.result[0].id,name:upload.response.result[0].name,url:path.API_PATH+upload.response.result[0].url};
					for(let j = 0 ; j < this.fileList.length; j++){
						if(photo.id == this.fileList[j].id){
							exist = true;
							break;
						}
					}
					if(!exist){
						this.fileList.push(photo);
					}
				}	
			} 
		},
		submitBatchUpload(){
			this.$refs.batchUpload.submit();
		},
		//返回主页
		backPage(){
			this.$router.push({
				path:'/dog/list'
			})
		}
		  
	}
	}

</script>