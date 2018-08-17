import * as types from '../../../../mutation_type'
import getDate from '../../../../../apis/api'

export default {
  setLanguage ({ commit }, language) {
    commit(types.SETLANGUAGE, language)
  },
  getSelfLogin ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.POST_LOGIN(params).then((res) => {
        commit(types.POSTLOGIN, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getConfigsList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROJECTLIST(params).then((res) => {
        commit(types.GETCONFIGSLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getValidateKey ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_VALIADATEKEY(params).then((res) => {
        commit(types.GETVALIADATEKEY, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getProjectsShow ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROJECTSHOW(params).then((res) => {
        commit(types.GETPROJECTSHOW, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getProjectsConfigList ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROJECTCONFIGLIST(params).then((res) => {
        commit(types.GETPROJECTCONFIGLIST, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getProjectsConfigShow ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROJECTCONFIGSHOW(params).then((res) => {
        commit(types.GETPROJECTCONFIGSHOW, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getAddConfig ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_ADDCONFIG(params).then((res) => {
        commit(types.GETADDCONFIG, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getdelConfig ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_DELCONFIG(params).then((res) => {
        commit(types.GETDELCONFIG, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  geteditConfig ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_EDITCONFIG(params).then((res) => {
        commit(types.GETEDITCONFIG, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getpushConfig ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PUSHCONFIG(params).then((res) => {
        commit(types.GETPUSHCONFIG, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getGroups ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_GROUPS(params).then((res) => {
        commit(types.GETGROUPS, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getaddprofiles ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_ADDPROFILES(params).then((res) => {
        commit(types.GETADDPROFILES, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getaddversions ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_ADDVERSIONS(params).then((res) => {
        commit(types.GETADDVERSIONS, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  geteditprofiles ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_EDITPROFILES(params).then((res) => {
        commit(types.GETEDITPROFILES, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getprofilesexpo ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROFILESEXPO(params).then((res) => {
        commit(types.GETPROFILESEXPO, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getdelprofiles ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_DELPROFILES(params).then((res) => {
        commit(types.GETDELPROFILES, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getprofiles ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PROFILES(params).then((res) => {
        commit(types.GETPROFILES, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getpublishtime ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_PUBLISHTIME(params).then((res) => {
        commit(types.GETPUBLISHTIME, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getversion ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_VERSION(params).then((res) => {
        commit(types.GETVERSION, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  },
  getactiveversion ({state, commit}, params) {
    return new Promise((resolve, reject) => {
      return getDate.GET_ACTIVEVERSION(params).then((res) => {
        commit(types.GETACTIVEVERSION, res)
        resolve(res)
      }).catch((thrown) => {
        reject(thrown)
      })
    })
  }
}
