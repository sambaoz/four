import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import Users from '@/views/users/User.vue'
import Rights from '@/views/right/rights.vue'
import Roles from '@/views/right/roles.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'defaut', path: '/', redirect: { name: 'Login' }
    },
    { name: 'Login',
      path: '/login',
      component: Login
    },
    { name: 'Home',
      path: '/home',
      component: Home,
      redirect: { name: 'Welcome' },
      children: [
        { name: 'Welcome', path: 'welcome', component: Welcome },
        { name: 'Users', path: 'users', component: Users },
        { name: 'Rights', path: 'rights', component: Rights },
        { name: 'Roles', path: 'roles', component: Roles },
        { name: 'Goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'List' },
          children: [
            { name: 'List', path: 'list', component: List },
            { name: 'Add', path: 'add', component: Add }

          ]
        }

      ] }

  ]
})
