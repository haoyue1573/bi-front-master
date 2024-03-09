import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/login/register'),//当自定义组件的组件名不是index时，添加路由时要加后缀
    hidden: false
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/mychart',
    component: Layout,
    redirect: '/mychart/chart',
    name: 'mychart',
    // meta: { title: '我的图表', icon: 'el-icon-s-help' }
    children: [{
      path: 'chart',
      name: 'Chart',
      component: () => import('@/views/chart/index'),
      meta: { title: '我的图表', icon: 'el-icon-s-help' }
    }]
  },
  {
    path: '/gen',
    component: Layout,
    redirect: '/gen/sync',
    name: 'Nested',
    meta: {
      title: '生成图表',
      icon: 'nested'
    },
    children: [
      {
        path: 'sync',
        component: () => import('@/views/gen/sync/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: '同步生成' }
      },
      {
        path: 'async',
        component: () => import('@/views/gen/async/index'),
        name: 'Menu2',
        meta: { title: '异步生成' }
      }
    ]
  },
  {
    path: '/chat',
    component: Layout,
    redirect: '/chat/aichat',
    name: 'chat',
    children: [{
      path: 'chat',
      name: 'chat',
      component: ()=>import('../views/chat/chat'),
      meta: {
        title: 'ai助手',
        icon: 'el-icon-user-solid'
      },
    }]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
