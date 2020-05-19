<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAdd">添加</el-button>

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
      :current-page="page"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getTrademarks"
      @size-change="handleSizeChange"
      >
    </el-pagination>
    <el-dialog title="添加" :visible.sync="isShowDialog">  <!-- 内部会执行: $emit('update:visible', false) 自动关闭 -->
      <el-form :model="form" style="width: 80%">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="form.tmName" autocomplete="off" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="isShowDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'TrademarkList',

    data() {
      return {
        trademarks: [], // 当前页的列表数据
        total: 0, // 总数量
        page: 1, // 当前页码
        limit: 3, // 每页数量

        isShowDialog: false, // 是否显示添加的dialog
        form: {
          tmName: '',
          logoUrl: ''
        },
        formLabelWidth: '100px',

        imageUrl: '',
      }
    },

    mounted() {
      // 测试新定义的接口请求函数
      // this.$API.trademark.getById(1)

      this.getTrademarks()
    },

    methods: {

       handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      /* 
      异步获取指定页码列表数据显示
      */
      async getTrademarks (page=1) {
        this.page = page

        // 发异步ajax获取数据
        const result = await this.$API.trademark.getList(page, this.limit)
        // 成功了, 更新列表数据
        if (result.code===200) {
          const {records, total} = result.data
          this.trademarks = records
          this.total = total
        } else { // 失败了, 提示
          this.$message.error('获取品牌列表失败')
        }
      },

      /* 
      每页数量改变的监听回调
      */
      handleSizeChange (pageSize) {
        // 更新limit数据
        this.limit = pageSize
        // 重新请求获取第1页列表显示
        this.getTrademarks()
      },

      /* 
      显示添加界面
      */
      showAdd () {
        this.isShowDialog = true
      }
    }
  }

</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
