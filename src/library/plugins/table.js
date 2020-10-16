import Engine from 'doc-engine/lib';
import { getTableModel, normalizeTable, unWrapperTableBI } from '../section/table/utils';
import schema from '../section/table/schema';

const { ChangeUtils, StringUtils, NodeUtils, $ } = Engine;

function handleKeydownEnter(e) {
  const range = this.change.getRange();
  if (!range.collapsed) {
    return;
  }
  const block = ChangeUtils.getClosestBlock(range.startContainer);
  if (block.name !== 'p') {
    return;
  }

  const options = this.options.markdown || {
    items: ['table'],
  };

  if (options.items.indexOf('table') < 0) return;

  const chars = ChangeUtils.getBlockLeftText(block, range);
  const match = /^\|(?:(?:[^\|]+?)\|){2,}$/.exec(chars);

  if (match) {
    e.preventDefault();
    ChangeUtils.removeBlockLeftText(block, range);
    const textList = match[0].split('|').filter((n) => {
      return n;
    });
    const rows = 3;
    const cols = textList.length;
    let html = '<table>';

    for (let i = 0; i <= rows - 1; i++) {
      html += '<tr>';
      for (let j = 0; j <= cols - 1; j++) {
        const text = i === 0 ? StringUtils.escape(textList[j]) : '<br />';
        html += '<td><p>'.concat(text, '</p></td>');
      }
      html += '</tr>';
    }

    html += '</table>';
    const node = $(html);
    const table = normalizeTable(node[0]);
    const tableModel = getTableModel(node[0]);
    const value = {
      html: table.outerHTML,
      rows: tableModel.rows,
      cols: tableModel.cols,
    };
    this.command.execute('table', value);
    return value;
  }
}

export { handleKeydownEnter };

export default {
  initialize() {
    // 添加被允许的标签
    this.schema.add(schema);
    // 创建命令
    this.command.add('table', {
      execute: (value) => {
        const sectionRoot = this.change.insertSection(
          'table',
          value || {
            rows: 8,
            cols: 8,
          },
        );
        const component = this.section.getComponent(sectionRoot);
        this.change.activateSection(sectionRoot);
        component.selection.selectFirstCell();
        return component;
      },
    });
    this.on('paste:origin', unWrapperTableBI);
    this.on('paste:before', (fragment) => {
      NodeUtils.fetchAllChildren(fragment).forEach((node) => {
        node = $(node);
        if (node.name === 'table') {
          const table = normalizeTable(node[0]);
          const tableModel = getTableModel(node[0]);
          const value = {
            html: table.outerHTML,
            rows: tableModel.rows,
            cols: tableModel.cols,
          };
          this.section.replaceNode(node, 'table', value);
        }
      });
    });
    // markdown 快捷方式
    this.on('keydown:enter', (e) => {
      handleKeydownEnter.call(this, e);
    });
  },
};
