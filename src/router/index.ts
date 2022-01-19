import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Introduce from '../components/dashbord/Introduce.vue'
import Dashbord from '../components/dashbord/Dashbord.vue'
import Addproduct from '../components/dashbord/Addproduct.vue'
import Category from '../components/module/Category.vue'
import Good from '../components/module/Good.vue'
import Add from '../components/module/Add.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'introduce'
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/introduce',
    name: '系统介绍',
    component: Introduce
  },
  {
    path: '/dashbord',
    name: 'Dashbord',
    component: Dashbord
  },
  {
    path: '/addproduct',
    name: '添加商品',
    component: Addproduct
  },
  {
    path: '/category',
    name: 'category',
    component: Category,
    children: [
      {
        path: '/category/level2',
        name: 'level2',
        component: Category
      },
      {
        path: '/category/level3',
        name: 'level3',
        component: Category
      }
    ]
  },
  {
    path: '/good',
    name: 'good',
    component: Good
  },
  {
    path: '/add',
    name: 'add',
    component: Add
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
