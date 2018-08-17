import Cookies from 'js-cookie'
import actions from './actions/actions'
import mutations from './mutations/mutation'

const state = {
  language: Cookies.get('language') || 'en',
  index_projectList: [],
  code_result: '',
  layout_result: '',
  formConfigModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  formModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  list_groups: [],
  index_goodsType: {},
  text_config: {
    configKey: '',
    configValue: '',
    createTime: 0,
    creatorId: 1,
    id: 165,
    projectId: '',
    remark: ''
  },
  index_configList: [],
  fullscreenLoading: true,
  list_files: [],
  list_version: [],
  activeversion: ''
}

export default{
  state,
  actions,
  mutations
}
