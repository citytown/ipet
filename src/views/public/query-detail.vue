<template>
  <section>
    <div class="mycontainer">
      <el-row>
        <el-col :span="12">
          <el-row>
            <div class="breed">
              {{dog.breed}}
               <el-tooltip class="item" effect="dark" content="点击取消收藏" placement="top" v-if="remark.collect== 1">
                  <img class="collection" src="../../assets/collection.png" @click="collectionSubmit" v-if="remark.collect==1">
               </el-tooltip>
               <el-tooltip class="item" effect="dark" content="点击收藏" placement="top" v-if="remark.collect== 0">
                  <img class="collection" src="../../assets/nocollection.png" @click="collectionSubmit" v-if="remark.collect== 0">
               </el-tooltip>
               <el-button type="primary" @click="remarkVisible = true">笔记</el-button>
            </div>
          </el-row>
          <el-row>
            <el-col :span="10">
              <div class="dog-text">原产地：{{dog.original}}</div>
            </el-col>
            <el-col :span="10">
              <div class="dog-text">体型：{{dog.shape}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <div class="dog-text">毛长：{{dog.original}}</div>
            </el-col>
            <el-col :span="10">
              <div class="dog-text">平均价格：{{dog.minPrice}}&nbsp;~&nbsp;{{dog.maxPrice}}&nbsp;元</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <div class="dog-text">功能：{{dog.function}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <div class="dog-text">平均寿命：{{dog.minLife}}&nbsp;~&nbsp;{{dog.maxLife}}&nbsp;年</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="5">
            <img class="avatar" :src= "avatarUrl">
        </el-col>
      </el-row>
      <div class="dog-text">简介：</div>
      <el-row>
        <el-col :span="20">
          <div class="descri">{{dog.description}}</div>
        </el-col>
      </el-row>
      <el-row>
        <div class="dog-text">相册：</div>
      </el-row>
      <el-row>
        <el-col :span="20">
          <div class='photo'>
            <v-gallery :caption="true" :images="photos" ></v-gallery>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="remarkVisible"
      width="30%"
    >
      <el-input type="textarea" :rows="4" placeholder="请输入你的笔记" v-model="remark.content"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkVisible = false">取 消</el-button>
        <el-button type="primary" @click="remarkSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import http from '@/api/http.js';
import collection from '@/assets/collection.png'
import path from "@/common/constants/path.js"

  export default {
    //初始化
    mounted() {
      this.loginUser = JSON.parse(sessionStorage.getItem("user"));
      console.log('当前登录用户：'+ this.loginUser)
      if(this.$route.query.id == undefined){
        this.$router.push({
          path:'/public/home'
        })
      }else{
        console.log('狗 id：'+ this.$route.query.id);
        this.dog.id = this.$route.query.id;
        this.getDogInfo();
        this.getRemarkInfo();
      }
    },	
    data() {
      return{
        loginUser:{},
        dog:{id:'',breed:'',original:'',shape:'',woolength:'',minLife:'',maxLife:'',minPrice:'',maxPrice:"",descrition:""},
        defaultPhotoUrl: path.API_PATH + 'image/default/default.jpg',//默认照片
        avatarUrl:path.API_PATH + 'image/default/default.jpg',//默认照片,
        photos:[],
        remark:{id:'',dogId:'',userId:'',collect:0,content:''},
        remarkVisible:false
     }
    },
    methods:{
		//获取狗信息
		getDogInfo(){
			http.get('/v1/dog/'+this.dog.id).then(res=>{
				if(res.status == 'OK'){
          console.log(res)
					this.dog = res.result.dogInfo;
					this.funcSelected = this.dog.function.split(",");
					let photos = res.result.photos;
					if(photos !=''){
						if(photos[0].isCover == 1){
							this.avatarUrl = path.API_PATH + photos[0].url;
							photos.splice(0,1);
						}
						for(let item of photos){
							let photo ={title:item.name,url:path.API_PATH + item.url};
							this.photos.push(photo);
						}
					}
					console.log(JSON.stringify(this.photos));
				}else{
					this.$message.error("查询失败");
				}
			}).catch(err=>{
				this.$message.error("服务器出错");
				console.log(err);
			})
    },
    //获取当前用户对该犬类的备注收藏信息
    getRemarkInfo(){
      http.get("/v1/collectionAndMark/"+this.loginUser.id + "/" + this.dog.id).then(res=>{
        if(res.status == 'OK'){
          this.remark = res.result;
          console.log(this.remark);

        }else{
          this.$message.error("查询备注收藏出错");
        }
      }).catch(err=>{
        this.$message.error("服务器出错");
      })
    },
      //收藏提交
      collectionSubmit(){
        if(this.remark.collect == 1){
          this.remark.collect = 0;
        }else{
          this.remark.collect = 1;
        }
        http.put("/v1/collection",this.remark).then(res=>{
          console.log(res);
          if(res.status == 'OK'){
            this.$message.success("操作成功");
          }else{
            this.$message.error("操作失败");
          }
        }).catch(err=>{
          this.$message.error("服务器出错");
        })
      },
      //备注提交
      remarkSubmit(){
        http.put("/v1/mark",this.remark).then(res=>{
          console.log(res);
          if(res.status == 'OK'){
            this.$message.success("添加笔记成功");
            this.remarkVisible = false;
          }else{
            this.$message.error("添加笔记失败");
          }
        }).catch(err=>{
          this.$message.error("服务器出错");
        })
      }
    }
  }

</script>
<style>
.mycontainer{
  margin-left:20px;
  margin-top:20px;
}
.breed{
  font-size: 40px;
}
.dog-text{
  font-size: 25px;
  padding-top: 40px;
}
.avatar{
  width:250px;
  height: 250px;
  margin-top: 30px;
  border-radius: 20px;
  margin-left: 20px;
  object-fit: cover;
}
.descri{
  padding-top: 30px;
  font-size: 20px;
  text-indent: 2em;
}
.photo{
  padding-top: 20px;
}
.collection{
  padding-left: 10px;
  width: 4%;
  height: 4%;
}
</style>
