/**
 * axios二次封装
 1. 配置统一的请求基础路径: 开发环境与生产环境不同
 2. 配置请求超时时间
 3. 请求时, 通过请求头携带登陆用户的token
 4. 请求成功得到的不是response, 而是请求体response.data
 5. 对请求出错进行统一的提示处理, 具体请求可以选择处理或不处理
 6. 对请求操作失败进行统一提示处理, 具体请求可以选择处理或不处理
 */

import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个新的axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  
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

      // 如果响应数据的code是201/20001: 删除系统数据失败, 只需要在当前统一提示, 不需要外部再提示
      if (result.code===201) {
        Message.error(result.data || '未知错误')
        return new Promise(() => {})   // 返回一个pending状态的promise ==> 中断promise链
      } else if (result.code===20001) {
        Message.error(result.message || '未知错误')
        return new Promise(() => {})
      }
      
      // 提示业务请求操作不成功
      Message({
        message: result.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      

      // 返回了一个失败的promise
      // return Promise.reject(new Error(result.data || result.message || '未知错误'))
      return Promise.reject(new Error(result.message || '未知错误'))
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
