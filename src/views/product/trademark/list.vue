<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAdd" style="margin-bottom:20px">添加</el-button>

    <el-table 
      v-loading="loading"
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
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="showUpdate(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)">删除</el-button>
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
    <el-dialog :title="form.id ? '更新' : '添加'" :visible.sync="isShowDialog">  <!-- 内部会执行: $emit('update:visible', false) 自动关闭 -->
      <el-form :model="form" style="width: 80%" :rules="rules"  ref="tmForm">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <!-- 
            action: 指定上传图片的接口地址   组件内部向发此地址发送上传文件的ajax请求
              http://182.92.128.115/admin/product/fileUpload: 不可以, 跨域了
              /dev-api/admin/product/fileUpload: 可以, 通过代理服务转发, 就没跨域了
            on-success: 指定上传成功时调用的回调函数
            before-upload: 指定在准备发送上传图片请求前的回调函数, 如果返回值为false, 不会发出请求
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'TrademarkList',

    data() {
      return {
        loading: false, //不显示loading
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

        rules: {
          /* 
          品牌名称:
              必须输入   输入过程中触发校验
              长度必须在2-10个之间   失去焦点时触发校验
          品牌LOGO:
              必须有
          */
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'change' }, /* 值发生改变时触发 */
            /* { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' } */ /* 失去焦点触发 */
            /* validator校验器: 用于校验的回调函数 */
            { validator: this.validateTmName, trigger: 'blur' }
          ],
          logoUrl: [
            { required: true, message: '请指定LOGO图片' }
          ]
        }
      }
    },

    mounted() {
      // 测试新定义的接口请求函数
      // this.$API.trademark.getById(1)

      this.getTrademarks()
    },

    methods: {

      /* 
      校验品牌名称的自定义校验函数
        value: 输入的最新值
        callback: 用来指定是否通过的函数, 由我们调用
      长度必须在2-10个之间
      */
      validateTmName (rule, value, callback) {
        console.log('validateTmName()', value)
        if (value.length<2 || value.length>10) {
          // 调用callback传入error就代表不通过, 并指定要显示的错误信息
          callback(new Error('长度在 2 到 10 个字符'))
        } else {
          // 调用callback()不传任何参数代表通过
          callback()
        }
      },

      /* 
      当上传图片成功时调用
      */
      handleLogoSuccess(res, file) {
        // console.log('---', res, file)
        // 得到返回的图片url
        // const logoUrl = file.response.data
        const logoUrl = res.data
        // 保存图片url
        this.form.logoUrl = logoUrl
      },

      /* 
      指定在准备发送上传图片请求前的回调函数, 如果返回值为false, 不会发出请求
      作用: 限制上传图片的类型与大小
      要求: 只能上传jpg/png文件，且不超过500kb
      */
      beforeLogoUpload(file) {
        
        const isJPGOrPNG = ['image/jpeg', 'image/png'].indexOf(file.type)>=0
        const isLt500KB = file.size / 1024 < 500

        if (!isJPGOrPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt500KB) {
          this.$message.error('上传头像图片大小不能超过 500kb!')
        }
       
        return isJPGOrPNG && isLt500KB;
      },

      /* 
      异步获取指定页码列表数据显示
      */
      async getTrademarks (page=1) {
        this.page = page

        // 在发请求获取数据前, 显示loading
        this.loading = true

        // 发异步ajax获取数据
        const result = await this.$API.trademark.getList(page, this.limit)

        // 请求结束后, 隐藏loading
        this.loading = false

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
        // 重置form数据(可能原本有)
        this.form = {
          tmName: '',
          logoUrl: ''
        }
        // 显示
        this.isShowDialog = true
      },

      /* 
      显示修改界面
      */
      showUpdate (trademark) {
        // 将当前品牌对象保存到form ==> 用于在dialog中显示
        // this.form = trademark  // 共用一个对象, 有问题
        this.form = {...trademark} // form与trademark指向的就不是同一个对象      对象的浅拷贝
        // 显示
        this.isShowDialog = true
      },

      /* 
      添加或者更新品牌
      */
      addOrUpdateTrademark () {
        // 先进行统一的表单校验, 如果没通过, 不提交请求, 只是显示错误提示
        this.$refs.tmForm.validate(async (valid) => { // 当校验完成后自动调用
          if (valid) { // 通过
            // 取出请求需要数据
            const trademark = this.form
            let result
            // 如果trademark中有id, 就发更新的请求, 否则发添加的请求
            if (trademark.id) {
              result = await this.$API.trademark.update(trademark)
            } else {
              result = await this.$API.trademark.add(trademark)
            }
            
            // 成功后, 提示添加/更新成功, 隐藏当前Dialog, 重新显示新的品牌列表
            if (result.code===200) {
              this.$message.success(`${trademark.id ? '更新' : '添加'}品牌成功`)
              this.isShowDialog = false
              // 如果是更新,获取当前页显示
              // 如果是添加, 获取第1页显示
              this.getTrademarks(trademark.id ? this.page : 1)
              // 清除数据
              this.form = {
                tmName: '',
                logoUrl: ''
              }
            } else {
              // 失败后, 提示添加/更新失败
              this.$message.error(`${trademark.id ? '更新' : '添加'}品牌失败`)
            }
          } else { // 没通过   本质上不用写
            // 不需要做什么, 错误提示已经显示了
          }
        })
      },

      /* 
      删除指定的品牌
      */
      deleteTrademark (trademark) {
        this.$confirm(`确定删除 ${trademark.tmName} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => { // 点击确定
          // 发送删除品牌的请求
          const result = await this.$API.trademark.remove(trademark.id)
          // 如果成功了
          if (result.code===200) {
            this.$message.success('删除品牌成功!')
            // 重新获取分页列表显示
            // 方式一: 固定去第1页面
            // this.getTrademarks(1) 
            // 方式二: 还显示当前页(有可能当前页已经不存在了)
              // 特别: 如果当前页只剩一条数据, 获取上一页显示, 否则获取当前页
            const page = this.trademarks.length===1 ? this.page-1 : this.page
            this.getTrademarks(page)

          } else { // 如果失败了
            this.$message.error('删除品牌失败!')
          }
        }).catch(() => { // 点击取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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
