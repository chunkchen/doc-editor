const rs = require('../routerConfig');

/**
 * 递归获取路由名字 数组返回
 * @param paths
 * @param configList
 * @returns {[]}
 */
function recursiveGetName(paths, configList) {
  let nodes = [];
  if (paths.length > 0) {
    const path = paths[0];
    const find = configList.find(item => item.path === `/${path}`);
    if (find) {
      nodes.push(find.name);
      if (find.children && find.children.length > 0) {
        nodes = nodes.concat(recursiveGetName(paths.slice(1), find.children));
      }
    }
  }
  return nodes;
}

const colorList = [
  '#ff3321', '#e96339', '#cb7ce9', '#6ff5c5',
  '#4bb6e6', '#4bb6e6', '#3fcc2c', '#75fb49',
  '#4bb6e6', '#5d8028', '#276080', '#43e417',
  '#455fff', '#999730', '#6765ff', '#137fff',
  '#f56a00', '#f500c4', '#e200f5', '#c000f5',
];

/**
 * 根据给定的一个关键字获取 20 范围内的索引,返回对应的颜色
 * @param word 汉字 字母 或数字
 */
export function getColorByWord(word) {
  if (!word) {
    return colorList[0];
  }
  const firstLetter = word.substr(0, 1);
  let number = 0;
  if (firstLetter.match(/[\u4e00-\u9fa5]/)) {
    number = parseInt(encodeURI(firstLetter).replace(/%/g, ''), 16);
  }
  if (firstLetter.match(/[a-zA-Z]/)) {
    number = firstLetter.charCodeAt(0);
  }
  if (firstLetter.match(/[0-9]/)) {
    number = firstLetter;
  }
  const index = number % 20;
  return colorList[index];
}

/**
 * 根据路径获取名字列表
 * @param pathname
 * @returns {[]}
 */
export function getBreadNamesByPathname(pathname) {
  let result = [];
  if (!pathname || pathname === '/') {
    return ['首页'];
  }
  const paths = pathname.split('/').slice(1);
  console.log(paths)
  if (paths.length > 0) {
    result = result.concat(recursiveGetName(paths, rs.routerConfig));
  }
  return result;
}
