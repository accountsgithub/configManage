import actions from './actions/actions'
import mutations from './mutations/mutation'
import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: !+Cookies.get('sidebarStatus'),
    withoutAnimation: false
  },
  device: 'desktop',
  // 功能列表
  index_showList: [],
  index_rProjectSelectList: [],
  index_rootList: []
}

export default{
  state,
  actions,
  mutations
}
