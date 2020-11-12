import Engine from '@hicooper/doc-engine/lib';
import { MODE_NAME_MAP } from '../section/codeblock';

const { ChangeUtils, NodeUtils, StringUtils, HTMLParser, $ } = Engine;

// 缩写替换
const INPUT_MODE_ALIAS = {
  text: 'plain',
  sh: 'bash',
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  puml: 'plantuml',
  uml: 'plantuml',
  vb: 'basic',
  md: 'markdown',
  'c++': 'cpp',
};

const PLUGIN_NAME = 'codeblock';
export default {
  initialize() {
    // 创建命令
    this.command.add(PLUGIN_NAME, {
      queryState: () => {
        const { section, activeSection } = this.change;
        if (section && activeSection) {
          return section.getName(activeSection);
        }
        return '';
      },
      execute: (mode, code) => {
        const sectionRoot = this.change.insertSection(PLUGIN_NAME, {
          mode,
          code,
        });
        this.change.focusSection(sectionRoot);
        const component = this.section.getComponent(sectionRoot);
        window.setTimeout(() => {
          component.focusToCodeEditor();
        }, 10);
      },
    });
    // Markdown 快捷键
    this.on('keydown:enter', (e) => {
      const range = this.change.getRange();
      if (!range.collapsed) {
        return;
      }
      const block = ChangeUtils.getClosestBlock(range.startContainer);
      if (!block.isHeading()) {
        return;
      }
      const options = this.options.markdown || {
        items: [
          'codeblcok',
        ],
      };

      if (options.items.indexOf('codeblcok') < 0) return;

      const chars = ChangeUtils.getBlockLeftText(block, range);
      const match = /^```(.*){0,10}$/.exec(chars);

      if (match) {
        let mode = (undefined === match[1] ? '' : match[1]).toLowerCase();
        mode = INPUT_MODE_ALIAS[mode] || mode;

        if (MODE_NAME_MAP[mode] || mode === '') {
          e.preventDefault();
          ChangeUtils.removeBlockLeftText(block, range);
          this.command.execute(PLUGIN_NAME, mode, '');
          block.remove();
          return false;
        }
      }
    });

    // 转换页面粘贴过来的代码块
    this.on('paste:origin', (root) => {
      NodeUtils.walkTree(root, (node) => {
        node = $(node);
        // 编辑页面
        if (node.isBlock() && node.hasClass('bi-code')) {
          const preNode = node.find('pre');
          if (preNode.length > 0) {
            const match = /^bi-code bi-code-(\w+)/.exec(node[0].className);
            const mode = match ? match[1] : '';
            let code = new HTMLParser(preNode).toText();
            code = StringUtils.unescape(code);
            this.section.replaceNode(node, PLUGIN_NAME, {
              mode,
              code,
            });
          }
        }
      });
    });
    // 转换粘贴过来的代码块
    this.on('paste:schema', (schema) => {
      schema.add({
        pre: {
          'data-syntax': '*',
        },
      });
    });

    this.on('paste:each', (node) => {
      // 阅读页面
      if (node.name === 'pre' && node.attr('data-syntax')) {
        let code = new HTMLParser(node).toText();
        code = StringUtils.unescape(code);

        this.section.replaceNode(node, PLUGIN_NAME, {
          mode: node.attr('data-syntax'),
          code,
        });

        return;
      }
      // 其它页面
      if (node.name === 'pre' && node.first() && node.first().name === 'code') {
        let _code = new HTMLParser(node).toText();
        _code = StringUtils.unescape(_code);
        this.section.replaceNode(node, PLUGIN_NAME, {
          mode: 'plain',
          code: _code,
        });
      }
    });

    // // 快捷键
    // const options = this.options[PLUGIN_NAME] || {
    //   hotkey: 'mod+shift+c',
    // };
    //
    // if (options.hotkey) {
    //   this.hotkey.set(options.hotkey, PLUGIN_NAME);
    // }
  },
};
