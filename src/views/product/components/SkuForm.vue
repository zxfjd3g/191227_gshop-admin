<template>
  <el-form label-width="100px">
    <el-form-item label="SPU 名称">
      <span>{{spu.spuName}}</span>
    </el-form-item>

    <el-form-item label="SKU 名称">
      <el-input type="text" placeholder="SKU 名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>

    <el-form-item label="价格">
      <el-input type="number" placeholder="SKU 价格" v-model="skuInfo.price"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input type="number" placeholder="SKU 重量" v-model="skuInfo.weight"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="SKU 规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form inline label-width="100px">
        <el-form-item :label="attr.attrName" style="margin: 5px" v-for="attr in attrList" :key="attr.id">
          <el-select v-model="attr.attrIdValueId">
            <el-option :label="value.valueName" :value="attr.id + ':' + value.id" v-for="value in attr.attrValueList" :key="value.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form inline label-width="100px">
        <el-form-item :label="attr.saleAttrName" style="margin: 5px" v-for="attr in spuSaleAttrList" :key="attr.id">
          <el-select v-model="attr.saleAttrValueId">
            <el-option :label="value.saleAttrValueName" :value="value.id" v-for="value in attr.spuSaleAttrValueList" :key="value.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table border :data="spuImageList" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{row}">
            <img :src="row.imgUrl" alt="" style="width:100px;height:100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row, $index}">
            <el-tag v-if="row.isDefault==='1'" type="success">默认</el-tag>
            <el-button v-else type="primary" size="mini" @click="setDefaultImg(row)">设为默认</el-button>
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
  name: 'SkuForm',

  props: {
    saveSuccess: Function,
  },

  data () {
    return {
      spu: {},

      skuInfo: {
        // 父组件传过来的
        category3Id: null,
        spuId: null,
        tmId: null,

        // 用户输入自动收集: v-model
        skuName: null,
        skuDesc: '',
        price: null, // 输入后是数字字符串
        weight: null, //  输入后是数字字符串

        // 需要我们写代码去整理
        skuDefaultImg: '', // 默认图片的url
        skuAttrValueList: [], // 收集整理的sku平台属性值列表
        skuSaleAttrValueList: [], // 收集整理的sku销售属性值列表
        skuImageList: [], // 收集整理的sku图片数据列表
      },

      attrList: [], // 平台属性列表
      spuSaleAttrList: [], // spu销售属性列表
      spuImageList: [], // spu图片列表
      selectedSpuImageList: [], // 所有选中的spu图片列表
    }
  },

  methods: {

    /* 
    保存SKU信息
    */
    async save () {
      // 整理收集的数据
      const {skuInfo, attrList, spuSaleAttrList, selectedSpuImageList} = this

      // 整理1: skuAttrValueList
      /* 
      数据来源: attrList
        {
            attrIdValueId: '1:207'  // 可能有, 也可能没有
        }
      目标数据结构:
        {
            "attrId": "1",
            "valueId": "207"
        }
      */
      // 只根据有attrIdValueId的attr来生成包含目标结构的数组
      skuInfo.skuAttrValueList = attrList.reduce((pre, attr) => {
        if (attr.attrIdValueId) {
          const [attrId, valueId] = attr.attrIdValueId.split(':')
          pre.push({
            attrId,
            valueId
          })
        }
        return pre
      }, [])

      // 整理2: skuSaleAttrValueList
      /* 
      数据来源: spuSaleAttrList
        {
            saleAttrValueId: '258'  // 可能有, 也可能没有
        }
      目标数据结构:
        {
            "saleAttrValueId": 258
        }
      */
      // 只根据有saleAttrValueId的attr来生成包含目标结构的数组
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((pre, attr) => {
        if (attr.saleAttrValueId) {
          pre.push({
            saleAttrValueId: attr.saleAttrValueId
          })
        }
        return pre
      }, [])

      // 整理3: skuImageList
       /* 
      数据来源: selectedSpuImageList
        {
            "id": 333,
            "spuId": 26,
            "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
            "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
            "isDefault": "1"  // 也可能是"0"
        }
      目标数据结构:
        {
            "imgName": "下载 (1).jpg",
            "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
            "spuImgId": 337, // 当前Spu图片的id
            "isDefault": "1"   // 默认为"1", 非默认为"0"
        }
      */
      skuInfo.skuImageList = selectedSpuImageList.map(image => ({
        imgName: image.imgName,
        imgUrl: image.imgUrl,
        spuImgId: image.id, // 当前Spu图片的id
        isDefault: image.isDefault   // 默认为"1", 非默认为"0"
      }))

      // 发送异步ajax请求保存SKU信息
      const result = await this.$API.sku.addUpdate(skuInfo)
      // 成功了, ...
      if (result.code===200) {
        this.$message.success('保存SKU成功')
        // 重置数据
        this.resetData()
        // 通知父组件保存成功
        this.saveSuccess()
      } else { //失败了, 提示
        this.$message.error('保存SKU信息失败')
      }
    },

    /* 
    将当前图片设置为默认图片
    */
    setDefaultImg (spuImg) {
      // 将所有图片都指定非默认的
      this.spuImageList.forEach(item => item.isDefault = '0')
      // 将当前spuImg指定为默认的
      spuImg.isDefault = '1'
      // 保存默认图片地址
      this.skuInfo.skuDefaultImg = spuImg.imgUrl
    },

    /* 
    table列表选中发生改变的监听回调
    value: 所有选中项对应图片对象的数组
    */
    handleSelectionChange (value) {
      this.selectedSpuImageList = value
    },
    /* 
    初始化加载数据
    */
    initLoadAddData (spu) {
      this.spu = spu
      // 瘵spu中的信息数据保存到skuInfo中
      /* 
      category3Id: null,
      spuId: null,
      tmId: null,
      */
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId

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

      // 给得到的图片列表中的图片对象都添加一个isDefault属性 ===> 后面更新默认图片方便
      const spuImageList = results[1].data.map(item => ({...item, isDefault: '0'}))
      this.spuImageList = spuImageList
      this.spuSaleAttrList = results[2].data
    },

    /* 
    取消返回列表界面
    */
    back () {
      this.resetData()
      this.$emit('cancel')
    },

    /* 
    重置一下数据
    */
    resetData () {
      this.skuInfo = {
        category3Id: '',
        spuId: '',
        tmId: '',
        skuName: '',
        skuDesc: '',
        price: '',
        weight: '',
        skuDefaultImg: '',
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      this.spu = {}, // 所属的SPU对象
      this.attrList = [] // 平台属性列表
      this.spuImageList = [] // SPU的图片列表
      this.spuSaleAttrList = [] // SPU的销售属性列表
      this.selectedImageList = [] // 所有选中图片对象的列表
    },
  }
}
</script>

<style>

</style>