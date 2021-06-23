<template>
  <div class="login_container">
    <div class="register_box">
      <div class="register_title">申请账号</div>
      <div>
        <el-link type="primary" class="back_login" :underline="false" href="/login">返回登录页</el-link>
      </div>
      <el-form label-position='right' :model="registerForm" :rules="registerFormRules" ref="registerFormRef" label-width="90px" class="register_form">
        <!--          prop用与规则对应的字段要求-->
        <el-form-item label="工号" prop="id">
          <el-input v-model="registerForm.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="申请角色" prop="applyRole">
          <el-input v-model="registerForm.applyRole" placeholder="如果不清楚角色，可简单描述工作范围"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="telephone">
          <el-input v-model="registerForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="registerForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="办公地址" prop="address">
          <el-input v-model="registerForm.address"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="registerForm.code" style="width: 150px"></el-input>
          <img :src="this.verificationImg" @click="acquireVerification" class="divIdentifyingCode">
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="info" @click="quClose">取消</el-button>
          <el-button type="primary" @click="registerT">申请</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  // 行为区


  export default {
    name: "Register",
    data(){
      //验证邮箱的规则
      var checkEmail1 = (rule,value,cb) => {
        const regExpemail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(value === '' || value === null){
          return cb()
        }
        if(regExpemail.test(value)){
          //合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的邮箱地址'))
      }
      //验证手机号码的规则
      var checkTel1 = (rule,value,cb) => {
        const regExpTel=/^(13[0-9]|14[57]|15[012356789]|17[678]|18[0-9]|166|198|199)[0-9]{8}$/
        if(regExpTel.test(value)){
          //合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的手机号码'))
      }
      //这是登录表单的数据绑定对象
      return{
        registerForm:{
          id:null,
          username:null,
          applyRole: null,
          sex:null,
          telephone: null,
          email:null,
          address:null
        },
        verificationImg:'',
        registerFormRules:{
          id:[
            {required:true,message:'该信息不可为空',trigger: 'blur'}
          ],
          username:[
            {required:true,message:'该信息不可为空',trigger: 'blur'}
          ],
          applyRole:[
            {required:true,message:'该信息不可为空',trigger: 'blur'}
          ],
          sex:[
            {required:true,message:'该信息不可为空',trigger: 'blur'}
          ],
          telephone:[
            {required:true,message:'该信息不可为空',trigger: 'blur'},
            {validator:checkTel1,trigger: 'blur'}
          ],
          email:[
            {validator:checkEmail1,trigger: 'blur'}
          ],
          address:[
            {required:true,message:'该信息不可为空',trigger: 'blur'}
          ],
          code:[
            {required:true,message:'该信息不可为空',trigger: 'blur'}
          ]
        },
        myUuid2:''
      }
    },
    methods:{
      quClose(){
        this.registerForm.email=null
        this.$refs.registerFormRef.resetFields();
        this.$router.push('/login')
      },
      //注册
      async registerT(){
        this.$refs.registerFormRef.validate(async valid => {
          if(!valid) return;
          const {data:res}=await this.$http.post('/register?code='+this.registerForm.code+"&uuid="+this.myUuid2,this.registerForm)
          if(!res.success) {
            return this.$message.error(res.message)
            this.acquireVerification()
          }
          this.quClose()
          this.$message.success(res.message)
          this.$router.push('/login').catch(err =>err)
        })
      },
      acquireVerification() {
        // {responseType: 'blob'} ，不加这个返回的就是乱码
        //直接获取
        this.$http.get('/getVerifyCode', {responseType: 'blob'}).then((response) => {
          this.myUuid2=response.headers.uuid
          this.verificationImg = window.URL.createObjectURL(response.data)
        }).catch(error=>error);
      }
    },
    created() {
      this.acquireVerification()
    }

  }
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .register_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px 0 0;
    box-sizing: border-box;
  }
  .btns{
    display: flex;//弹性盒子模型
    justify-content: flex-end;
  }
  .register_box{
    width: 450px;
    height: 660px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;/*绝对位移*/
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .register_title{
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    padding: 20px 0;
  }
  .back_login{
    display: flex;
    justify-content: flex-end;
    padding: 0 20px;
  }
  .divIdentifyingCode {
    position: absolute;
    width: 120px; /*设置图片显示的宽*/
    height: 100%; /*图片显示的高*/
    margin: 0 20px;
  }
</style>
