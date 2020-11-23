import { post } from '../network/request'

/**
 * 生成 latex/puml svg 图片内容
 *
 * @param {string} type puml|latex
 * @param {string} code 待处理文本
 * @return {Promise<{} | void>} 服务端处理结果
 */
export const preview = (type, code) => {
  return post('/api/'.concat(type), {
    content: code,
  })
}
