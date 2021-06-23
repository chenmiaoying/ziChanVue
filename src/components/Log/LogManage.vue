<template>
    <div>
      <!--      面包屑区域-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>日志管理 >></el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-form :model="searchForm" inline>
          <el-form-item label="名称">
            <el-input placeholder="请输入关键字" v-model="searchForm.apiDescribe" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
            <el-button type="success" icon="el-icon-folder-add" @click="logDialogVisible=true">新增</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-button size="mini" type="danger" @click="deleteSelect" plain>删除</el-button>
        <el-table
          ref="multipleTable"
          :data="logManageData"
          @selection-change="selectApiChange"
          stripe
          style="width: 100%">

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="55"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="id"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="url"
            label="url">
          </el-table-column>
          <el-table-column
            prop="apiDescribe"
            label="url名称">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column width="100px" label="操作">
            <template #default="scope">
              <el-button size="mini"
                         type="danger"
                         @click="deleteThis(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-pagination
            style="float: right"
            @current-change="logMHandleCurrentChange"
            @size-change="logMHandleSizeChange"
            :current-page="this.limit"
            :page-size="this.offset"
            layout="total,sizes,prev, pager, next, jumper"
            :total="this.total">
          </el-pagination>
        </div>
      </el-card>
<!--      添加日志管理接口-->
      <el-dialog
        title="新增需要监控的接口日志管理"
        :visible.sync="logDialogVisible"
        width="50%"
        >
        <div style="display: flex ;justify-content: center;align-items: center;">
          <el-transfer v-model="behaviorApi"
                       :props="{key: 'id',label: 'apiActionName'}"
                       :data="allApi"></el-transfer>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="closeTransfer">取 消</el-button>
    <el-button type="primary" @click="addBehaviorApi">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "LogManage",
      data(){
          return{
            searchForm:{
              apiDescribe:''
            },
            limit:1,
            offset:10,
            total:0,
            logManageData:[],
            allApi:[],
            behaviorApi:[],
            selectStr:[],
            logDialogVisible:false
        }
      },
      methods:{
        search(){
          this.limit=1
          this.getLogUrl()
        },
        reset(){
          this.searchForm.apiDescribe=''
        },
        async getLogUrl(){
          const {data:res}=await this.$http.post('/log/menage/'+this.limit+'/'+this.offset,this.searchForm)
          if(!res.success) return this.$message.error(res.message)
          this.logManageData=res.data.records
          this.limit = res.data.current
          this.total = res.data.total
        },
        logMHandleCurrentChange(newPage){
          this.limit=newPage
          this.getLogUrl()
        },
        logMHandleSizeChange(newSize){
          this.offset=newSize
          this.getLogUrl()
        },
        async getAllApi(){
          const {data:res}=await this.$http.get('/log/menage/allApi')
          if(!res.success) return this.$message.error(res.message)
          this.allApi=res.data
        },
        async deleteThis(val){
          const {data:res}=await this.$http.delete('/log/menage?ids='+val)
          if(!res.success) return this.$message.error(res.message)
          this.limit=1
          await this.getLogUrl()
          this.$message.success(res.message)
        },
        selectApiChange(val){
          let str=''
          val.forEach(item => {
            if(str===''){
              str+=item.id;
            }else{
              str+=','+item.id;
            }
          })
          this.selectStr=str
        },
        deleteSelect(){
          this.deleteThis(this.selectStr)
        },
        async addBehaviorApi(){
          let idStr=''
          idStr=this.beIdsStrG(this.behaviorApi)
          const {data:res}=await this.$http.post('/log/addBehavior?ids='+idStr)
          if(!res.success) return this.$message.error(res.message)
          await this.getLogUrl()
          this.$message.success(res.message)
          this.logDialogVisible=false
        },
        closeTransfer(){
          this.behaviorApi=null
          this.logDialogVisible=false
        }
      },
      created() {
        this.getLogUrl()
        this.getAllApi()
      }
    }
</script>

<style scoped>

</style>
