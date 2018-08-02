import * as types from '../../../../mutation_type'

export default {
  // 统一权限项目管理
  [types.GETDEPTLIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_departList = res.data.result.data
      state.formModelData.pageNo = res.data.result.pageNo
      state.formModelData.pageSize = res.data.result.pageSize
      state.formModelData.total = res.data.result.total
    }
  },
  // 统一权限资源绑定
  [types.GETRRESOURCEBUILD] (state, res) {},
  [types.GETRADDPROJECTS] (state, res) {},
  // 统一权限项目管理
  [types.GETTHISRPROJECTLIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_rThisProjectList = res.data.result.data
      state.rProFormModelData.pageNo = res.data.result.pageNo
      state.rProFormModelData.pageSize = res.data.result.pageSize
      state.rProFormModelData.total = res.data.result.total
    }
  },
  [types.GETRPROJECTLIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_rProjectList = res.data.result.data
    }
  },
  // 统一权限角色管理
  [types.GETRTHISROLELIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_rThisRoleList = res.data.result.data
      state.rRoleFormModelData.pageNo = res.data.result.pageNo
      state.rRoleFormModelData.pageSize = res.data.result.pageSize
      state.rRoleFormModelData.total = res.data.result.total
    }
  },
  // 统一权限角色显示列表
  [types.GETRROLELIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_rRoleList = res.data.result.data
    }
  },
  // 统一权限角色显示列表
  [types.GETRROLESELECTLIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_rRoleSelectList = res.data.result.data
    }
  },
  [types.GETRADDROLE] (state, res) {},
  [types.GETCLUMBDILIDATA] (state, res) {},
  [types.GETREDITROLE] (state, res) {},
  [types.GETSETROLEABLE] (state, res) {},
  [types.GETSETROLEABLEALL] (state, res) {},
  [types.GETRESTPW] (state, res) {},
  // 统一权限用户管理
  [types.GETRUSERLIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_rUserList = res.data.result.data
      state.index_rUseFieldList = res.data.fields ? res.data.fields : []
      state.rUserFormModelData.pageNo = res.data.result.pageNo
      state.rUserFormModelData.pageSize = res.data.result.pageSize
      state.rUserFormModelData.total = res.data.result.total
    }
  },
  [types.GETRADDUSER] (state, res) {},
  [types.GETREDITUSER] (state, res) {},
  [types.GETSETUSERABLE] (state, res) {},
  [types.GETSETUSERABLEONCE] (state, res) {},
  [types.GETEXAMINEDAPPLY] (state, res) {},
  // 统一权限资源管理
  [types.GETREDITRESOURCE] (state, res) {},
  [types.GETRADDRESOURCE] (state, res) {},
  [types.GETSETRESOURCEABLE] (state, res) {},
  [types.GETRESOURCELIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_rResourceList = res.data.result.data
      state.rResourceFormModelData.pageNo = res.data.result.pageNo
      state.rResourceFormModelData.pageSize = res.data.result.pageSize
      state.rResourceFormModelData.total = res.data.result.total
    }
  },
  // 管理单位树
  [types.GETTREEDEPARTLIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_treeDepartList = res.data.result
    }
  },
  // 资源绑定树
  [types.GETRESOURCEBUILDINGTREE] (state, res) {
    if (res.data && res.data.result) {
      state.index_treeResourceBuilding = res.data.result
    }
  },
  // 统一权限部门管理
  [types.GETRADDDEPART] (state, res) {},
  [types.GETREDITDEPART] (state, res) {},
  // 统一全校部门设置有效/无效
  [types.GETSETDEPARTMENTABLE] (state, res) {},
  [types.GETDEPARTLIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_departList = res.data.result.data
      state.rDeptFormModelData.pageNo = res.data.result.pageNo
      state.rDeptFormModelData.pageSize = res.data.result.pageSize
      state.rDeptFormModelData.total = res.data.result.total
    }
  },
  // 统一权限人员管理
  [types.GETRADDPERSON] (state, res) {},
  [types.GETREDITPERSON] (state, res) {},
  [types.GETRDOWNLOADFILE] (state, res) {
    state.downLoadHref = res
  },
  [types.GETSETPERSONABLE] (state, res) {},
  [types.GETRPERSONLIST] (state, res) {
    if (res.data && res.data.result) {
      state.index_rPersonList = res.data.result.data
      state.rPersonFormModelData.pageNo = res.data.result.pageNo
      state.rPersonFormModelData.pageSize = res.data.result.pageSize
      state.rPersonFormModelData.total = res.data.result.total
    }
  },
  [types.GETRPERSONSELECTLIST] (state, res) {
    if (res.data.result) {
      state.index_rPersonSelectList = res.data.result.data
    }
  }
}
