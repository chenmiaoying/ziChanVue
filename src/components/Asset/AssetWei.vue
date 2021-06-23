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
        <el-form-item>
          <el-button type="primary" round @click="search" size="medium">查询</el-button>
          <el-button type="info" round @click="reset" size="medium">重置</el-button>
          <el-button type="primary" @click="addWeiDialogVisible=true" icon="el-icon-folder-add" size="medium">新增维修</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" type="border-card" @tab-click="weiHandleClick">
        <el-tab-pane label="未完成维修工单" name="first">
          <!--        用户列表区域-->
          <el-table
            :data="records" border stripe ref="multipleTable">
            <el-table-column label="记录编号" prop="repairId" width="80"></el-table-column>
            <el-table-column label="资产名称" prop="assetName"></el-table-column>
            <el-table-column label="检修成员" prop="repairPeople"></el-table-column>
            <el-table-column label="检修性质" prop="repairInfo"></el-table-column>
            <el-table-column label="检修地点" prop="address" show-overflow-tooltip></el-table-column>
            <el-table-column label="检修内容" prop="repairContent"></el-table-column>
            <el-table-column label="验收人" prop="acceptPeople"></el-table-column>
            <el-table-column label="工单发起时间" prop="createTime"></el-table-column>
            <!--              <el-table-column label="验收评价" prop="evaluation"></el-table-column>-->
            <el-table-column
              property="status"
              label="工单状态"
            >
              <template slot-scope="scope">
                <el-tag :type="getStatusActionType(scope.row.status)">{{getStatusAction(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">

                <el-tooltip effect="dark" content="确认维修工单" placement="top" :enterable="false">
                  <el-button type="primary" size="mini" @click="toYes(scope.row.repairId)" v-if="scope.row.status === 3">维修验收</el-button>
                </el-tooltip>

                <el-tooltip effect="dark" content="关闭该维修工单" placement="top" :enterable="false">
                  <el-button type="success" size="mini" v-if="scope.row.status === 4" @click="closeWei(scope.row.repairId)">结束工单</el-button>
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
        <el-tab-pane label="已结束维修工单" name="second" >
          <!--        用户列表区域-->
          <el-table
            :data="records" border stripe ref="multipleTable">
            <el-table-column label="记录编号" prop="repairId" width="80"></el-table-column>
            <el-table-column label="资产名称" prop="assetName"></el-table-column>
            <el-table-column label="检修成员" prop="repairPeople" width="80"></el-table-column>
            <el-table-column label="检修性质" prop="repairInfo"></el-table-column>
            <el-table-column label="检修地点" prop="address"></el-table-column>
            <el-table-column label="检修内容" prop="repairContent" show-overflow-tooltip></el-table-column>
            <el-table-column label="验收人" prop="acceptPeople"></el-table-column>
            <el-table-column label="工单发起时间" prop="createTime"></el-table-column>
            <!--              <el-table-column label="验收评价" prop="evaluation"></el-table-column>-->
            <el-table-column
              property="status"
              label="工单状态"
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
    <el-dialog
      title="维修验收"
      :visible.sync="acceptDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="acceptForm" :rules="acceptFormRules" ref="acceptFormRef">
        <el-form-item label="验收评价" prop="evaluation">
          <el-input v-model="acceptForm.evaluation"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="acceptY">确 定</el-button>
  </span>
    </el-dialog>
<!--    新增维修工单-->
    <el-dialog
      title="新增维修工单"
      :visible.sync="addWeiDialogVisible"
      width="40%"
      :before-close="addWeiHandleClose">
      <el-form :model="addWeiForm" :rules="addWeiFormRules" ref="addWeiFormRef" label-width="120px">
        <el-form-item label="资产编号" prop="assetId">
          <el-input v-model="addWeiForm.assetId"></el-input>
        </el-form-item>
        <el-form-item label="维修地点" prop="address">
          <el-input v-model="addWeiForm.address" placeholder="如果资产地点已经变动则填写维修地点"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" prop="repairContent">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入资产出现的问题描述"
            v-model="addWeiForm.repairContent">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addWeiHandleClose">取 消</el-button>
    <el-button type="primary" @click="repairAdd">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "AssetWei",
    data(){
      return{
        repairForm:{
          arr:[],
          assetName:null,

        },
        typeData:[],
        defaultParams: {
          label: 'assetType',
          value: 'id',
          children: 'children',
          checkStrictly: true,
        },
        records:[],
        //获取用户列表的参数对象
        limit:1,//当前页数
        offset:10,//每页多少条
        total:0,
        activeName: 'first',
        acceptForm:{
          repairId:null,
          evaluation:null
        },
        acceptDialogVisible:false,
        acceptFormRules:{
          evaluation:[
            {required: true, message: '该信息不可为空', trigger: 'blur'}
          ]
        },
        addWeiFormRules:{
          assetId:[
            {required: true, message: '该信息不可为空', trigger: 'blur'}
          ],

          repairContent:[
            {required: true, message: '该信息不可为空', trigger: 'blur'}
          ]
        },
        flag:1,
        addWeiDialogVisible:false,
        addWeiForm:{
          assetId:null,
          assetName:null,
          address:null,
          repairContent:null
        }

      }
    },
    methods:{
      search(){
        this.getRepair()
      },
      reset(){
        this.repairForm.assetName=null
        this.getRepair()
      },
      async getRepair(){
        const {data:res}=await this.$http.post('/repair/myList/' +this.flag+'/'+ this.limit + '/' + this.offset,this.repairForm);
        this.records = res.data.records
        this.limit = res.data.current
        this.total = res.data.total
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
      async toYes(val){
        this.acceptForm.repairId=val
        this.acceptDialogVisible=true
      },
      handleClose(){
        this.$refs.acceptFormRef.resetFields()
        this.acceptDialogVisible=false
      },
      acceptY(){
        this.$refs.acceptFormRef.validate(async valid =>{
          if(!valid) return ;
          const {data:res}=await this.$http.post('/repair/accept',this.acceptForm)
          if(!res.success) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.acceptDialogVisible=false
          await this.getRepair()
        })
      },
      weiHandleClick(tab, event) {
        if(tab.name==='second'){
          this.flag=2
          this.getRepair()
        }
        if(tab.name==='first'){
          this.flag=1
          this.getRepair()
        }
      },
      async closeWei(val){
        const {data:res}=await this.$http.delete('/repair/close/'+val)
        if(!res.success) return this.$message.error(res.message)
        this.$message(res.message)
        await this.getRepair()
      },
      addWeiHandleClose(){
        this.$refs.addWeiFormRef.resetFields()
        this.addWeiDialogVisible=false
      },
      repairAdd(){
        this.$refs.addWeiFormRef.validate(async valid=> {
          if (!valid) return;
          const {data:res}=await this.$http.post('/repair/add',this.addWeiForm)
          if(!res.success) return this.$message.error(res.message)
          this.addWeiDialogVisible=false
          this.getRepair()
          this.$message.success(res.message)
        })
      },
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
