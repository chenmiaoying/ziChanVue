<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产查询</el-breadcrumb-item>
      <el-breadcrumb-item>被删除资产</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="form" :model="form" inline>
            <el-form-item label="资产名称">
              <el-input class="inputStyle" v-model="form.assetName"></el-input>
            </el-form-item>
            <el-form-item label="资产类型">
              <el-cascader
                v-model="form.arr"
                placeholder="请选择"
                :options="typesData"
                :props="defaultParams"
                clearable></el-cascader>
            </el-form-item>
            <el-form-item label="资产删除人">
              <el-input class="inputStyle" v-model="form.assetUser"></el-input>
            </el-form-item>
          </el-form>
      <el-divider></el-divider>
      <div class="btnStyle">
        <el-button type="success" round @click="exportFile">导出</el-button>
        <el-button type="info" round @click="reset">重置</el-button>
        <el-button type="primary" round @click="search">查询</el-button>
      </div>
    </el-card>
    <el-card>
      <el-table
        v-loading="deleteLoading"
        element-loading-text="拼命加载中"
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
        style="width: 100%">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="资产编号" prop="assetId"></el-table-column>
        <el-table-column
          prop="assetName"
          label="资产名称">
        </el-table-column>
        <el-table-column
          prop="assetType"
          label="资产类型">
        </el-table-column>
        <el-table-column
          prop="assetCondition"
          label="资产状况">
        </el-table-column>
        <el-table-column
          prop="assetCreatTime"
          label="资产创建时间">
        </el-table-column>
        <el-table-column
          prop="assetDeletePeople"
          label="资产删除操作人">
        </el-table-column>
        <el-table-column
          prop="assetHost"
          label="资产管理员">
        </el-table-column>
        <el-table-column prop="pointId" label="区域站点" :formatter="pointString">
        </el-table-column>
        <el-table-column
          prop="assetDeleteReason"
          label="删除原因" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="assetDeleteTime"
          label="资产删除时间">
        </el-table-column>
      </el-table>
      <div class="paginationStyle">
        <el-pagination
          style="float: right"
          @current-change="handleCurrentChange"
          :current-page="this.limit"
          :page-size="this.offset"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DeleteAssetQuery",
  data () {
    return{
      form: {
        assetName: null,
        assetType: null,
        assetUser: null,
        arr:null,
        assetDelete: 1
      },
      tableData: [],
      typesData:[],
      defaultParams: {
        label: 'assetType',
        value: 'id',
        children: 'children',
        checkStrictly: true
      },
      selectIds: '',
      temp: [],
      multipleSelection: [],
      limit: 1,
      offset: 10,
      total: 1,
      deleteLoading:true,
      pointTreeData:[],
      defaultParamsPoint:{
        label: 'pointName',
        value: 'id',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created() {
    this.pointTree()
    this.deleteLoading=true
    this.treeType();
    this.getAsset();
  },
  methods: {
    async getAsset(){
      const {data:res}=await this.$http.post('/asset/' + this.limit + '/' + this.offset,this.form);
      this.tableData = res.data.records
      this.total = res.data.total
      this.limit = res.data.current
      this.deleteLoading=false
    },
    async search(){
      if(this.form.arr.length !== 0){
        const ind=this.form.arr.length
        this.form.assetType=this.form.arr[ind-1]
      }else {
        this.form.assetType=null
      }
      const {data:res}=await this.$http.post('/asset/' + 0 + '/' + this.offset,this.form);
      this.tableData = res.data.records
      this.limit = res.data.current
      this.total = res.data.total
    },
    async reset(){
      this.form.assetName = this.form.assetType = this.form.assetUser = null;
      this.form.arr=[];
      const {data:res}=await this.$http.post('/asset/' + 0 + '/' + this.offset,this.form);
      this.tableData = res.data.records
      this.limit = res.data.current
      this.total = res.data.total
    },
    async exportFile(){
      var str = ''
      if(this.temp.length!=0){
        this.temp.forEach(row1 =>{
          row1.forEach(row2=>{
            if(str==''){
              str+=row2.assetId
            }else {
              str+=','+row2.assetId
            }
          })
        })
      }
      if(str ==''){
        const {data:res}=await this.$http.get('/asset/list/export/1/'+ JSON.stringify(this.form))
        if('undefined' != typeof res.success){
          return this.$message.error(res.message)
        }
        await this.exportExcel('/asset/list/export/1/'+ JSON.stringify(this.form),null,'导出资产信息')
      }else{
        const {data:res}=await this.$http.get('/asset/list/exportByIds/1/' + str)

        if('undefined' != typeof res.success){
          return this.$message.error(res.message)
        }
        await this.exportExcel('/asset/list/exportByIds/1/' + str,null,'导出资产信息')
      }
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    //获取全部资产类型数据，tree结构
    async treeType(){
      const {data:res}=await this.$http.get('/assetType/getAllTypeTree')
      if(!res.success) return;
      this.typesData=res.data
    },
    handleSelectionChange(val) {
      this.temp[this.limit] = val
      this.multipleSelection = val
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    async handleCurrentChange(val) {
      // this.temp[this.limit] = this.multipleSelection
      const {data:res}=await this.$http.post('/asset/' + val + '/' + this.offset,this.form);
      this.tableData = res.data.records
      this.total = res.data.total
      this.limit = res.data.current
      let a = []
      if(this.temp[this.limit]){
        this.temp[this.limit].forEach(row=>{
          this.tableData.forEach(trow=>{
            if(row.assetId == trow.assetId){
              this.$nextTick(()=> {
                this.toggleSelection([trow])
              })
            }
          })
        })
      }
    },
    pointString(row,column){
      let arr=this.changeString(row.pointId,this.pointTreeData)
      return this.beString(arr)
    },
    beString(arr){
      let resultString=''
      arr.forEach(item=>{
        if(resultString==''){
          resultString+=item
        }else {
          resultString+='/'+item
        }
      })
      return resultString
    },
    changeString(val,treeData) {
      let arr = []; // 在递归时操作的数组
      let returnArr = []; // 存放结果的数组
      let depth = 0; // 定义全局层级
// 定义递归函数
      function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
          depth = depthN; // 将执行的层级赋值 到 全局层级
          arr[depthN] = (childrenData[j].pointName);
          if (childrenData[j].id === val) {
            returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
            break
          } else {
            if (childrenData[j].children) {
              depth++;
              childrenEach(childrenData[j].children, depth);
            }
          }
        }
        return returnArr;
      }
      return childrenEach(treeData, depth);
    },
    //获取全部资产类型数据，tree结构
    async pointTree(){
      const {data:res}=await this.$http.get('/point/allTree')
      if(!res.success) return;
      this.pointTreeData=res.data
    },
  }
}
</script>

<style lang="less" scoped>
.inputStyle{
  width: 250px!important;
}
.el-form-item{
  width: 360px!important;
  margin: 0;
}
.el-card{
  margin-bottom: 10px;
}
.el-form{
  height: 40px;
}
.el-button{
  float: right;
  margin-right: 10px;
}
.btnStyle{
  display: flex;//弹性盒子模型
  justify-content: flex-end;
  height: 40px;
}
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
.paginationStyle{
  margin-top: 10px;
  height: 20px;
}
.tableButton{
  float: right;
}
</style>
