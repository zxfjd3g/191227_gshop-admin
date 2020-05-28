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

## 显示初始请求的数据(SpuForm组件)
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
    
## 收集数据(SpuForm组件)
    图片数据收集: spuImageList
        已有图片对象: 接口返回+我添加的
            {
                id:1224
                imgName:"O1CN01N5IsrF29zFm3vQZpT_!!1714128138.jpg"
                imgUrl:"http://182.92.128.115:8080/xxx.jpg"
                spuId:154,
                name: 'O1CN01N5IsrF29zFm3vQZpT_!!1714128138.jpg',
                url: 'http://182.92.128.115:8080/xxx.jpg'
            }
        新上传图片的结构:  Upload组件内部创建的
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
            最终目标: 
                向spuSaleAttr.spuSaleAttrValueList中添加一个spu销售属性值对象
                {
                    "saleAttrValueName": "a",  // 输入的
                    "baseSaleAttrId": "1" // 销售属性的id
                }
            查看模式与编辑模式:
                标识: edit: true/false
                输入的属性值名称: saleAttrValueName
                将这2个数据保存在spu的销售属性对象(row)上
            从查看模式切换到编辑械
                给当前行的属性对象添加edit属性: $set()
                输入框自动获得焦点: $nextTick()
            确定添加spu销售属性值对象
                必须输入的内容
                不能与已有的重复

        删除spu销售属性值
            简单
        删除spu销售属性
            简单

## 提交添加/更新SPU的请求(SpuForm组件)
    收集整理请求参数数据
        整理1: spu图片列表中图片对象的结构不对, 利用map方法生成满足要求的图片数据对象
        整理2: spu销售属性列表中的属性对象包含一些没必要的属性, 没有一个属性值名称的属性应该过滤掉
    发送ajax请求
    成功了,..
        提示成功
        重置当前组件的数据
        回到列表页面
        通知父组件重新获取分页列表数据显示  ==> 获取哪一页?
    失败了

## 显示指定SPU下所有SKU的列表

## SkuForm添加sku功能
    1.界面布局: Form / Input / Select / Table / Button

    2.获取数据
        根据3个级别分类ID获取所有的平台属性列表
        根据spu的ID获取SPU图片列表
        根据SPU的ID获取SPU销售属性列表
    3.显示数据
        attrList中的attr结构:
            {
                "id": 1,
                "attrName": "价格",
                "categoryId": 61,
                "categoryLevel": 3,
                "attrValueList": [
                    {
                        "id": 207,
                        "valueName": "500-999",
                        "attrId": 1
                    }
                ]
            }
        spuImageList中的image结构:
            {
                "id": 333,
                "spuId": 26,
                "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
                "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
            }
        spuSaleAttrList中的attr结构:
            {
                "id": 136,
                "spuId": 30,
                "baseSaleAttrId": 1,
                "saleAttrName": "选择颜色",
                "spuSaleAttrValueList": [
                    {
                        "id": 258,
                        "spuId": 30,
                        "baseSaleAttrId": 1,
                        "saleAttrValueName": "a",
                        "saleAttrName": "选择颜色",
                        "isChecked": null
                    }
                ]
            }
    4.交互收集数据
        简单:
            收集父组件传入的
            v-model收集
        平台属性数据
            现有数据: attrList
                {
                    "id": 1,
                    "attrName": "价格",
                    "categoryId": 61,
                    "categoryLevel": 3,
                    "attrValueList": [
                        {
                            "id": 207,
                            "valueName": "500-999",
                            "attrId": 1
                        }
                    ]
                }
            目标数据: skuInfo.skuAttrValueList
                {
                    "attrId": "1",
                    "valueId": "207"
                }
            收集数据: 到平台属性对象上添加一个新属性attrIdValueId
                {
                    attrIdValueId: '1:207'
                }
        销售属性:
            现有数据: spuSaleAttrList
                {
                    "id": 136,
                    "spuId": 30,
                    "baseSaleAttrId": 1,
                    "saleAttrName": "选择颜色",
                    "spuSaleAttrValueList": [
                        {
                            "id": 258,
                            "spuId": 30,
                            "baseSaleAttrId": 1,
                            "saleAttrValueName": "a",
                            "saleAttrName": "选择颜色",
                            "isChecked": null
                        }
                    ]
                }
            目标数据: skuInfo.skuSaleAttrValueList
                {
                "saleAttrValueId": 258
                }
            收集数据: 到销售属性对象上添加一个新属性saleAttrValueId
                {
                    saleAttrValueId: '258'
                }
        sku图片列表和默认图片url
            现有数据: spuImageList
                {
                    "id": 333,
                    "spuId": 26,
                    "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
                    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
                }
            目标数据:
                skuImageList: [
                        {
                            "imgName": "下载 (1).jpg",
                            "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
                            "spuImgId": 337, // 当前Spu图片的id
                            "isDefault": "1"   // 默认为"1", 非默认为"0"
                        }
                    ]
                skuDefaultImg: 'http://47.93.148.192:8080/xxx.jpg'
            收集数据:
                selectedSpuImageList
                selection-change事件监听
                给请求得到的每个spuImage添加一个isDefault属性标识是否是默认图片
                点击设置按钮时, 直接更新isDefault属性, 不用使用$set()
                    skuInfo.skuDefaultImg = 'xxx'
                    {
                        "id": 333,
                        "spuId": 26,
                        "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
                        "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
                        isDefault: '1'
                    }
    5. 整理数据后请求
        整理1: skuAttrValueList
            数据来源: attrList
                {
                    attrIdValueId: '1:207'  // 可能有, 也可能没有
                }
            目标数据结构:
                {
                    "attrId": "1",
                    "valueId": "207"
                }
        整理2: skuSaleAttrValueList
            数据来源: spuSaleAttrList
                {
                    saleAttrValueId: '258'  // 可能有, 也可能没有
                }
            目标数据结构:
                {
                    "saleAttrValueId": 258
                }
        整理3: skuImageList
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
    6.请求完成后更新界面
        重置数据
        返回列表界面: 通知父组件
            方式一: 分发自定义事件
            方式二: 调用函数属性

