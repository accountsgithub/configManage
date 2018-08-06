import actions from './actions/actions'
import mutations from './mutations/mutation'

const state = {
  // 管理单位树
  index_treeDepartList: [],
  // 部门
  index_departList: [],
  rDeptFormModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  fullscreenLoading: true,
  username: '',
  // 项目管理
  index_rProjectList: [],
  rProFormModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 角色管理
  index_rRoleList: [],
  rRoleFormModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 用户列表
  index_rUserList: [],
  rUserFormModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 人员列表
  index_rPersonList: [],
  rPersonFormModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  // 资源列表
  index_rResourceList: [],
  rResourceFormModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  }
}

export default{
  state,
  actions,
  mutations
}
