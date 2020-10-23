import Engine from 'doc-engine/lib';
import { normalizeTable } from './utils';

const { $ } = Engine;

const TABLE_WRAPPER_CLASS = 'table-wrapper';
const TABLE_CLASS = 'lake-table';
const COLS_HEADER_CLASS = 'table-cols-header';
const COLS_HEADER_ITEM_CLASS = 'table-cols-header-item';
const COLS_HEADER_TRIGGER_CLASS = 'cols-trigger';
const COLS_ADDITION_CLASS = 'cols-addition';
const COLS_ADDITION_HEADER_CLASS = 'cols-addition-header';
const ROWS_HEADER_CLASS = 'table-rows-header';
const ROWS_HEADER_ITEM_CLASS = 'table-rows-header-item';
const ROWS_HEADER_TRIGGER_CLASS = 'rows-trigger';
const ROWS_ADDITION_CLASS = 'rows-addition';
const ROWS_ADDITION_HEADER_CLASS = 'rows-addition-header';
const HEADER_CLASS = 'table-header';
const ACTIVE_TD_CLASS = 'table-active-td';
const ACTIVE_TD_TRIGGER_CLASS = 'table-active-td-trigger';
const AREA_MASK = 'mask';
const ROW_MASK = 'mask-row';
const COL_MASK = 'mask-col';
const SUB_EDITOR_CLASS = 'sub-editor';
const SUB_EDITOR_CONTENT_CLASS = 'sub-editor-content';
const MENUBAR_CLASS = 'table-menubar';
const MENUBAR_ITEM_CLASS = 'table-menubar-item';
const TABLE_TEXTAREA_CLASS = 'table-textarea';
const VIEWPORT = 'table-viewport';
const VIEWPORT_READER = 'lake-table-reader';
const PLACEHOLDER_CLASS = 'table-placeholder';
const MULTI_ADDITION_CLASS = 'multi-addition';
const SHADOW_LEFT_CLASS = 'table-shadow-left';
const SHADOW_RIGHT_CLASS = 'table-shadow-right';

