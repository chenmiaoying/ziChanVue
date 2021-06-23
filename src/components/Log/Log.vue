<template>
  <div>
    <!--      面包屑区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志</el-breadcrumb-item>
      <el-breadcrumb-item>系统日志 >></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input placeholder="请输入关键字" v-model="searchForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="动作">
          <el-input placeholder="请输入关键字" v-model="searchForm.operation" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.times"
            type="datetimerange"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div class="btnStyle">
        <el-button-group>
          <el-button type="success" size="small" icon="el-icon-refresh" @click="flushThis">刷新</el-button>
          <el-button type="danger"  size="small" icon="el-icon-delete" @click="deleteSelect">删除</el-button>
          <el-button type="primary"  size="small" icon="el-icon-shopping-cart-full" @click="Qing">清空</el-button>
        </el-button-group>
      </div>

      <el-table
        v-loading="logLoading"
        element-loading-text="拼命加载中"
        ref="multipleTable"
        :data="logData"
        @selection-change="selectChange"
        :default-sort = "{prop: 'createTime', order: 'descending'}"
        border
        stripe
        style="width: 100%">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="动作">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="ip地址">
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="创建时间">
        </el-table-column>
        <el-table-column width="100px" label="操作">
          <template #default="scope">
            <el-button class="tableButton"
                       size="mini"
                       type="danger"
                       @click="deleteThis(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationStyle">
        <el-pagination
          style="float: right"
          @current-change="logHandleCurrentChange"
          @size-change="logHandleSizeChange"
          :current-page="this.limit"
          :page-size="this.offset"
          layout="total,sizes,prev, pager, next, jumper"
          :total="this.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "Log",
      data(){
          return{
            limit: 1,
            offset: 10,
            total: 0,
            logLoading:false,
            logData:[],
            searchForm:{
              username:'',
              operation:'',
              times:null
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
            selectStr:''
          }
      },
      methods:{
          search(){
            this.getLog()
          },
          flushThis(){
            this.limit=1
            this.offset=10
            this.searchForm.username=this.searchForm.operation=''
            this.searchForm.times=null
            this.getLog()
          },
        reset(){
          this.searchForm.username=this.searchForm.operation=''
          this.searchForm.times=null
          this.getLog()
        },
          async getLog(){
            const {data:res}=await this.$http.post("/log/list/"+this.limit+"/"+this.offset,this.searchForm)
            if(!res.success) return this.$message.error("查询失败")
            this.logData=res.data.records
            this.limit = res.data.current
            this.total = res.data.total
          },
        logHandleCurrentChange(newPage){
            this.limit=newPage
            this.getLog()
        },
        logHandleSizeChange(newSize){
            this.offset=newSize
            this.getLog()
        },
        async deleteThis(val){
            const {data:res}=await this.$http.delete('/log/queryId?ids='+val)
            if(!res.success) return this.$message.error(res.message)
            await this.getLog()
            this.$message.success(res.message)
        },
        selectChange(val){
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
        async Qing(){
            const {data:res}=await this.$http.post('/log/delQing',this.searchForm)
          if(!res.success) return this.$message.error(res.message)
          this.$message.success(res.message)
          await this.getLog()
        }
      },
      created() {
          this.getLog()
      }
    }
</script>

<style lang="less" scoped>
  .btnStyle{
    display: flex;
    justify-content: flex-end;
    height: 40px;
    margin-bottom: 10px;
  }
  .el-card{
    margin-bottom: 10px;
  }
</style>
