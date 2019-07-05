<template>
    <div class="list">
       <!-- //搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select searchBox" @keyup.enter.native="serachUser">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain  @click='$router.push({name:"Add"})'>添加按钮</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="goodsData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="580"></el-table-column>
      <el-table-column prop="goods_price" label="价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template >
           <el-button size="mini">编辑</el-button>
        <el-button size="mini" type="danger" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    </div>
</template>

<script>
import { getAllGoodsList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      goodsData: [],
      query: '',
      pagenum: 1,
      pagesize: 10
    }
  },
  methods: {
    async init () {
      let result = await getAllGoodsList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      this.goodsData = result.data.data.goods
      console.log(result)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
  .searchBox {
  width: 300px;
  margin-right: 10px;
}
</style>
