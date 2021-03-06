const {override, fixBabelImports, addLessLoader} = require('customize-cra');

// 关闭 sourceMap
process.env.GENERATE_SOURCEMAP = 'false';
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {'@primary-color': '#1890FF'},
    }
  }),
);
