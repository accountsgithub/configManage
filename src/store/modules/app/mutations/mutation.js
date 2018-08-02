import * as types from '../../../mutation_type'
import Cookies from 'js-cookie'
import utils from '@/utils/util'

export default {
  [types.TOGGLESIDEBAR] (state, res) {
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
  },
  [types.CLOSESIDEBAR] (state, withoutAnimation) {
    Cookies.set('sidebarStatus', 1)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  [types.TOGGLEDEVICE] (state, device) {
    state.device = device
  },

  // 项目切换
  [types.GETRBACLIST] (state, res) {
    if (res.data.result) {
      state.index_showList = res.data.result
      state.index_rProjectSelectList = res.data.result
    } else {
      state.index_showList = []
      state.index_rProjectSelectList = []
    }
  },
  // 当前用户权限
  [types.GETROOTLIST] (state, res) {
    if (res.data.result) {
      localStorage.setItem('rootList', JSON.stringify(res.data.result))
    } else {
      localStorage.setItem('rootList', JSON.stringify([]))
    }
  },
  [types.GETLOGIN] (state, res) {
    if (res.data && res.data.result) {
      state.username = res.data.result.username
      utils.setCookie('name', res.data.result.username)
    }
  },
  [types.GETCHECKLOGIN] (state, res) {},
  [types.GETEDITPW] (state, res) {},
  [types.GETLOGINOUT] (state, res) {
    utils.delCookie('name')
  }
}
