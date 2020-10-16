import AccountList from './pages/System/Account';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import OpLog from './pages/System/OpLog';
import RegisterResult from './pages/User/RegisterResult';
import BlankPage from './pages/BlankPage';
import NoAuth from './components/Exception/403';
import NotFound from './components/Exception/404';
import ServerError from './components/Exception/500';

const routerConfig = [
  {
    name: '首页',
    path: '/home',
    redirect: '/blank',
    children: [
      {
        name: '空白页',
        path: '/blank',
        component: BlankPage,
      },
    ],
  },
  {
    path: '/system',
    name: '系统管理',
    children: [
      {
        name: '账户管理',
        path: '/account',
        component: AccountList,
      },
      {
        name: '登陆日志',
        path: '/op-log',
        component: OpLog,
      },
    ],
  },
];

const userRouterConfig = [
  {
    path: '/user',
    name: '用户',
    children: [
      {
        name: '登录',
        path: '/login',
        component: Login,
      },
      {
        name: '注册',
        path: '/register',
        component: Register,
      },
      {
        name: '注册结果',
        path: '/register-result',
        component: RegisterResult,
      },
    ],
  },
];

const exceptionRouterConfig = [
  {
    path: '/403',
    name: '没有权限',
    component: NoAuth,
  },
  {
    path: '/404',
    name: '页面不存在',
    component: NotFound,
  },
  {
    path: '/500',
    name: '服务器异常',
    component: ServerError,
  },
];

export { routerConfig, userRouterConfig, exceptionRouterConfig };
