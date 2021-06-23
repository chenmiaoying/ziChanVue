<template>
    <div>
      <el-row>
        <el-col :span="24">
          <el-card style="height: 8%;">
          <el-form :model="queryForm" inline>
            <el-form-item label="起止时间">
              <el-date-picker
                v-model="queryForm.times"
                type="datetimerange"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="center">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" round @click="search">查询</el-button>
            </el-form-item>
          </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-card shadow="hover" >
                <el-row>
                  <el-col :span="10" type="flex" justify="center" align="middle">
                    <div>
                      <el-avatar :size="60" icon="el-icon-s-order" style="background-color: #8de238">
                      </el-avatar>
                    </div>
                    <div v-if="retsum.flag===1">
                      平台用户总数
                    </div>
                    <div v-else>
                      管理资产总数
                    </div>
                  </el-col>
                  <el-col :span="14" type="flex" justify="center" align="middle" style="font-size: 30px;font-weight: bold;color: #3a8ee6;line-height: 84px">
                    <div v-model="users">
                      {{users}}
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <el-row>
                  <el-col :span="10" type="flex" justify="center" align="middle">
                    <div>
                      <el-avatar :size="60" icon="el-icon-s-order" style="background-color: #74d2bc">
                      </el-avatar>
                    </div>
                    <div v-model="retsum.flag" v-if="retsum.flag===1">
                      平台资产总数
                    </div>
                    <div v-else>
                      待归还资产数
                    </div>
                  </el-col>
                  <el-col :span="14" type="flex" justify="center" align="middle" style="font-size: 30px;font-weight: bold;color: #3a8ee6;line-height: 84px">
                    <div v-model="assets">
                      {{assets}}
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-card body-style="height:333px">
                <div style="padding-bottom: 10px">
                  <span style="padding-right: 10px;font-weight: bold;font-size: 18px">日志记录</span>
                  <el-button size="mini" round type="primary" @click="goLog">查看</el-button>
                  <div style="padding-top: 10px">
                    <table style="border-collapse:collapse;table-layout:fixed;" width="100%">
                      <tr>
                        <th class="thclass">序号</th>
                        <th class="thclass">事件</th>
                        <th class="thclass">日期</th>
                      </tr>
                    </table>
                  </div>
                </div>
                <div>
<!--                  v-for="(item,index) in noticeManage" :key="index" v-if="index < 5"-->
                  <vue-seamless-scroll :data="secondData" class="seamless-warp" :class-option="classOption">
                    <el-table
                      :data="secondData"
                      stripe
                      style="width: 100%"
                      v-for="(item,index) in secondData"
                      :key="index"
                      v-if="index < 5"
                      >
                      <el-table-column
                        fixed
                        type="index"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="operation"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="createTime"
                      >
                      </el-table-column>
                    </el-table>
                  </vue-seamless-scroll>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-card body-style="height:500px">
            <div style="padding-bottom: 10px">
              <span style="padding-right: 10px;font-weight: bold;font-size: 18px">待办事项</span>
              <el-tooltip class="item" effect="dark" content="默认跳转到审核页面" placement="right-start">
                <el-button size="mini" round type="success" @click="toCheck">处理</el-button>
              </el-tooltip>
              <div style="padding-top: 10px">
                <table style="border-collapse:collapse;table-layout:fixed;" width="100%">
                  <tr>
                    <th class="thclass">序号</th>
                    <th class="thclass">待办</th>
                    <th class="thclass">日期</th>
                  </tr>
                </table>
              </div>
            </div>
            <div>
              <vue-seamless-scroll :data="doListData" class="seamless-warp" :class-option="classOption">
                <el-table
                  :data="doListData"
                  stripe
                  style="width: 100%"
                  v-for="(item,index) in secondData"
                  :key="index"
                  v-if="index < 9"
                  >
                  <el-table-column
                    fixed
                    type="index"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="action"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    >
                  </el-table-column>
                </el-table>
              </vue-seamless-scroll>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import vueSeamlessScroll from 'vue-seamless-scroll'
    export default {
        name: "Welcome",
      data(){
          return{
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
            doListData:[],
            queryForm:{
              times:[]
            },
            secondData:[],
            users:0,
            assets:0,
            retsum:{}
          }
      },
      methods:{
        search(){
          this.getSecondData()
          this.getDoListData()
        },
        goLog(){
          this.$router.push('/syslog')
        },
        toCheck(){
          this.$router.push('/borrowCheck')
        },
        getToday(){
          const end = new Date();
          const start = new Date();
          start.setTime(new Date(Date.now()).setHours(0,0,0,0));
          this.queryForm.times=[start, end]

        },

        async getDoListData(){
          const {data:res}=await this.$http.post('/doList',this.queryForm)
          if(!res.success) return this.$message.error(res.message)
          this.doListData=res.data
        },
        async getSecondData(){
          const {data:res}=await this.$http.post('/log/list',this.queryForm)
          if(!res.success) return this.$message.error(res.message)
          this.secondData=res.data
        },
        async getSum(){
          const {data:res}=await this.$http.get('/log/sum')
          if(!res.success) return this.$message.error(res.message)
          this.retsum=res.data
          this.users=this.retsum.two
          this.assets=this.retsum.three
        }
      },
      created() {
          this.getToday()
          this.getSecondData()
          this.getSum()
          this.getDoListData()
      },
      components: {    //组件
        vueSeamlessScroll
      },
      computed: {

        classOption () {
          return {
            step: 0.2, // 数值越大速度滚动越快
            limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
            hoverStop: true, // 是否开启鼠标悬停stop
            direction: 1, // 0向下 1向上 2向左 3向右
            openWatch: true, // 开启数据实时监控刷新dom
            singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
            singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
            waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
          }
        }
      }

    }
</script>

<style lang="less" scoped>
  .el-row {
    margin-bottom: 20px;
   last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .seamless-warp{
    width: 100%;
    height: calc(100% - 16px);
    overflow: hidden;
  }
  .thclass {
    width: 33%;
    text-align: left;
    color: #8e9195;
  }
  .divMain{
    height: 200px !important;
  }
  .el-main {
    height: 900px !important;
  }

</style>
