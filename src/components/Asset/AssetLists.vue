<template>
    <div>
<!--      面包屑区域-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产查询</el-breadcrumb-item>
        <el-breadcrumb-item>全部资产 >></el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图区-->
      <el-card>
        <el-form ref="form" :model="form" inline>
          <el-form-item label="资产名称">
            <el-input v-model="form.assetName" placeholder="请输入内容" class="select"></el-input>
          </el-form-item>
          <el-form-item label="资产类型">
            <el-cascader

              v-model="form.arr"
              placeholder="请选择"
              :options="typeData"
              :props="defaultParams"
              clearable></el-cascader>
          </el-form-item>
          <el-form-item label="资产使用人">
            <el-input v-model="form.assetUser" placeholder="请输入内容"></el-input>
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

<!--        用户列表区域-->
        <el-table v-loading="loading"
                  element-loading-text="拼命加载中"
                  :data="records" border stripe ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="资产编号" prop="assetId"></el-table-column>
          <el-table-column label="资产名称" prop="assetName"></el-table-column>
          <el-table-column label="资产类型" prop="assetType"></el-table-column>
          <el-table-column label="资产状况" prop="assetCondition"></el-table-column>
          <el-table-column label="资产创建时间" prop="assetCreatTime"></el-table-column>
          <el-table-column label="资产使用人" prop="assetUser"></el-table-column>
          <el-table-column label="资产管理员" prop="assetHost"></el-table-column>
          <el-table-column label="区域站点" prop="pointAllName"></el-table-column>
          <el-table-column label="是否归还" prop="assetBack" :formatter="isBack"></el-table-column>
          <el-table-column label="操作" width="190px">
            <template slot-scope="scope">
<!--              修改-->
              <el-tooltip effect="dark" content="修改资产信息" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              </el-tooltip>
<!--              删除-->
              <el-tooltip effect="dark" content="删除该资产" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteById(scope.row.assetId)"></el-button>
              </el-tooltip>
<!--              详情-->
              <el-tooltip effect="dark" content="资产维修" placement="top" :enterable="false">
                <el-button type="info" icon="el-icon-setting" size="mini" @click="repairAction(scope.row.assetId)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
<!--        分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="limit"
          :page-size="offset"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>

<!--      修改资产信息对话框-->
      <el-dialog
        title="编辑修改资产信息"
        :visible.sync="editDialogVisible"
        width="60%"
      >
<!--        内容主体区域-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px"
        @close="editDialogClosed"
        >
<!--          prop用与规则对应的字段要求-->
          <el-form-item label="资产名称">
            <el-input v-model="editForm.assetName" disabled></el-input>
          </el-form-item>
          <el-form-item label="资产类型" prop="arr1">
            <el-cascader
              v-model="editForm.arr1"
              placeholder="请选择"
              :options="typeData"
              :props="defaultParams"
              filterable
              change-on-select
              ></el-cascader>
          </el-form-item>
          <el-form-item label="所属区域站点" prop="arr2">
            <el-cascader
              v-model="editForm.arr2"
              placeholder="请选择"
              :options="pointTreeData"
              :props="defaultParamsPoint"
              filterable
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="资产状况" prop="assetCondition">
            <el-input v-model="editForm.assetCondition"></el-input>
          </el-form-item>
          <el-form-item label="资产创建时间" prop="assetCreatTime">
            <el-input v-model="editForm.assetCreatTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="资产使用人" prop="assetUser">
            <el-input v-model="editForm.assetUser"></el-input>
          </el-form-item>
          <el-form-item label="资产管理员">
            <el-input v-model="editForm.assetHost"></el-input>
          </el-form-item>
          <el-form-item label="资产是否归还" prop="assetBack">
            <el-select v-model="editForm.assetBack" placeholder="请选择">
              <el-option
                v-for="item in isBacks"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
<!--        底部区域-->
        <span slot="footer" class="dialog-footer">
           <el-button @click="editDialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="editAssetInfo">确 定</el-button>
        </span>
      </el-dialog>
<!--      删除资产信息对话框的时候对话框-->
      <el-dialog
        title="删除资产信息"
        :visible.sync="deleteDialogVisible"
        width="60%"
      >
        <!--        内容主体区域-->
        <el-form :model="deleteForm" :rules="deleteFormRules" ref="deleFormRef" label-width="120px" @close="deleteDialogClosed">
          <!--          prop用与规则对应的字段要求-->
          <el-form-item label="删除资产原因" prop="assetDeleteReason">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="deleteForm.assetDeleteReason">
            </el-input>
          </el-form-item>
        </el-form>
        <!--        底部区域-->
        <span slot="footer" class="dialog-footer">
           <el-button @click="deleteDialogClosed">取 消</el-button>
           <el-button type="primary" @click="deleteAssetInfo">确 定</el-button>
        </span>
      </el-dialog>
