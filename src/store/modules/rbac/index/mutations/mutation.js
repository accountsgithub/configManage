import * as types from '../../../../mutation_type'
import utils from '@/utils/util'

export default {
  [types.GETLOGIN] (state, res) {
    state.username = res.data.result.username
    utils.setCookie('name', res.data.result.username)
  },
  // 统一权限项目管理
  [types.GETDEPTLIST] (state, res) {
    // console.log(res)
    state.index_departList = res.data.result.data
    state.formModelData.pageNo = res.data.result.pageNo
    state.formModelData.pageSize = res.data.result.pageSize
    state.formModelData.total = res.data.result.total
  },
  // 统一权限项目管理
  [types.GETRPROJECTLIST] (state, res) {
    // console.log(res)
    state.index_rProjectList = res.data.result.data
    state.rProFormModelData.pageNo = res.data.result.pageNo
    state.rProFormModelData.pageSize = res.data.result.pageSize
    state.rProFormModelData.total = res.data.result.total
  },
  // 统一权限角色管理
  [types.GETRROLELIST] (state, res) {
    // console.log(res)
    state.index_rRoleList = res.data.result.data
    state.rRoleFormModelData.pageNo = res.data.result.pageNo
    state.rRoleFormModelData.pageSize = res.data.result.pageSize
    state.rRoleFormModelData.total = res.data.result.total
  },
  [types.GETRADDROLE] (state, res) {},
  [types.GETREDITROLE] (state, res) {},
  [types.GETSETROLEABLE] (state, res) {},
  // 统一权限用户管理
  [types.GETRUSERLIST] (state, res) {
    // console.log(res)
    state.index_rUserList = res.data.result.data
    state.rUserFormModelData.pageNo = res.data.result.pageNo
    state.rUserFormModelData.pageSize = res.data.result.pageSize
    state.rUserFormModelData.total = res.data.result.total
  },
  [types.GETRADDUSER] (state, res) {},
  [types.GETREDITUSER] (state, res) {},
  [types.GETSETUSERABLE] (state, res) {},
  [types.GETEXAMINEDAPPLY] (state, res) {},
  // 统一权限资源管理
  [types.GETREDITRESOURCE] (state, res) {},
  [types.GETRADDRESOURCE] (state, res) {},
  [types.GETRESOURCELIST] (state, res) {
    'use strict'
    state.index_rResourceList = res.data.result.data
    state.rResourceFormModelData.pageNo = res.data.result.pageNo
    state.rResourceFormModelData.pageSize = res.data.result.pageSize
    state.rResourceFormModelData.total = res.data.result.total
  },
  // 管理单位树
  [types.GETTREEDEPARTLIST] (state, res) {
    'use strict'
    state.index_treeDepartList = res.data.result.data
  },
  // 统一权限部门管理
  [types.GETRADDDEPART] (state, res) {},
  [types.GETREDITDEPART] (state, res) {},
  [types.GETDEPARTLIST] (state, res) {
    'use strict'
    state.index_departList = res.data.result.data
    state.rDeptFormModelData.pageNo = res.data.result.pageNo
    state.rDeptFormModelData.pageSize = res.data.result.pageSize
    state.rDeptFormModelData.total = res.data.result.total
  },
  // 统一权限人员管理
  [types.GETRADDPERSON] (state, res) {},
  [types.GETREDITPERSON] (state, res) {},
  [types.GETRPERSONLIST] (state, res) {
    'use strict'
    state.index_rPersonList = res.data.result.data
    state.rPersonFormModelData.pageNo = res.data.result.pageNo
    state.rPersonFormModelData.pageSize = res.data.result.pageSize
    state.rPersonFormModelData.total = res.data.result.total
  }
}