export default function (section) {
  return {
    TABLE_WRAPPER_CLASS: '.'.concat(TABLE_WRAPPER_CLASS),
    TABLE_CLASS: '.'.concat(TABLE_CLASS),
    COLS_HEADER_CLASS: '.'.concat(COLS_HEADER_CLASS),
    COLS_HEADER_ITEM_CLASS: '.'.concat(COLS_HEADER_ITEM_CLASS),
    COLS_HEADER_TRIGGER_CLASS: '.'.concat(COLS_HEADER_TRIGGER_CLASS),
    COLS_ADDITION_CLASS: '.'.concat(COLS_ADDITION_CLASS),
    COLS_ADDITION_HEADER_CLASS: '.'.concat(COLS_ADDITION_HEADER_CLASS),
    ROWS_HEADER_CLASS: '.'.concat(ROWS_HEADER_CLASS),
    ROWS_HEADER_ITEM_CLASS: '.'.concat(ROWS_HEADER_ITEM_CLASS),
    ROWS_HEADER_TRIGGER_CLASS: '.'.concat(ROWS_HEADER_TRIGGER_CLASS),
    ROWS_ADDITION_CLASS: '.'.concat(ROWS_ADDITION_CLASS),
    ROWS_ADDITION_HEADER_CLASS: '.'.concat(ROWS_ADDITION_HEADER_CLASS),
    HEADER_CLASS: '.'.concat(HEADER_CLASS),
    ACTIVE_TD_CLASS: '.'.concat(ACTIVE_TD_CLASS),
    ACTIVE_TD_TRIGGER_CLASS: '.'.concat(ACTIVE_TD_TRIGGER_CLASS),
    AREA_MASK: '.'.concat(AREA_MASK),
    ROW_MASK: '.'.concat(ROW_MASK),
    COL_MASK: '.'.concat(COL_MASK),
    SUB_EDITOR_CLASS: '.'.concat(SUB_EDITOR_CLASS),
    SUB_EDITOR_CONTENT_CLASS: '.'.concat(SUB_EDITOR_CONTENT_CLASS),
    MENUBAR_CLASS: '.'.concat(MENUBAR_CLASS),
    MENUBAR_ITEM_CLASS: '.'.concat(MENUBAR_ITEM_CLASS),
    TABLE_TEXTAREA_CLASS: '.'.concat(TABLE_TEXTAREA_CLASS),
    VIEWPORT: '.'.concat(VIEWPORT),
    VIEWPORT_READER: '.'.concat(VIEWPORT_READER),
    PLACEHOLDER_CLASS: '.'.concat(PLACEHOLDER_CLASS),
    MULTI_ADDITION_CLASS: '.'.concat(MULTI_ADDITION_CLASS),
    SHADOW_LEFT_CLASS: '.'.concat(SHADOW_LEFT_CLASS),
    SHADOW_RIGHT_CLASS: '.'.concat(SHADOW_RIGHT_CLASS),
    EmptyCell: '<p><br /></p>',
    SubEditor: '<div class="'.concat(SUB_EDITOR_CLASS, '"><div class="').concat(SUB_EDITOR_CONTENT_CLASS, '"></div></div>'),

    /**
     * 用于Section渲染
     * @param {object} value 参数
     * @param {number} value.rows 行数
     * @param {number} value.cols 列数
     * @param {string} value.html html 字符串
     * @return {string} 返回 html 字符串
     */
    htmlEdit(value) {
      const rows = value.rows;
      const cols = value.cols;
      let html = value.html;
      const tds = '<td><p><br /></p></td>'.repeat(cols);
      const trs = '<tr>'.concat(tds, '</tr>').repeat(rows);
      const col = '<col />'.repeat(cols);
      const colgroup = '<colgroup>'.concat(col, '</colgroup>');
      const colsAddition = '<div class="'.concat(COLS_ADDITION_HEADER_CLASS, '">\n        <div class="multi-trigger"></div>\n        <div class="').concat(COLS_ADDITION_CLASS, '"> + </div>\n      </div>');
      const rowsAddition = '<div class="'.concat(ROWS_ADDITION_CLASS, '">\n        <div class="plus"> + </div>\n      </div>');
      const rowsAdditionHead = '<div class="'.concat(ROWS_ADDITION_HEADER_CLASS, '">\n        <div class="multi-trigger"></div>\n      </div>');
      const multiAddition = '<div class="'.concat(MULTI_ADDITION_CLASS, '">\n        <div class="number">1</div>\n        <div class="up"><span class="lake-icon lake-icon-arrow-up" /></div>\n        <div class="down"><span class="lake-icon lake-icon-arrow-down"/></div>\n      </div>');

      const colsHeader = '\n        <div class="'.concat(COLS_HEADER_CLASS, '">\n          ')
        .concat('<div class="'
          .concat(COLS_HEADER_ITEM_CLASS, '" draggable="true">\n  <div class="table-col-header-btns">\n'
            + '              <a class="table-control-icon-btn table-header-delete-btn">\n'
            + '                <span class="lake-icon lake-icon-delete" />\n'
            + '              </a>\n'
            + '              <a class="table-control-icon-btn table-header-add-btn">\n'
            + '                  <span class="lake-icon lake-icon-plus"/>\n'
            + '              </a>\n'
            + '            </div>           <div class="col-dragger">\n                <span class="lake-icon lake-icon-drag"/>\n                <p class="drag-info"/>\n              </div>\n              <div class="')
          .concat(COLS_HEADER_TRIGGER_CLASS, '"></div>\n            </div>')
          .repeat(cols), '\n          ')
        .concat('\n        </div>\n      ');

      const rowsHeader = '\n        <div class="'.concat(ROWS_HEADER_CLASS, '">\n          ').concat('<div class="'.concat(ROWS_HEADER_ITEM_CLASS, '" draggable="true">\n              <div class="row-dragger">\n                <span class="lake-icon lake-icon-drag"/>\n                <span class="drag-info"/>\n              </div>\n              <div class="').concat(ROWS_HEADER_TRIGGER_CLASS, '"></div>\n            </div>').repeat(rows), '\n          ').concat('\n        </div>\n      ');

      const tableHeader = '<div class="'.concat(HEADER_CLASS, '"></div>');

      const textArea = '<textarea class="'.concat(TABLE_TEXTAREA_CLASS, '"></textarea>');
      const activeBox = '<div class="'
        .concat(ACTIVE_TD_CLASS, '">\n        ')
        .concat(textArea, '\n        <div class="')
        .concat(COL_MASK, '"></div>\n        <div class="')
        .concat(ROW_MASK, '"></div>\n        <div class="l"></div>\n        <div class="r"></div>\n        <div class="t"></div>\n        <div class="b"></div>\n        <div class="')
        .concat(AREA_MASK, '"></div>\n        <div class="nw ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_nw"></div>\n        <div class="se ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_se"></div>\n        <div class="n ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_n"></div>\n        <div class="w ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_w"></div>\n        <div class="s ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_s"></div>\n        <div class="e ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_e"></div>\n        ')
        .concat(this.SubEditor, '\n      </div>');
      const placeholder = '<div class="'.concat(PLACEHOLDER_CLASS, '"></div>');
      const shadowLeft = '<div class="'.concat(SHADOW_LEFT_CLASS, '"></div>');
      const shadowRight = '<div class="'.concat(SHADOW_RIGHT_CLASS, '"></div>');
      let menuBar = section.constants.MENU.map((menu) => {
        if (menu.split) {
          return '<div class="split"></div>';
        }
        return '<div class="'.concat(MENUBAR_ITEM_CLASS, '" data-action="').concat(menu.action, '">\n          <span class="lake-icon lake-icon-table-').concat(menu.icon, '"></span>\n          ').concat(menu.text, '\n        </div>');
      });
      menuBar = '<div class="'.concat(MENUBAR_CLASS, '">').concat(menuBar.join(''), '</div>');

      if (html) {
        const hasColGroup = html.includes('<colgroup>');

        if (!hasColGroup) {
          html = html.replace(/^(<table[^>]+>)/, (match) => {
            return match + colgroup;
          });
        }

        html = normalizeTable($(html)[0]).outerHTML;
      }

      const table = html || '\n        <table class="'.concat(TABLE_CLASS, '">\n          ').concat(colgroup, '\n          ').concat(trs, '\n        </table>');

      const sectionClass = TABLE_WRAPPER_CLASS + (section.options.type === 'mini' ? ` ${TABLE_WRAPPER_CLASS}-mini` : '');
      return '\n        <div class="'.concat(sectionClass, '">\n          ').concat(tableHeader, '\n         ').concat(colsHeader, '\n            <div class="').concat(VIEWPORT, '">\n            ')
        .concat(activeBox, '\n            ')
        .concat(table, '\n            ')
        .concat(placeholder, '\n            ')
        .concat(shadowLeft, '\n            ')
        .concat(shadowRight, '\n          </div>\n          ')
        .concat(rowsHeader, '\n          ')
        .concat(multiAddition, '\n          ')
        .concat(menuBar, '\n        </div>');
    },
    htmlView: (value) => {
      const html = value.html;
      return '<div class="'.concat(VIEWPORT_READER, '">\n        ').concat(html, '\n      </div>');
    },
  };
}
