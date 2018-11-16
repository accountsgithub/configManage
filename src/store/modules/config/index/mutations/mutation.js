import * as types from '../../../../mutation_type'
import Cookies from 'js-cookie'
import utils from '@/utils/util'

export default {
  [types.SETLANGUAGE] (state, language) {
    state.language = language
    Cookies.set('language', language)
  },
  [types.POSTLOGIN] (state, res) {
    state.username = res.data.result.username
  },
  // 判断是否登陆
  [types.ISLOGIN] (state, res) {

  },
  [types.GETCONFIGSLIST] (state, res) {
    if (res.data.result) {
      state.index_projectList = res.data.result.data
      state.formConfigModelData.pageNo = res.data.result.pageNo
      state.formConfigModelData.pageSize = res.data.result.pageSize
      state.formConfigModelData.total = res.data.result.total
      state.formConfigModelData.totalPages = res.data.result.totalPages
    }
  },
  [types.GETVALIADATEKEY] (state, res) {
    state.code_result = res.data.result
  },
  [types.GETPROJECTSHOW] (state, res) {
    // state.index_goodsType = res.data.data
  },
  [types.GETPROJECTCONFIGLIST] (state, res) {
    if (res.data.result) {
      state.formModelData.pageNo = res.data.result.pageNo
      state.formModelData.pageSize = res.data.result.pageSize
      state.formModelData.total = res.data.result.total
      state.formModelData.totalPages = res.data.result.totalPages
      state.index_configList = res.data.result.data
    }
  },
  [types.GETPROJECTCONFIGSHOW] (state, res) {
    // state.index_goodsType = res.data.data
  },
  [types.GETGROUPS] (state, res) {
    state.list_groups = res.data.result.data
  },
  [types.GETADDCONFIG] (state, res) {
    // state.index_goodsType = res.data.data
  },
  [types.GETDELCONFIG] (state, res) {
    // state.index_goodsType = res.data.data
  },
  [types.GETEDITCONFIG] (state, res) {
    // state.index_goodsType = res.data.data
  },
  [types.GETPUSHCONFIG] (state, res) {
    // state.index_goodsType = res.data.data
  },
  [types.GETADDPROFILES] (state, res) {
    // state.list_groups = res.data.result.data
  },
  [types.GETEDITPROFILES] (state, res) {
    // state.list_groups = res.data.result.data
  },
  [types.GETPROFILESEXPO] (state, res) {
    // state.list_groups = res.data.result.data
  },
  [types.GETDELPROFILES] (state, res) {
    // state.list_groups = res.data.result.data
  },
  [types.GETPROFILES] (state, res) {
    state.list_files = res.data.result.data
    state.totalListFiles = res.data.result.total
  },
  [types.GETPUBLISHTIME] (state, res) {
    // state.list_groups = res.data.result.data
  },
  [types.GETVERSION] (state, res) {
    state.list_version = res.data.result
  },
  [types.GETACTIVEVERSION] (state, res) {
    state.activeversion = res.data.result
  }
}
