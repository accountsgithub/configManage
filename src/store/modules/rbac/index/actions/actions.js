import * as types from '../../../../mutation_type'
import getDate from '../../../../../apis/api'

export default {
  // 统一权限获取单位树
  getTreeDeptList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      'use strict'
      return getDate.GET_TREEDEPARTLIST(params).then((res) => {
        commit(types.GETTREEDEPARTLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限部门管理
  getDeptList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_DEPARTLIST(params).then((res) => {
        commit(types.GETDEPARTLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限添加部门
  getRAddDepart ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RADDDEPART(params).then((res) => {
        commit(types.GETRADDDEPART, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限编辑部门
  getREditDepart ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_REDITDEPART(params).then((res) => {
        commit(types.GETREDITDEPART, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限项目管理
  getRProjectList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RPROJECTLIST(params).then((res) => {
        commit(types.GETRPROJECTLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getREditProjects ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_REDITPROJECTS(params).then((res) => {
        commit(types.GETREDITPROJECTS, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 角色管理
  getRRoleList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RROLELIST(params).then((res) => {
        commit(types.GETRROLELIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getRAddRole ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RADDROLE(params).then((res) => {
        commit(types.GETRADDROLE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getREditRole ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_REDITROLE(params).then((res) => {
        commit(types.GETREDITROLE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getSetRoleAble ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_SETROLEABLE(params).then((res) => {
        commit(types.GETSETROLEABLE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 用户管理
  getRUserList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RUSERLIST(params).then((res) => {
        commit(types.GETRUSERLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getRAddUser ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RADDUSER(params).then((res) => {
        commit(types.GETRADDUSER, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getREditUser ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_REDITUSER(params).then((res) => {
        commit(types.GETREDITUSER, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getSetUserAble ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_SETUSERABLE(params).then((res) => {
        commit(types.GETSETUSERABLE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 资源管理
  getResourceList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RESOURCELIST(params).then((res) => {
        commit(types.GETRESOURCELIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限添加资源
  getRAddResource ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RADDRESOURCE(params).then((res) => {
        commit(types.GETRADDRESOURCE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限编辑资源
  getREditResource ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_REDITRESOURCE(params).then((res) => {
        commit(types.GETREDITRESOURCE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限获取人员列表
  getRPersonList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RPERSONLIST(params).then((res) => {
        commit(types.GETRPERSONLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限添加人员
  getRAddPerson ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RADDPERSON(params).then((res) => {
        commit(types.GETRADDPERSON, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限编辑人员
  getREditPerson ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_REDITPERSON(params).then((res) => {
        commit(types.GETREDITPERSON, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  }
}
