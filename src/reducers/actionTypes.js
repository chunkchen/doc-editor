/*
 * action 类型
 */
export const FOLD = 'FOLD';
export const UNFOLD = 'UNFOLD';

/*
 * action 创建函数
 */

export function setFold() {
  return {
    type: FOLD,
  };
}

export function setUnFold() {
  return {
    type: UNFOLD,
  };
}
