<template>
  <div class="User">
    <!-- //面包屑导航 -->

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a>活动管理</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    <!-- //搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select searchBox" @keyup.enter.native="serachUser">
        <el-button slot="append" icon="el-icon-search" @click="serachUser"></el-button>
      </el-input>
      <el-button type="success" plain  @click='addialogFormVisible = true'>添加按钮</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"  @change="changeStatu($event,scope.row.id)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
           <el-button type="success" icon="el-icon-delete"  @click='del(scope.row.id)'></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="warning" icon="el-icon-share" @click="showGrantRoleDialog(scope.row)"></el-button>

          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑弹框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色弹框 -->
    <el-dialog title="角色分配" :visible.sync="roleFormVisible">
  <el-form :model="roleform">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="roleform.name" autocomplete="off" style='width:222px' disabled></el-input>
    </el-form-item>
    <el-form-item label="角色" :label-width="formLabelWidth">
     <el-select v-model="roleform.rid" placeholder="请选择" @change="selectRole">
     <el-option
       v-for="item in rolelist"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="fenpei">确 定</el-button>
  </div>
</el-dialog>

<!-- 添加弹框 -->
    <el-dialog title="添加用户" :visible.sync="addialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username" autocomplete="off" ></el-input>
        </el-form-item>
         <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit('addForm')">确 定</el-button>
      </div>
    </el-dialog>
   <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { getAllRoleList, actor } from '@/api/role_index.js'
import { getDatelist, editUser, delUserById, updateUserStatuById, addUser } from '@/api/users_index.js'
export default {
  data () {
    return {
      roleFormVisible: false,
      rolelist: [],
      values: 'ff',
      roleform: {
        id: '',
        name: '',
        rid: ''
      },
      addialogFormVisible: false,
      addForm: {
        username: '',
        mobile: '',
        email: '',
        password: ''

      },

      // 用户搜索关键字
      query: '',
      value: true,
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 1,
      total: 0,
      //   表格数据源
      tableData: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      editForm: {
        username: '',
        mobile: '',
        email: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }
        ]
      },

      editTemp: {}
    }
  },
  methods: {
    // 分页功能
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },

    // 搜索功能
    serachUser () {
      this.init()
    },
    // 添加用户
    addSubmit (addForm) {
      this.$refs[addForm].validate((valid) => {
        if (valid) {
          this.addialogFormVisible = false
          addUser(this.addForm)
            .then((result) => {
              if (result.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: result.meta.msg
                })

                this.init()
              } else {
                this.$message({
                  type: 'success',
                  message: result.meta.msg
                })
              }
            })
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
    },
    // 角色分配
    fenpei () {
      actor(this.roleform.id, this.roleform.rid)
        .then(result => {
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.meta.msg
            })
            this.roleFormVisible = false
            this.init()
          }
        })
    },
    // 显示下拉列表
    showGrantRoleDialog (row) {
      this.roleFormVisible = true
      this.roleform.id = row.id
      this.roleform.rid = row.rid
      this.roleform.name = row.username
    },
    // 下拉列表选择
    selectRole (obj) {
      console.log(obj)
    },
    // 修改用户状态
    changeStatu (e, id) {
      console.log(e, id)
      updateUserStatuById(e, id)
        .then((result) => {
          console.log(result)
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
        })
      console.log('看看谁先输出')
    },
    // 删除用户
    del (id) {
      this.$confirm(`此操作将永久删除id号为${id}的用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserById(id)
          .then((result) => {
            console.log(result)
            if (result.meta.status === 200) {
              this.$message({
                type: 'success',
                message: result.meta.msg
              })
              this.init()
            } else {
              this.$message({
                type: 'success',
                message: result.meta.msg
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示编辑对话框,并且展示默认数据
    handleEdit (data) {
      // this.editTemp = data
      this.dialogFormVisible = true
      this.editForm.id = data.id
      this.editForm.username = data.username
      this.editForm.email = data.email
      this.editForm.mobile = data.mobile
      // this.editForm = data
      console.log(data)
    },
    // 编辑用户
    editSubmit (tableName) {
      this.$refs[tableName].validate((valid) => {
        if (valid) {
          editUser(this.editForm).then((result) => {
            console.log(result)
            // this.editTemp = result.data
            // this.editForm = result.data
            this.dialogFormVisible = false
            this.init()
          })
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
    },
    init () {
      // 获得用户数据
      getDatelist({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })

        .then(result => {
          console.log(result)
          this.tableData = result.data.users
          this.total = result.data.total
          console.log(this.total)
          // this.tableData = result.data.data.users
          // this.total = result.data.data.total
          // console.log(this.total)
        })
      console.log('看看哪个限制性')
    }

  },
  mounted () {
    // 获得用户数据
    this.init()
    // 获取角色数据
    getAllRoleList()
      .then(result => {
        console.log(result)
        this.rolelist = result.data
      })
  }

}
</script>
<style scoped>
.searchBox {
  width: 300px;
  margin-right: 10px;
}
</style>
