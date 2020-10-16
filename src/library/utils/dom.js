import { isNil } from './type';

/**
 * 获取一串字符关于另一个字符的索引集
 * @param  {String} str - 被检索字符
 * @param  {String} keyword - 用于检索的关键词
 * @return {Array} 字符的索引集
 */

const getKeywordIndexs = (str, keyword) => {
  const rst = [];
  const l = keyword.length;
  let i = str.indexOf(keyword);

  while (i > -1) {
    rst.push(i);
    i = str.indexOf(keyword, i + l);
  }

  return rst;
};

/**
 * dom 元素是否在浏览器视口内
 * @param  {Object} dom - DOM节点
 * @return {Boolean}
 */
export const isInViewport = (dom) => {
  const rect = dom.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    /* or $(window).height() */
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  /* or $(window).width() */
};

/**
 * 获取样式
 * @param  {Object} dom - DOM节点
 * @param  {String} name - 样式名
 * @param  {Any} defaultValue - 默认值
 * @return {String} 属性值
 */

export const getStyle = (dom, name, defaultValue) => {
  try {
    if (window.getComputedStyle) {
      return window.getComputedStyle(dom, null)[name];
    }

    return dom.currentStyle[name];
  } catch (e) {
    if (!isNil(defaultValue)) {
      return defaultValue;
    }
    return null;
  }
};

/**
 * 获取宽度
 * @param  {HTMLElement} el - dom节点
 * @param  {Number} defaultValue - 默认值
 * @return {Number} 宽度
 */
export const getWidth = (el, defaultValue) => {
  let width = getStyle(el, 'width', defaultValue);

  if (width === 'auto') {
    width = el.offsetWidth;
  }

  return parseFloat(width);
};

/**
 * 获取高度
 * @param  {HTMLElement} el - dom节点
 * @param  {Number} defaultValue - 默认值
 * @return {Number} 高度
 */
export const getHeight = (el, defaultValue) => {
  let height = getStyle(el, 'height', defaultValue);

  if (height === 'auto') {
    height = el.offsetHeight;
  }

  return parseFloat(height);
};

/**
 * 获取一个 dom 元素内所有的 textnode 类型的元素
 * @param  {HTMLElement} elem - dom节点
 * @param  {Function} filter - 过滤器
 * @return {Array} 获取的文本节点
 */
export const getTextNodes = (elem, filter) => {
  let textNodes = [];
  if (elem) {
    if (filter && !filter(elem)) {
      return textNodes;
    }

    const nodes = elem.childNodes;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeType = node.nodeType;
      if (nodeType === 3) {
        textNodes.push(node);
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        textNodes = textNodes.concat(getTextNodes(node, filter));
      }
    }
  }
  return textNodes;
};

/**
 * 从一个 testNode 集合中获取关于一个 text 的 range 集合
 * @param  {HTMLElement} textNodes - 文字元素集合
 * @param  {Function} text - 目标文本
 * @return {Array} 区间集合
 */
export const getRangesByText = (textNodes, text) => {
  const ranges = [];
  textNodes.forEach((textNode) => {
    const textValue = textNode.nodeValue;
    const l = text.length;
    const strIndexs = getKeywordIndexs(textValue, text);
    strIndexs.forEach((strIndex) => {
      const range = document.createRange();
      range.setStart(textNode, strIndex);
      range.setEnd(textNode, strIndex + l);
      ranges.push(range);
    });
  });
  return ranges;
};

export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      return resolve(image);
    };
    image.onerror = reject;
    image.src = src;
  });
};
