import Engine from '@hicooper/doc-engine/lib';

const {NodeUtils, $} = Engine;

const PLUGIN_NAME = 'math';
export default {
  initialize() {
    // 创建命令
    this.command.add(PLUGIN_NAME, {
      execute: () => {
        const sectionRoot = this.change.insertSection(PLUGIN_NAME);
        const component = this.section.getComponent(sectionRoot);
        this.change.activateSection(sectionRoot);
        window.setTimeout(() => {
          component.focusTextarea();
        }, 10);
      },
    });
    // 转换页面粘贴过来的代码块
    this.on('paste:origin', (root) => {
      NodeUtils.walkTree(root, (node) => {
        node = $(node);
        // 阅读页面
        if (node.isBlock() && node.attr('data-type') === PLUGIN_NAME) {
          const src = node.attr('data-src');
          let code = node.attr('data-text');
          const width = node.attr('data-width');
          const height = node.attr('data-height');
          code = unescape(code);
          this.section.replaceNode(node, PLUGIN_NAME, {
            src,
            code,
            width,
            height,
          });
        }
      });
    });
  },
};
