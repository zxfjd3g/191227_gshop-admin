<template>
  <el-card>
    <el-table border stripe :data="skuList" v-loading="loading">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
        row-key="id">
      </el-table-column>

      <el-table-column prop="skuName" label="名称" />

      <el-table-column prop="skuDesc" label="描述"/>

      <el-table-column label="默认图片" width="150" align="center">
        <template slot-scope="{row}">
          <div class="info">
            <div class="pic">
              <img :src="row.skuDefaultImg" alt="商品图片" style="width: 80px;">
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量(KG)"/>

      <el-table-column prop="price" label="价格(元)" width="80"/>

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="{row}">
          <HintButton v-if="row.isSale == 0" title="上架" type="success" size="mini" 
            icon="el-icon-top" @click="onSale(row.id)" />
          
          <HintButton v-if="row.isSale == 1" title="下架" type="warning" size="mini" 
            icon="el-icon-bottom" @click="cancelSale(row.id)" />
            
          <HintButton title="修改" type="primary" size="mini" 
            icon="el-icon-edit" @click="toUpdateSku(row.id)" />

          <HintButton title="查看详情" type="primary" size="mini" 
            icon="el-icon-info" @click="showSkuInfo(row.id)" />
          
          <el-popconfirm :title="`确定删除 ${row.skuName} 吗`" @onConfirm="deleteSku(row.id)">
            <hint-button slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除"></hint-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      style="padding: 20px 0; text-align: center;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="changeSize"
    />

  </el-card>
</template>

<script>
export default {
  name: 'SkuList',
  
  data() {
    return {
      skuList: [], // SKU列表
      loading: false, // 是否正在加载中
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      skuInfo: {},
    }
  },

  mounted() {
    this.getSkuList()
  },

  methods: {

    /* 
    显示Sku详情信息
    */
    showSkuInfo (skuId) {
      this.$message.info('课上实现')
    },

    /* 
    当页码发生改变自动调用
    */
    changeSize(size) {
      this.limit = size
      this.getSkuList(1)
    },

    /* 
    异步获取指定页码的sku列表
    */
    async getSkuList(page = 1) {
      this.page = page
      this.loading = true
      const result = await this.$API.sku.getList(this.page, this.limit)
      this.loading = false
      this.skuList = result.data.records
      this.total = result.data.total
    },

    /* 
    对指定SKU进行上架的请求
    */
    onSale(skuId) {
      this.$API.sku.onSale(skuId).then(result => {
        this.$message({
          type: 'success',
          message: '上架成功!'
        })
        this.getSkuList(this.page)
      })
    },

    /* 
    对指定SKU进行下架的请求
    */
    cancelSale(skuId) {
      this.$API.sku.cancelSale(skuId).then(result => {
        this.$message({
          type: 'success',
          message: '下架成功!'
        })
        this.getSkuList(this.page)
      })
    },

    /* 
    到SKU的更新界面去
    */
    toUpdateSku (skuId) {
      this.$message.warning('缺少接口的支持, 待开发!')
    },

    /* 
    删除SKU
    */
    async deleteSku (skuId) {
      const result = await this.$API.sku.remove(skuId)
      if (result.code===200) {
        this.$message({
          message: '删除SKU成功',
          type: 'success'
        })
        this.getSkuList(1)
      } else {
        this.$message({
          message: '删除SKU失败',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>

