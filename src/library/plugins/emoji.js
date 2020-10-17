export default {
  initialize() {
    // 创建命令
    this.command.add('emoji', {
      execute: (point) => {
        const options = this.change.engine.options.emoji || {};
        const url = options.action || '/emoji/';
        const src = url.concat(point, '.svg');
        this.change.insertSection('emoji', src);
      },
    });
    // 转换粘贴过来的 emoji
    this.on('paste:schema', (schema) => {
      schema.add([{
        img: {
          class: 'lake-emoji',
        },
      }, {
        span: {
          'data-type': '*',
          style: {
            'background-image': '*',
          },
        },
      }]);
    });
    this.on('paste:each', (node) => {
      // 只复制了 emoji 图片
      if (node.name === 'img' && node.hasClass('lake-emoji')) {
        const match = /((https|http)?:\/\/.+?\.svg)/i.exec(node[0].outerHTML);
        if (match) {
          this.section.replaceNode(node, 'emoji', match[1]);
        }
        return;
      }
      // 阅读页面
      if (node.name === 'span' && node.attr('data-type') === 'emoji') {
        const _match = /((https|http)?:\/\/.+?\.svg)/i.exec(node[0].outerHTML);
        if (_match) {
          node.empty();
          this.section.replaceNode(node, 'emoji', _match[1]);
        }
      }
    });
  },
};
