<template>
  <el-form label-width="100px" v-show="visible">
    <el-form-item label="SPU名称">
      <el-input type="text" placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
        <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuInfo.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        multiple
        :file-list="spuImageList"
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess">
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- 显示大图的dialog -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-select v-model="attrIdAttrName" :placeholder="unUsedSaleAttrList.length>0 ? `还有${unUsedSaleAttrList.length}个未使用` : '没有啦!!!'" value="">
        <el-option :label="attr.name" :value="attr.id + ':' + attr.name" v-for="attr in unUsedSaleAttrList" :key="attr.id"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" @click="addSpuSaleAttr"
        :disabled="!attrIdAttrName">添加销售属性</el-button>

      <el-table 
        style="margin-top: 20px"
        border
        :data="spuInfo.spuSaleAttrList"
      >
        <!-- 序号列 -->
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center">
        </el-table-column>

        <el-table-column label="属性名" prop="saleAttrName" width="150px">
        </el-table-column>
        <el-table-column label="属性值名称列表">
          <template slot-scope="{row, $index}">
            <el-tag
              style="margin-right: 5px"
              v-for=" (value, index) in row.spuSaleAttrValueList"
              :key="value.id"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
              {{value.saleAttrValueName}}
            </el-tag>
            <el-input
              style="width: 100px"
              placeholder="请输入名称"
              v-if="row.edit"
              v-model="row.saleAttrValueName"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)" 
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ 添加</el-button>
          </template>
        </el-table-column>
       
        <el-table-column prop="address" label="操作" width="150px">
          <template slot-scope="{row, $index}">
            <el-button type="danger" icon="el-icon-delete" size="mini" 
            @click="spuInfo.spuSaleAttrList.splice($index, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },

  data () {
    return {
      dialogImageUrl: '', // 要显示的大图的url
      dialogVisible: false, // 是否显示大图dialog, 默认不显示

      spuId: '', // 当前要更新的spuInfo的id
      spuInfo: { // SPU的详情信息
        spuName: '',
        description: '',
        tmId: '',
        spuSaleAttrList: [], // 必须有初始空数组
        spuImageList: [], // spu销售属性的数组
      }, // 当前SpuInfo对象
      spuImageList: [], // Spu的图片列表
      trademarkList: [], //品牌列表
      saleAttrList: [], //销售属性列表
      attrIdAttrName: '', // 用来收集销售属性的id与name,   id:name
    }
  },

  computed: {
    /* 
    得到saleAttrList中还没有使用的属性的数组: 只留下没有的spuInfo.spuSaleAttrList中的属性
     attr的结构:
      {
        "name": "选择颜色"
      },
    spuAttr: 
        {
          "saleAttrName": "选择版本",
        }
    判断: attr的name与spuSaleAttrList数组中每个spuAttr的saleAttrName都不相同
    */
    unUsedSaleAttrList () {
      return this.saleAttrList.filter(
        attr => this.spuInfo.spuSaleAttrList.every(spuAttr => spuAttr.saleAttrName!==attr.name)
      )
    }
  },

  methods: {

    /* 
    保存(添加/更新)SPU详情信息
    */
    async save () {
      // 取出请求需要的数据, 并做必要的整理工作
      const {spuInfo, spuImageList} = this

      // 整理1: 处理spuImageList属性
      /* 
      当前: spuInfo中的spuImageList属性值为null
      */
     /* 
     已有图片对象
        {
            id:1224
            imgName:"O1CN01N5IsrF29zFm3vQZpT_!!1714128138.jpg"
            imgUrl:"http://182.92.128.115:8080/xxx.jpg"
            spuId:154,
            name: 'O1CN01N5IsrF29zFm3vQZpT_!!1714128138.jpg',
            url: 'http://182.92.128.115:8080/xxx.jpg'
        }
      新上传图片的结构:
          {
              name: 'fa6e854a56ff9b46.png',
              url: 'blob:http://localhost:9529/0b11fe66-1f6a-432d-b327-e48745825a8c',
              response: {
                  data: 'http://182.92.128.115:8080/xxx.png'
              }
          }
      提交请求需要的图片对象的结构:
          {
            "imgName": "下载 (1).jpg",
            "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
          }
     */
      spuInfo.spuImageList = spuImageList.map(item => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.url
      }))

      // 整理2: 处理spuSaleAttrList属性
        /* 
        1. 删除不必要的参数数据: 数组元素对象(属性对象)很可能有2个不必要的数据
        2. 过滤掉没有一个属性值对象的属性
        */
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter((attr) => {
        delete attr.edit
        delete attr.saleAttrValueName
        return attr.spuSaleAttrValueList.length>0
      })

      // 发送保存SPU详情信息的异步ajax请求
      const result = await this.$API.spu.addUpdate(spuInfo)
      // 成功了, ...
      if (result.code===200) {
        this.$message.success('保存SPU成功')

        // 重置当前组件的数据
        this.resetData()
        // 回到列表页面
        this.$emit('update:visible', false)
        // 通知父组件重新获取分页列表数据显示  ==> 获取哪一页?
          /* 
          子向父通信: 
          当前不需要传递数据, 但需要通知父组件
          1. 函数props
          2. 自定义事件
          3. $parent
          */
        this.$emit('saveSuccess')
      } else {
        // 失败了, 提示
        this.$message.error('保存SPU失败')
      }
    },

    /* 
    重置当前组件的数据
    */
    resetData () {
      this.dialogImageUrl = '' 
      this.dialogVisible = false 

      this.spuId = null
      this.spuInfo = {
        category3Id: '',
        spuName: '',
        description: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: []
      } 
      this.spuImageList = [] 
      this.trademarkList = [] 
      this.saleAttrList = []
      this.attrIdAttrName = ''
    },

    /* 
    确定添加一个新的SPU销售属性值对象:
    向spuSaleAttr.spuSaleAttrValueList中添加
    {
        "saleAttrValueName": "a",  // 输入的
        "baseSaleAttrId": "1" // 销售属性的id
    }
    */
    handleInputConfirm (spuSaleAttr) {
      // 取出需要的数据
      const {saleAttrValueName, baseSaleAttrId} = spuSaleAttr
      // console.log('----handleInputConfirm', saleAttrValueName)
      // 限制1: 属性值名称必须有输入
      if (!saleAttrValueName) {   // 为undefined / ''
        spuSaleAttr.edit = false
        return
      }
      // 限制2: 输入的属性值名称不能与已有重复
      const isRepeat = spuSaleAttr.spuSaleAttrValueList.some(value => value.saleAttrValueName===saleAttrValueName)
      if (isRepeat) {
        this.$message.warning('不能重复!')
        return
      }

      // 向spuSaleAttr.spuSaleAttrValueList中添加一个新的SPU销售属性值对象
      spuSaleAttr.spuSaleAttrValueList.push({
        saleAttrValueName,
        baseSaleAttrId
      })

      // 显示查看模式
      spuSaleAttr.edit = false
      spuSaleAttr.saleAttrValueName = ''

    },

    /* 
    显示输入框: 在当前行
    */
    showInput (spuSaleAttr) {
      // 指定属性对象的edit的值为true
      if (spuSaleAttr.hasOwnProperty('edit')) {
        spuSaleAttr.edit = true
      } else {
        this.$set(spuSaleAttr, 'edit', true)
      }
      
      // 让输入框自动获得焦点
      this.$nextTick(() => this.$refs.saveTagInput.focus())
    },

    /* 
    添加一个新的spu销售属性数据对象
    */
    addSpuSaleAttr () {
      // 取出收集的销售属性的id与name
      const [baseSaleAttrId, saleAttrName] = this.attrIdAttrName.split(':')

      // 添加一个新的spu属性对象
      this.spuInfo.spuSaleAttrList.push({
          baseSaleAttrId,
          saleAttrName,
          spuSaleAttrValueList: []
      })

      // 删除收集的属性id与name
      this.attrIdAttrName = ''
    },

    /* 
    由父组件调用的方法
    请求加载相关数据
    */
    initLoadAddData (category3Id) {
      // 保存到spuInfo中
      this.spuInfo.category3Id = category3Id

      // 3. 获取所有品牌的列表
      this.getTrademarkList()
      // 4. 获取所有销售属性(id/name)列表
      this.getSaleAttrList()
    },

    /* 
    由父组件调用的方法
    根据id请求加载相关数据
    */
    initLoadUpdateData (spuId) {
      // 保存spuId
      this.spuId = spuId

      // 1. 根据SPU的id获取SPU的详情信息
      this.getSpuInfo()
      // 2. 根据SPU的id获取SPU的图片列表
      this.getSpuImageList()
      // 3. 获取所有品牌的列表
      this.getTrademarkList()
      // 4. 获取所有销售属性(id/name)列表
      this.getSaleAttrList()
    },

    /* 
    根据SPU的id获取SPU的详情信息
    */
    async getSpuInfo () {
      const result = await this.$API.spu.get(this.spuId)
      this.spuInfo = result.data
    }, 

    /* 
    根据SPU的id获取SPU的图片列表
    */
    async getSpuImageList () {
      const result = await this.$API.sku.getSpuImageList(this.spuId)
      // 得到返回的图片列表数据
      const spuImageList = result.data

      // 需要对数据进行整理: 给数组元素对象添加name和url属性
      spuImageList.forEach(item => {
        item.name = item.imgName
        item.url = item.imgUrl
      })

      // 保存图片列表
      this.spuImageList = spuImageList
    }, 

    /* 
    获取所有品牌的列表
    */
    async getTrademarkList () {
      const result = await this.$API.trademark.getList()
      this.trademarkList = result.data
    }, 

    /* 
    获取所有销售属性(id/name)列表
    */
    async getSaleAttrList () {
      const result = await this.$API.spu.getSaleList()
      this.saleAttrList = result.data
    }, 

    /* 
    上传图片成功后的回调函数
    response: 响应体数据对象, 对应的是axios中的response.data
    file: 新上传成功的图片对象
    fileList: 所有图片对象的数组
    */
    handleSuccess (response, file, fileList) {
      console.log('handleSuccess', response, file, fileList)
      // 将已上传图片对象的列表保存起来
      this.spuImageList = fileList
    },

    /* 
    点击删除按钮的回调(并没有发请求)
    file: 被删除图片对象
    fileList: 剩下的所有图片对象的数组
    */
    handleRemove(file, fileList) {
      console.log('handleRemove', file, fileList)
      // 将已上传图片对象的列表保存起来
      this.spuImageList = fileList
    },

    /* 
    用来显示大图dialog的回调函数
    file: 点击的图片信息对象
    */
    handlePictureCardPreview(file) {
      // 保存要显示大图的url
      this.dialogImageUrl = file.url
      // 显示大图dialog
      this.dialogVisible = true
    },

    back () {
      // 重置数据
      this.resetData()
      // 分发自定义事件, 关闭当前SpuForm界面
      this.$emit('update:visible', false)
      // 分发自定义事件, 通知父组件当前组件取消了操作
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>