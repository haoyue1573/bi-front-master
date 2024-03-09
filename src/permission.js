import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
// 白名单，默认将登录方法放行，开发时可以将需要用到的路由添加进来
// const whiteList = ['/login' ,'/register', '/dashboard','/mychart/chart','/form/index','/gen/sync','/gen/async'] // no redirect whitelist
const whiteList = ['/login', '/register']
// 路由守卫，权限校验
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // 获取token
  const hasToken = getToken()
  // 判断是否有token
  if (hasToken) {
    // 如果有token,并且目标路径是/login
    if (to.path === '/login') {
      // if is logged in, redirect to the home page,直接放行到根目录
      next({ path: '/' })
      NProgress.done()
    } else {
      // 否则的话，尝试获取store中是否有存储用户信息
      const hasGetUserInfo = store.getters.id
      // 如果有，则放行
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info  没有用户信息，就先去获取用户信息,获取到用户信息后，会把返回的用户ID设置到state
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          // 没有获取到用户信息，就重置token，重定向到登录页面
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
