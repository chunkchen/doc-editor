/**
 * @fileOverview base util
 */
import G6 from '@antv/g6';
import Palettes from 'ant-design-palettes';

const keyCodeMap = {
  whitespace: {
    9: 'Tab',
    13: 'Enter',
    32: 'Space',
  },
  fn: {
    112: 'f1 ',
    113: 'f2 ',
    114: 'f3 ',
    115: 'f4 ',
    116: 'f5 ',
    117: 'f6 ',
    118: 'f7 ',
    119: 'f8 ',
    120: 'f9 ',
    121: 'f10',
    122: 'f11',
    123: 'f12',
  },
  letter: {
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
  },
  number: {
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
  },
  navigation: {
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
  },
  symbol: {
    110: 'decimal point',
    186: 'semi-colon',
    187: '=',
    188: 'comma',
    189: '-',
    190: 'period ',
    191: '/',
    192: 'grave accent',
    219: 'open bracket ',
    220: 'back slash ',
    221: 'close bracket ',
    222: 'single quote ',
  },
  smallNumberKey: {
    96: 'numpad 0 ',
    97: 'numpad 1 ',
    98: 'numpad 2 ',
    99: 'numpad 3 ',
    100: 'numpad 4 ',
    101: 'numpad 5 ',
    102: 'numpad 6 ',
    103: 'numpad 7 ',
    104: 'numpad 8 ',
    105: 'numpad 9 ',
  },
  modifierKey: {
    16: 'Shift',
    17: 'Ctrl ',
    18: 'Alt',
    20: 'caps lock',
  },
  escKey: {
    8: 'Backspace',
    46: 'Delete',
    27: 'Escape',
  },
  homeKey: {
    91: 'Windows Key / Left command',
    92: 'right window key ',
    93: 'Windows Menu',
  },
  computeKey: {
    106: 'multiply ',
    107: 'add',
    109: 'subtract ',
    111: 'divide ',
  },
};

const Util = {
  ...G6.Util,
  /**
   * get key bu keycode
   * @param  {number} keyCode key code
   * @return {object} rst
   */
  getTypeAndChar: (keyCode) => {
    keyCode = `${keyCode}`;
    let type;
    let character;

    for (const index in keyCodeMap) {
      type = index;

      for (const i in keyCodeMap[index]) {
        if (i === keyCode) {
          character = keyCodeMap[index][i];
          return {
            type,
            character,
          };
        }
      }
    }
    return {};
  },
  getKeyboradKey: (domEvent) => {
    return domEvent.key || Util.getTypeAndChar(domEvent.keyCode).character;
  },

  /**
   * point to line distance
   * @param  {number} x1 line p1.x
   * @param  {number} y1 line p1.y
   * @param  {number} x2 line p2.x
   * @param  {number} y2 line p2.y
   * @param  {number} x p.x
   * @param  {number} y p.y
   * @return {Number|NaN} distance
   */
  pointLineDistance: (x1, y1, x2, y2, x, y) => {
    const d = [x2 - x1, y2 - y1];
    if (G6.Util.vec2.exactEquals(d, [0, 0])) {
      return NaN;
    }
    const u = [-d[1], d[0]];
    G6.Util.vec2.normalize(u, u);
    const a = [x - x1, y - y1];
    return Math.abs(G6.Util.vec2.dot(a, u));
  },

  /**
   * get rect by box
   * @param  {object} box box
   * @param  {object} group group
   * @param  {object} style style
   * @return {object} rect
   */
  getRectByBox: (box, group, style) => {
    return group.addShape('rect', {
      attrs: {
        ...style,
        x: box.minX,
        y: box.minY,
        width: box.maxX - box.minX,
        height: box.maxY - box.minY,
      },
    });
  },

  /**
   * object to values
   * @param   {object} obj object
   * @return  {array} rst array
   */
  objectToValues: (obj) => {
    const rst = [];
    let i;
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        rst.push(obj[i]);
      }
    }

    return rst;
  },

  /**
   * get contrast from obj1 by obj2
   * @param  {object} obj1 model
   * @param  {object} obj2 model
   * @return {object} rst
   */
  getContrast: (obj1, obj2) => {
    const rst = {};
    G6.Util.each(obj2, (v, k) => {
      rst[k] = obj1[k];
    });
    return rst;
  },
  // 将光标移动到最后
  setEndOfContenteditable: (contentEditableElement) => {
    const range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  },
  Palettes,
};
export default Util;
