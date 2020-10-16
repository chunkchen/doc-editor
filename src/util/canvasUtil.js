/**
 * 获取选中框的虚线
 * @param x
 * @param y
 * @param w
 * @param h
 * @returns {*[][]}
 */
export function getDashPosition(x, y, w, h) {
  return [
    [x, y + h / 3, x + w, y + h / 3],
    [x, y + 2 * h / 3, x + w, y + 2 * h / 3],
    [x + w / 3, y, x + w / 3, y + h],
    [x + 2 * w / 3, y, x + 2 * w / 3, y + h],
  ];
}

/**
 * 获取选中框的8个点
 * @param x
 * @param y
 * @param w
 * @param h
 */
export function getDotPosition(x, y, w, h) {
  return [
    [x - 2, y - 2, 4, 4],
    [x + w / 2 - 2, y - 2, 4, 4],
    [x + w - 2, y - 2, 4, 4],
    [x - 2, y + h / 2 - 2, 4, 4],
    [x + w - 2, y + h / 2 - 2, 4, 4],
    [x - 2, y + h - 2, 4, 4],
    [x + w / 2 - 2, y + h - 2, 4, 4],
    [x + w - 2, y + h - 2, 4, 4],
  ];
}

/**
 * 获取鼠标位置
 * @param x
 * @param y
 * @param w
 * @param h
 * @returns {(number[]|(number|*)[])[]}
 */
export function getMousePosition(x, y, w, h) {
  return [
    // 左上 右上 右下 左下 四个点
    [x - 4, y - 4, 8, 8],
    [x + w - 4, y - 4, 8, 8],
    [x + w - 4, y + h - 4, 8, 8],
    [x - 4, y + h - 4, 8, 8],
    // 上 右 下 左 四条边
    [x - 4, y - 4, w + 4, 8],
    [x + w - 4, y - 4, 8, h + 4],
    [x - 4, y + h - 4, w + 4, 8],
    [x - 4, y - 4, 8, h + 4],
  ];
}

/**
 * 判断选中框是否到外界了，返回选中框新位置
 * @param w
 * @param h
 * @param select
 */
export const checkSelectBoundary = (w, h, select) => {
  // 只需要判断左上角和右下角
  const _select = { ...select };

  _select.x < 0 && (_select.x = 0);
  _select.y < 0 && (_select.y = 0);

  _select.x + _select.w > w && (_select.x -= _select.x + _select.w - w);
  _select.y + _select.h > h && (_select.y -= _select.y + _select.h - h);

  return _select;
};

export const handleMouseInfo = (i, select, distance) => {
  const _select = { ...select };
  switch (i) {
    case 0:
      _select.x += distance.x;
      _select.y += distance.y;
      _select.w -= distance.x;
      _select.h -= distance.y;
      break;
    case 1:
      _select.y += distance.y;
      _select.w += distance.x;
      _select.h -= distance.y;
      break;
    case 2:
      _select.w += distance.x;
      _select.h += distance.y;
      break;
    case 3:
      _select.x += distance.x;
      _select.w -= distance.x;
      _select.h += distance.y;
      break;
    case 4:
      _select.y += distance.y;
      _select.h -= distance.y;
      break;
    case 5:
      _select.w += distance.x;
      break;
    case 6:
      _select.h += distance.y;
      break;
    case 7:
      _select.x += distance.x;
      _select.w -= distance.x;
      break;
    case 8:
      _select.x += distance.x;
      _select.y += distance.y;
      break;
    default:
      break;
  }
  return _select;
};

export const getCursorStyle = (i) => {
  let cursor = 'default';
  switch (i) {
    case 0:
    case 2:
      cursor = 'nwse-resize';
      break;
    case 1:
    case 3:
      cursor = 'nesw-resize';
      break;
    case 4:
    case 6:
      cursor = 'ns-resize';
      break;
    case 5:
    case 7:
      cursor = 'ew-resize';
      break;
    case 8:
      cursor = 'move';
      break;
    default:
      break;
  }
  return cursor;
};

/**
 * 将 负宽度 矩形 纠正
 * @param select
 * @returns {{w: number, x: *, h: number, y: *}}
 */
export const getAnewXY = (select) => {
  return {
    x: select.x + (select.w < 0 ? select.w : 0),
    y: select.y + (select.h < 0 ? select.h : 0),
    w: Math.abs(select.w),
    h: Math.abs(select.h),
  };
};
