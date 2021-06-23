<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>资产维护 >></el-breadcrumb-item>
      </el-breadcrumb>
      <!--      卡片视图区-->
      <el-card>
        <el-form ref="formRef" :model="repairForm" inline>
          <el-form-item label="资产名称">
            <el-input v-model="repairForm.assetName" placeholder="请输入资产名称关键字"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="repairForm.createTimeArr"
              type="datetimerange"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="center">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="search" size="medium">查询</el-button>
            <el-button type="info" round @click="reset" size="medium">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-tabs v-model="activeName" type="border-card" @tab-click="repairHandleClick">
          <el-tab-pane label="未完成维修工单" name="first">
            <!--        用户列表区域-->
            <el-table
              :data="records" border stripe ref="multipleTable">

              <el-table-column label="记录编号" prop="repairId" width="80"></el-table-column>
              <el-table-column label="资产名称" prop="assetName" width="100"></el-table-column>
              <el-table-column label="检修成员" prop="repairPeople" width="80"></el-table-column>
              <el-table-column label="检修性质" prop="repairInfo"></el-table-column>
              <el-table-column label="检修地点" prop="address"></el-table-column>
              <el-table-column label="检修内容" prop="repairContent"></el-table-column>
              <el-table-column label="验收人" prop="acceptPeople"></el-table-column>
              <el-table-column label="工单发起时间" prop="createTime"></el-table-column>
<!--              <el-table-column label="验收评价" prop="evaluation"></el-table-column>-->
              <el-table-column
                property="status"
                label="工单状态"
                width="180"
              >
                <template slot-scope="scope">
                  <el-tag :type="getStatusActionType(scope.row.status)">{{getStatusAction(scope.row.status)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!--              修改-->
                  <el-tooltip effect="dark" content="确认维修工单" placement="top" :enterable="false">
                    <el-button type="primary" size="mini" @click="toSure(scope.row.repairId)" v-if="scope.row.status===1">确认</el-button>
                  </el-tooltip>
                  <!--              删除-->
                  <el-tooltip effect="dark" content="维修结束，指派给发起者确认" placement="top" :enterable="false">
                    <el-button type="success" size="mini" v-if="scope.row.status !== 1" @click="endWei(scope.row.repairId)">维修结束</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <!--        分页-->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="limit"
              :page-sizes="[10, 20, 30]"
              :page-size="offset"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="已结束维修工单" name="second">
            <el-table
              :data="records" border stripe ref="multipleTable">

              <el-table-column label="记录编号" prop="repairId" width="80"></el-table-column>
              <el-table-column label="资产名称" prop="assetName" width="100"></el-table-column>
              <el-table-column label="检修成员" prop="repairPeople" width="80"></el-table-column>
              <el-table-column label="检修性质" prop="repairInfo"></el-table-column>
              <el-table-column label="检修地点" prop="address"></el-table-column>
              <el-table-column label="检修内容" prop="repairContent"></el-table-column>
              <el-table-column label="验收人" prop="acceptPeople"></el-table-column>
              <el-table-column label="工单发起时间" prop="createTime"></el-table-column>
              <!--              <el-table-column label="验收评价" prop="evaluation"></el-table-column>-->
              <el-table-column
                property="status"
                label="工单状态"
                width="180"
              >
                <template slot-scope="scope">
                  <el-tag :type="getStatusActionType(scope.row.status)">{{getStatusAction(scope.row.status)}}</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <!--        分页-->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="limit"
              :page-sizes="[10, 20, 30]"
              :page-size="offset"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "Repair",
      data(){
          return{
            repairForm:{
              assetName:'',
              createTimeArr:[]
            },
            typeData:[],
            defaultParams: {
              label: 'assetType',
              value: 'id',
              children: 'children',
              checkStrictly: true,
            },
            pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
            records:[],
            //获取用户列表的参数对象
            limit:1,//当前页数
            offset:10,//每页多少条
            total:0,
            activeName: 'first',
            flag:1,
            strTime:''
          }
      },
      methods:{
          search(){
            this.getRepair()
          },
        reset(){
          this.repairForm.assetName=''
          this.repairForm.createTimeArr=[]
          this.getRepair()
        },
        async getRepair(){
          const {data:res}=await this.$http.post('/repair/list/' + this.flag+'/'+this.limit + '/' + this.offset,this.repairForm);
          this.records = res.data.records
          this.limit = res.data.current
          this.total = res.data.total
        },
        repairHandleClick(tab, event) {
          if(tab.name==='second'){
            this.flag=2
            this.getRepair()
          }
          if(tab.name==='first'){
            this.flag=1
            this.getRepair()
          }
        },
        //监听pagesize,改变每页显示的条数
        handleSizeChange(newSize){
          this.offset=newSize
          this.getRepair()
        },
        //页码值发生变化会触发事件
        handleCurrentChange(newPage) {
            this.limit=newPage
            this.getRepair()
        },
        getStatusActionType(statusType){
          const tagColor = {
            1: 'primary',
            2: 'success',
            3: 'warning',
            4: 'success',
            5: 'info'
          }
          return tagColor[statusType]
        },
        getStatusAction(status) {
          const tagAction= {
            1: '工单发起',
            2: '确认维修',
            3: '维修结束，待验收',
            4: '验收结束',
            5: '工单结束',
          };
          return tagAction[status]
        },
        async toSure(val){
          const {data:res}=await this.$http.post('/repair/sure/'+val)
          if(!res.success) return this.$message.error(res.message)
          this.$message(res.message)
          await this.getRepair()
        },
        async endWei(val){
          const {data:res}=await this.$http.post('/repair/end/'+val)
          if(!res.success) return this.$message.error(res.message)
          this.$message(res.message)
          await this.getRepair()
        }
      },
      created() {
        this.getRepair()
      }
    }
</script>

<style lang="less" scoped>
  .btnStyle{
    display: flex;//弹性盒子模型
    justify-content: flex-end;
    height: 40px;
  }
  .time{
    margin-left:-5.5px;
  }
  .el-input__inner{
    border-radius: 0px 4px 4px 0px;
  }
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
</style>
