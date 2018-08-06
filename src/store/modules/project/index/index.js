import actions from './actions/actions'
import mutations from './mutations/mutation'

const state = {
  index_projectList: [],
  index_ProsonList: [],
  formProjectModelData: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pagerCount: 6
  },
  fullscreenLoading: true,
  index_examList: [],
  username: ''
}

export default{
  state,
  actions,
  mutations
}