<!--      申请资产维修的对话框-->
      <el-dialog
        title="申请对该资产进行资产维修"
        :visible.sync="repairDialogVisible"
        width="60%"
        :before-close="repairDialogClosed"
      >
        <!--        内容主体区域-->
        <el-form :model="repairForm" :rules="repairFormRules" ref="repairFormRef" label-width="120px">
          <!--          prop用与规则对应的字段要求-->

          <el-form-item label="维修地点" prop="address">
            <el-input v-model="repairForm.address" placeholder="如果资产地点已经变动则填写维修地点"></el-input>
          </el-form-item>
          <el-form-item label="问题描述" prop="repairContent">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入资产出现的问题描述"
              v-model="repairForm.repairContent">
            </el-input>
          </el-form-item>
        </el-form>
        <!--        底部区域-->
        <span slot="footer" class="dialog-footer">
           <el-button @click="repairDialogClosed">取 消</el-button>
           <el-button type="primary" @click="repairAdd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      name: "AssetLists",

      data(){
          return{
            assetName:'',
            styleSelect:'',
            select:'',
            assetUser:'',
            //是否归还
            isBacks: [
              {
                value:0,
                label:'否'
              },
              {
                value:1,
                label:'是'
              }
            ],
            //获取用户列表的参数对象
            limit:1,//当前页数
            offset:10,//每页多少条
            form: {
              assetName: null,
              assetType: null,
              assetUser: null,
              assetDelete: 0,
              arr:null
            },
            //获取到的信息
            total:0,
            records:[],
            temp: [],
            // 控制修改信息对话框的显示与隐藏
            editDialogVisible:false,
            //控制删除资产信息对话框的显示与隐藏
            deleteDialogVisible:false,
            repairDialogVisible:false,
            //添加修改资产信息的表单数据
            editForm:{
              arr1:[],
              arr2:[]
            },
            //加载
            loading:true,
            //添加修改资产信息表单的验证规则对象
            editFormRules:{
                arr1:[
                {type:'array',required:true,message:'该信息不可为空',trigger: 'change'}
              ],
              arr2:[
                {type:'array',required:true,message:'该信息不可为空',trigger: 'change'}
              ],
                assetCondition:[
                    {required:true,message:'该信息不可为空',trigger: 'blur'}
                ],
                assetCreatTime:[
                    {required:true,message:'该信息不可为空',trigger: 'blur'}
                ],
                assetUser:[
                    {required:true,message:'该信息不可为空',trigger: 'blur'}
                ],
                assetBack:[
                    {required:true,message:'该信息不可为空',trigger: 'blur'}
                ]
            },
            deleteId:'',
            deleteForm:{assetDeleteReason:''},
            deleteFormRules:{
              assetDeleteReason:[
                {required:true,message:'该信息不可为空',trigger: 'blur'}
              ]
            },
            typeData:[],
            defaultParams: {
              label: 'assetType',
              value: 'id',
              children: 'children',
              checkStrictly: true
            },
            repairForm:{
              assetId:null,
              repairContent:null,
              address:null
            },
            repairFormRules:{
              repairContent:[
                {required:true,message:'该信息不可为空',trigger: 'blur'},
                {min:2,max:500,message: '请输入2-500数量之间的内容',trigger: 'blur'}
              ]
            },
            pointTreeData:[],
            defaultParamsPoint:{
              label: 'pointName',
              value: 'id',
              children: 'children',
              checkStrictly: true
            }
          }
      },
      methods: {
        async search(){
          if(this.form.arr!==null && this.form.arr.length !== 0){
            const ind=this.form.arr.length
            this.form.assetType=this.form.arr[ind-1]
          }else {
            this.form.assetType=null
          }
          const {data:res}=await this.$http.post('/asset/' + this.limit + '/' + this.offset,this.form);
          this.records = res.data.records
          this.limit = res.data.current
          this.total = res.data.total
        },
        async reset(){
          this.form.assetName = this.form.assetType = this.form.assetUser =null;
          const {data:res}=await this.$http.post('/asset/' + 0 + '/' + this.offset,this.form);
          this.records = res.data.records
          this.limit = res.data.current
          this.total = res.data.total
        },
        changeDetSelect(val,treeData) {
          let arr = []; // 在递归时操作的数组
          let returnArr = []; // 存放结果的数组
          let depth = 0; // 定义全局层级
// 定义递归函数
          function childrenEach(childrenData, depthN) {
            for (var j = 0; j < childrenData.length; j++) {
              depth = depthN; // 将执行的层级赋值 到 全局层级
              arr[depthN] = (childrenData[j].id);
              if (childrenData[j].assetType === val) {
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
        //导出
        async exportFile(){
          var str = ''
          if(this.temp.length !== 0){
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
            const {data:res}=await this.$http.get('/asset/list/export/0/'+ JSON.stringify(this.form))
            if('undefined' != typeof res.success){
              return this.$message.error(res.message)
            }
            await this.exportExcel('/asset/list/export/0/'+JSON.stringify(this.form),null,'导出资产信息')
          }else{
            const {data:res}=await this.$http.get('/asset/list/exportByIds/0/'+ str)
            if('undefined' != typeof res.success){
              return this.$message.error(res.message)
            }
            await this.exportExcel('/asset/list/exportByIds/0/' + str,null,'导出资产信息')
          }
        },
        async getAssetList(){
          const {data:res}=await this.$http.post('/asset/'+ this.limit + '/' + this.offset,this.form)
          if (!res.success){
            return this.$message.error(res.message);
          }
          this.records=res.data.records
          this.total=res.data.total
          this.loading=false;
        },
        isBack(row, column){
          if (row.assetBack === 1) {
            return '是'
          } else  {
            return '否'
          }
        },
        //监听pagesize,改变每页显示的条数
        handleSizeChange(newSize){
          this.offset=newSize
          this.getAssetList()
        },
        //页码值发生变化会触发事件
        async handleCurrentChange(newPage){
          const {data:res}=await this.$http.post('/asset/' + newPage + '/' + this.offset,this.form);
          this.records = res.data.records
          this.total = res.data.total
          this.limit = res.data.current
          if(this.temp[this.limit]){
            this.temp[this.limit].forEach(row=>{
              this.records.forEach(trow=>{
                if(row.assetId == trow.assetId){
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
          this.temp[this.limit]=val
          // //多选返回的值multipleSelection
          // this.multipleSelection=val

        },
        //toggleRowSelection(row, selected)接受两个参数，row传递被勾选行的数据，selected设置是否选中
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        },
        //展示编辑会话框
         async showEditDialog(val){
         // const {data:res}=await this.$http.get("/asset/"+val)
         //  if (!res.success){
         //    return this.$message.error(res.message)
         //  }
          this.editForm=val
           this.editForm.arr1=this.changeDetSelect(val.assetType,this.typeData)
           this.editForm.arr2=this.changePoint(val.pointId,this.pointTreeData)
          this.editDialogVisible=true
        },
        // 监听修改对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        deleteDialogClosed(){
          this.$refs.deleFormRef.resetFields()
          this.deleteDialogVisible = false
        },
          //修改资产信息并提交
          editAssetInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return;
                //发起修改用户信息的请求
              const ind1=this.editForm.arr1.length
              this.editForm.assetType=this.editForm.arr1[ind1-1]

              this.editForm.pointAllName=this.beIdsStrG(this.editForm.arr2)
                const {data:res}=await this.$http.post("/asset/update",this.editForm)
                if (!res.success) return this.$message.success("修改失败")
                //关闭对话框
                this.editDialogVisible=false
                //刷新数据列表
                this.getAssetList()
                //提示修改成功
                this.$message.success("修改成功")
            })
          },
          //展示删除资产对话框
          async showDeleteById(val){
            this.deleteId=val
            this.deleteDialogVisible=true
          },
        //删除资产对话框
        async deleteAssetInfo(){
          this.$refs.deleFormRef.validate(async valid=>{
            if(!valid) return
            //询问用户是否确认删除
            const info=await this.$confirm('此操作将删除该资产, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err=>err)
            if(info !== 'confirm') return
            //发起删除用户信息的请求
            const {data:delet}=await this.$http.delete("/asset/"+this.deleteId+"/"+this.deleteForm.assetDeleteReason)
            this.deleteDialogVisible=false
            if(!delet.success) return this.$message.error(delet.message)
            this.$message.success('删除资产成功')
            this.getAssetList()
          })
        },
        //获取全部资产类型数据，tree结构
        async treeType(){
          const {data:res}=await this.$http.get('/assetType/getTypeTree')
          if(!res.success) return;
          this.typeData=res.data
        },
        repairAction(val){
          this.repairForm.assetId=val
          this.repairDialogVisible=true
        },
        repairDialogClosed(){
          this.$refs.repairFormRef.resetFields()
          this.repairDialogVisible=false
        },
        repairAdd(){
          this.$refs.repairFormRef.validate(async valid=> {
            if (!valid) return;
            const {data:res}=await this.$http.post('/repair/add',this.repairForm)
            if(!res.success) return this.$message.error(res.message)
            this.repairDialogVisible=false
            this.$message.success(res.message)
          })
        },
        //获取全部资产类型数据，tree结构
        async pointTree(){
          const {data:res}=await this.$http.get('/point/tree')
          if(!res.success) return;
          this.pointTreeData=res.data
        },
        changePoint(key,treeData) {
          let arr = []; // 在递归时操作的数组
          let returnArr = []; // 存放结果的数组
          let depth = 0; // 定义全局层级
// 定义递归函数
          function childrenEach(childrenData, depthN) {
            for (var j = 0; j < childrenData.length; j++) {
              depth = depthN; // 将执行的层级赋值 到 全局层级
              arr[depthN] = (childrenData[j].id);
              if (childrenData[j].id == key) {
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
        }
      },
      created() {
        this.pointTree()
        this.loading=true;
        this.treeType()
        this.getAssetList()
      }
    }
</script>

<style lang="less" scoped>
 .btnStyle{
   display: flex;//弹性盒子模型
   justify-content: flex-end;
   height: 40px;
 }
 .select{
   margin-left:-6px;
 }
 .time{
   margin-left:-5.5px;
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
