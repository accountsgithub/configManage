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
  // 获取资源绑定树
  getResourceBuildingTree ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RESOURCEBUILDINGTREE(params).then((res) => {
        commit(types.GETRESOURCEBUILDINGTREE, res)
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
  // 资源绑定
  getRResourceBuild ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RRESOURCEBUILD(params).then((res) => {
        commit(types.GETRRESOURCEBUILD, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限项目管理
  getRThisProjectList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RTHISPROJECTLIST(params).then((res) => {
        commit(types.GETTHISRPROJECTLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
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
  // 部门设置有效/无效
  getSetDepartAble ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_SETDEPARTMENTABLE(params).then((res) => {
        commit(types.GETSETDEPARTMENTABLE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限项目编辑
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
  // 统一权限项目新增
  getRAddProjects ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RADDPROJECTS(params).then((res) => {
        commit(types.GETRADDPROJECTS, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 角色管理
  getRThisRoleList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RTHISROLELIST(params).then((res) => {
        commit(types.GETRTHISROLELIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 角色显示下拉列表
  getRSelectRoleList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RROLESELECTLIST(params).then((res) => {
        commit(types.GETRROLESELECTLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 角色显示列表
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
  // 角色唯一验证
  clumbDilidata ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_CLUMBDILIDATA(params).then((res) => {
        commit(types.GETCLUMBDILIDATA, res)
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
  // 统一权限批量有效/无效
  getSetRoleAbleAll ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_SETROLEABLEALL(params).then((res) => {
        commit(types.GETSETROLEABLEALL, res)
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
  // 密码重置
  getResetPW  ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RESTPW(params).then((res) => {
        commit(types.GETRESTPW, res)
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
  // 批量设置用户有效/无效
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
  // 设置用户有效无效
  getSetUserAbleOnce ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_SETUSERABLEONCE(params).then((res) => {
        commit(types.GETSETUSERABLEONCE, res)
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
  // 设置资源有效/无效
  getSetResourceAble ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_SETRESOURCEABLE(params).then((res) => {
        commit(types.GETSETRESOURCEABLE, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  // 统一权限获取人员下拉列表
  getRPersonSelectList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_RPERSONLIST(params).then((res) => {
        commit(types.GETRPERSONSELECTLIST, res)
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
  // 设置人员有效/无效
  getSetPersonAble ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_SETPERSONABLE(params).then((res) => {
        commit(types.GETSETPERSONABLE, res)
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
  },
  // 下载
  getrDownloadFile ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      commit(types.GETRDOWNLOADFILE, getDate.GET_RDOWNLOADFILE(params))
    })
  }
}
