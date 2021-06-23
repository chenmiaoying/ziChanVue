<template>
    <div class="login_container">
      <div class="login_box">
<!--        头像-->
        <div class="avatar_box">
          <img src="../assets/img/loginlogo.png" alt="">
        </div>
<!--        登录表单-->
        <el-form :model="resetForm" :rules="resetFormRules" ref="resetFormRef" class="login_form">
<!--          :model绑定对象  v-model:绑定对象具体的元素-->
<!--          prop指定规则为username-->
          <el-form-item prop="newPwd">
            <el-input type="password" v-model="resetForm.newPwd" prefix-icon="iconfont icon-gongkai">
              <template slot="prepend">新密码</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="isNewPwd">
            <el-input type="password" v-model="resetForm.isNewPwd" prefix-icon="iconfont icon-gongkai">
              <template slot="prepend">重新确认</template>
            </el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="resetPwd">确定</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>

        </el-form>
      </div>

    </div>
</template>

<script>
// 行为区


export default {
        name: "Login",
        data(){
          //验证两个密码一致
          var checkPwd = (rule,value,cb) => {
            if(this.resetForm.newPwd === value){
              //一直
              return cb()
            }
            cb(new Error('密码不一致'))
          }
          //这是登录表单的数据绑定对象
            return{
              resetForm:{
                newPwd:'',
                isNewPwd:''
              },
              //这是表单的验证规则对象
              resetFormRules:{
                //验证用户名是否合法
                newPwd: [
                  { required: true, message: '请重新设置密码', trigger: 'blur' },
                  { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                //验证密码是否一致
                isNewPwd: [
                  {required: true, message: '请重新输入新密码', trigger: 'blur' },
                  {validator:checkPwd,trigger: 'blur'}
                ]
              }

            }
       },
        methods:{
          aesEncode(str) {
            const CryptoJS = require("crypto-js");
            const key = CryptoJS.enc.Utf8.parse("cBssbHB3ZA==HKXT")
            let encryptedData = CryptoJS.AES.encrypt(str, key, {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
            });
            return encryptedData.toString();
          },
          resetLoginForm(){
            this.$refs.resetFormRef.resetFields();
          },
          resetPwd(){

            let pwd = {
              password1: this.aesEncode(this.resetForm.newPwd),
              password2: this.aesEncode(this.resetForm.isNewPwd)
            };
            this.$refs.resetFormRef.validate(async valid => {
              if (!valid){
                return;
              }
              if(pwd.password1 === pwd.password2){
                const {data: res}=await this.$http.post('/reset',{username:null,password:pwd.password2});

                if(res.code !== "200"){
                  return this.$message.error(res.msg)
                }
                this.$message.success(res.msg);
                //跳转到home
                this.$router.push("/login");
              }else {
                return this.$message.error('密码不一致')
              }
            })
          }
        }

    }
</script>

<style lang="less" scoped>
  .login_container{
  background-color: #2b4b6b;
  height: 100%;
}
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;/*绝对位移*/
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
      height: 130px;
      width: 130px;
      border:1px solid #ffffff;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #ffffff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns{
    display: flex;//弹性盒子模型
    justify-content: flex-end;
  }
</style>
