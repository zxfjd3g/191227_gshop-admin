<template>
  <div>
    <el-card>
      <CategorySelector @categoryChange="handleCategoryChange"/>
    </el-card>

    <el-card>
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px">添加属性</el-button>

      <el-table border :data="attrs">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="属性名称" width="150" prop="attrName"></el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{row, $index}">
            <el-tag style="margin: 2px" type="info" v-for="value in row.attrValueList" :key="value.id">{{value.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{row, $index}">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AttrList',

  data () {
    return {
      category1Id: '',  // 一级分类ID
      category2Id: '',  // 二级分类ID
      category3Id: '',  // 三级分类ID
      attrs: [], // 所有属性的列表
    }
  },

  mounted () {
    this.$API.attr.getList(2, 13, 61)
  },

  methods: {
    /* 
    3个级别分类发生改变时的监听回调
    */
    handleCategoryChange ({categoryId, level}) {
      // console.log('handleCategoryChange', categoryId, level)
      if (level===1) {
        this.category1Id = categoryId
      } else if (level===2) {
        this.category2Id = categoryId
      } else {
        this.category3Id = categoryId
        // 异步请求获取属性列表显示
        this.getAttrs()
      }
    },

    /* 
    异步请求获取属性列表显示
    */
    async getAttrs () {
      const {category1Id, category2Id, category3Id} = this
      const result = await this.$API.attr.getList(category1Id, category2Id, category3Id)
      this.attrs = result.data
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

