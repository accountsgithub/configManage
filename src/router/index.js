import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  // 登陆
  { path: '/login',
    component: resolve => require(['@/views/login/index'], resolve),
    hidden: true
  },
  // 404
  { path: '/404',
    component: resolve => require(['@/views/404'], resolve),
    hidden: true
  },
  // dashboard example
  {
    path: '/',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    redirect: '/department',
    name: 'department',
    hidden: true,
    children: [{
      path: '/department',
      component: resolve => require(['@/views/rbac/departList'], resolve)
    }]
  },
  /* {
    path: '/project',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    children: [
      {
        path: '',
        name: '项目展示',
        component: resolve => require(['@/views/project/project'], resolve),
        meta: { title: '项目展示', icon: 'search' }
      }
    ]
  },
  {
    path: '/proExd',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    children: [
      {
        path: '',
        name: '项目审批',
        component: resolve => require(['@/views/project/proExd'], resolve),
        meta: { title: '项目审批', icon: 'permissions' }
      }
    ]
  }, */
  // 统一配置
  /* {
    path: '/config',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    children: [
      {
        path: '',
        name: 'configPage',
        component: resolve => require(['@/views/config/content'], resolve),
        meta: { title: 'configPage', icon: 'setting' }
      }
    ]
  },
  {
    path: '/config',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    redirect: '/list',
    name: 'listPage',
    hidden: true,
    children: [{
      path: 'list/:id/:mark',
      name: 'list',
      component: resolve => require(['@/views/config/list.vue'], resolve),
      meta: { title: 'listPage', icon: 'edit' }
    }]
  }, */
  // 统一权限
  {
    path: '/view',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    redirect: '/department',
    name: 'department',
    children: [
      {
        path: 'department',
        name: '部门管理',
        component: resolve => require(['@/views/rbac/departList'], resolve),
        meta: { title: '部门管理', icon: 'department' }
      }
    ]
  },
  {
    path: '/view',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    children: [
      {
        path: 'person',
        name: '人员管理',
        component: resolve => require(['@/views/rbac/personList'], resolve),
        meta: { title: '人员管理', icon: 'members' }
      }
    ]
  },
  {
    path: '/view',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    redirect: '/user',
    name: 'user',
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: resolve => require(['@/views/rbac/userList'], resolve),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/view',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    children: [
      {
        path: 'role',
        name: '角色管理',
        component: resolve => require(['@/views/rbac/roleList'], resolve),
        meta: { title: '角色管理', icon: 'permissions' }
      }
    ]
  },
  {
    path: '/view',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    children: [
      {
        path: 'resource',
        name: '资源管理',
        component: resolve => require(['@/views/rbac/resourceList'], resolve),
        meta: { title: '资源管理', icon: 'resources' }
      }
    ]
  },
  {
    path: '/view',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    children: [
      {
        path: 'client',
        name: '项目管理',
        component: resolve => require(['@/views/rbac/projectList'], resolve),
        meta: { title: '项目管理', icon: 'project' }
      }
    ]
  },
  {
    path: '/view',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    redirect: '/resourceBuilding',
    name: 'resourceBuilding',
    hidden: true,
    children: [{
      path: 'resourceBuilding/:id',
      name: 'resourceBuilding',
      component: resolve => require(['@/views/rbac/resourceBuilding'], resolve),
      meta: { title: '资源绑定', icon: 'edit' }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
