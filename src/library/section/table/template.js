import Engine from '@hicooper/doc-engine/lib';
import {normalizeTable} from './utils';

const {$} = Engine;

const TABLE_WRAPPER_CLASS = 'table-wrapper';
const TABLE_CLASS = 'lake-table';
const COLS_HEADER_CLASS = 'table-cols-header';
const COLS_HEADER_ITEM_CLASS = 'table-cols-header-item';
const HEADER_ADD_CLASS = 'table-header-add-btn';
const HEADER_DELETE_CLASS = 'table-header-delete-btn';
const COLS_HEADER_TRIGGER_CLASS = 'cols-trigger';
const ROWS_HEADER_CLASS = 'table-rows-header';
const ROWS_HEADER_ITEM_CLASS = 'table-rows-header-item';
const ROWS_HEADER_TRIGGER_CLASS = 'rows-trigger';
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
const SHADOW_LEFT_CLASS = 'table-shadow-left';
const SHADOW_RIGHT_CLASS = 'table-shadow-right';

export default function (section) {
  return {
    TABLE_WRAPPER_CLASS: '.'.concat(TABLE_WRAPPER_CLASS),
    TABLE_CLASS: '.'.concat(TABLE_CLASS),
    COLS_HEADER_CLASS: '.'.concat(COLS_HEADER_CLASS),
    COLS_HEADER_ITEM_CLASS: '.'.concat(COLS_HEADER_ITEM_CLASS),
    HEADER_ADD_CLASS: '.'.concat(HEADER_ADD_CLASS),
    HEADER_DELETE_CLASS: '.'.concat(HEADER_DELETE_CLASS),
    COLS_HEADER_TRIGGER_CLASS: '.'.concat(COLS_HEADER_TRIGGER_CLASS),
    ROWS_HEADER_CLASS: '.'.concat(ROWS_HEADER_CLASS),
    ROWS_HEADER_ITEM_CLASS: '.'.concat(ROWS_HEADER_ITEM_CLASS),
    ROWS_HEADER_TRIGGER_CLASS: '.'.concat(ROWS_HEADER_TRIGGER_CLASS),
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

      // 列头
      const colsHeader = '<div class="'
        .concat(COLS_HEADER_CLASS, '">')
        .concat('<div class="'
          .concat(COLS_HEADER_ITEM_CLASS, '" draggable="true"> '
            + '<div class="table-col-header-btns">'
            + '   <a class="table-control-icon-btn table-header-delete-btn">'
            + '       <span class="lake-icon lake-icon-delete" />'
            + '   </a>'
            + '   <a class="table-control-icon-btn table-header-add-btn">'
            + '       <span class="lake-icon lake-icon-plus"/>'
            + '   </a>'
            + '</div>'
            + '<div class="col-dragger"><span class="lake-icon lake-icon-drag"></span><p class="drag-info"></p></div>'
            + '<div class="')
          .concat(COLS_HEADER_TRIGGER_CLASS, '"></div></div>')
          .repeat(cols), '')
        .concat('</div>');

      // 行头
      const rowsHeader = '<div class="'
        .concat(ROWS_HEADER_CLASS, '">')
        .concat('<div class="'
          .concat(ROWS_HEADER_ITEM_CLASS, '" draggable="true">'
            + '<div class="table-row-header-btns">\n'
            + '    <a class="table-control-icon-btn table-header-delete-btn">'
            + '       <span class="lake-icon lake-icon-delete" />'
            + '    </a>'
            + '    <a class="table-control-icon-btn table-header-add-btn">'
            + '       <span class="lake-icon lake-icon-plus"/>'
            + '    </a>'
            + '</div>          '
            + '<div class="row-dragger"> <span class="lake-icon lake-icon-drag"></span><span class="drag-info"></span></div>'
            + '<div class="')
          .concat(ROWS_HEADER_TRIGGER_CLASS, '"></div></div>')
          .repeat(rows), ' ')
        .concat('</div> ');

      // 整个表 锚点
      const tableHeader = '<div class="'.concat(HEADER_CLASS, '"></div>');

      // 当前激活单元格
      const textArea = '<textarea class="'
        .concat(TABLE_TEXTAREA_CLASS, '"></textarea>');
      const activeBox = '<div class="'
        .concat(ACTIVE_TD_CLASS, '">')
        .concat(textArea, '<div class="')
        .concat(COL_MASK, '"></div><div class="')
        .concat(ROW_MASK, '"></div><div class="l"></div><div class="r"></div><div class="t"></div><div class="b"></div><div class="')
        .concat(AREA_MASK, '"></div><div class="nw ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_nw"></div><div class="se ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_se"></div><div class="n ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_n"></div><div class="w ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_w"></div><div class="s ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_s"></div> <div class="e ')
        .concat(ACTIVE_TD_TRIGGER_CLASS, '" direction="drag_e"></div>')
        .concat(this.SubEditor, '     </div>');

      const placeholder = '<div class="'.concat(PLACEHOLDER_CLASS, '"></div>');
      const shadowLeft = '<div class="'.concat(SHADOW_LEFT_CLASS, '"></div>');
      const shadowRight = '<div class="'.concat(SHADOW_RIGHT_CLASS, '"></div>');

      // 右键菜单
      let menuBar = section.constants.MENU.map((menu) => {
        if (menu.split) {
          return '<div class="split"></div>';
        }
        return '<div class="'
          .concat(MENUBAR_ITEM_CLASS, '" data-action="')
          .concat(menu.action, '"><span class="lake-icon lake-icon-table-')
          .concat(menu.icon, '"></span>')
          .concat(menu.text, '</div>');
      });
      menuBar = '<div class="'
        .concat(MENUBAR_CLASS, '">')
        .concat(menuBar.join(''), '</div>');

      if (html) {
        const hasColGroup = html.includes('<colgroup>');

        if (!hasColGroup) {
          html = html.replace(/^(<table[^>]+>)/, (match) => {
            return match + colgroup;
          });
        }

        html = normalizeTable($(html)[0]).outerHTML;
      }

      const table = html || ' <table class="'
        .concat(TABLE_CLASS, '">')
        .concat(colgroup, '')
        .concat(trs, '</table>');

      const sectionClass = TABLE_WRAPPER_CLASS + (section.options.type === 'mini' ? ` ${TABLE_WRAPPER_CLASS}-mini` : '');
      return '       <div class="'.concat(sectionClass, '">').concat(tableHeader, ' <div class=" ').concat(VIEWPORT, '">').concat(colsHeader, '')
        .concat(activeBox, '')
        .concat(table, '')
        .concat(placeholder, '')
        .concat(shadowLeft, '')
        .concat(shadowRight, '</div>')
        .concat(rowsHeader, '')
        .concat(menuBar, '</div>');
    },
    htmlView: (value) => {
      const html = value.html;
      return '<div class="'.concat(VIEWPORT_READER, '">       ').concat(html, '     </div>');
    },
  };
}
