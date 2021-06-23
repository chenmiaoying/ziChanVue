<template>
    <div>
      <!--      面包屑区域-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产查询</el-breadcrumb-item>
        <el-breadcrumb-item>采购工单 >></el-breadcrumb-item>
      </el-breadcrumb>
      <!--      卡片视图区-->
      <el-card>
        <el-form :model="buyYForm" inline>
          <el-form-item label="申请人">
            <el-input v-model="buyYForm.userName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="search">查询</el-button>
            <el-button type="info" round @click="reset">重置</el-button>
            <el-button type="success" round @click="exportFile">导出</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>

        <!--        申购列表区域-->
        <el-table v-loading="loading"
                  element-loading-text="拼命加载中"
                  border stripe ref="multipleTable1" :data="buyYData" @selection-change="handleSelectionChange" :default-sort = "{prop: 'applyTime', order: 'descending'}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column label="工单号" prop="id" width="65"></el-table-column>
          <el-table-column label="申请人工号" prop="userId"></el-table-column>
          <el-table-column label="申请人" prop="userName"></el-table-column>
          <el-table-column label="申请时间" prop="applyTime" sortable></el-table-column>
          <el-table-column label="资产名称" prop="assetName"></el-table-column>
          <el-table-column label="资产类型" prop="assetType"></el-table-column>
          <el-table-column label="规格型号" prop="specificationModel"></el-table-column>
          <el-table-column label="购买数量" prop="number"></el-table-column>
          <el-table-column label="预算资金" prop="budgetFunds"></el-table-column>
          <el-table-column label="审批人" prop="checkPeople"></el-table-column>
          <el-table-column label="审批意见" prop="approveOpinion"></el-table-column>
          <el-table-column label="采购状态" prop="buyStatus">
            <template slot-scope="scope">
              <el-tag :type="getStatusType(scope.row.buyStatus)">{{getStatusText(scope.row.buyStatus)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="buyStatus">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="buyWas(scope.row.id)">采购完毕</el-button>
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
    </div>
</template>

<script>
    export default {
      name: "AssetBuyYes",
      data(){
          return{
            limit:1,//当前页数
            offset:10,//每页多少条
            total:0,
            loading:true,
            buyYData:[],
            buyYForm:{
              userName:null
            },
            buyTemp: []
          }
      },
      methods:{
        async getBuyData(){
          const {data:res}=await this.$http.post('/assetBuy/buyList/'+this.limit+'/'+this.offset,this.buyYForm)
          if(!res.success){
            this.loading=false
            this.$message.error(res.message)
          }
          this.loading=false
          this.buyYData=res.data.records
          this.limit = res.data.current
          this.total = res.data.total
        },
        //监听pagesize,改变每页显示的条数
        buyHandleSizeChange(newSize){
          this.offset=newSize
        },
        getStatusType(statusType){
          const tagColor = {
            0: 'warning',
            1: 'success',
          }
          return tagColor[statusType]
        },
        //匹配状态
        getStatusText(status) {
          const tagText= {
            0: '待采购',
            1: '已采购'
          };
          return tagText[status]
        },
        search(){
          this.limit=1
          this.getBuyData()
        },
        reset(){
          this.buyYForm.userName=null
          this.limit=1
          this.getBuyData()
        },
        buyHandleCurrentChange(newPage){
          this.limit=newPage
          this.getBuyData()
          if(this.buyTemp[this.limit]){
            this.buyTemp[this.limit].forEach(row=>{
              this.buyYData.forEach(trow=>{
                if(row.id == trow.id){
                  //下一执行周期执行这个函数
                  this.$nextTick(()=> {
                    this.toggleSelection([trow])
                  })
                }
              })
            })
          }
        },
        //选择table的数据就会触发的事件
        handleSelectionChange(val){
          this.buyTemp[this.limit]=val
          // //多选返回的值multipleSelection
          // this.multipleSelection=val

        },
        async buyWas(val){
          const {data:res}=this.$http.post('/assetBuy/buyWas/'+val);
          if(!res.success) return this.$message.error(res.message)
          await this.getBuyData()
          this.$message.success(res.message)
        },
        //toggleRowSelection(row, selected)接受两个参数，row传递被勾选行的数据，selected设置是否选中
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable1.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable1.clearSelection();
          }
        },
        async exportFile(){
          var str = ''
          if(this.buyTemp.length !== 0){
            this.buyTemp.forEach(row1 =>{
              row1.forEach(row2=>{
                if(str==''){
                  str+=row2.id
                }else {
                  str+=','+row2.id
                }
              })
            })
          }
          if(str ==''){
            const {data:res}=await this.$http.get('/assetBuy/list/export/'+JSON.stringify(this.buyYForm))

            if('undefined' != typeof res.success){
              return this.$message.error(res.message)
            }
            await this.exportExcel('/assetBuy/list/export/'+JSON.stringify(this.buyYForm),null,'导出采购数据')
          }else{
            const {data:res}=await this.$http.get('/assetBuy/list/exportByIds?ids=' + str)

            if('undefined' != typeof res.success){
              return this.$message.error(res.message)
            }
            await this.exportExcel('/assetBuy/list/exportByIds?ids=' + str,null,'导出采购数据')
          }
        },
      },
      created() {
        this.getBuyData()
      }
    }
</script>

<style lang="less" scoped>
  .el-card{
    margin-bottom: 10px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.25) !important;
  }

</style>
