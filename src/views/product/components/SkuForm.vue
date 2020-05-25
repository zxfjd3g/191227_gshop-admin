<template>
  <el-form label-width="100px">
    <el-form-item label="SPU 名称">
      <span>小米11</span>
    </el-form-item>

    <el-form-item label="SKU 名称">
      <el-input type="text" placeholder="SKU 名称"></el-input>
    </el-form-item>

    <el-form-item label="价格">
      <el-input type="number" placeholder="SKU 价格"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input type="number" placeholder="SKU 重量"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="SKU 规格描述" rows="4"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form inline label-width="100px">
        <el-form-item label="test" style="margin: 5px">
          <el-select value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="test" style="margin: 5px">
          <el-select value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="test" style="margin: 5px">
          <el-select value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="test" style="margin: 5px">
          <el-select value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="test" style="margin: 5px">
          <el-select value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form inline label-width="100px">
        <el-form-item label="test" style="margin: 5px">
          <el-select value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="test" style="margin: 5px">
          <el-select value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table border>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column label="图片">
        </el-table-column>
        <el-table-column label="名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row, $index}">
            <el-button type="primary">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',

  data () {
    return {
      spu: {},

      attrList: [], // 平台属性列表
      spuImageList: [], // spu图片列表
      spuSaleAttrList: [], // spu销售属性列表
    }
  },

  methods: {
    /* 
    初始化加载数据
    */
    initLoadAddData (spu) {
      this.spu = spu

      // 请求获取所有需要显示的数据
      this.getData()
    },

    /* 
    根据3个级别分类ID获取所有的平台属性列表: attr.getList
    根据spu的ID获取SPU图片列表: sku.getSpuImageList
    根据SPU的ID获取SPU销售属性列表: sku.getSpuSaleAttrList

    利用Promise.all()批量发送多个请求
    */
    async getData () {
      const {category1Id, category2Id, category3Id, id} = this.spu
      const promise1 = this.$API.attr.getList(category1Id, category2Id, category3Id)
      const promise2 = this.$API.sku.getSpuImageList(id)
      const promise3 = this.$API.sku.getSpuSaleAttrList(id)

      const results = await Promise.all([promise1, promise2, promise3])
      // results: [{data:attrList}, {data: spuImageList}, {data: spuSaleAttrList}]
      this.attrList = results[0].data
      this.spuImageList = results[1].data
      this.spuSaleAttrList = results[2].data
    },

    back () {
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>