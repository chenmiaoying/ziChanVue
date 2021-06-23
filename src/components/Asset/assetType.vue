<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>资产类型管理 >></el-breadcrumb-item>
    </el-breadcrumb>
<!--    搜索区域-->
    <el-card>
      <el-form ref="formRef" :model="typeForm" label-width="80px" :inline="true">
        <el-form-item label="资产类型">
          <el-input v-model="typeForm.assetType" placeholder="支持关键字查询" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="allType">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-folder-add" @click="typeDialogVisible=true">新增资产类型</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-tree :data="typeData" :props="defaultProps" default-expand-all></el-tree>
        </el-col>
        <el-col :span="16">
          <el-table
            ref="typesRef"
            stripe
            border
            :data="typeTableData"
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="id"
              label="类型id"
              width="120">
            </el-table-column>
            <el-table-column
              property="assetType"
              label="资产类型"
              width="120">
            </el-table-column>
            <el-table-column
              property="pid"
              label="父节点"
            >
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <!--              修改-->
                <el-tooltip effect="dark" content="修改资产类型信息" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditType(scope.row)"></el-button>
                </el-tooltip>
                <!--              删除-->
                <el-tooltip effect="dark" content="删除该资产信息" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteType(scope.row.id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationStyle">
            <el-pagination
              style="float: right"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :current-page="this.limit"
              :page-size="this.offset"
              layout="total,sizes,prev, pager, next, jumper"
              :total="this.total">
            </el-pagination>
          </div>

        </el-col>
      </el-row>

    </el-card>
<!--    添加资产类型-->
    <el-dialog
      title="添加资产类型"
      :visible.sync="typeDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="addTypeFormRef" :model="addTypeForm" :rules="addTypeFormRules" label-width="120px">
        <el-form-item label="资产类型" prop="assetType">
          <el-input v-model="addTypeForm.assetType" clearable></el-input>
        </el-form-item>
        <el-form-item label="父节点" prop="arr">
          <el-tooltip class="item" effect="dark" content="为空表示该资产类型是最高父节点" placement="bottom">
            <el-cascader
              v-model="addTypeForm.arr"
              :options="typeData"
              :props="defaultParams"
              clearable></el-cascader>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="addAssetType">确 定</el-button>
  </span>
    </el-dialog>
<!--    修改资产类型-->
    <el-dialog
      title="修改资产类型信息"
      :visible.sync="editTypeDialogVisible"
      width="30%"
      :before-close="editHandleClose">
      <el-form ref="editTypeFormRef" :model="editTypeForm" :rules="addTypeFormRules" label-width="120px">
        <el-form-item label="资产类型" prop="assetType">
          <el-input v-model="editTypeForm.assetType" clearable></el-input>
        </el-form-item>
        <el-form-item label="父节点" prop="arr">
          <el-tooltip class="item" effect="dark" content="为空表示该资产类型是最高父节点" placement="bottom">
            <el-cascader
              v-model="editTypeForm.arr"
              :options="typeData"
              :props="defaultParams"
              clearable></el-cascader>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editHandleClose">取 消</el-button>
    <el-button type="primary" @click="editAssetType">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "assetType",
      data(){
          return{
            typeForm:{
              assetType:null
            },
            typeData:[],
            typeTableData:[],
            defaultProps: {
              children: 'children',
              label: 'assetType'
            },
            limit: 1,
            offset: 10,
            total: 0,
            typeDialogVisible:false,
            editTypeDialogVisible:false,
            addTypeForm:{
              assetType: null,
              arr:[],
              pid:null
            },
            editTypeForm:{
              assetType: null,
              arr:[],
              pid:null
            },
            addTypeFormRules: {
              assetType: [
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ]
            },
            defaultParams: {
              label: 'assetType',
              value: 'id',
              children: 'children',
              checkStrictly: true
            }
          }
      },
      methods:{
        //获取全部资产类型数据，tree结构
        async treeType(){
          const {data:res}=await this.$http.get('/assetType/getTypeTree')
          if(!res.success) return;
          this.typeData=res.data
        },
        //获取资产类型所有数据
        async allType(){
          const {data:res}=await this.$http.post('/assetType/list/'+this.limit+'/'+this.offset,this.typeForm)
          if(!res.success) return this.$message.error(res.message)
          this.typeTableData=res.data.records
          this.limit = res.data.current
          this.total = res.data.total
        },
        //监听pagesize,改变每页显示的条数
        handleSizeChange(newSize){
          this.offset=newSize
          this.allType()
        },
        //页码值发生变化会触发事件
        handleCurrentChange(newPage){
          this.limit=newPage
          this.allType()

        },
        async showEditType(val){
          // const {data:res}=await this.$http.post("/assetType/getType/"+val)
          // if(!res.success) return this.$message.error(res.message)
          this.editTypeForm=val
          this.editTypeForm.arr=this.changeDetSelect(val.pid,this.typeData)
          this.editTypeDialogVisible=true
        },
        handleClose(){
          this.$refs.addTypeFormRef.resetFields()
          this.typeDialogVisible = false
        },
        editHandleClose(){
          this.$refs.editTypeFormRef.resetFields()
          this.editTypeDialogVisible = false
        },
        addAssetType(){
          this.$refs.addTypeFormRef.validate(async valid =>{
            if(!valid) return;

            if(this.addTypeForm.arr.length !== 0){
              const ind=this.addTypeForm.arr.length
              this.addTypeForm.pid=this.addTypeForm.arr[ind-1]
            }

            const {data:res}=await this.$http.post('/assetType/add',this.addTypeForm)

            if(!res.success) return this.$message.error(res.message);

            await this.allType()
            await this.treeType()
            this.typeDialogVisible = false
            this.$message.success(res.message)
          })
        },
        editAssetType(){
          this.$refs.editTypeFormRef.validate(async valid =>{
            if(!valid) return;

            if(this.editTypeForm.arr.length !== 0){
              const ind=this.editTypeForm.arr.length
              this.editTypeForm.pid=this.editTypeForm.arr[ind-1]
            }

            const {data:res}=await this.$http.post('/assetType/update',this.editTypeForm)

            if(!res.success) return this.$message.error(res.message);

            await this.allType()
            await this.treeType()
            this.editTypeDialogVisible = false
            this.$message.success(res.message)
          })
        },
        async deleteType(val){
          const info=await this.$confirm('此操作将删除该资产类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          if(info !== 'confirm') return;

          const {data:res}=await this.$http.delete('/assetType/'+val)

          if(!res.success) return this.$message.error(res.message);

          await this.allType()
          await this.treeType()
          this.$message.success(res.message)
        },
        changeDetSelect(key,treeData) {
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
        this.treeType()
        this.allType()
      }
    }
</script>

<style lang="less" scoped>
  .el-card{
    margin-bottom: 10px;
  }

</style>
