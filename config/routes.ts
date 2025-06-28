/**
 * @name Guardian智能守护系统路由配置
 * @description 配置Guardian系统的完整路由结构
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  // 用户认证相关路由（无布局）
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './User/Register',
      },
      {
        name: 'forgot-password',
        path: '/user/forgot-password',
        component: './User/ForgotPassword',
      },
    ],
  },

  // 主要功能路由
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './Dashboard',
  },

  // 守护圈管理
  {
    path: '/circles',
    name: 'circles',
    icon: 'team',
    routes: [
      {
        path: '/circles',
        redirect: '/circles/list',
      },
      {
        path: '/circles/list',
        name: 'circles-list',
        component: './Circles/List',
      },
      {
        path: '/circles/create',
        name: 'circles-create',
        component: './Circles/Create',
      },
      {
        path: '/circles/:id',
        name: 'circles-detail',
        component: './Circles/Detail',
        hideInMenu: true,
      },
      {
        path: '/circles/:id/members',
        name: 'circles-members',
        component: './Circles/Members',
        hideInMenu: true,
      },
      {
        path: '/circles/:id/settings',
        name: 'circles-settings',
        component: './Circles/Settings',
        hideInMenu: true,
      },
    ],
  },

  // 设备管理
  {
    path: '/devices',
    name: 'devices',
    icon: 'mobile',
    component: './Devices',
  },

  // 事件监控
  {
    path: '/events',
    name: 'events',
    icon: 'alert',
    routes: [
      {
        path: '/events',
        redirect: '/events/list',
      },
      {
        path: '/events/list',
        name: 'events-list',
        component: './Events',
      },
      {
        path: '/events/:id',
        name: 'events-detail',
        component: './Events/Detail',
        hideInMenu: true,
      },
    ],
  },

  // 数据分析
  {
    path: '/analytics',
    name: 'analytics',
    icon: 'barChart',
    component: './Analytics',
  },

  // 个人中心
  {
    path: '/profile',
    name: 'profile',
    icon: 'user',
    routes: [
      {
        path: '/profile',
        redirect: '/profile/info',
      },
      {
        path: '/profile/info',
        name: 'profile-info',
        component: './Profile/Info',
      },
      {
        path: '/profile/security',
        name: 'profile-security',
        component: './Profile/Security',
      },
      {
        path: '/profile/notifications',
        name: 'profile-notifications',
        component: './Profile/Notifications',
      },
    ],
  },

  // 用户管理
  {
    path: '/users',
    name: 'users',
    icon: 'team',
    component: './Users',
    access: 'canAdmin',
  },

  // 系统管理（仅管理员可见）
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/settings',
      },
      {
        path: '/admin/settings',
        name: 'admin-settings',
        component: './Settings',
      },
      {
        path: '/admin/logs',
        name: 'admin-logs',
        component: './Logs',
      },
    ],
  },

  // 帮助中心
  {
    path: '/help',
    name: 'help',
    icon: 'question',
    component: './Help',
  },

  // 根路径重定向
  {
    path: '/',
    redirect: '/dashboard',
  },

  // 404页面
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
