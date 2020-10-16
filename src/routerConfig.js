import BlankPage from './pages/BlankPage';
import NoAuth from './components/Exception/403';
import NotFound from './components/Exception/404';
import ServerError from './components/Exception/500';

const routerConfig = [
  {
    name: '首页',
    path: '/home',
    component: BlankPage,
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

export { routerConfig, exceptionRouterConfig };
