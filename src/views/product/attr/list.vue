<template>
  <div>
    <el-card>
      <CategorySelector @categoryChange="handleCategoryChange"/>
    </el-card>

    <el-card>
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px" 
          @click="isShowList=false" :disabled="!category3Id">添加属性</el-button>

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
              <HintButton title="修改" type="primary" icon="el-icon-edit" size="mini"></HintButton>
              <hint-button title="删除" type="danger" icon="el-icon-delete" size="mini"></hint-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <el-form inline :model="attr">
          <el-form-item label="属性名">
            <el-input type="text" v-model="attr.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" 
          :disabled="!attr.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>
          <!-- 
            {
              "attrId": 0,
              "id": 0,
              "valueName": "string"
            }
           -->
        <el-table border style="margin: 20px 0" :data="attr.attrValueList">
          <el-table-column label="序号"  type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row, $index}">
              <el-input v-model="row.valueName" size="mini" placeholder="请输入属性值名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <HintButton title="删除" type="danger" icon="el-icon-delete" size="mini"></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
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

      isShowList: false, // 是否显示属性列表页面   true: 列表页面, false: 添加或更新页面  

      attr: { // 要添加的平台属性对象
        attrName: '', // 属性名
        attrValueList: [], //属性值的列表
        categoryId: '', // 3级的分类ID
        categoryLevel: 3, // 只能是3级
      }
    }
  },

  mounted () {
    this.category1Id = 2
    this.category2Id = 13
    this.category3Id = 61
    this.getAttrs()
  },

  methods: {
    /* 
    添加一个新的属性值
    */
    addAttrValue () {
      this.attr.attrValueList.push({
        valueName: ''
      })
    },

    /* 
    3个级别分类发生改变时的监听回调
    */
    handleCategoryChange ({categoryId, level}) {
      // console.log('handleCategoryChange', categoryId, level)
      if (level===1) {
        this.category1Id = categoryId
        // 重置2级和3级ID和属性列表
        this.category2Id = ''
        this.category3Id = ''
        this.attrs = []
      } else if (level===2) {
        this.category2Id = categoryId
        // 重置3级ID和属性列表
        this.category3Id = ''
        this.attrs = []
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

