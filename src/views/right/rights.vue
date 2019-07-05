<template>
  <div class="rights">
    <!-- //面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table ref="singleTable" :data="rightTable" style="width: 100%"  :row-class-name="tableRowClassName">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="权限" width="120"></el-table-column>
      <el-table-column property="path" label="路径" width="120"></el-table-column>
      <!-- <el-table-column property="level" label="层级"></el-table-column> -->
       <el-table-column label="层级">
          <template slot-scope='scope'>
              <span>{{scope.row.level | levelFormat}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/right_index.js'

export default {
  data () {
    return {
      rightTable: []
    }
  },
  methods: {
    async init () {
      let result = await getAllRightList('list')
      console.log(result)
      this.rightTable = result.data.data
      console.log('--------------')
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  },
  mounted () {
    // getAllRightList('list').then(result => {
    //   console.log(result)
    //   this.rightTable = result.data.data
    // })
    this.init()
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
