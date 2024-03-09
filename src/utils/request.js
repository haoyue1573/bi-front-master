import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout:600000 // request timeout
})

// request interceptor请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      console.log("用户id"+store.getters.id)
      console.log("哈哈哈，发送请求的cookie头是" + getToken())
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor  响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 10 * 1000
      })

      // 50008: 未登录（根据后端来的）; 50012: 操作失败（根据后端来的）; 50014: Token expired;
      if (res.code === 40100 || res.code === 50012 || res.code === 50014) {
        // to re-login
        //如果后端响应code为50012，说明后端未登录，此时会弹出一个待确认的弹框，
        //点击去登录
        MessageBox.confirm('你已经登出，你可以重新登录', '确认登出', {
          confirmButtonText: '去登录',
          // cancelButtonText: 'Cancel',//不能取消
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()//刷新页面以获取最新数据或重置状态时使用
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 10 * 1000 
    })
    return Promise.reject(error)
  }
)

export default service
