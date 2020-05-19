<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table 
      :data="trademarks"
      border
      stripe>
      <!-- 序号列 -->
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center">
      </el-table-column>

      <el-table-column prop="tmName" label="品牌名称">
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 60px;">
        </template>
      </el-table-column>
      <!-- 如果列表列的内容是指定指定的结构: 使用作用域插槽 -->
      <el-table-column prop="address" label="操作">
        <template slot-scope="{row, $index}">
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

     <el-pagination
      background
      style="text-align: center; margin-top: 20px;"
      :current-page="1"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="400">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'TrademarkList',

    data() {
      return {
        trademarks: [
          {
            "id": 66,
            "tmName": "苹果",
            "logoUrl": "http://182.92.128.115:8080/group1/M00/00/05/rBFUDF64AOGAU6y8AABHE9lc8_o704.jpg"
          },
          {
            "id": 67,
            "tmName": "三星",
            "logoUrl": "http://182.92.128.115:8080/group1/M00/00/05/rBFUDF64AO2AFG3NAAAlYfAdvyQ668.jpg"
          },
          {
            "id": 68,
            "tmName": "小米",
            "logoUrl": "http://182.92.128.115:8080/group1/M00/00/09/rBFUDF6-MomAapNzAAAKVYl1Jvk870.jpg"
          }
        ]
      }
    },

    mounted() {
      // 测试新定义的接口请求函数
      // this.$API.trademark.getById(1)
    }
  }

</script>

<style>
</style>
