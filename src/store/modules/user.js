import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login 用户登录
  login({ commit }, userInfo) {

    return new Promise((resolve, reject) => {

      console.log("请求到了登录request方法前")
      login(userInfo).then(response => {
        //登录成功后，提交SET_TOKEN的修改任务，修改值为响应的token
        console.log("返回了登录后用户信息" + response.data)
        console.log("返回的用户ID是" + response.data.id)
        commit('SET_TOKEN', response.data.id)
        commit('SET_ID', response.data.id)
        //同时把响应的token设置到cookies
        setToken(response.data.id)
        resolve()
      }).catch(error => {
        console.log("登录方法捕获了异常" + error)
        reject(error)
      })
    })
  },

  // get user info 获取用户信息
  getInfo({ commit, getToken }) {
    return new Promise((resolve, reject) => {
      console.log("请求到了获取用户信息request方法前")
      getInfo(getToken).then(response => {
        console.log(response);
        console.log("获取到的用户信息：")
        const data = response.data.id
        console.log("打印获取到的用户ID类型" + typeof (data))
        if (!data) {
          return reject('登录信息失效, 请重新登录')
        }
        commit('SET_ID', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout 用户登出
  // 在开发调试的时候，有两种情况
  // 1、（正常情况）用户在登录中，点击登出，先发送logout请求，在响应拦截器中会判断用响应码，
  // 如果响应码res.code === 50012，说明后端提示用户未登录，
  // 那么在页面中会弹出MessageBox.confirm确认框，让用户点击确认“去登录”，回到登录页
  // 2、（搞笑情况）当前页面是在首页，按理说进入首页应该是登录了的，当点击登出的时候，报未登录错误，
  // 后端会返回这个报错信息给前端，同时会友响应码，问题在这个响应码，后端返回的和前端的不一致
  // 经过搜索和修改，50012是未登录的响应码
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first 必须先移除cookies中的token，不然先提交commit的话，全局状态相当于没有登出
        resetRouter()
        commit('RESET_STATE')
        console.log("用户已经登出")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token 去除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first 原因同上
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

