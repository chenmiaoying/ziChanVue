<template>
    <div class="login_container">
      <div class="login_box">
<!--        头像-->
        <div class="avatar_box">
          <img src="../assets/img/loginlogo.png" alt="">
        </div>
<!--        <div><el-link type="primary">主要链接</el-link></div>-->
<!--        登录表单-->
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="login_form">
<!--          :model绑定对象  v-model:绑定对象具体的元素-->
<!--          prop指定规则为username-->
          <el-form-item >
            <el-link type="primary" class="btns" :underline="false" href="/register">申请账号</el-link>
          </el-form-item>
          <el-form-item prop="id">
            <el-input v-model="loginForm.id" prefix-icon="iconfont icon-geren">
              <template slot="prepend">工&emsp;号</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-gongkai">
              <template slot="prepend">密&emsp;码</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" prefix-icon="iconfont icon-gongkai" style="width: 250px">
              <template slot="prepend">验证码</template>
            </el-input>
            <img :src="this.verificationImg" @click="acquireVerification" class="divIdentifyingCode">
<!--              <el-link>看不清？</el-link>-->

          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
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
          //这是登录表单的数据绑定对象
            return{
              loginForm:{
                username:'',
                password:'',
                code:''
              },
              //这是表单的验证规则对象
              loginFormRules:{
                //验证用户名是否合法
                id: [
                  { required: true, message: '请输入工号', trigger: 'blur' }
                ],
                //验证密码是否合法
                password: [
                  {required: true, message: '请输入密码', trigger: 'blur' }
                ],
                code:[
                  {required: true, message: '请输入验证码', trigger: 'blur' }
                ]
              },
              verificationImg:'',
              num:0,
              myUuid:''

            }
       },
        methods: {
          aesEncode(str) {
            const CryptoJS = require("crypto-js");
            const key = CryptoJS.enc.Utf8.parse("cBssbHB3ZA==HKXT")
            let encryptedData = CryptoJS.AES.encrypt(str, key, {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
            });
            return encryptedData.toString();
          },
          resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
          },
          login() {
            let data = {
              id: this.loginForm.id,
              password: this.aesEncode(this.loginForm.password)
            };
            this.$refs.loginFormRef.validate(async valid => {
              if (!valid) {
                return;
              }
              const {data: res} = await this.$http.post('/login?code='+this.loginForm.code+"&uuid="+this.myUuid, data);


              if (res.code === "200") {
                //登录成功之后token保存到sessionStorage
                window.sessionStorage.setItem("username", res.data)
                window.sessionStorage.setItem("token", res.token);
                //跳转到home
                await this.$router.push("/home");
                this.$message.success(res.msg)
              } else if (res.code === "2002") {
                window.sessionStorage.setItem("token", res.token);
                this.$message.success(res.msg)
                await this.$router.push("/reset");
              } else {
                this.$message.error(res.msg)
                this.acquireVerification()
              }
            })
          },

          acquireVerification() {
            // {responseType: 'blob'} ，不加这个返回的就是乱码
            //直接获取
            this.$http.get('/getVerifyCode', {responseType: 'blob'}).then((response) => {
              this.myUuid=response.headers.uuid
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
  .login_box{
    width: 450px;
    height: 350px;
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
  .divIdentifyingCode {
    position: absolute;
    width: 120px; /*设置图片显示的宽*/
    height: 100%; /*图片显示的高*/
    margin: 0 20px;
  }
</style>
