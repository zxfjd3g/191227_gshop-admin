<template>
  <div>
    <el-card>
      <CategorySelector ref="cs" @categoryChange="handleCategoryChange"/>
    </el-card>

    <el-card>
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px" 
          @click="showAdd" :disabled="!category3Id">添加属性</el-button>

        <el-table border :data="attrs">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名称" width="150" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{row, $index}">
              <el-tag style="margin: 2px" type="info" v-for="value in row.attrValueList" :key="value.id">{{value.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row, $index}">
              <HintButton title="修改" type="primary" icon="el-icon-edit" size="mini" @click="showUpdate(row)"></HintButton>
              <el-popconfirm
                :title="`确定删除 '${row.attrName}' 吗`"
                @onConfirm="deleteAttr(row.id)">
                <hint-button slot="reference" title="删除" type="danger" icon="el-icon-delete" 
                  size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <el-form inline :model="attr">
          <el-form-item label="属性名">
            <el-input type="text" v-model="attr.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" 
          :disabled="!attr.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>
          <!-- 
            {
              "attrId": 0,
              "id": 0,
              "valueName": "string"
            }
           -->
        <el-table border style="margin: 20px 0" :data="attr.attrValueList">
          <el-table-column label="序号"  type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row, $index}">
              <el-input :ref="$index" v-if="row.edit" v-model="row.valueName" size="mini" 
                placeholder="请输入属性值名称" @blur="toShow(row)" 
                @keyup.enter.native="toShow(row)"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: inline-block; width: 100%">
                {{row.valueName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <el-popconfirm
                :title="`确定删除 '${row.valueName}' 吗`"
                @onConfirm="attr.attrValueList.splice($index, 1)">
                <HintButton slot="reference" title="删除" type="danger" icon="el-icon-delete" size="mini"></HintButton>
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="!attr.attrName || attr.attrValueList.length===0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

import cloneDeep from 'lodash/cloneDeep' // 只引入要使用的工具函数
export default {
  name: 'AttrList',

  data () {
    return {
      category1Id: '',  // 一级分类ID
      category2Id: '',  // 二级分类ID
      category3Id: '',  // 三级分类ID
      attrs: [], // 所有属性的列表

      isShowList: true, // 是否显示属性列表页面   true: 列表页面, false: 添加或更新页面  

      attr: { // 要添加或者修改的平台属性对象
        attrName: '', // 属性名
        attrValueList: [], //属性值的列表
        categoryId: '', // 3级的分类ID
        categoryLevel: 3, // 只能是3级
      }
    }
  },

  mounted () {
    // this.category1Id = 2
    // this.category2Id = 13
    // this.category3Id = 61
    // this.getAttrs()
  },

  watch: {
    // 当isShowList发生改变时执行处理: 更新cs组件的disabled状态数据
    isShowList (value) {
      this.$refs.cs.disabled = !value
    }
  },

  methods: {

    /* 
    删除指定的属性
    */
    deleteAttr (id) {
      // 请求删除
      this.$API.attr.remove(id).then(result => {
        // 重新获取列表显示
        this.getAttrs()
      }).catch(error => {
        this.$message.error('删除属性失败')
      })
    },

    /* 
    保存(添加/更新)属性
    */
    async save () {
      // 准备参数数据
      const attr = this.attr

      // 在提交请求前, 需要对收集数据进行整理操作
        /* 
        属性值名称没有指定, 请求保存的是"" ==> 将属性值名称为""的属性值对象从数组中过滤掉
        一个属性值都没有指定, 也提交了请求  ==> 不能提交请求
        请求携带了没有必要的参数数据: edit  ==> 删除此属性
        */
      attr.attrValueList = attr.attrValueList.filter(value => {
        if (value.valueName!=='') {
          delete value.edit 
          return true
        }
      })
      if (attr.attrValueList.length===0) {
        this.$message.warning('至少指定一个属性值名称')
        return
      }

      // 提交添加/更新的请求
      const result = await this.$API.attr.addOrUpdate(attr)
      // 成功了, ...
      if (result.code===200) {
        // 提示成功
        this.$message.success('保存属性成功')
        // 变为属性列表模式
        this.isShowList = true
        // 重新获取列表显示
        this.getAttrs()
      } else { // 失败了, 提示
        this.$message.error('保存属性失败')
      }
      
    },

    /* 
    将指定属性值对象的界面变为编辑模式
    */
    toEdit (value, index) {
      // 如果value就已经有edit属性了, 直接指为true
      if (value.hasOwnProperty('edit')) {
        value.edit = true
      } else {
        // 如果没有, 必须通过$set()来添加一个新属性
        this.$set(value, 'edit', true)
      }

      // 找到当前行的Input对象, 让其获得焦点
      // 此时input界面有没有显示?  没有
      // 数据更新了, 但界面是最后异步更新的
      // 必须在界面更新之后才去操作
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    /* 
    将指定属性值对象的界面变为查看模式
    */
    toShow (value) {
      // 必须输入了属性值名称
      if (value.valueName) {
        // 必须不在已有属性值列表中
          // 只能与数组当前元素之外所有进行比较
        const isRepeat = this.attr.attrValueList.some((item, index) => {
          if (item!==value) {
            return item.valueName===value.valueName
          }
        })
        // console.log('---', value.valueName, isRepeat)
        if (!isRepeat) {
          value.edit = false
        } else { // 如果已经有了
          value.valueName = ''  // 清除输入
          this.$message.warning('输入的名称已存在')
        }
      }
    },

    /* 
    显示添加属性的界面
    */
    showAdd () {
      // 重置attr对象 
      this.attr = { 
        attrName: '', 
        attrValueList: [],
        categoryId: this.category3Id, 
        categoryLevel: 3, 
      }
      // 显示添加的界面
      this.isShowList = false
    },

    /* 
    显示修改属性的界面
    
    */
    showUpdate (attr) {
      // 保存要修改的属性对象
      // this.attr = attr // 列表与修改界面引用了同一个属性对象  ==> 修改属性名不能取消
      // this.attr = {...attr} // 对attr进行了一个浅拷贝(克隆)  ==> 修改属性值名称不能取消
      this.attr = cloneDeep(attr) // 对attr进行了一个深拷贝(克隆) ==> OK

      // 显示更新的界面(attr中有数据)
      this.isShowList = false
    },

    /* 
    添加一个新的属性值
    */
    addAttrValue () {
      this.attr.attrValueList.push({
        attrId: this.attr.id, // 如果是修改属性有值, 如果是添加属性就是undefined
        valueName: '',
        edit: true, // 添加的新属性值是编辑模式的
      })

      // 让最后一个属性值的input自动获得焦点 (必须等界面更新之后之能focus)
      this.$nextTick(() => {
        this.$refs[this.attr.attrValueList.length-1].focus()
      })
    },

    /* 
    3个级别分类发生改变时的监听回调
    */
    handleCategoryChange ({categoryId, level}) {
      // console.log('handleCategoryChange', categoryId, level)
      if (level===1) {
        this.category1Id = categoryId
        // 重置2级和3级ID和属性列表
        this.category2Id = ''
        this.category3Id = ''
        this.attrs = []
      } else if (level===2) {
        this.category2Id = categoryId
        // 重置3级ID和属性列表
        this.category3Id = ''
        this.attrs = []
      } else {
        this.category3Id = categoryId
        // 异步请求获取属性列表显示
        this.getAttrs()
      }
    },

    /* 
    异步请求获取属性列表显示
    */
    async getAttrs () {
      const {category1Id, category2Id, category3Id} = this
      const result = await this.$API.attr.getList(category1Id, category2Id, category3Id)
      this.attrs = result.data
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

