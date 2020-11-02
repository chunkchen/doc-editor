import FullEdit from './example/FullEdit';
import MiniEdit from './example/MiniEdit';
import MobileEdit from './example/MobileEdit';
import InlineEdit from './example/InlineEdit';

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

export default routerConfig;
