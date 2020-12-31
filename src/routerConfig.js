import FullEdit from './example/FullEdit'
import MiniEdit from './example/MiniEdit'
import MobileEdit from './example/MobileEdit'
import InlineEdit from './example/InlineEdit'
import MultiPageEditor from './example/MultiPageEdit'

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
      {
        name: 'MultiPage',
        path: '/multi-page',
        component: MultiPageEditor,
      },
    ],
  },
]

export default routerConfig
