<template>
  <div>
    <!--      面包屑区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产查询</el-breadcrumb-item>
      <el-breadcrumb-item>申购审批 >></el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区-->
    <el-card>
      <el-form :model="checkForm" inline>
        <el-form-item label="申请人">
          <el-input v-model="checkForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="checkForm.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round>查询</el-button>
          <el-button type="info" round>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>

      <!--        申购列表区域-->
      <el-table v-loading="loading"
                element-loading-text="拼命加载中"
                border stripe ref="multipleTable" :data="buyData" :default-sort = "{prop: 'applyTime', order: 'descending'}">
        <el-table-column type="expand">
          <template slot-scope="props">
            <span style="size: 12px;font-weight:bold">申购信息</span>
            <el-divider><i class="el-icon-shopping-cart-full"></i></el-divider>
            <div class="detailDiv">
              工单编号:&nbsp;&nbsp;&nbsp;{{props.row.id}}<br/>
              申购人工号:&nbsp;&nbsp;&nbsp;{{props.row.userId}}<br/>
              申购人:&nbsp;&nbsp;&nbsp;{{props.row.userName}}<br/>
              申购资产类型:&nbsp;&nbsp;&nbsp;{{props.row.assetType}}<br/>
              规格型号:&nbsp;&nbsp;&nbsp;{{props.row.specificationModel}}<br/>
              申购数量:&nbsp;&nbsp;&nbsp;{{props.row.number}}<br/>
              预购资金:&nbsp;&nbsp;&nbsp;{{props.row.budgetFunds}}<br/>
              申请时间:&nbsp;&nbsp;&nbsp;{{props.row.applyTime}}<br/>
              审批人:&nbsp;&nbsp;&nbsp;{{props.row.checkPeople}}<br/>
              审批意见:&nbsp;&nbsp;&nbsp;{{props.row.approveOpinion}}<br/>
              审核时间:&nbsp;&nbsp;&nbsp;{{props.row.checkTime}}<br/>
              申请理由及用途:&nbsp;&nbsp;&nbsp;{{props.row.purchaseReason}}<br/>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="工单号" prop="id"></el-table-column>
        <el-table-column label="申请人" prop="userName"></el-table-column>
        <el-table-column label="申请时间" prop="applyTime" sortable show-overflow-tooltip></el-table-column>
        <el-table-column label="资产类型" prop="assetType" ></el-table-column>
        <el-table-column label="规格型号" prop="specificationModel" show-overflow-tooltip></el-table-column>
        <el-table-column label="购买数量" prop="number"></el-table-column>
        <el-table-column label="预算资金" prop="budgetFunds"></el-table-column>
        <el-table-column label="申购理由" prop="purchaseReason" show-overflow-tooltip></el-table-column>
        <el-table-column label="审批人" prop="checkPeople"></el-table-column>
        <el-table-column label="审批状态" prop="status">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{getStatusText(scope.row.status)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审批" width="170px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="tongYi(scope.row.id)" v-if="scope.row.status===0">同意</el-button>
            <el-button type="danger" size="mini" @click="refluse1(scope.row.id)" v-if="scope.row.status===0">拒绝</el-button>
            <el-tag type="success" v-else>已审批</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--        分页-->
      <el-pagination
        @size-change="buyCheckHandleSizeChange"
        @current-change="buyCheckHandleCurrentChange"
        :current-page.sync="limit"
        :page-size="offset"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="拒绝原因"
      :visible.sync="buyRefuseDialogVisible"
      :before-close="closeThis"
      width="35%">
      <el-form :model="refluseForm" ref="refluseFormRef" :rules="buyFormRules">
        <el-form-item prop="approveOpinion">
          <el-input v-model="refluseForm.approveOpinion"></el-input>
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
        name: "BuyCheck",
      data(){
          return{
            limit:1,//当前页数
            offset:10,//每页多少条
            total:0,
            loading:false,
            options: [{
              value: 0,
              label: '未审核'
            }, {
                value: 1,
                label: '已拒绝'
            }, {
                value: 2,
                label: '已通过'
            }],
            checkForm:{
              status:null,
              userName:null
            },
            buyData:[],
            buyRefuseDialogVisible:false,
            buyFormRules:{
              approveOpinion:[
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ]
            },
            refluseForm:{
              id:null,
              approveOpinion:null
            }
          }
      },
      methods:{
        async getData(){
          const {data:res}=await this.$http.post('/assetBuy/checkList/'+this.limit+'/'+this.offset,this.checkForm)
          if(!res.success){
            this.loading=false
            return this.$message.error(res.message)
          }
          this.loading=false
          this.buyData=res.data.records
          this.limit = res.data.current
          this.total = res.data.total
        },
        closeThis(){
          this.$refs.refluseFormRef.resetFields()
          this.buyRefuseDialogVisible=false
        },
        //监听pagesize,改变每页显示的条数
        buyCheckHandleSizeChange(newSize){
          this.offset=newSize
        },
        async refuseThis(){
          const {data:res}=await this.$http.post('/assetBuy/check/0',this.refluseForm)
          if(!res.success) return this.$message.error(res.message)
          await this.getData()
          this.buyRefuseDialogVisible=false
          this.$message.success(res.message)

        },
        buyCheckHandleCurrentChange(newPage){
          this.limit=newPage
        },
        async tongYi(val){
          this.refluseForm.id=val
          const {data:res}=await this.$http.post('/assetBuy/check/1',this.refluseForm)
          if(!res.success) return this.$message.error(res.message)
          await this.getData()
          this.$message.success(res.message)
        },
        refluse1(val){
          this.refluseForm.id=val
          this.buyRefuseDialogVisible=true
        },
        getStatusType(statusType){
          const tagColor = {
            0: 'warning',
            1: 'danger',
            2: 'success',
          }
          return tagColor[statusType]
        },
        //匹配状态
        getStatusText(status) {
          const tagText= {
            0: '待审核',
            1: '已拒绝',
            2: '已通过',
          };
          return tagText[status]
        }
      },
      created() {
          this.getData()
      }
    }
</script>

<style lang="less" scoped>
  .el-card{
    margin-bottom: 10px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.25) !important;
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
</style>
