import axios from 'axios'
import api from './index'
import store from '../store'
import router from '../router'
import {Message} from 'element-ui'
import config from "../store/modules/config/index";
/**
 *
 * @type {{}}
 */
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charest=utf-8'
axios.interceptors.request.use(config => {
  store.state.config.fullscreenLoading = true
  return config
}, err => {
  store.state.config.fullscreenLoading = false
  Message.error('服务器错误，请重试')
  return Promise.reject(err)
})
axios.interceptors.response.use(response => {
  if (response.data.status == '200') {
    store.state.config.fullscreenLoading = false
  } else {
    Message.error(response.data.message)
    store.state.config.fullscreenLoading = false
    if (response.data.status != '500' && response.data.status != '404' && response.data.status != '400' && response.data.status != '1001' && response.data.status != '1002'&& response.data.status != '1003'&& response.data.status != '1004' && response.data.status != '1005') {
      router.push({path: '/login'})
    }
    return Promise.reject(response)
  }
  return response
}, err => {
  store.state.config.fullscreenLoading = false
  Message.error('服务器错误，请重试')
  return Promise.reject(err)
})

let base = ''

export default {
  GET_LOGIN (params) {
    return api.fetch('post', `${base}/auth/login`, params)
  },
  GET_LOGINOUT (params) {
    return api.fetch('get', `${base}/oauth2/logout`, params)
  },
  // 修改密码
  GET_EDITPW (params) {
    return api.fetch('put', `${base}/user/password`, params)
  },
  // 统一项目
  // GET_ADDPROJECTS (params) {
  //   return api.fetch('post', `${base}/admin/projects`, params)
  // },
  // GET_EDITPROJECTS (params) {
  //   return api.fetch('put', `${base}/admin/projects/` + params.id, params)
  // },
  // GET_DELPROJECTS (params) {
  //   return api.fetch('put', `${base}/admin/projects/batch`, params)
  // },
  // GET_PROJECTSLIST (params) {
  //   console.log(params)
  //   return api.fetch('get', `${base}/admin/projects`, params)
  // },
  // GET_PPRESONLIST (params) {
  //   console.log(params)
  //   return api.fetch('get', `${base}/projectPerson`, params)
  // },
  // GET_UNIQUE (params) {
  //   return api.fetch('get', `${base}/admin/projects/unique/`, params)
  // },
  // GET_EXAMINEDLIST (params) {
  //   return api.fetch('get', `${base}/admin/projects/examinedList`, params)
  // },
  // GET_EXAMINED (params) {
  //   return api.fetch('put', `${base}/admin/projects/examined/` + params.type, params)
  // },
  // GET_EXAMINEDAPPLY (params) {
  //   return api.fetch('put', `${base}/admin/projects/examined/apply`, params)
  // },
  // // 人员
  // GET_ADDPERSON (params) {
  //   return api.fetch('post', `${base}/person`, params)
  // },
  // GET_PERSONLIST (params) {
  //   return api.fetch('get', `${base}/projectPerson`, params)
  // },
  // GET_EDITPERSON (params) {
  //   return api.fetch('put', `${base}/person`, params)
  // },
  // GET_DELPERSON (params) {
  //   return api.fetch('delete', `${base}/person/` + params.id)
  // },
  // GET_PERSONISADMIN (params) {
  //   return api.fetch('get', `${base}/admin/projects/personIsAdmin`)
  // },
  // 统一配置
  GET_PROJECTLIST (params) {
    return api.fetch('get', `${base}/projects`, params)
  },
  GET_PROJECTSHOW (params) {
    return api.fetch('get', `${base}/projects/` + params.id)
  },
  GET_PROJECTCONFIGLIST (params) {
    return api.fetch('get', `${base}/configs`, params)
  },
  GET_PROJECTCONFIGSHOW (params) {
    return api.fetch('get', `${base}/configs/` + params.id)
  },
  GET_ADDCONFIG (params) {
    return api.fetch('post', `${base}/configs`, params)
  },
  GET_DELCONFIG (params) {
    return api.fetch('delete', `${base}/configs/` + params.id)
  },
  GET_EDITCONFIG (params) {
    return api.fetch('put', `${base}/configs/` + params.id, params)
  },
  GET_PUSHCONFIG (params) {
    return api.fetch('put', `${base}/configs/push/` + params.projectId + `/` + params.version)
  },
  GET_GROUPS (params) {
    return api.fetch('get', `${base}/groups`)
  },
  GET_ADDPROFILES (params) {
    return api.fetch('post', `${base}/profiles`, params)
  },
  GET_ADDVERSIONS (params) {
    return api.fetch('post', `${base}/version/add`, params)
  },
  GET_EDITPROFILES (params) {
    return api.fetch('put', `${base}/profiles/` + params.id, params)
  },
  GET_PROFILESEXPO (params) {
    return api.fetch('post', `${base}/files/config_file_import`)
  },
  GET_DELPROFILES (params) {
    return api.fetch('delete', `${base}/profiles/` + params.id)
  },
  GET_PROFILES (params) {
    return api.fetch('get', `${base}/profiles`, params)
  },
  GET_PUBLISHTIME (params) {
    return api.fetch('get', `${base}/profiles/publishTime/` + params.projectId + `/` + params.version)
  },
  // 统一配置查询版本号
  GET_VERSION (params) {
    return api.fetch('get', `${base}/version/findVersion/` + params.projectId)
  },
  // 统一配置查询正在使用版本号
  GET_ACTIVEVERSION (params) {
    return api.fetch('get', `${base}/version/findActiveVersion/` + params.projectId)
  },
  GET_USERNAME () {
    return api.fetch('get', `${base}/auth/me`)
  },

  // 统一项目
  GET_DEPTLIST () {
    return api.fetch('get', `${base}/auth/me`)
  },

  // 统一权限
  GET_RPROJECTLIST (params) {
    return api.fetch('get', `${base}/client`, params)
  },
  GET_REDITPROJECTS (params) {
    return api.fetch('put', `${base}/client/` + params.id, params)
  },
  // 统一权限角色管理
  GET_RROLELIST (params) {
    return api.fetch('get', `${base}/role`, params)
  },
  // 统一权限新增角色
  GET_RADDROLE (params) {
    return api.fetch('post', `${base}/role`, params)
  },
  // 统一权限编辑角色
  GET_REDITROLE (params) {
    return api.fetch('post', `${base}/role` + params.id, params)
  },
  // 统一权限设置有效、无效
  GET_SETROLEABLE (params) {
    return api.fetch('post', `${base}/role/command`, params)
  },
  // 统一权限用户管理
  GET_RUSERLIST (params) {
    return api.fetch('get', `${base}/user`, params)
  },
  // 统一权限新增用户
  GET_RADDUSER (params) {
    return api.fetch('post', `${base}/user`, params)
  },
  // 统一权限编辑用户
  GET_REDITUSER (params) {
    return api.fetch('post', `${base}/user` + params.id, params)
  },
  // 统一权限设置用户有效、无效
  GET_SETUSERABLE (params) {
    return api.fetch('post', `${base}/user/command`, params)
  },
  // 统一权限获取资源列表
  GET_RESOURCELIST (params) {
    'use strict'
    return api.fetch('get', `${base}/resource`, params)
  },
  // 统一权限添加资源
  GET_RADDRESOURCE (params) {
    'use strict'
    return api.fetch('post', `${base}/resource`, params)
  },
  // 统一权限编辑资源
  GET_REDITRESOURCE (params) {
    'use strict'
    return api.fetch('post', `${base}/resource` + params.id, params)
  },
  // 统一权限添加部门
  GET_RADDDEPART (params) {
    'use strict'
    return api.fetch('post', `${base}/department`, params)
  },
  // 统一权限编部门
  GET_REDITDEPART (params) {
    'use strict'
    return api.fetch('put', `${base}/department` + params.id, params)
  },
  // 管理单位树
  GET_TREEDEPARTLIST (params) {
    'use strict'
    return api.fetch('get', `${base}/department`, params)
  },
  // 统一权限获取部门列表
  GET_DEPARTLIST (params) {
    'use strict'
    return api.fetch('get', `${base}/department`, params)
  },
  // 统一权限获取人员列表
  GET_RPERSONLIST (params) {
    return api.fetch('get', `${base}/person`, params)
  },
  // 统一权限添加人员
  GET_RADDPERSON (params) {
    'use strict'
    return api.fetch('post', `${base}/person`, params)
  },
  // 统一权限编辑人员
  GET_REDITPERSON (params) {
    'use strict'
    return api.fetch('put', `${base}/person` + params.id, params)
  }
}
