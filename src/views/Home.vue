<template>
  <el-container class="home-container">
    <!--    头部区-->
    <el-header>
      <div>
        <span>资产管理系统</span>
      </div>
      <div>
        <i class="el-icon-user-solid"></i>
        <span v-model="username" class="user" icon="el-icon-user-solid">{{username}}</span>
        <el-button type="info" @click="loginout" size="mini">注销</el-button>
      </div>

    </el-header>
    <!--   页面主题区-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="closeOrOpen">|||</div>
        <!--        侧边栏菜单-->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
<!--          每个用户都拥有首页-->
          <el-menu-item index="/welcome">
            <i class="iconfont icon-shouye"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <!--          一级菜单-->
          <el-submenu :index="item.menuId+''" v-for="item in menuList" :key="item.menuId">
<!--            一级菜单的模板区域-->
            <template slot="title">
              <i :class="item.menuIcon"></i>
<!--              文本-->
              <span>{{item.menuLabel}}</span>
            </template>
<!--            二级菜单     -->
            <el-menu-item :index="subItem.menuUrl+''" v-for="subItem in item.children" :key="subItem.menuId" @click="subItem.menuUrl">
              <template slot="title">
                <!--图标-->
                <i :class="subItem.menuIcon"></i>
                <!--文本-->
                <span>{{subItem.menuLabel}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      右侧内容主体-->
      <el-main>
        <!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  created() {
    this.getMenuList()
    // this.activePath=window.sessionStorage.getItem('activePath')
    this.username=window.sessionStorage.getItem('username');
    this.getSum()
  },
  methods:{
    loginout(){
      this.$http.post("/logout")
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    closeOrOpen(){
      this.isCollapse = !this.isCollapse
    },
    activeMenu(path){
      window.sessionStorage.setItem('activePath',path)
    },
    //获取所有菜单
    async getMenuList(){
      const {data: res}=await this.$http.get('/menu/menus')
      if(!res.success) return this.$message.error("获取菜单失败")
      this.menuList=res.data
    }
  },
  data(){
    return {
      //左侧菜单数据
      menuList: [],
      isCollapse: false,
      activePath: '',
      username: ''
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #545c64;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fffdef;
  font-size: 30px;
  > div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #545c64;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #ffffff;
}
.toggle-button{
  background-color: #82848a;
  font-size: 12px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;//变成小手
}
  .user{
    font-size: 15px;
  }
  .el-button{
    margin-left: 30px;
  }
</style>
