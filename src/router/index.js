import Vue from 'vue'
import VueRouter from "vue-router";
import Login from "../views/Login";
import Register from "../views/Register";
import Home from "../views/Home";
import Welcome from "../views/Welcome";
import AddAsset from "../components/Asset/AddAsset";
import DeleteAssetQuery from "../components/Asset/DeleteAssetQuery";
import AssetLists from "../components/Asset/AssetLists";
import PeopleManagement from "../components/user/PeopleManagement";
import PeopleDetail from "../components/User/PeopleDetail";
import RoleManage from "../components/User/RoleManage";
import FirstLogin from "../views/FirstLogin";
import AssetBorrow from "../components/Asset/AssetBorrow";
import Check from "../components/Asset/Check";
import assetType from "../components/Asset/assetType";
import Log from "../components/Log/Log";
import Repair from "../components/Asset/Repair";
import Point from "../components/Asset/Point";
import AssetWei from "../components/Asset/AssetWei";
import LogManage from "../components/Log/LogManage";
import BuyCheck from "../components/Asset/BuyCheck";
import AssetBuy from "../components/Asset/AssetBuy";
import AssetBuyYes from "../components/Asset/AssetBuyYes";
import UserApply from "../components/User/UserApply";

//安装路由
//显示声明使用vueRouter
Vue.use(VueRouter);

//配置导出路由
const router=new VueRouter({
  mode:'history',
  routes:[
    {
      path: '/',
      redirect:'/home'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/register',
      component:Register
    },
    {
      path:'/home',
      component:Home,
      redirect: '/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path: '/list',component: AssetLists},
        {path: '/deleteAsset', component: DeleteAssetQuery},
        {path: '/peopleManagement', component: PeopleManagement},
        {path: '/peopleDetail', component: PeopleDetail},
        {path: '/addAsset', component: AddAsset},
        {path: '/roleManage', component: RoleManage},
        {path: '/borrowCheck',component: Check},
        {path: '/assetBorrow',component: AssetBorrow},
        {path: '/assetType',component: assetType},
        {path: '/syslog',component: Log},
        {path: '/repair',component: Repair},
        {path: '/point',component: Point},
        {path: '/weixiu',component: AssetWei},
        {path: '/logManage',component: LogManage},
        {path: '/buy',component: AssetBuyYes},
        {path: '/want',component: AssetBuy},
        {path: '/buyCheck',component: BuyCheck},
        {path: '/apply',component: UserApply}
        ]
    },
    {
      path: '/reset',
      component: FirstLogin
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to,from,next) => {
  /*
  to:将要访问的路径
  from：代表从哪个路径跳转而来
  next：是一个函数，表示放行
  nex()放行  next('')强制跳转的路径
   */
  const tokenStr=window.sessionStorage.getItem('token');
  const username=window.sessionStorage.getItem('username');
  if (to.path=='/login' || to.path=='/register'){
    if ((tokenStr !== null) && (username!==null)) {
      return next('/home')
    }else {
      return next();
    }
  }
  if(!tokenStr) return next('/login');
  if (to.path=='/reset') return next();
  if ((tokenStr !== null) && (username!==null)){
    next();
  }else{
    return next('/login');
  }
})
export default router
