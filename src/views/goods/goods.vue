<template>
  <div class="goods">
      <!-- //面包屑导航 -->

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a>商品管理</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <router-view></router-view>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>

</style>
