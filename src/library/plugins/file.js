import Engine from '@hicooper/doc-engine'

export default {
  initialize() {
    // 拖拽上传文件
    this.on('drop:files', (files) => {
      if (this.uploader.post('file', files)) return false
    })

    // 转换页面粘贴过来的文件
    this.on('paste:origin', (root) => {
      Engine.NodeUtils.walkTree(root, (node) => {
        node = Engine.$(node)
        // 编辑页面
        if (node.isBlock() && node.hasClass('bi-file')) {
          const fileNode = node.find('.bi-file-content')
          if (fileNode.length > 0) {
            const src = fileNode.attr('data-src') || ''
            const name = fileNode.attr('data-name')
            const ext = src.split('.')
              .pop()
            const sizeNode = fileNode.find('.size')
            if (!src || !ext || sizeNode.length === 0) {
              return
            }
            const size = sizeNode.text()
              .replace(/^.+?([\d\\.]+)\s*(kb|mb).*$/i, (match0, size, unit) => {
                // 注意：这里必须用 1000，不能用 1024
                if (unit.toLowerCase() === 'kb') {
                  return size * 1000
                }

                if (unit.toLowerCase() === 'mb') {
                  return size * 1000 * 1000
                }
              })
            const value = {
              src,
              name,
              size: parseFloat(size) || 0,
              ext,
            }
            this.section.replaceNode(node, 'file', value)
          }
        }
      })
    })
    this.on('paste:schema', (schema) => {
      schema.add([{
        p: {
          'data-type': '*',
          'data-filetype': '*',
          'data-name': '*',
          'data-size': '*',
          'data-src': '*',
        },
      }])
    })
    this.on('paste:each', (node) => {
      // 阅读页面
      if (node.attr('data-type') === 'file') {
        const src = node.attr('data-src')
        if (src) {
          const value = {
            src,
            name: node.attr('data-name'),
            size: parseInt(node.attr('data-size'), 10) || 0,
            ext: node.attr('data-filetype'),
          }

          this.section.replaceNode(node, 'file', value)
        }
      }
    })
  },
}
