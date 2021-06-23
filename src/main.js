
import Vue from 'vue'
import App from './App'
import router from './router'//自动扫描里面的路由配置
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
//导入全局样式表
import './assets/css/global.css'
//导入字体图标表
import './assets/fonts/iconfont.css'
import moment from 'moment';
//加密
Vue.prototype.$bcrypt = require('bcryptjs')

// 导入消息提示框
import { Message } from 'element-ui';
Vue.use(ElementUI)
Vue.prototype.$message=Message;

//axios
import axios from 'axios'

axios.defaults.baseURL='http://127.0.0.1:8081/'
// axios.defaults.baseURL='http://1.117.144.23:8081/'
axios.interceptors.request.use(config => {
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  //配置路由
  router,
  render: h => h(App)//ElementUI
})

//写一个全局函数
Vue.prototype.beIdsStrG = function (array){//changeData是函数名
  let str=''
  array.forEach(item => {
    if(str===''){
      str+=item
    }else {
      str+=','+item
    }
  })
  return str;
}

Vue.prototype.exportExcel = function (url, options = {},val) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
    axios({
      method: 'get',
      url: url, // 请求地址
      data: options, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(
      response => {
        if(response.data){
          resolve(response.data)
          let blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          })
          // Date.parse(new Date())
          let fileName = val+ moment(new Date()).format('YYYYMMDD') + '.xlsx'
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            // console.log(3)
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            //释放内存
            window.URL.revokeObjectURL(link.href)
          }
        }else {
          this.$message.error("网络繁忙，请稍后再试")
        }

      },
      err => {
        reject(err)
      }
    )
  })
}
