import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import UserList from './views/user/list.vue'
import echarts from './views/charts/echarts.vue'
import DogAddPage from './views/admin/dog/dog-add.vue';
import DogEditPage from './views/admin/dog/dog-edit.vue';
import DogListPage from './views/admin/dog/dog-list.vue';

let routes = [
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
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/list', component: UserList, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-circle-plus',
        leaf: true,//只有一个节点
        children: [
            { path: '/dog/add', component: DogAddPage, name: '犬类增加' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-circle-plus',
        leaf: true,//只有一个节点
        children: [
            { path: '/dog/list', component: DogListPage, name: '犬类管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        hidden: true,
        name: '',
        iconCls: 'el-icon-circle-plus',
        leaf: true,//只有一个节点
        children: [
            { path: '/dog/edit', component: DogEditPage, name: '犬类修改' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;