import * as types from '../../../mutation_type'
import getDate from '../../../../apis/api' // 接口
// import utils from '@/utils/util'
// import Cookies from 'js-cookie' // cookie

export default {
  ToggleSideBar: ({ commit }) => {
    commit(types.TOGGLESIDEBAR)
  },
  CloseSideBar ({ commit }, { withoutAnimation }) {
    commit(types.CLOSESIDEBAR, withoutAnimation)
  },
  ToggleDevice ({ commit }, device) {
    commit(types.TOGGLEDEVICE, device)
  },
  getRootList ({state, commit}, params) {
    return new Promise((resolve, reject) => { // 功能权限
      return getDate.GET_ROOTLIST().then((res) => {
        commit(types.GETROOTLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 登陆验证
  getCheckLogin ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_CHECKLOGIN(params).then((res) => {
        commit(types.GETCHECKLOGIN, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },

  // getLogin ({state, commit}, params) {
  //     return new Promise((resolve, reject) => {
  //       return getDate.GET_LOGIN(params).then((res) => {
  //         commit(types.GETLOGIN, res)
  //         resolve(res)
  //       }).catch((thrown) => {
  //         reject(thrown)
  //       })
  //     })
  //   },
  // 登陆
  getLogin ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_LOGIN(params).then((res) => {
        if (!res.data.result) {
          res.data = {code: '-2'}
          resolve(res)
        } else {
          commit(types.GETLOGIN, res)
          resolve(res)
        }
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 项目选项查询
  getRBACList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RBACLIST(params).then((res) => {
        commit(types.GETRBACLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getLogOut ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_LOGINOUT(params).then((res) => {
        commit(types.GETLOGINOUT, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getEditPW ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_EDITPW(params).then((res) => {
        commit(types.GETEDITPW, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  }
}
