/**
 * @fileOverview 类型判断
 */
const toString = {}.toString

const isType = (value, type) => {
  return toString.call(value) === `[object ${type}]`
}

export const isNil = (value) => {
  /**
   * isNil(null) => true
   * isNil() => true
   */
  return value === null || value === undefined
}
export const isNumber = (value) => {
  return isType(value, 'Number')
}

export const isString = (value) => {
  return isType(value, 'String')
}
export const isFunction = (value) => {
  return isType(value, 'Function')
}
