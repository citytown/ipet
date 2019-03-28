<template slot-scope>
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
               <el-tooltip class="item" effect="dark" content="点击收藏" placement="top" v-if="remark.collect== null">
                  <img class="collection" src="../../assets/nocollection.png" @click="collectionSubmit" v-if="remark.collect== null">
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
              <div class="dog-text">平均寿命：{{dog.minLife}}&nbsp;~&nbsp;{{dog.maxLife}}&nbsp;年</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="5">
            <img class="avatar" src= "https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=616a5025b03eb13544c7b0bd9e25cfee/58ee3d6d55fbb2fba27624df434a20a44723dc9a.jpg">
        </el-col>
      </el-row>
      <div class="dog-text">简介：</div>
      <el-row>
        <el-col :span="20">
          <div class="descri">{{dog.descrition}}</div>
        </el-col>
      </el-row>
      <el-row>
        <div class="dog-text">相册：</div>
      </el-row>
      <el-row>
        <el-col :span="20">
          <div class='photo'>
            <v-gallery :caption="true" :images="list" ></v-gallery>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="remarkVisible"
      width="30%"
      :before-close="handleClose">
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

  export default {
    computed: {},
    data() {
      return{
        dog:{id:'1',breed:'哈士奇',original:'西伯利亚',shape:'大型',woolength:'短毛',minLife:'10',maxLife:'15',minPrice:'1000'
        ,maxPrice:"2000",descrition:"雪橇犬（俄语：Сибирский хаски，英语：Siberian husky），常见别名哈士奇，昵称为二哈。西伯利亚雪橇犬体重介于雄犬20-27公斤，雌犬16-23公斤，身高大约雄犬肩高53-58厘米，雌犬51-56厘米，是一种中型犬。西伯利亚雪橇犬是原始的古老犬种，在西伯利亚东北部、格陵兰南部生活。哈士奇名字的由来，是源自其独特的嘶哑声。哈士奇性格多变，有的极端胆小，也有的极端暴力，进入大陆和家庭的哈士奇，都已经没有了这种极端的性格，比较温顺，是一种流行于全球的宠物犬。与金毛犬、拉布拉多并列为三大无攻击型犬类。被世界各地广泛饲养，并在全球范围内，有大量该犬种的赛事。"},
        
        list:[{title:'Image1',url:'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=01684b12841001e95a311c5dd9671089/aa18972bd40735fa44694c4297510fb30e2408ab.jpg'},
        {title:'Image2',url:'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=a2c7a0e0dd0735fa85fd46ebff3864d6/6a63f6246b600c338e9bdc33134c510fd8f9a16e.jpg'},
        {title:'Image3',url:'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=fbe9fef679cf3bc7fc0dc5beb069d1c4/80cb39dbb6fd52664cf63eefa218972bd507366f.jpg'},
        {title:'Image4',url:'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=1478e6cbb3a1cd1111bb7a72d87ba399/a8ec8a13632762d01ba7a644a9ec08fa503dc6b4.jpg'},
        {title:'Image5',url:'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=554b3d27d81b0ef478e5900cbcad3abf/6c224f4a20a44623f87ed06b9222720e0cf3d707.jpg'},
        {title:'Image2',url:'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=a2c7a0e0dd0735fa85fd46ebff3864d6/6a63f6246b600c338e9bdc33134c510fd8f9a16e.jpg'},
        {title:'Image3',url:'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=fbe9fef679cf3bc7fc0dc5beb069d1c4/80cb39dbb6fd52664cf63eefa218972bd507366f.jpg'},
        {title:'Image4',url:'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=1478e6cbb3a1cd1111bb7a72d87ba399/a8ec8a13632762d01ba7a644a9ec08fa503dc6b4.jpg'},
        {title:'Image5',url:'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=554b3d27d81b0ef478e5900cbcad3abf/6c224f4a20a44623f87ed06b9222720e0cf3d707.jpg'},
        {title:'Image2',url:'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=a2c7a0e0dd0735fa85fd46ebff3864d6/6a63f6246b600c338e9bdc33134c510fd8f9a16e.jpg'},
        {title:'Image3',url:'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=fbe9fef679cf3bc7fc0dc5beb069d1c4/80cb39dbb6fd52664cf63eefa218972bd507366f.jpg'},
        {title:'Image4',url:'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=1478e6cbb3a1cd1111bb7a72d87ba399/a8ec8a13632762d01ba7a644a9ec08fa503dc6b4.jpg'},
        {title:'Image5',url:'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=554b3d27d81b0ef478e5900cbcad3abf/6c224f4a20a44623f87ed06b9222720e0cf3d707.jpg'},
        {title:'Image2',url:'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=a2c7a0e0dd0735fa85fd46ebff3864d6/6a63f6246b600c338e9bdc33134c510fd8f9a16e.jpg'},
        {title:'Image3',url:'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=fbe9fef679cf3bc7fc0dc5beb069d1c4/80cb39dbb6fd52664cf63eefa218972bd507366f.jpg'},
        {title:'Image4',url:'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=1478e6cbb3a1cd1111bb7a72d87ba399/a8ec8a13632762d01ba7a644a9ec08fa503dc6b4.jpg'},
        {title:'Image5',url:'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=554b3d27d81b0ef478e5900cbcad3abf/6c224f4a20a44623f87ed06b9222720e0cf3d707.jpg'},
        ],
        remark:{id:'11',dogId:'11',userId:'213',collect:null,content:''},
        remarkVisible:false
     }
    },
    methods:{
      //收藏提交
      collectionSubmit(){
        console.log('我被出发');
        if(this.remark.collect == 1){
          this.remark.collect = null;
        }else{
          this.remark.collect = 1;
        }
      },
      //备注提交
      remarkSubmit(){

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
