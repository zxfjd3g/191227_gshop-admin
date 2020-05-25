import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个新的axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://47.93.148.192', // url = base url + request url
  // baseURL: 'http://182.92.128.115', // url = base url + request url
  timeout: 20000 //请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果有token, 通过token请求头携带token
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    
    const result = response.data
    /* 
    code为非20000或200是抛错 可结合自己业务进行修改
    */
    if (result.code !== 20000 && result.code !== 200) {
      // 提示业务请求操作不成功
      Message({
        message: result.data || result.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 如果响应数据的code是201: 删除系统数据失败, 只需要在当前统一提示, 不需要外部再提示
      if (result.code===201) {
        return new Promise(() => {})   // 返回一个pending状态的promise ==> 中断promise链
      }

      // 返回了一个失败的promise
      return Promise.reject(new Error(result.data || result.message || '未知错误'))
    } else {
      return result
    }
  },

  error => {
    console.log('err' + error)
    // 统一显示错误提示
    Message({
      message: error.message || '请求出错了',
      type: 'error',
      duration: 5 * 1000
    })
    // 向下传递错误, 具体的请求右以选择处理或不处理
    return Promise.reject(error)
  }
)

export default service
