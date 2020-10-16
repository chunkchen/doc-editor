## Preview

```bash
$ npm install
$ npm start
```

or:

```bash
$ yarn
$ yarn start
```

## 开发规范

### 目录和文件命名规范
1. 页面目录遵循大写命名， 组件（全局和局部）目录大小开头命名
2. 页面或组件目录下，索引文件命名 为 `index.jsx`
3. 出全局样式文件外的其他页面或组件内样式文件命名 `style.less`
4. 页面目录结构体现路由，即目录路径=路由（）相对于 `src/pages`
5. 全局样式定义在 `/src/styles`，所有新建的样式文件（`less`） 在 `index.less` 中导入引用
6. 静态图片文件放在 `/src/asserts` 目录下，如文件较多可根据用途建立目录
7. 全局通用组件 放在 `/src/components` 目录下
8. 所有样式引用 尽量 根据 DOM 节点层级创建, 超过2个 `css` 定义，使用 `class`，减少少内联样式使用（特殊覆盖除外）
9. 时间格式解析等处理用 包 `moment`
10. `jsx` 文件，状态变更，接口调用等函数调用 定义在 `render` 外，其他页面渲染逻辑定义 const 变量或函数，定义在 `render` 内



