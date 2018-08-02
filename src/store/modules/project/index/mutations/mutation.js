import * as types from '../../../../mutation_type'
// import utils from '@/utils/util'

export default {
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
  // 同一项目项目管理
  [types.GETPPROJECTLIST] (state, res) {
    state.index_pProjectList = res.data.result.data
    state.formProjectModelData.pageNo = res.data.result.pageNo
    state.formProjectModelData.pageSize = res.data.result.pageSize
    state.formProjectModelData.total = res.data.result.total
  },
  [types.GETPERSONLIST] (state, res) {
    state.index_ProsonList = res.data.result.data
  },
  // 统一项目人员列表
  [types.GETPERSONSELECTLIST] (state, res) {
    state.index_ProsonList = res.data.result.data
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
    console.log(res)
    state.index_examList = res.data.result.data
    state.formProjectModelData.pageNo = res.data.result.pageNo
    state.formProjectModelData.pageSize = res.data.result.pageSize
    state.formProjectModelData.total = res.data.result.total
  },
  [types.GETEXAMINED] (state, res) {},
  [types.GETEXAMINEDAPPLY] (state, res) {}
}
