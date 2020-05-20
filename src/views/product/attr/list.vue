<template>
  <div>
    <el-card>
      <CategorySelector/>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AttrList',

  mounted () {
    this.$API.attr.getList(2, 13, 61)
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

