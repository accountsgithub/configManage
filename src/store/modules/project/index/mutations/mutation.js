import * as types from '../../../../mutation_type'
import utils from '@/utils/util'

export default {
  [types.GETLOGIN] (state, res) {
    state.username = res.data.result.username
    utils.setCookie('name', res.data.result.username)
  },
  [types.GETADDPROJECTS] (state, res) {

  },
  [types.GETEDITPROJECTS] (state, res) {
    // state.index_goodsType = res.data.data
  },
  [types.GETDELPROJECTS] (state, res) {

  },
  [types.GETPROJECTSLIST] (state, res) {
    // console.log(res)
    state.index_projectList = res.data.result.data
    state.formProjectModelData.pageNo = res.data.result.pageNo
    state.formProjectModelData.pageSize = res.data.result.pageSize
    state.formProjectModelData.total = res.data.result.total
  },
  [types.GETPERSONLIST] (state, res) {
    state.index_ProsonList = res.data.result.data
    state.formProjectModelData.pageNo = res.data.result.pageNo
    state.formProjectModelData.pageSize = res.data.result.pageSize
    state.formProjectModelData.total = res.data.result.total
  },
  [types.GETPROJECTSLIST] (state, res) {
    // console.log(res)
    state.index_projectList = res.data.result.data
    state.formProjectModelData.pageNo = res.data.result.pageNo
    state.formProjectModelData.pageSize = res.data.result.pageSize
    state.formProjectModelData.total = res.data.result.total
  },
  [types.GETUNIQUE] (state, res) {},
  [types.GETEXAMINEDLIST] (state, res) {
    state.index_examList = res.data.result.data
    state.formProjectModelData.pageNo = res.data.result.pageNo
    state.formProjectModelData.pageSize = res.data.result.pageSize
    state.formProjectModelData.total = res.data.result.total
  },
  [types.GETEXAMINED] (state, res) {},
  [types.GETEXAMINEDAPPLY] (state, res) {}
}
