import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app/index'
import project from './modules/project/index/index'
import person from './modules/project/person/index'
import config from './modules/config/index/index'
import rbac from './modules/rbac/index/index'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    project,
    person,
    config,
    rbac
  },
  getters
})

export default store
