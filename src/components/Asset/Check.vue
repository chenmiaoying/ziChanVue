<template>
  <div>
    <!--      面包屑区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>审核</el-breadcrumb-item>
      <el-breadcrumb-item>借用审核 >></el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区-->
    <el-card>
      <el-form ref="formRef" :model="borrowCheckForm" label-width="60px" :inline="true">
        <el-form-item label="资产名">
          <el-input placeholder="支持模糊查询" clearable v-model="borrowCheckForm.assetName"></el-input>
        </el-form-item>
        <el-form-item label="发起人">
          <el-input placeholder="支持模糊查询" clearable v-model="borrowCheckForm.startPeople"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="borrowCheckForm.status" placeholder="请选择" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Search" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-tabs v-model="activeName" type="border-card" @tab-click="TabhandleClick">
      <el-tab-pane label="借用待审核工单" name="first">
        <el-card>
          <el-table
            v-loading="firstLoading"
            element-loading-text="拼命加载中"
            ref="checkTableRef"
            stripe
            border
            :data="borrowCheckData"
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="bcId"
              label="工单号"
              width="80">
            </el-table-column>
            <el-table-column
              property="startPeople"
              label="发起人"
              width="80">
            </el-table-column>
            <el-table-column
              property="applyTime"
              label="发起时间">
            </el-table-column>
            <el-table-column
              property="expReturnTime"
              label="预计归还时间"
              :formatter="myTime"
            >
            </el-table-column>
            <el-table-column
              property="assetName"
              label="资产名称"
              width="100"
            >
            </el-table-column>
            <el-table-column
              property="status"
              label="借用/延期原因"
              :formatter="myReason"
              >
            </el-table-column>
            <el-table-column
              property="status"
              label="工单状态">
              <template slot-scope="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{getStatusText(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="审批">
              <template slot-scope="scope">
                <!--              修改-->
                <el-tooltip effect="dark" content="同意该工单的借用" placement="top" :enterable="false">
                  <el-button type="primary" size="mini" @click="allowThis(scope.row.bcId)">同意</el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="拒绝该工单的借用" placement="top" :enterable="false">
                  <el-button type="danger" size="mini" @click="showDig(scope.row.bcId)">拒绝</el-button>
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>

          <div class="paginationStyle">
            <el-pagination
              style="float: right"
              @current-change="borrowHandleCurrentChange"
              @size-change="borrowHandleSizeChange"
              :current-page="this.limit"
              :page-size="this.offset"
              layout="total,sizes,prev, pager, next, jumper"
              :total="this.total">
            </el-pagination>
          </div>

        </el-card>
      </el-tab-pane>
      <el-tab-pane label="归还待确认工单" name="second">
        <el-card>
          <el-table
            v-loading="firstLoading"
            element-loading-text="拼命加载中"
            ref="checkTableRef"
            stripe
            border
            :data="borrowCheckData"
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="bcId"
              label="工单号"
              width="80">
            </el-table-column>
            <el-table-column
              property="startPeople"
              label="发起人"
              width="80">
            </el-table-column>
            <el-table-column
              property="applyTime"
              label="发起时间">
            </el-table-column>
            <el-table-column
              property="expReturnTime"
              label="预计归还时间">
            </el-table-column>
            <el-table-column
              property="assetName"
              label="资产名称"
              width="100"
            >
            </el-table-column>
            <el-table-column
              property="reason"
              label="借用原因"
            >
            </el-table-column>
            <el-table-column
              property="status"
              label="工单状态">
              <template slot-scope="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{getStatusText(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="审批">
              <template slot-scope="scope">
                <!--              修改-->
                <el-tooltip effect="dark" content="确认资产的归还" placement="top" :enterable="false">
                  <el-button type="primary" size="mini" @click="isBack(scope.row.bcId)">确认归还</el-button>
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>

          <div class="paginationStyle">
            <el-pagination
              style="float: right"
              @current-change="borrowHandleCurrentChange"
              @size-change="borrowHandleSizeChange"
              :current-page="this.limit"
              :page-size="this.offset"
              layout="total,sizes,prev, pager, next, jumper"
              :total="this.total">
            </el-pagination>
          </div>

        </el-card>
      </el-tab-pane>
      <el-tab-pane label="全部工单" name="third">
        <el-card>
          <el-table
            v-loading="firstLoading"
            element-loading-text="拼命加载中"
            ref="closeTableRef"
            stripe
            border
            :data="borrowCheckData"
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="bcId"
              label="工单号"
              width="80">
            </el-table-column>
            <el-table-column
              property="startPeople"
              label="发起人"
              width="80">
            </el-table-column>
            <el-table-column
              property="applyTime"
              label="发起时间">
            </el-table-column>
            <el-table-column
              property="expReturnTime"
              label="预计归还时间">
            </el-table-column>
            <el-table-column
              property="assetName"
              label="资产名称"
              width="100"
            >
            </el-table-column>
            <el-table-column
              property="reason"
              label="借用原因"
            >
            </el-table-column>
            <el-table-column
              property="status"
              label="工单状态">
              <template slot-scope="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{getStatusText(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div class="paginationStyle">
            <el-pagination
              style="float: right"
              @current-change="borrowHandleCurrentChange"
              @size-change="borrowHandleSizeChange"
              :current-page="this.limit"
              :page-size="this.offset"
              layout="total,sizes,prev, pager, next, jumper"
              :total="this.total">
            </el-pagination>
          </div>

        </el-card>
      </el-tab-pane>
    </el-tabs>
