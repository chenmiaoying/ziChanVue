<template>
  <div>
    <!--      面包屑区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人资料 >></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" id="cardColor">
      <div slot="header">
        <span>个人资料卡</span>
      </div>
      <div>
        <el-form label-width="100px" :model="peopleForm" ref="peopleFormRef" :rules="editPeopleRules">
          <el-form-item label="学工号 :" prop="userId">
            <div v-if="flag">{{peopleForm.id}}</div>
            <el-input v-model="peopleForm.id" v-else disabled></el-input>
          </el-form-item>
          <el-form-item label="名字 :" prop="username">
            <div v-model="peopleForm.username" v-if="flag">{{peopleForm.username}}</div>
            <el-input v-model="peopleForm.username" v-else></el-input>
          </el-form-item>
          <el-form-item label="性别 :" prop="sex">
            <div v-model="peopleForm.sex" v-if="flag">{{peopleForm.sex}}</div>
            <el-input v-model="peopleForm.sex" v-else></el-input>
          </el-form-item>
          <el-form-item label="电话号码 :" prop="telephone">
            <div v-model="peopleForm.telephone" v-if="flag">{{peopleForm.telephone}}</div>
            <el-input v-model="peopleForm.telephone" v-else></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址 :" prop="email">
            <div v-model="peopleForm.email" v-if="flag">{{peopleForm.email}}</div>
            <el-input v-model="peopleForm.email" v-else></el-input>
          </el-form-item>
          <el-form-item label="办公地址 :" prop="address">
            <div v-model="peopleForm.address" v-if="flag">{{peopleForm.address}}</div>
            <el-input v-model="peopleForm.address" v-else></el-input>
          </el-form-item>
        </el-form>
        <el-divider id="dividerColor"></el-divider>
        <div class="btnStyle">
          <el-button type="primary" v-if="flag" @click="ApplyR">申请权限</el-button>
          <el-button type="success" round @click="edit()" v-if="flag">修改</el-button>
          <div v-else>
            <el-button type="info" round @click="closeEdit">取消</el-button>
            <el-button type="primary" round @click="updatePeople">确定</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="申请权限"
      :visible.sync="applyRoleDialogVisible"
      width="50%" @close="closeApply">
      <el-form :model="applyRoleForm" :rules="applyRoleFormRules" ref="applyRoleFormRef" label-width="140px">
        <el-form-item label="申请工作描述" prop="applyRole">
          <el-input type="textarea" v-model="applyRoleForm.applyRole"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeApply">取 消</el-button>
        <el-button type="primary" @click="applyRoleT">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "PeopleDetail",
      created() {
        this.getPeopleDetail()
      },
      data(){
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
          return{
            applyRoleDialogVisible:false,
            applyRoleForm:{
              userId:'',
              username:'',
              applyRole:''
            },
            applyRoleFormRules:{
              applyRole:[{required:true,message:'该信息不可为空',trigger: 'blur'}]
            },
            peopleForm:{},
            flag:true,
            //修改用户填写规则
            editPeopleRules:{
              username:[
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
                {required:true,message:'该信息不可为空',trigger: 'blur'},
                {validator:checkEmail,trigger: 'blur'}
              ],
              address:[
                {required:true,message:'该信息不可为空',trigger: 'blur'}
              ]
            }

          }
      },
      methods:{
          async getPeopleDetail(){
            const {data:res}=await this.$http.post('/userInfo/peopleDetail')
            if (!res.success) return
            this.peopleForm=res.data
            this.applyRoleForm.userId=res.data.id
            this.applyRoleForm.username=res.data.username
          },
        edit(){
            this.flag=false
        },
        closeApply(){
            this.applyRoleForm.applyRole=''
          this.applyRoleDialogVisible=false
        },
        async applyRoleT(){
            const {data:res}=await this.$http.post('/apply/role',this.applyRoleForm)
          if(!res.success){
            return this.$message.error(res.message)
          }
          this.applyRoleDialogVisible=false
          this.$message.success(res.message)
        },
        ApplyR(){
            this.applyRoleDialogVisible=true
        },
        closeEdit(){
          this.flag=true
        },
        async updatePeople(){
          this.$refs.peopleFormRef.validate(async valid=> {
            if(!valid) return
            const {data:res}=await this.$http.post('/userInfo/updateMy',this.peopleForm)
            if (!res.success) return this.$message.error(res.message)
            this.flag=true
            this.$message.success(res.message)
            await this.getPeopleDetail()

          })
        }
      }

    }
</script>

<style lang="less">
  .btnStyle{
    display: flex;//弹性盒子模型
    justify-content: flex-end;
    height: 40px;
  }
  .el-card__header{
    background-color: #409EFF;
    box-shadow: 5px 0 1px #409EFF !important;
  }
  #cardColor{
    background-color: #DCDFE6;
  }
  #dividerColor{
    background-color: #409EFF;
    height: 2px;
  }
</style>
