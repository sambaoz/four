<template>
  <div class="roles">
    <!-- //面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="add">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleData" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="first in props.row.children" :key="first.id">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-tag
                  closable
                  type="success"
                  @close="removefirst(props.row,first.id)"
                >{{first.authName}}</el-tag>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                <el-row v-for="second in first.children" :key="second.id">
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-tag
                        closable
                        type="info"
                        @close="removeSecond(props.row,second.id)"
                      >{{second.authName}}</el-tag>
                    </div>
                  </el-col>
                  <el-col :span="18">
                    <div class="grid-content bg-purple-light">
                      <el-tag
                        closable
                        type="warning"
                        @close="removeSingleRight(props.row,third.id)"
                        v-for="third in second.children"
                        :key="third.id"
                      >{{third.authName}}</el-tag>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="props.row.children.length===0">没有数据</el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="success" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top">
            <el-button type="warning" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加弹框 -->
    <el-dialog title="添加角色" :visible.sync="addialogFormVisible">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addroled">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 授权列表 -->
    <el-dialog title="角色授权" :visible.sync="dialogFormVisible">
      <div class="rightListBox">
      <el-tree
         ref="rolesd"
        :data="rightsData"
        show-checkbox
        node-key="id"
       :default-expand-all='true'
        :default-checked-keys="setectList"
       :props="defaultProps"
      ></el-tree>  </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='grantRoleSubmit'>确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/right_index.js'
import {
  getAllRoleList,
  removeRightByUserId,
  addrole, grantRoleSubmitd
} from '@/api/role_index.js'
export default {
  data () {
    return {
      roleId: '',
      setectList: [],
      roleData: [],
      dialogFormVisible: false,
      addialogFormVisible: false,

      addForm: {
        roleName: '',
        roleDesc: ''
      },
      formLabelWidth: '120px',
      rightsData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
  // 实现授权
    async grantRoleSubmit () {
      console.log(this.$refs.rolesd.getCheckedNodes())
      var allNodes = this.$refs.rolesd.getCheckedNodes()
      var arr = allNodes.map(value => {
        return value.id + ',' + value.pid
      })
      var ids = arr.join(',')
      var temp = ids.split(',')
      // console.log(temp)
      var finalIds = Array.from(new Set(temp))
      console.log(finalIds)
      let result = await grantRoleSubmitd(this.roleId, finalIds.join(','))
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.dialogFormVisible = false
      }
      this.init()
      console.log(result)
    },

    // 打开授权框并加载所有权限
    async showGrantDialog (row) {
      this.dialogFormVisible = true
      let result = await getAllRightList('tree')
      // console.log(result)
      this.rightsData = result.data.data
      this.roleId = row.id
      console.log(this.roleId)

      // console.log(row)
      this.setectList = []
      if (row.children && row.children.length !== 0) {
        row.children.forEach((first) => {
          if (first.children && first.children.length !== 0) {
            first.children.forEach((second) => {
              if (second.children && second.children.length !== 0) {
                second.children.forEach((third) => {
                  this.setectList.push(third.id)
                })
              }
            })
          }
        })
      }

      // console.log(this.setectList)
    },
    // 添加角色
    async addroled () {
      let result = await addrole(this.addForm)
      console.log(result)
      this.init()
      this.addialogFormVisible = false
    },
    // 显示添加框
    add () {
      this.addialogFormVisible = true
    },
    async init () {
      let result = await getAllRoleList()
      // console.log(result)
      // console.log('-----------')
      this.roleData = result.data
    },
    async removeSingleRight (role, rightId) {
      let result = await removeRightByUserId(role.id, rightId)
      console.log(result)
      role.children = result.data.data
    },
    async removeSecond (role, rightId) {
      let result = await removeRightByUserId(role.id, rightId)
      console.log(result)
      role.children = result.data.data
    },
    async removefirst (role, rightId) {
      let result = await removeRightByUserId(role.id, rightId)
      console.log(result)
      role.children = result.data.data
    }
  }
}
</script>
<style lang="less" scoped>
.rightListBox{
  height: 400px;
  overflow: scroll;
}
</style>
