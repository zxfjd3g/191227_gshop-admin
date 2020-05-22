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

    显示修改SPU的界面发送哪些请求:
        1. 根据SPU的id获取SPU的详情信息
        2. 根据SPU的id获取SPU的图片列表
        3. 获取所有品牌的列表
        4. 获取所有销售属性(id/name)列表

    父组件通知子组件发请求
        利用ref技术: 通过ref得到子组件对象, 进而调用其方法同时传递数据 