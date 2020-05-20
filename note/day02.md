## 今日功能
    1). 属性列表
    2). 添加平台属性
    3). 修改平台属性
    4). 删除平台属性

## 分类3级列表选择器组件: CategorySelector
    界面布局: Form / Select
    动态获取数据:
        获取一级列表数据
        获取二级列表数据
        获取三级列表数据
    数据重置
    通过分发事件父组件传递数据
        事件名?  categoryChange
        什么时候分发?   3个级别的当前分类发生改变时都需要分发
        携带什么数据? 当前分类ID和级别标识, 比如: {cateogoryId, level}

## 属性列表
    界面布局: Card / Table / Tag / Button
    绑定事件监听接收分类ID数据
    动态获取数据显示

## 属性的添加和修改
    添加/修改的界面布局: Form / Input / Button / Table / 
    列表界面与添加/修改界面的切换: isShowList
    显示添加界面: 指定attr对象中的attrName与attrValueList都为空值
    显示修改界面: 指定attr为当前选择的属性对象

## 属性值管理
    添加的新属性值显示是编辑模式, 而原本有的属性值显示是查看模式
        为属性值对象设计一个新的标识属性: edit
        显示时根据edit来判断是显示input还是span
        新添加的属性值对象, 添加一个edit属性为true       
    在编辑模式下, 失去焦点或点enter键, 切换到查看模式
        在el-input的keyup监听必须通过.native指定为原生监听才有效果
        条件:
            必须输入了属性值名称
            不能与已有名称重复
        将属性值对象的edit指定为false
    在查看模式下, 点击文本, 当前项切换到编辑模式
        如果属性值对象有edit属性, 直接指定为true
        如果没有, 通过$set()添加edit属性, 值指定为true

    删除属性值
        利用属性值数组的splice()根据当前下标删除

    设计数据?
        类型: boolean
        名称: edit
        放在哪 attrValue对象