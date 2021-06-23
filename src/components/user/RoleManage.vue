<template>
  <div>
    <!--      面包屑区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理 >></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="form" :model="form" label-width="60px" :inline="true">
        <el-form-item label="角色">
          <el-select v-model="form.roleId" placeholder="请选择" clearable>
            <el-option
              v-for="item in roleData"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoles">查询</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-row class="buttonBox">
        <el-tooltip effect="dark" content="删除该角色,仅删除本页选中的角色" placement="top" :enterable="false">
          <el-button type="danger" round size="medium" @click="deleteRole">删除角色</el-button>
        </el-tooltip>
        <el-button type="success" round size="medium" @click="addRoleDialogVisible=true">添加角色</el-button>
      </el-row>
      <el-table v-loading="roleLoading" :data="roleData" border stripe ref="roleTable" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1==0 ? 'bdTop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.menuId">
<!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag>{{item1.menuLabel}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二级权限-->
              <el-col :span="19">
                <el-row :class="[i2==0 ? '' : 'bdTop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.menuId">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.menuLabel}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,i3) in item2.children" type="warning" :key="item3.menuId" closable @close="removeRightById(item3.menuId,scope.row.roleId)">
                      {{item3.menuLabel}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          :selectable="selectTable"
          width="55">
        </el-table-column>
        <el-table-column prop="roleId" label="ID" width="180"></el-table-column>
        <el-table-column prop="roleName" label="角色名" width="180"></el-table-column>
        <el-table-column prop="roleDescribe" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
               <!--           编辑-->
            <el-tooltip effect="dark" content="修改该角色权限" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" :disabled="scope.row.roleId === 1" @click="showEdit(scope.row.roleId)">编辑</el-button>
            </el-tooltip>
            <!--              删除-->
            <el-tooltip effect="dark" content="删除该角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="scope.row.roleId === 1" @click="getDeleteId(scope.row.roleId)">删除</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="给该角色分配权限" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <div class="paginationStyle">
        <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.limit"
          :page-size="this.offset"
          layout="total,sizes,prev, pager, next, jumper"
          :total="this.total">
        </el-pagination>
      </div>
    </el-card>
<!--    分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
      >
<!--      树形控件-->
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox node-key="menuId"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="getRightIds">确 定</el-button>
  </span>
    </el-dialog>
<!--    添加角色对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="30%"
      @close="addRoleDialogClosed"
    >
      <el-form ref="addRoleRef" :model="addRoleForm" :rules="addRoleRule" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色英文名" prop="userRole">
          <el-input v-model="addRoleForm.userRole"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDescribe">
          <el-input type="textarea" v-model="addRoleForm.roleDescribe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
    </el-dialog>
<!--    修改角色对话框-->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editRoleDialogVisible"
      width="30%"
      @close="editRoleDialogClosed"
    >
      <el-form ref="editRoleRef" :model="editRoleForm" :rules="editRoleRule" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色英文名" prop="userRole">
          <el-input v-model="editRoleForm.userRole"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDescribe">
          <el-input type="textarea" v-model="editRoleForm.roleDescribe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "RoleManage",
      data(){
          return{
            form:{
              roleId:null
            },
            roleData:[],
            // permission
            limit: 1,
            offset: 10,
            total: 0,
            roleSelection:[],
            deleteRoleId:null,
            //控制分配权限对话框的显示和隐藏
            setRightDialogVisible:false,
            //所有权限数据
            rightsList:[],
            //树形控件的属性绑定对象
            treeProps:{
              label:'menuLabel',
              children:'children'
            },
            //默认选中的节点Id值
            defKeys:[],
            roleId1:null,
            addRoleDialogVisible:false,
            editRoleDialogVisible:false,
            addRoleForm:{
              roleName:null,
              userRole:null,
              roleDescribe:null
            },
            roleLoading:true,
            editRoleForm:{},
            addRoleRule:{
              roleName:[
                {required:true,message:'该信息不可为空',trigger: 'blur'}
              ],
              userRole:[
                {required:true,message:'该信息不可为空',trigger: 'blur'}
              ]
            },
            editRoleRule:{
              roleName:[
                {required:true,message:'该信息不可为空',trigger: 'blur'}
              ],
              userRole:[
                {required:true,message:'该信息不可为空',trigger: 'blur'}
              ]
            }
          }
      },
      methods:{
          // 初始化角色列表
        async getRoles(){
          const {data:res}=await this.$http.post('/userRole/getRoles/' + this.limit + '/' + this.offset,this.form);
          if(!res.success) return this.$message.error(res.message)
          this.roleData=res.data.records
          this.total = res.data.total
          this.limit = res.data.current
          this.roleLoading=false;
        },
        //监听pagesize,改变每页显示的条数
        handleSizeChange(newSize){
          this.offset=newSize
          this.getRoles()
        },
        //页码值发生变化会触发事件
        handleCurrentChange(newPage){
          this.limit=newPage
          this.getRoles()

        },
        handleSelectionChange(val){
          this.roleSelection=val
        },
        async deleteRole(){
          let str=''
          if(this.roleSelection.length !==0){
            this.roleSelection.forEach(item =>{
              if(str==''){
                str+=item.roleId
              }else {
                str+=','+item.roleId
              }
            })
          }
          if(str !== ''){
            const {data:res}=await this.$http.delete("/userRole/deleteRole?param="+str)
            if(!res.success) return this.$message.error(res.message)
            await this.getRoles()
            this.$message.success(res.message)

          }else{
            if(this.deleteRoleId !== null){
              const {data:res}=await this.$http.delete("/userRole/deleteRole?param="+this.deleteRoleId)
              if(!res.success) return this.$message.error(res.message)
              await this.getRoles()
              this.$message.success(res.message)
            }else{
              this.$message.error("请勾选你想要选中的角色进行删除")
            }
          }
        },
        //得到删除roleId
        getDeleteId(val){
          this.deleteRoleId=val
          this.deleteRole()
        },
        //限制某一些角色不能删除
        selectTable(row,index){
          if(row.roleId === 1){
            return false
          }else{
            return true
          }
        },
        //根据Id删除对应的按钮权限
        async removeRightById(val,roleId){
          //弹框提醒用户是否要删除
          const confirm=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)

          if(confirm !== 'confirm'){
            return this.$message.info('取消了删除')
          }
          this.$message.info("已发送请求，请稍等")
          const {data:res}=this.$http.delete('/menu/deleteRight/'+val+'/'+roleId);

          if(!res.success){
            return this.$message.error(res.message)
          }
          this.$message.success(res.message)
          await this.getRoles()
        },
        //点击分配权限按钮
        async showSetRightDialog(val){
          this.roleId1=val.roleId
          const {data:res}=await this.$http.get("/menu/allMenus")
          if(!res.success) return this.$message.error(res.message)
          this.rightsList=res.data
          //递归得到二级目录的节点
          this.getLeafKeys(val,this.defKeys)

          this.setRightDialogVisible=true
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
        //监听权限分配对话框关闭事件
        setRightDialogClosed(){
          this.defKeys=[]
        },
        //为角色分配权限
        async getRightIds(){
          const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          const idStr = keys.join(',')
          const {data:res}=await this.$http.post('/menu/userRight/'+this.roleId1+'?idStr='+idStr)
          this.$message.info("成功发起请求")
          if(!res.success) return this.$message.error(res.message)
          this.setRightDialogVisible=false
          await this.getRoles()
          this.$message.success(res.message)
        },
        addRole(){
          this.$refs.addRoleRef.validate(async valid => {
            if(!valid) return

            const {data:res}=await this.$http.post("/userRole/addRole",this.addRoleForm)
            if(!res.success) return this.$message.error(res.message)
            this.addRoleDialogVisible=false
            this.$message.success(res.message)
            await this.getRoles()
          })
        },
        addRoleDialogClosed(){
          this.$refs.addRoleRef.resetFields()
        },
        editRoleDialogClosed(){
          this.$refs.editRoleRef.resetFields()
        },
        editRole(){
          this.$refs.editRoleRef.validate(async valid => {
            if(!valid) return

            const {data:res}=await this.$http.post("/userRole/updateRole",this.editRoleForm)
            if(!res.success) return this.$message.error(res.message)
            this.$message.success(res.message)
            await this.getRoles()
            this.editRoleDialogVisible=false
          })
        },
        async showEdit(val){
          const {data:res}=await this.$http.post("/userRole/getRole/"+val)
          if(!res.success) return this.$message.error(res.message)
          this.editRoleForm=res.data
          this.editRoleDialogVisible=true
        }

      },
      async created() {
          this.roleLoading=true
          await this.getRoles()
      }
    }
</script>

<style lang="less" scoped>
  .buttonBox{
    margin-bottom: 15px;
    margin-left: 32px;
  }
  .paginationStyle{
    margin-top: 10px;
    height: 20px;
  }
  .el-tag{
    margin: 7px;
  }
  .bdTop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }

</style>
