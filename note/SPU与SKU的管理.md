## 功能列表
    1.SPU的分页列表
    2.添加SPU
    3.修改SPU
    4.删除指定SPU
    5.给某个SPU添加SKU
    6.查看SPU下的SKU列表
    7.SKU的分页列表
    8.对SKU进行上架/下架处理
    9.查看SKU详情

## 理解区别2组业务概念
    1. SPU与SKU
      SPU: 某个商品所有相关信息的集合, 包括所有可选择的图片, 可选择的平台属性与销售属性
      SKU: SPU下确定了图片列表/平台属性与销售属性数据的信息集合, 商品唯一标识
      关系: 一个SPU下可以对应多个SKU
    2. 平台属性与销售属性
      平台属性: 用于(出现)商品搜索的商品描述信息, 包含属性名与一系列的属性值
      销售属性: 出现在商品详情界面的商品描述信息, 包含属性名与一系列的属性值

## SPU的分页列表
    界面布局: Card / CategorySelector / Button / Table / Pagination
    异步请求获取数据显示

## SpuForm组件
    显示隐藏切换: 利用.sync技术
        父组件: 
            <SpuForm :visible.sync="isShowSpuForm">
        子组件: 
            <Form v-show="visible">
            this.$emit('update:visible', false)
    子组件向父组件通信 / 子组件更新父组件的数据
        函数属性
        vue自定义事件
        v-model
        .sync
        $parent
    父组件更新子组件的数据
        props
        ref
        $children

    显示修改SPU的界面发送哪些请求:
        1. 根据SPU的id获取SPU的详情信息
        2. 根据SPU的id获取SPU的图片列表
        3. 获取所有品牌的列表
        4. 获取所有销售属性(id/name)列表

    父组件通知子组件发请求
        利用ref技术: 通过ref得到子组件对象, 进而调用其方法同时传递数据

    显示添加SPU的界面发送哪些请求
        1. 获取所有品牌的列表
        2. 获取所有销售属性(id/name)列表

    显示初始请求的数据
        品牌列表: trademarkList 和 spuInfo.tmId   ==> 简单
        SPU图片列表: spuImageList
            现有数据结构:
                {
                    id:1224
                    imgName:"O1CN01N5IsrF29zFm3vQZpT_!!1714128138.jpg"
                    imgUrl:"http://182.92.128.115:8080/xxx.jpg"
                    spuId:154
                }
            要求的数据结构:
                 {
                     name: 'food.jpg', 
                     url: 'https://xxx.cdn.com/xxx.jpg'
                }
            需要对数据进行整理:
                给数组元素对象添加name和url属性
            注意: 开发中请求获取的数据不能直接显示, 而需要进行特定处理/整理之后才能显示
        spu销售属性列表: spuInfo.spuSaleAttrList数组
            {
                "id": 133,
                "spuId": 26,
                "baseSaleAttrId": 2,
                "saleAttrName": "选择版本",
                "spuSaleAttrValueList": [
                    {
                        "id": 225,
                        "spuId": 26,
                        "baseSaleAttrId": 2,
                        "saleAttrValueName": "aa",
                        "saleAttrName": "选择版本",
                        "isChecked": null
                    },
                ],
                // 添加的属性
                edit: false/true,
                saleAttrValueName: 'xxx'
            }
        还没使用的销售属性名列表: saleAttrList 与 spuInfo.spuSaleAttrList
            根据这2个计算产生: 过滤saleAttrList, 找出所有在spuSaleAttrList中还没有用到的
    
## 收集数据
    图片数据收集: spuImageList
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

    销售属性数据收集:
        添加spu销售属性: 
            向数组中添加数据: spuInfo.spuSaleAttrList
            添加的数据的结构: 
                {
                    "baseSaleAttrId": "1",
                    "saleAttrName": "选择颜色",
                    "spuSaleAttrValueList": []
                }
        添加spu销售属性值: 
            向spuSaleAttr.spuSaleAttrValueList中添加一个spu销售属性值对象
                {
                    "saleAttrValueName": "a",  // 输入的
                    "baseSaleAttrId": "1" // 销售属性的id
                }
            查看模式与编辑模式:
                标识: edit: true/false
                输入的属性值名称: saleAttrValueName
                将这2个数据保存在spu的销售属性对象(row)上

        删除spu销售属性值

        删除spu销售属性