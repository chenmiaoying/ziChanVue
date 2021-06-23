<template>
  <div>
    <!--      面包屑区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户申请 >></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tabs type="border-card">
        <el-tab-pane label="账号申请">
          <el-form ref="form1" :model="form1" label-width="60px" :inline="true">
            <el-form-item label="工号">
              <el-input v-model="form1.id" class="inputStyle" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="form1.username" class="inputStyle" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit1" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
          <!--        申购列表区域-->
          <el-table v-loading="loading"
                    element-loading-text="拼命加载中"
                    border stripe :data="accountData" >
            <el-table-column type="expand">
              <template slot-scope="props">
                <span style="size: 12px;font-weight:bold">权限申请信息</span>
                <el-divider><i class="el-icon-s-check"></i></el-divider>
                <div class="detailDiv">
                  申请人工号:&nbsp;&nbsp;&nbsp;{{props.row.id}}<br/>
                  申请人姓名:&nbsp;&nbsp;&nbsp;{{props.row.username}}<br/>
                  申请角色:&nbsp;&nbsp;&nbsp;{{props.row.applyRole}}<br/>
                  申请人性别:&nbsp;&nbsp;&nbsp;{{props.row.sex}}<br/>
                  申请人邮箱:&nbsp;&nbsp;&nbsp;{{props.row.email}}<br/>
                  申请人电话号码:&nbsp;&nbsp;&nbsp;{{props.row.telephone}}<br/>
                  申请办公地点:&nbsp;&nbsp;&nbsp;{{props.row.applyTime}}<br/>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column label="申请人" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="申请人工号" prop="id" show-overflow-tooltip></el-table-column>
            <el-table-column label="性别" prop="sex" show-overflow-tooltip></el-table-column>
            <el-table-column label="申请时间" prop="applyTime" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="电话号码" prop="telephone" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="办公地址" prop="address" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="申请权限说明" prop="applyRole" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showAllowApply(scope.row.id)">同意</el-button>
                <el-button type="danger" size="mini" @click="refuseApply(scope.row.id)">拒绝</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--        分页-->
          <el-pagination
            @size-change="applyAccountHandleSizeChange"
            @current-change="applyAccountHandleCurrentChange"
            :current-page.sync="limit1"
            :page-size="offset1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="权限申请">
          <el-form ref="form2" :model="form2" label-width="60px" :inline="true">
            <el-form-item label="工号">
              <el-input v-model="form2.id" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="form2.username" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit2" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
          <!--      卡片视图区-->
          <el-card>

            <!--        申购列表区域-->
            <el-table v-loading="loading"
                      element-loading-text="拼命加载中"
                      border stripe :data="roleData" >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <span style="size: 12px;font-weight:bold">权限申请信息</span>
                  <el-divider><i class="el-icon-shopping-cart-full"></i></el-divider>
                  <div class="detailDiv">
                    申请人工号:&nbsp;&nbsp;&nbsp;{{props.row.userId}}<br/>
                    申请人姓名:&nbsp;&nbsp;&nbsp;{{props.row.username}}<br/>
                    申请时间:&nbsp;&nbsp;&nbsp;{{props.row.applyTime}}<br/>
                    申请权限说明:&nbsp;&nbsp;&nbsp;{{props.row.applyRole}}<br/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column label="申请人" prop="username" show-overflow-tooltip></el-table-column>
              <el-table-column label="申请人工号" prop="userId" show-overflow-tooltip></el-table-column>
              <el-table-column label="申请时间" prop="applyTime" sortable show-overflow-tooltip></el-table-column>
              <el-table-column label="申请权限说明" prop="applyRole" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="showAllowApplyRole(scope.row.userId)">同意</el-button>
                  <el-button type="danger" size="mini" @click="refuseApplyRole(scope.row.id)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--        分页-->
            <el-pagination
              @size-change="applyRoleHandleSizeChange"
              @current-change="applyRoleHandleCurrentChange"
              :current-page.sync="limit"
              :page-size="offset"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      title="同意账号申请"
      :visible.sync="userInfoDialogVisible"
      width="40%" @close="allowClose"
    >
      <!--        内容主体区域-->
      <el-form label-position='right' :model="userInfo" :rules="userInfoRules" ref="userInfoRef" label-width="200px"
               >
        <!--          prop用与规则对应的字段要求-->
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="userInfo.roleId" placeholder="请选择">
            <el-option
              v-for="item in Roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户所属区域站点" prop="arr" placeholder="请选择">
          <el-cascader
            v-model="userInfo.arr"
            :options="pointTreeData"
            :props="defaultPointParams"
            ></el-cascader>
        </el-form-item>
      </el-form>

      <!--        底部区域-->
      <span slot="footer" class="dialog-footer">
           <el-button @click="allowClose">取 消</el-button>
           <el-button type="primary" @click="allowApply">确 定</el-button>
        </span>
    </el-dialog>
    <!--    分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="applyRoleDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <!--      树形控件-->
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox node-key="menuId"
               default-expand-all
               :default-checked-keys="defKeys1"
               ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
    <el-button @click="applyRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allowApplyRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "UserApply",
    data(){
      return{
        loading:true,
        roleData:[],
        limit:1,
        offset:10,
        total:0,
        limit1:1,
        offset1:10,
        total1:0,
        form1:{
          id:'',
          username:''
        },
        form2:{
          id:'',
          username:''
        },
        userInfo:{
          id:'',
          roleId:null,
          point:null,
          arr:[]
        },
        applyR:{
          roleId:null,
          menuStr:''
        },
        defaultPointParams: {
          label: 'pointName',
          value: 'id',
          children: 'children',
          checkStrictly: true
        },
        pointTreeData:[],
        userInfoRules:{
          roleId: [{required:true,message:'该信息不可为空',trigger: 'blur'}],
          arr: [{required:true,message:'该信息不可为空',trigger: 'blur'}]
        },
        userInfoDialogVisible:false,
        Roles:[],
        accountData:[],
        applyRoleDialogVisible:false,
        //所有权限数据
        rightsList:[],
        //树形控件的属性绑定对象
        treeProps:{
          label:'menuLabel',
          children:'children'
        },
        //默认选中的节点Id值
        defKeys1:[],
        myRole:[],
        uId:null
      }
    },
    methods:{
      async getApplyRole(val){
        const {data:res}=await this.$http.post('/apply/role/'+val+'/'+this.offset,this.form2)
        this.loading=false
        if(!res.success) return this.$message.error(res.message)
        this.roleData = res.data.records
        this.total = res.data.total
        this.limit = res.data.current
      },
      async getApplyAccount(val){
        const {data:res}=await this.$http.post('/apply/account/'+val+'/'+this.offset,this.form1)
        this.loading=false
        if(!res.success) return this.$message.error(res.message)
        this.accountData = res.data.records
        this.total1 = res.data.total
        this.limit1 = res.data.current
      },
      //监听权限分配对话框关闭事件
      setRightDialogClosed(){
        this.defKeys1=[]
      },
      //监听pagesize,改变每页显示的条数
      applyRoleHandleSizeChange(newSize){
        this.offset=newSize
        this.getApplyRole(1)
      },

      //页码值发生变化会触发事件
      applyAccountHandleCurrentChange(newPage){
        this.getApplyAccount(newPage)
      },
      //监听pagesize,改变每页显示的条数
      applyAccountHandleSizeChange(newSize){
        this.offset=newSize
        this.getApplyAccount(1)
      },
      //页码值发生变化会触发事件
      applyRoleHandleCurrentChange(newPage){
        this.getApplyRole(newPage)
      },
      onSubmit2(){
        this.loading=true
        this.getApplyRole(1)
      },
      onSubmit1(){
        this.loading=true
        this.getApplyAccount(1)
      },
      refuseApply(val){
        this.userInfo.id=val
        this.apply(0)
      },
      refuseApplyRole(val){
        this.applyRole(0,val,'')
      },
      allowApplyRole(val){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        this.applyRole(1,val,idStr)
      },
      async showAllowApplyRole(id){
        await this.getUserRole(id)
        this.applyRoleDialogVisible=true
        //递归得到二级目录的节点
        this.getLeafKeys(this.myRole,this.defKeys1)
      },
      //通过递归获取所有角色下的二级权限的id
      getLeafKeys(node,arr){
        if(node.children.length===0){
          return arr.push(node.menuId)
        }

        node.children.forEach(item => {
          this.getLeafKeys(item,arr)
        })
      },
      async getUserRole(id){
        const {data:res}=await this.$http.post("/apply/myMenu/"+id)
        this.$message.info("正在获取该用户现有权限，请稍后~")
        if(!res.success) return this.$message.error(res.message)
        this.myRole=res.data
      },
      async getAllMenus(){
        const {data:res}=await this.$http.get("/menu/allMenus")
        if(!res.success) return this.$message.error(res.message)
        this.rightsList=res.data
      },
      async apply(val){
        const {data:res}=await this.$http.post('/apply/sureAccount/'+val,this.userInfo)
        if(!res.success) return this.$message.error(res.message)
        if(this.total%this.offset==1){
          await this.getApplyAccount(this.limit-1)
        }else {
          await this.getApplyAccount(this.limit)
        }
      },
      async applyRole(flag,val,str){
        const {data:res}=await this.$http.post('/apply/sureRole/'+flag+'/'+val+'?idStr='+str)
        if(!res.success) return this.$message.error(res.message)
        this.$message.info("成功发起请求")
        if(this.total%this.offset==1){
          await this.getApplyAccount(this.limit-1)
        }else {
          await this.getApplyAccount(this.limit)
        }
      },
      async pointTree(){
        const {data:res}=await this.$http.get('/point/tree')
        if(!res.success) return;
        this.pointTreeData=res.data
      },
      async getRoles(){
        const {data:res}=await this.$http.get("/userRole/getAllRoles")
        if(!res.success) return this.$message.error("获取角色失败，请重新刷新页面")
        this.Roles=res.data
      },
      showAllowApply(val){
        this.userInfo.id=val
        this.userInfoDialogVisible=true
      },
      allowApply(){
        this.$refs.userInfoRef.validate(valid=>{
          if(!valid) return;
          const ind=this.userInfo.arr.length
          this.userInfo.point=this.userInfo.arr[ind-1]
          this.apply(1)
          this.userInfoDialogVisible=false
        })
      },
      allowClose(){
        this.$refs.userInfoRef.resetFields()
        this.userInfoDialogVisible=false
      }

    },
    created() {
      this.getApplyRole(1)
      this.getApplyAccount(1)
      this.pointTree()
      this.getRoles()
      this.getAllMenus()
    }
  }
</script>

<style lang="less" scoped>
  .add {
    .el-input {
      width: 420px;
    }
  }
  .el-table{
    margin-top: 15px;
    font-size: 13px;
  }
  .el-pagination{
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
  .detailDiv{
    padding-left:4em;
    margin-top: 4px;
    line-height: 25px;
  }
  .inputStyle{
    width: 200px!important;
  }
</style>
