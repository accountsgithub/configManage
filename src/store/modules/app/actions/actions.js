import * as types from '../../../mutation_type'
import getDate from '../../../../apis/api' // 接口
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

  getLogin ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_LOGIN(params).then((res) => {
        commit(types.GETLOGIN, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  }
}
