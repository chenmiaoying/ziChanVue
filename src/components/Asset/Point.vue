<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>区域管理 >></el-breadcrumb-item>
    </el-breadcrumb>
    <!--    搜索区域-->
    <el-card>
      <el-form label-width="80px" :inline="true" :model="form">
        <el-form-item label="区域站点">
          <el-input v-model="form.pointName" placeholder="支持关键字查询" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="allPoint">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-folder-add" @click="pointDialogVisible=true">新增区域网点</el-button>
        </el-form-item>

      </el-form>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-tree :data="pointTreeData" :props="defaultProps" default-expand-all></el-tree>
        </el-col>
        <el-col :span="16">
          <el-table
            stripe
            border
            :data="pointTableData"
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="id"
              label="区域id"
              width="120">
            </el-table-column>
            <el-table-column
              property="pointName"
              label="区域名称"
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
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditPoint(scope.row)"></el-button>
                </el-tooltip>
                <!--              删除-->
                <el-tooltip effect="dark" content="删除该资产信息" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletePoint(scope.row.id)"></el-button>
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
    <!--    添加区域网点-->
    <el-dialog
      title="添加区域网点"
      :visible.sync="pointDialogVisible"
      width="30%"
      :before-close="pointHandleClose">
      <el-form ref="addPointFormRef" :model="addPointForm" :rules="addPointFormRules" label-width="120px" @close="pointHandleClose">
        <el-form-item label="区域网点" prop="pointName">
          <el-input v-model="addPointForm.pointName" clearable></el-input>
        </el-form-item>
        <el-form-item label="父节点" prop="arr">
          <el-tooltip class="item" effect="dark" content="为空表示该区域站点是最高父节点" placement="bottom">
            <el-cascader
              v-model="addPointForm.arr"
              :options="pointTreeData"
              :props="defaultParams"
              clearable></el-cascader>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="pointHandleClose">取 消</el-button>
    <el-button type="primary" @click="addPoint">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改资产类型-->
    <el-dialog
      title="修改资产类型信息"
      :visible.sync="editPointDialogVisible"
      width="30%"
      :before-close="editPointHandleClose">
      <el-form ref="editPointFormRef" :model="editPointForm" :rules="addPointFormRules" label-width="120px">
        <el-form-item label="资产类型" prop="pointName">
          <el-input v-model="editPointForm.pointName" clearable></el-input>
        </el-form-item>
        <el-form-item label="父节点" prop="arr">
          <el-tooltip class="item" effect="dark" content="为空表示该区域站点是最高父节点" placement="bottom">
            <el-cascader
              v-model="editPointForm.arr"
              :options="pointTreeData"
              :props="defaultParams"
              clearable></el-cascader>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editPointHandleClose">取 消</el-button>
    <el-button type="primary" @click="editPoint">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Point",
    data(){
      return{
        form:{
          pointName:null
        },
        pointTreeData:[],
        pointTableData:[],
        defaultProps: {
          children: 'children',
          label: 'pointName'
        },
        limit: 1,
        offset: 10,
        total: 0,
        pointDialogVisible:false,
        editPointDialogVisible:false,
        addPointForm:{
          pointName: null,
          arr:[],
          pid:null
        },
        editPointForm:{
          pointName: null,
          arr:[],
          pid:null
        },
        addPointFormRules: {
          pointName: [
            {required: true, message: '该信息不可为空', trigger: 'blur'}
          ]
        },
        defaultParams: {
          label: 'pointName',
          value: 'id',
          children: 'children',
          checkStrictly: true
        }
      }
    },
    methods:{
      //获取全部资产类型数据，tree结构
      async pointTree(){
        const {data:res}=await this.$http.get('/point/tree')
        if(!res.success) return;
        this.pointTreeData=res.data
      },
      //获取资产类型所有数据
      async allPoint(){
        const {data:res}=await this.$http.post('/point/list/'+this.limit+'/'+this.offset,this.form)
        if(!res.success) return this.$message.error(res.message)
        this.pointTableData=res.data.records
        this.limit = res.data.current
        this.total = res.data.total
      },
      //监听pagesize,改变每页显示的条数
      handleSizeChange(newSize){
        this.offset=newSize
        this.allPoint()
      },
      //页码值发生变化会触发事件
      handleCurrentChange(newPage){
        this.limit=newPage
        this.allPoint()

      },
      async showEditPoint(val){
        // const {data:res}=await this.$http.post("/point/"+val)
        // if(!res.success) return this.$message.error(res.message)

        this.editPointForm=val
        this.editPointForm.arr=this.changeDetSelect(val.pid,this.pointTreeData)
        this.editPointDialogVisible=true
      },
      pointHandleClose(){
        this.$refs.addPointFormRef.resetFields()
        this.pointDialogVisible = false
      },
      editPointHandleClose(){
        this.$refs.editPointFormRef.resetFields()
        this.editPointDialogVisible = false
      },
      addPoint(){
        this.$refs.addPointFormRef.validate(async valid =>{
          if(!valid) return;

          if(this.addPointForm.arr.length !== 0){
            const ind=this.addPointForm.arr.length
            this.addPointForm.pid=this.addPointForm.arr[ind-1]
          }

          const {data:res}=await this.$http.post('/point/add',this.addPointForm)

          if(!res.success) return this.$message.error(res.message);

          await this.pointTree()
          await this.allPoint()
          this.pointHandleClose()
          this.pointDialogVisible = false
          this.$message.success(res.message)
        })
      },
      editPoint(){
        this.$refs.editPointFormRef.validate(async valid =>{
          if(!valid) return;

          if(this.editPointForm.arr.length !== 0){
            const ind=this.editPointForm.arr.length
            this.editPointForm.pid=this.editPointForm.arr[ind-1]
          }

          const {data:res}=await this.$http.post('/point/update',this.editPointForm)

          if(!res.success) return this.$message.error(res.message);


          await this.pointTree()
          await this.allPoint()
          this.editPointDialogVisible = false
          this.$message.success(res.message)
        })
      },
      async deletePoint(val){
        const info=await this.$confirm('此操作将删除该区域站点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(info !== 'confirm') return;

        const {data:res}=await this.$http.delete('/point/delete/'+val)

        if(!res.success) return this.$message.error(res.message);

        await this.pointTree()
        await this.allPoint()
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
      this.pointTree()
      this.allPoint()
    }
  }
</script>

<style lang="less" scoped>
  .el-card{
    margin-bottom: 10px;
  }

</style>
