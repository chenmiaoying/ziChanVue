<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>资产入库 >></el-breadcrumb-item>
    </el-breadcrumb>
<!--    添加资产主体-->
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="单台入库" name="first">
          <el-form ref="formRef" :model="form" :rules="addFormRules" label-width="150px" >
            <el-form-item label="资产名称" prop="assetName">
              <el-input class="inputStyle" v-model="form.assetName"></el-input>
            </el-form-item>
            <el-form-item label="管理员工号" prop="hostId">
              <el-input class="inputStyle" v-model="form.hostId"></el-input>
            </el-form-item>
            <el-form-item label="管理员姓名" prop="assetHost">
              <el-input class="inputStyle" v-model="form.assetHost"></el-input>
            </el-form-item>
            <el-form-item label="资产使用人" prop="assetHost">
              <el-tooltip class="item" effect="light" content="新添加的资产使用人默认是资产管理员" placement="right">
                <el-input class="inputStyle" v-model="form.assetHost" disabled></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="资产状况" prop="assetCondition">
              <el-input class="inputStyle" v-model="form.assetCondition"></el-input>
            </el-form-item>
            <el-form-item label="资产类型" prop="arr">
              <el-cascader
                v-model="form.arr"
                placeholder="请选择"
                :options="typeData"
                :props="defaultParams"
                clearable></el-cascader>
            </el-form-item>
            <el-form-item label="资产所属区域站点" prop="arr2">
              <el-cascader
                v-model="form.arr2"
                :options="pointTreeData"
                :props="defaultPointParams"
                clearable></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button type="info" @click="resAsset">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="批量入库" name="second">
          <el-alert
            title="批量入库提示"
            type="info"
            description="请按照模板内容进行添加入库，否则入库不会成功"
            show-icon>
          </el-alert>
          <div class="uploadClass">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="uploadURL"
              :limit="3"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <el-button style="background-color: #e6a23c;color: #ffffff" type="info" size="small" plain @click="downloadTemplate">下载模板</el-button>
              <div slot="tip" class="el-upload__tip">只能上传2个.xlsx/.xls文件</div>
            </el-upload>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "AddAsset",
  data() {
    return {
      form: {
        assetName: '',
        hostId:'',
        userId:'',
        assetDelete: 0,
        assetHost: '',
        assetUser: '',
        assetCondition: '',
        assetType: '',
        assetCreatTime: '',
        assetBack: 1,
        assetDeletePeople: '',
        assetDeleteReason: '',
        arr:null,
        arr2:null
      },
      pointTreeData:[],
      defaultPointParams: {
        label: 'pointName',
        value: 'id',
        children: 'children',
        checkStrictly: true
      },
      addFormRules: {
        arr:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        arr2:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        assetCondition:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        assetName:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        assetHost:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ],
        hostId:[
          {required:true,message:'该信息不可为空',trigger: 'blur'}
        ]
      },
      assetType: [{
        value: '个人电脑',
        label: '个人电脑'
      }, {
        value: 'web应用',
        label: 'web应用'
      }, {
        value: '防火墙',
        label: '防火墙'
      }],
      typeData:[],
      //被激活的页签的名称
      activeName:'first',
      uploadURL: this.$http.defaults.baseURL+'asset/excel/upload',
      defaultParams: {
        label: 'assetType',
        value: 'id',
        children: 'children',
        checkStrictly: true
      },
      pointStr:null
    }
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate(async valid =>{
        if(!valid) return ;

        this.form.assetUser=this.form.assetHost
        this.form.userId=this.form.hostId

        if(this.form.arr.length !== 0){
          const ind=this.form.arr.length
          this.form.assetType=this.form.arr[ind-1]
        }
        this.pointStr=this.beIdsStrG(this.form.arr2);

        const {data:res}=await this.$http.post('/asset/add/'+this.pointStr,this.form);
        this.$message.success(res.message);
        this.resAsset();
      })
    },
    //点击取消之后内容重置
    resAsset(){
      this.$refs.formRef.resetFields();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    async treeType(){
      const {data:res}=await this.$http.get('/assetType/getTypeTree')
      if(!res.success) return;
      this.typeData=res.data
    },
    //上传文件到服务器
    submitUpload(){
      this.$refs.upload.submit();
    },
    async downloadTemplate(){
      const {data:res}=await this.$http.get('/asset/excel/template')

      if('undefined' != typeof res.success){
        return this.$message.error(res.message)
      }
      await this.exportExcel('/asset/excel/template',null,'批量存储资产excel模板')
    },
    async pointTree(){
      const {data:res}=await this.$http.get('/point/tree')
      if(!res.success) return;
      this.pointTreeData=res.data
    }
  },
  created() {
    this.pointTree()
    this.treeType()
  }
}
</script>

<style lang="less" scoped>
.inputStyle{
  width: 280px!important;
}
.el-form-item{
  margin-left: 130px;
}
.textStyle{
  width: 480px!important;
}
.item {
  margin: 4px;
}
  .uploadClass{
    margin-top: 30px;
    margin-bottom: 20px;
  }
</style>
