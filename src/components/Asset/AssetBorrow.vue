<template>
  <div>
    <!--      面包屑区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工单查询</el-breadcrumb-item>
      <el-breadcrumb-item>借用工单 >></el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区-->
    <el-card>
      <el-form ref="formRef" :model="checkForm" label-width="60px" :inline="true">
        <el-form-item label="资产名">
          <el-input clearable class="inputStyle" v-model="checkForm.assetName"></el-input>
        </el-form-item>
        <el-form-item label="审核人">
          <el-input clearable class="inputStyle" v-model="checkForm.checkPeople"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="checkForm.status" placeholder="请选择" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Search" icon="el-icon-search">搜索</el-button>
          <el-button type="success" icon="el-icon-folder-add" @click="addCheckDialogVisible=true">新增借用工单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未结束工单" name="first">
        <el-card>
          <el-table
            ref="checkTableRef"
            stripe
            border
            :data="checkData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <span style="size: 12px;font-weight:bold">基本信息</span>
                <div class="detailDiv">
                  工单号:&nbsp;&nbsp;&nbsp;{{props.row.bcId}}<br/>
                  发起人:&nbsp;&nbsp;&nbsp;{{props.row.startPeople}}<br/>
                  资产名称:&nbsp;&nbsp;&nbsp;{{props.row.assetName}}<br/>
                  发起时间:&nbsp;&nbsp;&nbsp;{{props.row.applyTime}}<br/>
                  审批人:&nbsp;&nbsp;&nbsp;{{props.row.checkPeople}}<br/>
                  审核时间:&nbsp;&nbsp;&nbsp;{{props.row.checkTime}}<br/>
                  预计归还时间:&nbsp;&nbsp;&nbsp;{{props.row.expReturnTime}}<br/>
                  借用原因:&nbsp;&nbsp;&nbsp;{{props.row.reason}}<br/>
                </div>
                <el-divider></el-divider>
                <span style="size: 12px;font-weight: bold">工单流程</span>

                <div class="liuCheng">
                  <el-steps :space="200" :active="getLiuCheng(props.row.status).length-1" finish-status="success">
                    <el-step :title="item" v-for="(item,index) in getLiuCheng(props.row.status)" :key="index"></el-step>
                  </el-steps>
                </div>
                <div style="padding-left:4em;" v-if="selfFlag(props.row.status)">
                  点击下载<el-link :underline="false" type="primary" style="size: 12px" @click="downUse(props.row.bcId)">领用单</el-link>
                </div>
                <div style="padding-left:4em;" v-if="props.row.status===1">
                  借用拒绝原因:&nbsp;&nbsp;&nbsp;{{props.row.refuseReason}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="bcId"
              label="工单号"
              width="50">
            </el-table-column>
            <el-table-column
              property="startPeople"
              label="发起人"
              width="80">
            </el-table-column>
            <el-table-column
              property="applyTime"
              label="发起时间">
            </el-table-column>
            <el-table-column
              property="expReturnTime"
              label="预计归还时间">
            </el-table-column>
            <el-table-column
              property="assetName"
              label="资产名称"
              width="100"
            >
            </el-table-column>
            <el-table-column
              property="checkPeople"
              label="审核人"
            width="80">
            </el-table-column>
            <el-table-column
              property="checkTime"
              label="审核时间">
            </el-table-column>
            <el-table-column
              property="status"
              label="工单状态"
              width="80"
            >
              <template slot-scope="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{getStatusText(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button :type="getStatusActionType(scope.row.status)" size="mini" @click="actionCheck(scope.row.status,scope.row.bcId)">{{getStatusAction(scope.row.status)}}</el-button>
                <el-button v-if="scope.row.status===4" type="primary" size="mini" @click="showMoreDig(scope.row.bcId)">延期借用</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="paginationStyle">
            <el-pagination
              style="float: right"
              @current-change="borrowHandleCurrentChange"
              @size-change="borrowHandleSizeChange"
              :current-page="this.limit"
              :page-size="this.offset"
              layout="total,sizes,prev, pager, next, jumper"
              :total="this.total">
            </el-pagination>
          </div>

        </el-card>
      </el-tab-pane>
      <el-tab-pane label="已结束工单" name="second">
        <el-card>
          <el-table
            ref="closeTableRef"
            stripe
            border
            :data="checkData"
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="bcId"
              label="工单号"
              width="80">
            </el-table-column>
            <el-table-column
              property="startPeople"
              label="发起人"
              width="80">
            </el-table-column>
            <el-table-column
              property="applyTime"
              label="发起时间">
            </el-table-column>
            <el-table-column
              property="expReturnTime"
              label="预计归还时间">
            </el-table-column>
            <el-table-column
              property="assetName"
              label="资产名称"
              width="100"
            >
            </el-table-column>
            <el-table-column
              property="checkPeople"
              label="审核人"
              width="80">
            </el-table-column>
            <el-table-column
              property="checkTime"
              label="审核时间">
            </el-table-column>
            <el-table-column
              property="status"
              label="工单状态">
              <template slot-scope="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{getStatusText(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div class="paginationStyle">
            <el-pagination
              style="float: right"
              @current-change="borrowHandleCurrentChange"
              @size-change="borrowHandleSizeChange"
              :current-page="this.limit"
              :page-size="this.offset"
              layout="total,sizes,prev, pager, next, jumper"
              :total="this.total">
            </el-pagination>
          </div>

        </el-card>
      </el-tab-pane>
    </el-tabs>
<!--    新增借用工单-->
    <el-dialog
      title="发起借用工单"
      :visible.sync="addCheckDialogVisible"
      width="40%"
      :before-close="checkClosed"
      >
      <el-form ref="addCheckRef" :model="addCheckForm" :rules="addCheckRules" label-width="120px">
        <el-form-item label="借用资产" prop="values">
          <el-cascader
            clearable
            v-model="addCheckForm.values"
            :options="serviceFields.options"
            :props="serviceFields.defaultParams"
            :show-all-levels="false"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="预计归还时间" prop="expReturnTime">
          <el-date-picker
            v-model="addCheckForm.expReturnTime"
            type="datetime"
            placeholder="选择日期时间"
            align="center"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="借用原因" prop="reason">
          <el-input v-model="addCheckForm.reason" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="checkClosed">取 消</el-button>
    <el-button type="primary" @click="addCheckWork">确 定</el-button>
  </span>
    </el-dialog>
<!--    延期-->
    <el-dialog
      title="延期借用"
      :visible.sync="moreDialogVisible"
      width="40%"
      :before-close="moreCheckClosed"
    >
      <el-form ref="moreCheckRef" :model="moreCheck" :rules="moreCheckRules" label-width="120px">
        <el-form-item label="预计归还时间" prop="afMoreTime">
          <el-date-picker
            v-model="moreCheck.afMoreTime"
            type="datetime"
            placeholder="选择日期时间"
            align="center"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="延期原因" prop="moreReason">
          <el-input v-model="moreCheck.moreReason" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="moreCheckClosed">取 消</el-button>
    <el-button type="primary" @click="moreTime">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "AssetBorrow",
      data(){
          return{
            checkForm:{
              assetName:null,
              checkPeople:null,
              status:null,
              workStatus:1
            },
            options: [{
              value: 1,
              label: '待审核'
            }, {
              value: 2,
              label: '已通过'
            }, {
              value: 3,
              label: '不通过'
            }],
            checkData:[],
            closeData:[],
            limit: 1,
            offset: 10,
            total: 1,
            //被激活的页签的名称
            activeName:'first',
            addCheckDialogVisible:false,
            addCheckForm:{
              values:[],
              assetName:null
            },
            assetTypeOptions:[],
            addCheckRules: {
              values: [
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              reason: [
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              expReturnTime:[
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ]
            },
            pickerOptions: {
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一周前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }]
            },
            serviceFields:{
              options:[],
              assetNameValue:[],
              defaultParams: {
                label: 'value1',
                value: 'value1',
                children: 'assetName'
              }
            },
            moreDialogVisible:false,
            moreCheck:{
              bcId:null,
              moreReason:null,
              afMoreTime:null
            },
            moreCheckRules: {
              moreReason: [
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ],
              afMoreTime:[
                {required: true, message: '该信息不可为空', trigger: 'blur'}
              ]
            }
          }
      },
      methods:{
          async getCheck(){
            const {data:res}=await this.$http.post("/check/list/"+this.limit+"/"+this.offset,this.checkForm)
            if(!res.success) return this.$message.error("查询失败")
            this.checkData=res.data.records
            this.limit = res.data.current
            this.total = res.data.total
          },
        handleClick(tab, event) {
          if(tab.name==='second'){
            this.checkData=[]
            this.checkForm.workStatus=0
            this.getCheck()
          }
          if(tab.name==='first'){
            this.checkData=[]
            this.checkForm.workStatus=1
            this.getCheck()
          }
        },
        checkClosed(){
            this.$refs.addCheckRef.resetFields()
          this.addCheckDialogVisible=false
        },
        moreCheckClosed(){
          this.$refs.moreCheckRef.resetFields()
          this.moreCheckDialogVisible=false
        },
        //监听pagesize,改变每页显示的条数
        borrowHandleSizeChange(newSize){
          this.offset=newSize
          this.getCheck()
        },
        //页码值发生变化会触发事件
        async borrowHandleCurrentChange(newPage){
            this.limit=newPage
            await this.getCheck()

        },
        async Search(){
          await this.getCheck()
        },
        //发起借用工单
        addCheckWork(){
            this.$refs.addCheckRef.validate(async valid =>{
              if(!valid) return;
              this.addCheckForm.assetName=this.addCheckForm.values[1]
              const {data:res}=await this.$http.post('/check/borrowCheck',this.addCheckForm)
              if(!res.success) return this.$message.error(res.message)
              this.$message.success(res.message)
              this.addCheckDialogVisible=false
            })
        },
        getStatusType(statusType){
          const tagColor = {
            0: 'info',
            1: 'danger',
            2: '',
            3: '',
            4: 'warning',
            5: 'success'
          }
          return tagColor[statusType]
        },
        //匹配状态
        getStatusText(status) {
          const tagText= {
            0: '待审核',
            1: '审核不通过',
            2: '待领用',
            3: '待归还',
            4: '逾期未归还',
            5: '归还待确认',
            6: '已归还'
          };
          return tagText[status]
        },
        getStatusActionType(statusType){
          const tagColor = {
            0: 'danger',
            1: 'danger',
            2: 'primary',
            3: 'success',
            4: 'warning',
            5: 'success',
            6: 'danger'
          }
          return tagColor[statusType]
        },
        getStatusAction(status) {
          const tagAction= {
            0: '结束',
            1: '结束',
            2: '领用',
            3: '归还',
            4: '归还',
            5: '归还',
            6: '结束'
          };
          return tagAction[status]
        },
        async getNames(){
           const {data:res}=await this.$http.get('/asset/getAssetName')
          if(!res.success) return;
          this.serviceFields.options=res.data
        },
        async closeCheck(val){
          const info=await this.$confirm('此操作将永久关闭该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if(info !== 'confirm') return;
          const {data:res}=await this.$http.delete('/check/close/'+val);
          if(!res.success){
            return this.$message.error(res.message)
          }
          this.$message.success(res.message)
          await this.getCheck()
        },
        async assetGet(val){
          const {data:res}=await this.$http.post('/check/use/'+val);
          if(!res.success){
            return this.$message.error(res.message)
          }
          await this.getCheck()
          this.$message.success(res.message)
          this.downUse(val)
        },
        async assetBack(val){
          const {data:res}=await this.$http.post('/check/back/'+val);
          if(!res.success){
            return this.$message.error(res.message)
          }
          this.$message.success(res.message)
          await this.getCheck()
        },
        async moreTime(){
          const {data:res}=await this.$http.post('/check/moreTime',this.moreCheck);
          if(!res.success){
            return this.$message.error(res.message)
          }
          this.$message.success(res.message)
          await this.getCheck()
        },
        actionCheck(key,val){
            switch (key) {
              case 2:
                this.assetGet(val)
                break;
              case 3:
                this.assetBack(val)
                break;
              case 4:
                this.assetBack(val)
                break;
              default:
                this.closeCheck(val)
                break;

            }
        },
        getLiuCheng(val){
          const arr= {
            0: ['工单创建', '审核中'],
            1: ['工单创建','审核完毕，未通过','待关闭'],
            2: ['工单创建','审核完毕，已通过','待领用'],
            3: ['工单创建','审核完毕，已通过','已领用','待归还'],
            4: ['工单创建','审核完毕，已通过','已领用','已逾期','待归还'],
            5: ['工单创建','审核完毕，已通过','已领用','发起归还','归还确认中'],
            6: ['工单创建','审核完毕，已通过','已领用','发起归还','归还确认','待结束']
          }

          return arr[val];
        },
        selfFlag(val){
            if(val===0 || val===1){
              return false
            }
            return true
        },
        showMoreDig(val){
          this.moreCheck.bcId=val
          this.moreCheckDialogVisible=true
        },
        downUse(val){
          this.$http.get('/check/use/download/'+val,{responseType: 'blob'}).then((data)=>{
            // console.log(data)vnd.openxmlformats-officedocument.wordprocessingml.document
            let blob = new Blob([data.data],{ type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'});
            let objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a')
            link.href = objectUrl
            link.download = '资产领用单' // 自定义文件名
            link.click() // 下载文件
            URL.revokeObjectURL(objectUrl); // 释放内存
            // window.location.href = objectUrl;
          })

        }
      },
      async created() {
        await  this.getCheck()
        await this.getNames()
      }
    }
</script>

<style lang="less" scoped>
  .inputStyle{
    width: 222px!important;
  }
  .el-card{
    margin-bottom: 10px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.25) !important;
  }
  .paginationStyle{
    margin-top: 10px;
    height: 20px;
  }
  .detailDiv{
    padding-left:4em;
    margin-top: 4px;
    line-height: 25px;
  }
  .liuCheng{
    padding-left:4em;
    margin-top: 30px;
    margin-bottom: 30px;
  }

</style>
