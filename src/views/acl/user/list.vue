<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item>
         <el-input v-model="tempSearchObj.username" placeholder="用户名" />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="showAddUser" v-if="$hasBP('user.add')">添 加</el-button>
      <el-button type="danger" @click="revomveUsers" :disabled="selectedIds.length===0" 
        v-if="$hasBP('user.remove')">批量删除</el-button>
    </div>

    <el-table
      border
      stripe
      v-loading="listLoading"
      :data="users"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55" />

      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />

      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="gmtCreate" label="创建时间" width="180"/>
      <el-table-column prop="gmtModified" label="更新时间" width="180"/>

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="{row}">
          <HintButton type="info" size="mini" icon="el-icon-user-solid" title="分配角色"
            v-if="$hasBP('user.add')" @click="showAssignRole(row)"/>
          <HintButton type="primary" size="mini" icon="el-icon-edit" title="修改用户"
            v-if="$hasBP('user.update')" @click="showUpdateUser(row)"/>
          <el-popconfirm :title="`确定删除 ${row.username} 吗?`" @onConfirm="removeUser(row.id)">
            <HintButton slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除用户"
              v-if="$hasBP('user.remove')"/> 
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 20px 0;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getUsers"
      @size-change="handleSizeChange"
    />

    <el-dialog :title="user.id ? '修改用户' : '添加用户'" :visible.sync="isShowDialog">
      <el-form ref="userForm" :model="user" :rules="userRules" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"/>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.nickName"/>
        </el-form-item>
        
        <el-form-item v-if="!user.id" label="用户密码" prop="password">
          <el-input v-model="user.password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button :loading="loading" type="primary" @click="assignRole">保存</el-button>
        <el-button @click="resetRoleData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'AclUserList',

  data () {
    return {
      listLoading: false,
      searchObj: {
        username: ''
      },
      tempSearchObj: {
        username: ''
      },
      selectedIds: [],
      users: [],
      page: 1,
      limit: 5,
      total: 0,
      user: {},
      isShowDialog: false,
      userRules: {
        username: [
          { required: true, message: '用户名必须输入' },
          { min: 4, message: '用户名不能小于4位' }
        ],
        password: [
          { required: true, validator: this.validatePassword }
        ]
      },
      loading: false,
      dialogRoleVisible: false, // 是否显示角色Dialog
      allRoles: [],
      userRoleIds: [],
      isIndeterminate: false,
      checkAll: false,
    }
  },

  created () {
    this.getUsers()
  },

  methods: {
    /* 
    显示指定角色的界面
    */
    showAssignRole (user) {
      this.user = user
      this.dialogRoleVisible = true
      this.getRoles()
    },

    /* 
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange (value) {
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
    },

    /* 
    异步获取用户的角色列表
    */
    async getRoles () {
      const result = await this.$API.user.getRoles(this.user.id)
      const {allRolesList, assignRoles} = result.data
      this.allRoles = allRolesList
      this.userRoleIds = assignRoles.map(item => item.id)
      this.checkAll = allRolesList.length===assignRoles.length
      this.isIndeterminate = assignRoles.length>0 && assignRoles.length<allRolesList.length
    },

    /* 
    角色列表选中项发生改变的监听
    */
    handleCheckedChange (value) {
      const {userRoleIds, allRoles} = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
      this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
    },

    /* 
    请求给用户进行角色授权
    */
    async assignRole () {
      const userId = this.user.id
      const roleIds = this.userRoleIds.join(',')
      this.loading = true
      const result = await this.$API.user.assignRoles(userId, roleIds)
      this.loading = false
      this.$message.success(result.message || '分配角色成功')
      this.resetRoleData()
    },

    /* 
    重置用户角色的数据
    */
    resetRoleData () {
      this.dialogRoleVisible = false
      this.allRoles = []
      this.userRoleIds = []
      this.isIndeterminate = false
      this.checkAll = false
    },

    /* 
    自定义密码校验
    */
    validatePassword (rule, value, callback) {
      if (!value) {
        callback('密码必须输入')
      } else if (!value || value.length < 6) {
        callback('密码不能小于6位')
      } else {
        callback()
      }
    },
    /* 
    根据输入进行搜索
    */
    search () {
      this.searchObj = {...this.tempSearchObj}
      this.getUsers()
    },

    /* 
    重置输入后搜索
    */
    resetSearch () {
      this.searchObj = {
        username: ''
      }
      this.tempSearchObj = {
        username: ''
      }
      this.getUsers()
    },

    /* 
    显示添加用户的界面
    */
    showAddUser () {
      this.user = {}
      this.isShowDialog = true
      this.$nextTick(() => this.$refs.userForm.clearValidate())
    },

    revomveUsers () {
      this.$confirm('确定删除吗?').then(async () => {
        const result = await this.$API.user.removeUsers(this.selectedIds)
        this.$message.success('删除成功')
        this.getUsers()
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    /* 
    列表选中状态发生改变的监听回调
    */
    handleSelectionChange (selection) {
      this.selectedIds = selection.map(item => item.id)
    },

    /* 
    显示更新用户的界面
    */
    showUpdateUser (user) {
      this.user = cloneDeep(user)
      this.isShowDialog = true
    },

    /* 
    删除某个用户
    */
    async removeUser (id) {
      await this.$API.user.removeById(id)
      this.$message.success('删除成功')
      this.getUsers(this.users.length===1 ? this.page-1 : this.page)
    },

    /* 
    获取分页列表
    */
    async getUsers (page=1) {
      this.page = page
      const {limit, searchObj} = this
      this.listLoading = true
      const result = await this.$API.user.getPageList(page, limit, searchObj)
      this.listLoading = false
      const {items, total} = result.data
      this.users = items
      this.total = total
      this.selectedIds = []
    },

    /* 
    处理pageSize发生改变的监听回调
    */
    handleSizeChange (pageSize) {
      this.limit = pageSize
      this.getUsers()
    },

    cancel () {
      this.isShowDialog = false
      this.user = {}
    },

    saveOrUpdate () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const {user} = this
          this.loading = true
          this.$API.user[user.id ? 'update' : 'add'](user).then((result) => {
            this.loading = false
            this.$message.success('保存成功!')
            this.getUsers(user.id ? this.page : 1)
            this.user = {}
            this.isShowDialog = false
          })
        }
      })
    }
  }
}
</script>
