import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'

//无权限页面
import NonePrivileged from   './views/non-privileged.vue'

//公共模块
import PublicHome from   './views/public/query-home.vue'
import PublicDetail from   './views/public/query-detail.vue'
import Collection from   './views/public/collection.vue'
import Game from   './views/public/public-game.vue'
import Advice from   './views/public/advice.vue'
//管理员模块
import UserList from   './views/admin/user/list.vue'
import DogAddPage from './views/admin/dog/dog-add.vue';
import DogEditPage from './views/admin/dog/dog-edit.vue';
import DogListPage from './views/admin/dog/dog-list.vue';
import AdminGame from './views/admin/game/game.vue';


let routes = [

    {
        path: '/',
        component: Home,
        name: '主页',
        iconCls: 'el-icon-message',//图标样式class
        hidden:true,
    },
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },

    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf:true,
        children: [
            { path: '/public/home', component: PublicHome, name: '犬类查询' },
            { path: '/public/detail', component: PublicDetail, name: '犬类详情',hidden:true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf:true,
        children: [
            { path: '/public/game', component: Game, name: '猜狗游戏' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/public/collection', component: Collection, name: '我的收藏' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '犬类管理',
        iconCls: 'el-icon-circle-plus',
        children: [
            { path: '/dog/list', component: DogListPage, name: '犬类信息的删改' },
            { path: '/dog/add', component: DogAddPage, name: '犬类增加' },
            { path: '/dog/edit', component: DogEditPage, name: '犬类修改' ,hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/user/list', component: UserList, name: '用户管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/game/list', component: AdminGame, name: '游戏管理' },
            {path: '/non-privileged',component: NonePrivileged,name: '无权限页面',hidden:true},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/public/advice', component: Advice, name: '反馈与建议' },
        ]
    },
   
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;