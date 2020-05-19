/* 
商品管理的品牌管理相关接口请求函数的模块
*/

import request from '@/utils/request'  // 相当于ajax

const api_name = '/admin/product/baseTrademark'

export default {

  /* 
  根据id获取对应的品牌
  GET /admin/product/baseTrademark/get/{id}
  */
  getById(id) {
    /* return request({
      url: `${api_name}/get/${id}`,
      method: 'GET'
    }) */
    return request.get(`${api_name}/get/${id}`)
  },

  /* 
  获取所有品牌的列表
  GET /admin/product/baseTrademark/getTrademarkList
  获取品牌分页列表
  GET /admin/product/baseTrademark/{page}/{limit}
  */
  getList(page, limit) {
    if (page && limit) {
      return request(`/admin/product/baseTrademark/${page}/${limit}`)
    } else {
      return request('/admin/product/baseTrademark/getTrademarkList')
    }
  },

  /* 
  根据id删除对应的品牌
  DELETE /admin/product/baseTrademark/remove/{id}
  */
  remove (id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  /* 
  添加一个新的品牌
  POST /admin/product/baseTrademark/save
  trademark对象: {tmName: '', logoUrl: ''}   没有id属性
  */
  add (trademark) {
    return request.post(`${api_name}/save`, trademark)
  },

  /* 
  更新品牌
  PUT /admin/product/baseTrademark/update
  trademark对象: {id: 2, tmName: '', logoUrl: ''}   需要有id属性
  */
  update (trademark) {
    return request.put(`${api_name}/update`, trademark)
  },

  /* 
  获取品牌分页列表
  GET /admin/product/baseTrademark/{page}/{limit}
  */
  /* getPageList (page, limit) {
    return request(`/admin/product/baseTrademark/${page}/${limit}`)
  } */

}
