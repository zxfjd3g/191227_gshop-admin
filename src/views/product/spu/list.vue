<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <category-selector @categoryChange="handleCategoryChange"></category-selector>
    </el-card>
    <el-card>
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary"  icon="el-icon-plus" style="margin-bottom: 20px">添加SPU</el-button>
        <el-table 
          v-loading="loading"
          :data="spuList"
          border
          stripe>
          <!-- 序号列 -->
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column label="SPU名称" prop="spuName">
          </el-table-column>
          <el-table-column label="SPU描述" prop="description">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <hint-button title="添加SKU" type="primary" icon="el-icon-plus" size="mini" @click="showSkuAdd"></hint-button>
              <hint-button title="修改SPU" type="primary" icon="el-icon-edit" size="mini" 
                @click="showUpdateSpu(row.id)"></hint-button>
              <hint-button title="查看所有SKU" type="info" icon="el-icon-info" size="mini"></hint-button>
              <hint-button title="删除SPU" type="danger" icon="el-icon-delete" size="mini"></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          style="text-align: center; margin-top: 20px;"
          :current-page="page"
          :page-sizes="[3, 6, 9, 12]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <!-- @update:visible="isShowSpuForm=$event" -->
      <!-- 
        一旦使用.sync, 必须是一个动态的变量属性值, 且属性名必须使用:
        但如果不加:, 传递给子组件的总是false值
       -->
      <SpuForm ref="spuForm" :visible.sync="isShowSpuForm"></SpuForm>

      <SkuForm v-show="isShowSkuForm"></SkuForm>

    </el-card>
  </div>
</template>

<script>
import SpuForm from '../components/SpuForm'
import SkuForm from '../components/SkuForm'
export default {
  name: 'SpuList',

  data () {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',

      loading: false,
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,

      isShowSpuForm: false, // 是否显示spuForm界面
      isShowSkuForm: false, // 是否显示skuForm界面
    }
  },

  /* 
  子组件更新父组件的数据
    函数属性
    vue自定义事件
    v-model
    .sync
    $parent
  */

  mounted () {
    this.category3Id = 61
    this.getSpuList()
  },

  methods: {

    /* 
    显示SKU添加的表单界面
    */
    showSkuAdd () {
      this.isShowSkuForm = true
    },

    /* 
    显示SPU的修改界面
    */
    showUpdateSpu (id) {
      // 显示SpuForm修改界面
      this.isShowSpuForm = true

      // 通知SpuForm根据传入的ID请求获取初始显示需要的数据
        // 使用的是v-show来隐藏的, 隐藏时组件对象还在存在
      this.$refs.spuForm.initLoadUpdateData(id)
    },
    /* 
    选择新的分类的监听回调
    */
    handleCategoryChange ({categoryId, level}) {
      if (level===1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = [],
        this.total = 0
      } else if (level===2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.spuList = [],
        this.total = 0
      } else {
        this.category3Id = categoryId
        // 请求获取分页列表数据
        this.getSpuList()
      }
    },

    /* 
    获取指定页码的列表数据 (spuList, total)
    */
    async getSpuList (page=1) {
      this.page = page
      const {limit, category3Id} = this
      const result = await this.$API.spu.getList (page, limit, category3Id)
      if (result.code===200) {
        const {records, total} = result.data
        this.spuList = records
        this.total = total
      }
    },

    /* 
    当每页数量发生改变的监听回调
    */
    handleSizeChange (pageSize) {
      this.limit = pageSize
      this.getSpuList(1)
    }
  },

  components: {
    SpuForm,
    SkuForm
  }
}
</script>
