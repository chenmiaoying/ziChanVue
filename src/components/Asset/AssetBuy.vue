<template>
  <div>
      <!--      面包屑区域-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产查询</el-breadcrumb-item>
        <el-breadcrumb-item>全部资产 >></el-breadcrumb-item>
      </el-breadcrumb>
    <el-tabs type="border-card">
      <el-tab-pane label="资产申购" class="add">
        <span style="display: flex; justify-content: center">资产购置申请</span>

        <el-divider><i class="el-icon-shopping-cart-full"></i></el-divider>
        <el-form ref="addBuyFormRef" :model="buyForm" :rules="buyFormRules" label-width="140px">
          <el-form-item label="申请人" prop="userName">
            <el-input v-model="buyForm.userName" disabled></el-input>
          </el-form-item>
          <el-form-item label="资产名称" prop="assetName">
            <el-input v-model="buyForm.assetName"></el-input>
          </el-form-item>
          <el-form-item label="资产类型" prop="assetType">
            <el-input v-model="buyForm.assetType"></el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="specificationModel">
            <el-input v-model="buyForm.specificationModel"></el-input>
          </el-form-item>
          <el-form-item label="购买数量" prop="number">
            <el-input-number v-model="buyForm.number" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="预算资金" prop="budgetFunds">
            <el-input v-model="buyForm.budgetFunds">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="审批人姓名" prop="checkPeople">
            <el-input v-model="buyForm.checkPeople"></el-input>
          </el-form-item>
          <el-form-item label="申请理由及用途" prop="purchaseReason">
            <el-input type="textarea" v-model="buyForm.purchaseReason" style="width: 420px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addBuy">立即创建</el-button>
            <el-button @click="reset">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="申购工单">
        <!--      卡片视图区-->
        <el-card>

          <!--        申购列表区域-->
          <el-table v-loading="loading"
                    element-loading-text="拼命加载中"
                    border stripe ref="multipleTable" :data="myBuyData" :default-sort = "{prop: 'applyTime', order: 'descending'}">
            <el-table-column type="expand">
              <template slot-scope="props">
                <span style="size: 12px;font-weight:bold">申购信息</span>
                <el-divider><i class="el-icon-shopping-cart-full"></i></el-divider>
                <div class="detailDiv">
                  工单编号:&nbsp;&nbsp;&nbsp;{{props.row.id}}<br/>
                  申购人工号:&nbsp;&nbsp;&nbsp;{{props.row.userId}}<br/>
                  申购人:&nbsp;&nbsp;&nbsp;{{props.row.userName}}<br/>
                  申购资产类型:&nbsp;&nbsp;&nbsp;{{props.row.asset_type}}<br/>
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
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column label="工单号" prop="id" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column label="申请人" prop="userName" show-overflow-tooltip></el-table-column>
            <el-table-column label="申请时间" prop="applyTime" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="资产类型" prop="assetType" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格型号" prop="specificationModel" show-overflow-tooltip></el-table-column>
            <el-table-column label="购买数量" prop="number" show-overflow-tooltip></el-table-column>
            <el-table-column label="预算资金" prop="budgetFunds" show-overflow-tooltip></el-table-column>
            <el-table-column label="申购理由" prop="purchaseReason" show-overflow-tooltip></el-table-column>
            <el-table-column label="审批人" prop="checkPeople" show-overflow-tooltip></el-table-column>
            <el-table-column label="审批意见" prop="approveOpinion" show-overflow-tooltip></el-table-column>
            <el-table-column label="审批状态" prop="status">
              <template slot-scope="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{getStatusText(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <!--        分页-->
          <el-pagination
            @size-change="buyHandleSizeChange"
            @current-change="buyHandleCurrentChange"
            :current-page.sync="limit"
            :page-size="offset"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    export default {
        name: "AssetBuy",
      data(){
          return{
            buyForm:{
              number:1,
              assetType:null,
              specificationModel:null,
              budgetFunds:null,
              checkPeople:null,
              purchaseReason:null
            },
            buyFormRules:{
              assetType: [
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              assetName: [
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              specificationModel:[
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              budgetFunds:[
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              checkPeople:[
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              purchaseReason:[
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              number:[
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ]
            },
            limit:1,//当前页数
            offset:10,//每页多少条
            total:0,
            loading:true,
            myBuyData:[]
          }
      },
      methods:{
        //监听pagesize,改变每页显示的条数
        buyHandleSizeChange(newSize){
            this.offset=newSize
        },
        buyHandleCurrentChange(newPage){
          this.limit=newPage
        },
        getUserName(){
          const username=window.sessionStorage.getItem('username');
          this.buyForm.userName=username
        },
        reset(){
          this.$refs.addBuyFormRef.resetFields()
        },
        async getMyBuyList(){
          const {data:res}=await this.$http.get('/assetBuy/MyBuyList/'+this.limit+'/'+this.offset)
          if(!res.success){
            this.loading=false
            return this.$message.error(res.message)
          }
          this.loading=false
          this.myBuyData=res.data.records
          this.limit = res.data.current
          this.total = res.data.total
        },
        async addBuy(){
          const {data:res}=await this.$http.post('/assetBuy/add',this.buyForm)
          if(!res.success) this.$message.error(res.message)
          this.reset()
          this.$message.success(res.message)
          await this.getMyBuyList()
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
          this.getUserName()
        this.getMyBuyList()
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
</style>
