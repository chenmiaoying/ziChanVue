<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理 >></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="form" :model="form" label-width="60px" :inline="true">
        <el-form-item label="角色">
          <el-select @change="changeSelect" v-model="form.roleId" clearable placeholder="请选择">
            <el-option
              v-for="item in Roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学工号">
          <el-input clearable class="inputStyle" v-model="form.id" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
          <el-button type="primary" @click="showAddDialog" icon="el-icon-folder-add">新增</el-button>
          <el-button type="success" @click="editPVisible=true">修改默认密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table
        v-loading="userLoading"
        element-loading-text="拼命加载中"
        ref="singleTable"
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="id"
          label="学工号"
          width="120">
        </el-table-column>
        <el-table-column
          property="username"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          property="roleId"
          label="角色"
          :formatter="roleFormate"
        >
        </el-table-column>
        <el-table-column
          property="telephone"
          label="电话号码">
        </el-table-column>
        <el-table-column
          property="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          property="sex"
          width="80"
          label="性别">
        </el-table-column>
        <el-table-column
          property="address"
          label="地址">
        </el-table-column>
        <el-table-column
          width="200"
          label="操作">
          <template slot-scope="scope">
            <!--              修改-->
            <el-tooltip effect="dark" content="修改用户信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUserEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!--              删除-->
            <el-tooltip effect="dark" content="删除该用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!--              重置为初始密码-->
            <el-tooltip effect="dark" content="重置该用户密码" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-refresh-left" size="mini" @click="resetUserById(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationStyle">
        <el-pagination
          style="float: right"
          @current-change="handleCurrentChange"
          :current-page="this.limit"
          :page-size="this.offset"
          layout="total,sizes,prev, pager, next, jumper"
          :total="this.total">
        </el-pagination>
      </div>
    </el-card>
    <!--      修改用户信息对话框-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserDialogVisible"
      width="60%"
    >
      <!--        内容主体区域-->
      <el-form label-position='right' :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="100px"
                 @close="editUserDialogClosed">
          <!--          prop用与规则对应的字段要求-->
          <el-form-item label="学工号">
            <el-input v-model="editUserForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="username">
            <el-input v-model="editUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="editUserForm.roleId" clearable placeholder="请选择">
              <el-option
                v-for="item in Roles"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话号码" prop="telephone">
            <el-input v-model="editUserForm.telephone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="editUserForm.sex"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="editUserForm.address"></el-input>
          </el-form-item>
        </el-form>

      <!--        底部区域-->
      <span slot="footer" class="dialog-footer">
           <el-button @click="editUserDialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
    </el-dialog>
<!--    添加用户信息对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="30%" :before-close="addUserDialogClosed">
      <el-form :model="userForm" :rules="addUserFormRules" ref="addUserFormRef">
        <el-form-item label="工号" label-width="100px" prop="id">
          <el-input v-model="userForm.id" class="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="userForm.username" class="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="100px" prop="roleId">
          <el-select v-model="userForm.roleId" clearable placeholder="请选择">
            <el-option
              v-for="item in Roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域站点" label-width="100px" prop="arr">
          <el-cascader
            v-model="userForm.arr"
            :options="pointTreeData"
            :props="defaultPointParams"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <div v-model="tip" :v-if="tipFlag" class="tipClass">{{tip}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改用户默认密码"
      :visible.sync="editPVisible"
      width="30%" :before-close="pDialogClosed">
      <el-form :model="PForm" :rules="editPFormRules" ref="PFormRef">
        <el-form-item label="默认密码" label-width="100px" prop="password">
          <el-input v-model="PForm.password" class="inputStyle"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editDefaultPassword">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "PeopleManagement",
  data() {
    //验证邮箱的规则
    var checkEmail = (rule,value,cb) => {
      const regExpemail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regExpemail.test(value)){
        //合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱地址'))
    }
    //验证手机号码的规则
    var checkTel = (rule,value,cb) => {
      const regExpTel=/^(13[0-9]|14[57]|15[012356789]|17[678]|18[0-9]|166|198|199)[0-9]{8}$/
      if(regExpTel.test(value)){
        //合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      PForm:{
        password:''
      },
      form: {
        roleId: null,
        id: null
      },
      editPVisible:false,
      Role:{
        roleId:'',
        userRole:'',
        roleName:''
      },
      Roles:[],
      tableData: [],
      limit: 1,
      offset: 10,
      total: 1,
      editUserDialogVisible:false,
      addUserDialogVisible:false,
      addUsersDialogVisible:false,
      userForm:{
        id:null,
        username:null,
        roleId:null,
        arr:null,
        point:null
      },
      userLoading:true,
      editUserForm:{
        email:null
      },
      editPFormRules:{
        password:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ]
      },
      editUserFormRules:{
        username:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        roleId:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        sex:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        telephone:[
          {required:true,message:'该信息不可为空',trigger: 'blur'},
          {validator:checkTel,trigger: 'blur'}
        ],
        email:[
          {validator:checkEmail,trigger: 'blur'}
        ],
        address:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ]
      },
      addUserFormRules:{
        id:[{required:true,message:'该信息不可为空',trigger: 'blur'}],
        username:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        roleId:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        arr:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ]
      },
      defaultP:'',
      //提示语
      tip:'',
      tipFlag:false,
      number:1,
      pointTreeData:[],
      defaultPointParams: {
        label: 'pointName',
        value: 'id',
        children: 'children',
        checkStrictly: true
      }


    }
  },
  methods:{
    pDialogClosed(){
      this.$refs.PFormRef.resetFields()
      this.editPVisible=false
    },
    async onSubmit(){
      await this.selectUser(1)
    },
    addUser(){
      this.tip=''
      this.$refs.addUserFormRef.validate(async valid=>{
        if(!valid) return;
        const ind=this.userForm.arr.length
        this.userForm.point=this.userForm.arr[ind-1]
        const {data:res} =await this.$http.post('userInfo/add',this.userForm)
        if(!res.success){
          this.tip=res.message
          this.tipFlag=true
          return
        }
        this.$message.success(res.message)
        this.addUserDialogClosed()
        this.$nextTick(() => {
          this.selectUser(1)
        })
      })
    },
    aesEncode(str) {
      const CryptoJS = require("crypto-js");
      const key = CryptoJS.enc.Utf8.parse("cBssbHB3ZA==HKXT")
      let encryptedData = CryptoJS.AES.encrypt(str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return encryptedData.toString();
    },
    async editDefaultPassword(){
      this.$refs.PFormRef.validate(async valid=>{
        if(!valid) return
        let newP=this.aesEncode(this.PForm.password)
        const {data:res}=await this.$http.post("/defaultP/"+newP)
        if(!res.success) return this.$message.error(res.message)
        this.PForm.password=''
        this.editPVisible=false
        this.$message.success(res.message)
      })

    },
    //匹配角色名
    roleFormate(row){
      let result=''
      this.Roles.forEach(item =>{
        if(item.roleId === row.roleId)
        {
          result=item.roleName
        }
      })
      return result
    },
    //展示用户编辑会话框
    async showUserEditDialog(val){

      // const {data:res}=await this.$http.get("/userInfo/list/"+val)
      // if (!res.success){
      //   return this.$message.error(res.message)
      // }
      this.editUserForm=val
      this.editUserDialogVisible=true
    },
    editUserDialogClosed(){
      this.$refs.editUserFormRules.resetFields()
    },
    addUserDialogClosed(){
      this.$refs.addUserFormRef.resetFields()
      this.addUserDialogVisible = false
    },
    //提交修改之后的用户信息
    editUserInfo(){
      this.$refs.editUserFormRef.validate(async valid=> {
        if(!valid) return
        const {data:res}=await this.$http.post('/userInfo/update',this.editUserForm)
        if (!res.success) return this.$message.error(res.message)
        this.editUserDialogVisible=false
        this.$message.success(res.message)
        this.$nextTick(() => {
          this.selectUser(1)
        })
      })
    },
    async deleteUserById(val){
      //询问用户是否确认删除
      const info=await this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(info !== 'confirm') return this.$message.info("取消删除")
      await this.deleteUser(val)
      },
    changeSelect(){
      this.selectUser(1)
    },
    async deleteUser(id){
      this.form.id=""
      this.form.userRole=""
      const {data:res}=await this.$http.delete('/userInfo/delete/1/'+this.offset+'/'+id);
      if(!res.success) return this.$message.error(res.message)

      this.tableData = res.data.records
      this.total = res.data.total
      this.limit = res.data.current
      return this.$message.success(res.message)
    },
    async selectUser(val){
      const {data:res}=await this.$http.post('/userInfo/list/' + val + '/' + this.offset,this.form);
      this.tableData = res.data.records
      this.total = res.data.total
      this.limit = res.data.current
      this.userLoading=false
    },
    async handleCurrentChange(val){
      await this.selectUser(val)
    },
    async getRoles(){
      const {data:res}=await this.$http.get("/userRole/getAllRoles")
      if(!res.success) return this.$message.error("获取角色失败，请重新刷新页面")
      this.Roles=res.data
    },
    //展示添加用户对话框
    showAddDialog(){
      this.addUserDialogVisible=true
    },
    async pointTree(){
      const {data:res}=await this.$http.get('/point/tree')
      if(!res.success) return;
      this.pointTreeData=res.data
    },
    resetUserById(val){
      this.$confirm('此操作将会把该用户密码重置为初始密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetPwd(val)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        });
      });

    },
    async resetPwd(val){
      const {data:res}=await this.$http.post('/userInfo/reset/'+val);
      if(!res) return this.$message.error(res.message)
      this.$message.success(res.message)
    }
  },
  created() {
    this.userLoading=true
    this.selectUser(this.limit)
    this.getRoles()
    this.pointTree()
  }
}
</script>

<style lang="less" scoped>
.inputStyle{
  width: 222px!important;
}

.paginationStyle{
  margin-top: 10px;
  height: 20px;
}
.el-card{
  margin-bottom: 10px;
}
 .tipClass{
   color: #ff0000;
   margin-left: 100px;
 }
  .btnS{
    display: flex;
    justify-content: center;
    margin: 30px 50px 10px 50px;
  }
  .defaultP{
    .input{
      width: 20px!important;
    }
  }
</style>