<!--    拒绝-->
    <el-dialog
      title="拒绝原因"
      :visible.sync="refuseDialogVisible"
      :before-close="closeThis"
      width="35%">
      <el-form :model="allowForm" ref="allowFormRef" :rules="allowFormRules">
        <el-form-item prop="refuseReason">
          <el-input v-model="allowForm.refuseReason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="closeThis">取 消</el-button>
    <el-button type="primary" @click="refuseThis">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Check",
    data(){
      return{
        borrowCheckForm:{
          assetName:null,
          startPeople:null,
          status:null,
          workStatus:1
        },
        options: [{
          value: 1,
          label: '待审核'
        }, {
          value: 2,
          label: '已通过'
        }, {
          value: 3,
          label: '不通过'
        }],
        borrowCheckData:[],
        closeData:[],
        limit: 1,
        offset: 10,
        total: 1,
        firstLoading:true,
        //被激活的页签的名称
        activeName:'first',
        assetTypeOptions:[],
        //是否审核
        flag:0,
        //是否同意
        isAllow:null,
        allowForm:{
          bcId:null,
          refuseReason:null
        },
        refuseDialogVisible:false,
        allowFormRules:{
          refuseReason: [
            {required:true,message:'该信息不可为空',trigger: 'blur'},
            {max:100,message: '字数不能超过100',trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      myReason(row, column){
        if(row.status===0){
          return row.reason;
        }else{
          return row.moreReason
        }
      },
      myTime(row, column){
        if(row.status===0) {
          return row.expReturnTime
        }else{
          return row.afMoreTime
        }
      },
      async getCheck(){
        const {data:res}=await this.$http.post("/check/checkList/"+this.flag+"/"+this.limit+"/"+this.offset,this.borrowCheckForm)
        if(!res.success) return this.$message.error("查询失败")
        this.borrowCheckData=res.data.records
        this.limit = res.data.current
        this.total = res.data.total
        this.firstLoading=false
      },
      TabhandleClick(tab, event) {
        if(tab.name==='second'){
          this.reset()
          this.borrowCheckData=[]
          this.firstLoading=true
          this.borrowCheckForm.workStatus=1
          this.flag=2
          this.getCheck()
        }
        if(tab.name==='third'){
          this.reset()
          this.borrowCheckData=[]
          this.firstLoading=true
          this.flag=3
          this.getCheck()
        }
        if(tab.name==='first'){
          this.reset()
          this.borrowCheckData=[]
          this.firstLoading=true
          this.borrowCheckForm.workStatus=1
          this.flag=0
          this.getCheck()
        }
      },
      reset(){
        this.borrowCheckForm.assetName=this.borrowCheckForm.startPeople=this.borrowCheckForm.status=this.borrowCheckForm.workStatus=null
      },
      //监听pagesize,改变每页显示的条数
      borrowHandleSizeChange(newSize){
        this.offset=newSize
        this.getCheck()
      },
      //页码值发生变化会触发事件
      async borrowHandleCurrentChange(newPage){
        this.limit=newPage
        await this.getCheck()

      },
      async Search(){
        await this.getCheck()
      },
      async AllowBorrow(val){
        const {data:res}=await this.$http.post("/check/allow/"+this.isAllow+"/"+val,this.allowForm)
        if(!res.success) return this.$message.error(res.message);
        this.$message.success(res.message)
        this.flag=0
        await this.getCheck()
      },
      async isBack(val){
        const {data:res}=await this.$http.post("/check/isBack/"+val)
        if(!res.success) return this.$message.error(res.message);
        this.$message.success(res.message)
        await this.getCheck()
      },
      allowThis(val){
        this.isAllow=1
        this.AllowBorrow(val)
      },
      refuseThis(){
        this.$refs.allowFormRef.validate(valid=> {
          if(!valid) return ;
          this.isAllow=0
          this.AllowBorrow(this.allowForm.bcId)
        })
      },
      closeThis(){
        this.refuseDialogVisible=false
        this.$refs.allowFormRef.resetFields()

      },
      showDig(val){
        this.refuseDialogVisible=true
        this.allowForm.bcId=val
      },
      getStatusType(statusType){
        const tagColor = {
          0: 'info',
          1: 'danger',
          2: '',
          3: '',
          4: 'warning',
          5: 'success'
        }
        return tagColor[statusType]
      },
      //匹配状态
      getStatusText(status) {
        const tagText= {
          0: '待审核',
          1: '审核不通过',
          2: '待领用',
          3: '待归还',
          4: '逾期未归还',
          5: '归还待确认',
          6: '已归还'
        };
        return tagText[status]
      },
    },
    async created() {
      this.firstLoading=true
      await  this.getCheck()
    }
  }
</script>

<style lang="less" scoped>
  .inputStyle{
    width: 222px!important;
  }
  .el-card{
    margin-bottom: 10px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.25) !important;
  }
  .paginationStyle{
    margin-top: 10px;
    height: 20px;
  }

</style>
