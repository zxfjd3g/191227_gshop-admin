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

  methods: {
    back () {
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>