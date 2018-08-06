import * as types from '../../../../mutation_type'
import getDate from '../../../../../apis/api'

export default {
  getAddPerson ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_ADDPERSON(params).then((res) => {
        commit(types.GETADDPERSON, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getPersonList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PERSONLIST(params).then((res) => {
        commit(types.GETPERSONLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getEditPerson ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_EDITPERSON(params).then((res) => {
        commit(types.GETEDITPERSON, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getDelPerson ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_DELPERSON(params).then((res) => {
        commit(types.GETDELPERSON, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getPersonIsAdmin ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PERSONISADMIN(params).then((res) => {
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  }
}
