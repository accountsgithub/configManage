import actions from './actions/actions'
import mutations from './mutations/mutation'

const state = {
  personList: [],
  formModelData: {
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
