/* 
包含所有SPU管理的接口请求函数
*/
import request from '@/utils/request'

export default {
  /* 
  获取所有销售属性列表
  GET /admin/product/baseSaleAttrList
  [
    {
      "id": 0,
      "name": "string"
    }
  ]
  */
  getSaleList () {
    return request.get('/admin/product/baseSaleAttrList')
  },

  /* 
  删除指定id的SPU
  DELETE /admin/product/deleteSpu/{spuId}
  */
  remove (id) {
    return request.delete(`/admin/product/deleteSpu/${id}`)
  },

  /* 
  获取指定id的SPU信息
  GET /admin/product/getSpuById/{spuId}
  */
  get (id) {
    return request.get(`/admin/product/getSpuById/${id}`)
  },

  /* 
  保存(添加/更新)SPU
  POST /admin/product/saveSpuInfo
  POST /admin/product/updateSpuInfo
  */
  addUpdate (spuInfo) {
    return request.post(`/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
  },

  /* 
  获取指定分类的SPU分页列表
  GET /admin/product/{page}/{limit}
  */
  getList (page, limit, category3Id) {
    return request.get(`/admin/product/${page}/${limit}`, {params: {category3Id}})
  }
}