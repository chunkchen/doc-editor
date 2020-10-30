import FullEdit from './pages/FullEdit';
import MiniEdit from './pages/MiniEdit';
import MobileEdit from './pages/MobileEdit';
import InlineEdit from './pages/InlineEdit';
import NoAuth from './components/Exception/403';
import NotFound from './components/Exception/404';
import ServerError from './components/Exception/500';

const routerConfig = [
  {
    name: '首页',
    path: '/home',
    children: [
      {
        name: 'full',
        path: '/full',
        component: FullEdit,
      },
      {
        name: 'Mini',
        path: '/mini',
        component: MiniEdit,
      },
      {
        name: 'Mobile',
        path: '/mobile',
        component: MobileEdit,
      },
      {
        name: 'Inline',
        path: '/inline',
        component: InlineEdit,
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

export { routerConfig, exceptionRouterConfig };