## 相对复杂的需要向后台提交数据的界面:
    1. 界面布局: element-ui的组件搭建
    2. 请求获取初始显示需要的数据(有可能需要发多个请求)
    3. 显示初始动态数据
    4. 用户操作收集数据(v-model/绑定事件监听)
    5. 在提交请求前整理收集数据, 
    6. 根据整理好的参数, 发送请求
    7. 请求完成后做相应的响应处理

## 作用域样式(scoped css)与深度作用选择器
    1.作用域样式是什么?
        (1)<style scoped>
        (2)让组件的样式限定在当前组件作用域(范围)内有效, 对其它外部或内部组件无效
    2.组件不加scoped声明的问题?
        一个组件的样式可以影响到外部或内部的所有任何组件, 如果不做限制就会出现样式效果的问题
    3.组件声明使用scoped
        (1)标签变化:
            ①当前组件内所有标签都会添加一个自定义data属性来标识这个组件, 如: data-v-2e8d0da5
            ②所有子组件也会收到此属性, 转换为其根标签的属性(不会在其内部其它标签上添加)
            ③推理: 
                1)一个组件的根标签: 可能有1个data属性(父组件没有指定scoped), 也可能有2个data属性(父组件指定了scoped)
                2)内部所有子标签: 可能没有data属性(当前组件没有指定scoped), 也可能有1个data属性(当前组件指定了scoped)
        (2)选择器变化:
            在选择器最右边加上当前组件标识data属性条件: .test2 .t2[data-v-2e8d0da5]
                源码: 
                    .test2 .t3 {
                        color: red;
                    }
                编译: 
                    .test2 .t3[data-v-2e8d0da5] {
                        color: red;
                    }
            ② 这个条件对当前组件的标签都匹配
            ③但对其它组件只有可能匹配上子组件的根标签, 其它都匹配不上(不会产生样式的影响)
        (3)作用:
            ①让当前组件的样式不要影响其它组件, 尤其是子/孙组件
            ②注意: 但还是可以影响子组件的根标签的
    4.深度作用选择器
        (1)作用: 使用了scoped后, 还能修改子/孙组件的样式, 尤其是第三方UI组件库组件
        (2)语法:
            原生css: 使用 >>>
                .test2 >>> .t2 {
                    color: red;
                }
            预编译器: 使用/deep/
                .test2 { 
                    /deep/ .t2 {
                        color: red;
                    }
                }
        (3)原理: 
            ①内部是由vue-loader来进行编译处理的
            ②编译打包后样式选择器上的data属性条件加在了最左边第一层选择器上: .test2[data-v-2e8d0da5] .t3
                .test2[data-v-2e8d0da5] .t2 {
                    color: red;
                }
            ③结果: 对子/孙组件标签就没有此属性的条件, 就可以匹配上子/孙组件内的标签, 进而改变其样式效果
        (4)项目功能实例:
            修改element-ui的Carousel轮播图组件的指示器样式  (本身都没有加scoped)
    5.面试题:
        (1)scoped的作用与原理?
            看上面
        (2)修改第三方UI组件库的样式有哪些办法?
            ①使用深度选择器
            ②将修改子组件样式的代码放在不指定scoped的style内, 但最好给根标签加上类名做限制(不产生全局影响)