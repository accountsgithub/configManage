import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  // 登陆
  { path: '/login',
    component: resolve => require(['@/views/selfLogin/index'], resolve),
    hidden: true
  },
  // 登陆
  {
    path: '/homePage',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    name: 'homePage',
    hidden: true,
    children: [{
      path: '/homePage',
      component: resolve => require(['@/views/config/content'], resolve)
    }]
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
    redirect: '/login',
    name: 'login',
    hidden: true,
    children: [{
      path: '/login',
      component: resolve => require(['@/views/selfLogin/index'], resolve)
    }]
  },
  // // 统一项目
  // {
  //   path: '/project',
  //   component: resolve => require(['@/views/project/project'], resolve),
  //   redirect: '/project',
  //   name: '统一项目',
  //   meta: { title: '统一项目', icon: 'home' },
  //   children: [
  //     {
  //       path: '',
  //       name: '项目展示',
  //       component: resolve => require(['@/views/project/project'], resolve),
  //       meta: { title: '项目展示', icon: 'edit' }
  //     },
  //     {
  //       path: 'proExd',
  //       name: '项目审批',
  //       component: resolve => require(['@/views/project/proExd'], resolve),
  //       meta: { title: '项目审批', icon: 'edit' }
  //     }
  //   ]
  // },
  // 统一配置
  {
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
  },
  // 统一权限
  /* {
    path: '/cloud-rbac/view',
    component: resolve => require(['@/views/layout/Layout'], resolve),
    redirect: '',
    name: '',
    meta: { title: '权限中心', icon: 'edit' },
    children: [
      {
        path: 'department',
        name: '部门管理',
        component: resolve => require(['@/views/rbac/departList'], resolve),
        meta: { title: '部门管理' }
      },
      {
        path: 'person',
        name: '人员管理',
        component: resolve => require(['@/views/rbac/personList'], resolve),
        meta: { title: '人员管理' }
      },
      {
        path: 'user',
        name: '用户管理',
        component: resolve => require(['@/views/rbac/userList'], resolve),
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: resolve => require(['@/views/rbac/roleList'], resolve),
        meta: { title: '角色管理' }
      },
      {
        path: 'resource',
        name: '资源管理',
        component: resolve => require(['@/views/rbac/resourceList'], resolve),
        meta: { title: '资源管理' }
      },
      {
        path: 'client',
        name: '项目管理',
        component: resolve => require(['@/views/rbac/projectList'], resolve),
        meta: { title: '项目管理' }
      }
    ]
  }, */
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
