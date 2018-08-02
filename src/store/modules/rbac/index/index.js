import actions from './actions/actions'
import mutations from './mutations/mutation'

const state = {
  // 管理单位树
  index_treeDepartList: [],
  downLoadHref: '',
  // 部门
  index_departList: [],
  rDeptFormModelData: {
    pageNo: 0,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  fullscreenLoading: true,
  username: '',
  // 项目管理
  index_rThisProjectList: [],
  index_rProjectList: [],
  rProFormModelData: {
    pageNo: 0,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 角色管理
  index_rRoleList: [],
  index_rRoleSelectList: [],
  index_rThisRoleList: [],
  rRoleFormModelData: {
    pageNo: 0,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 用户列表
  index_rUserList: [],
  index_rUseFieldList: [],
  rUserFormModelData: {
    pageNo: 0,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 人员列表
  index_rPersonList: [],
  index_rPersonSelectList: [],
  rPersonFormModelData: {
    pageNo: 0,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 资源列表
  index_rResourceList: [],
  rResourceFormModelData: {
    pageNo: 0,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 资源绑定树
  index_treeResourceBuilding: []
}

export default{
  state,
  actions,
  mutations
}
