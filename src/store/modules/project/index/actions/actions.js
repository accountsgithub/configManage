import * as types from '../../../../mutation_type'
import getDate from '../../../../../apis/api'

export default {
  // getLogin ({state, commit}, params) {
  //   return new Promise((resolve, reject) => {
  //     return getDate.GET_LOGIN(params).then((res) => {
  //       commit(types.GETLOGIN, res)
  //       resolve(res)
  //     }).catch((thrown) => {
  //       reject(thrown)
  //     })
  //   })
  // },
  getLoginOut ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_LOGINOUT(params).then((res) => {
        commit(types.GETLOGINOUT, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getAddProjects ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_ADDPROJECTS(params).then((res) => {
        commit(types.GETADDPROJECTS, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getEditProjects ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_EDITPROJECTS(params).then((res) => {
        commit(types.GETEDITPROJECTS, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getDelProjects ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_DELPROJECTS(params).then((res) => {
        commit(types.GETDELPROJECTS, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  /* getProjectsShow ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROJECTSSHOW(params).then((res) => {
        commit(types.GETPROJECTSSHOW, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  }, */
  getProjectsList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROJECTSLIST(params).then((res) => {
        commit(types.GETPROJECTSLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 同一项目项目管理
  getpProjectList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROJECTSLIST(params).then((res) => {
        commit(types.GETPPROJECTLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  /* getRPersonList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RPERSONLIST(params).then((res) => {
        commit(types.GETRPERSONLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  }, */
  getUnique ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_UNIQUE(params).then((res) => {
        commit(types.GETUNIQUE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getExaminedList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_EXAMINEDLIST(params).then((res) => {
        commit(types.GETEXAMINEDLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getExamined ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_EXAMINED(params).then((res) => {
        commit(types.GETEXAMINED, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getExaminedApply ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_EXAMINEDAPPLY(params).then((res) => {
        commit(types.GETEXAMINEDAPPLY, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  }
}
