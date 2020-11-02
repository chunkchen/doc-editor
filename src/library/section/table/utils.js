import isInteger from 'lodash/isInteger';
import isObject from 'lodash/isObject';
import Engine from '@hicooper/doc-engine/lib';

const {$, StringUtils, NodeUtils} = Engine;

/**
 * 提取表格数据模型，由于合并单元格的存在，html 结构不利于操作
 * @param {NativeNode} table 表格原生对象
 * @return {(tdModel[])[]} result 一个二维数组
 * [
 *  [tdModel, tdModel...],
 *  [tdModel, tdModel...],
 *  ...
 * ]
 * @tdModel:
 *  {
 *    isMulti: {boolean} 合并的单元格
 *    isEmpty: {boolean} 为 true 时表示被合并单元格覆盖到的占位
 *    isShadow: {boolean} 为 true 时表示这是一个补充的单元格，html拷贝的时候会出现遗漏单元格，这里需要补充上
 *    parent: {row, col} 标记占位格的父单元格的坐标位置
 *    element: {NativeNode} 指针作用，指向对应的 td
 *    rowSpan: {number} 单元格的 rowSpan
 *    colSpan: {number} 单元格的 colSpan
 *  }
 */
export const getTableModel = (table) => {
  const model = [];
  const rows = table.rows;
  const rowCount = rows.length;

  for (let r = 0; r < rowCount; r++) {
    const tr = rows[r];
    const cells = tr.cells;
    const cellCount = cells.length;

    for (let c = 0; c < cellCount; c++) {
      const td = cells[c];
      let {rowSpan, colSpan} = td;
      rowSpan = rowSpan === void 0 ? 1 : rowSpan;
      colSpan = colSpan === void 0 ? 1 : colSpan;
      const isMulti = rowSpan > 1 || colSpan > 1;
      model[r] = model[r] || [];
      // 如果当前单元格的 model 已经存在，说明是前面已经有合并单元格覆盖了当前坐标，需要往右推移
      let _c = c;
      while (model[r][_c]) {
        _c++;
      }

      model[r][_c] = {
        rowSpan,
        colSpan,
        isMulti,
        element: td,
      };

      if (isMulti) {
        // 补齐被合并的单元格占位
        let _rowCount = rowSpan;

        while (_rowCount > 0) {
          let colCount = colSpan;
          while (colCount > 0) {
            if (colCount !== 1 || _rowCount !== 1) {
              const rowIndex = r + _rowCount - 1;
              const colIndex = _c + colCount - 1;
              model[rowIndex] = model[rowIndex] || [];
              model[rowIndex][colIndex] = {
                isEmpty: true,
                parent: {
                  row: r,
                  col: _c,
                },
                element: null,
              };
            }
            colCount--;
          }
          _rowCount--;
        }
      }
    }
  }

  const colCounts = model.map((trModel) => {
    return trModel.length;
  });
  const MaxColCount = Math.max.apply(Math, [...colCounts]);
  model.forEach((trModel) => {
    if (trModel.length < MaxColCount) {
      let addCount = MaxColCount - trModel.length;
      while (addCount--) {
        trModel.push({
          rowSpan: 1,
          colSpan: 1,
          isShadow: true,
          element: null,
        });
      }
    }
    // 表格内有空数组项，补齐为 shadow
    for (let i = 0; i < MaxColCount; i++) {
      if (!trModel[i]) {
        trModel[i] = {
          rowSpan: 1,
          colSpan: 1,
          isShadow: true,
          element: null,
        };
      }
    }
  });
  return {
    rows: model.length,
    cols: MaxColCount,
    width: table.offsetWidth,
    table: model,
  };
};
/**
 * table 结构标准化，补齐丢掉的单元格和行
 * 场景1. number 拷贝过来的 html 中，如果这一行没有单元格，就会省掉 tr，渲染的时候会有问题
 * 场景2. 从网页中鼠标随意选取表格中的一部分，会丢掉没有选中的单元格，需要补齐单元格
 * @param {nativeNode} table 表格 Dom
 * @return {nativeNode} 修复过的 table dom
 */

export const normalizeTable = (table) => {
  const $table = $(table);
  trimStartTr($table);
  fixNumberTr(table);
  normalizeTdContent($table);
  $table.addClass('lake-table');
  // 修正表格宽度为 pt 场景
  const width = $table.css('width');

  if (parseInt(width) === 0) {
    $table.css('width', 'auto');
  } else {
    // pt 直接转为 px, 因为 col 的 width 属性是没有单位的，会直接被理解为 px, 这里 table 的 width 也直接换成 px。
    $table.css('width', `${parseInt(width, 10)}px`);
  } // 表格 table 标签不允许有背景色，无法设置

  $table.css('background-color', '');
  const model = getTableModel(table);
  // 修正列的 span 场景
  let cols = $table.find('col');
  if (cols.length !== 0) {
    for (let c = cols.length - 1; c >= 0; c--) {
      const _width = $(cols[c]).attr('width');
      if (_width) {
        $(cols[c]).attr('width', parseInt(_width));
      }
      if (cols[c].span > 1) {
        let addCount = cols[c].span - 1;
        while (addCount--) {
          cols[c].parentNode.insertBefore(cols[c].cloneNode(), cols[c]);
        }
      }
    }
    cols = $table.find('col');
    if (cols.length < model.cols) {
      const lastCol = cols.length - 1;
      let colsAddCount = model.cols - cols.length;
      while (colsAddCount--) {
        cols[0].parentNode.appendChild(cols[lastCol].cloneNode());
      }
    }
    $table.find('col').attr('span', 1);
  } else {
    let colgroup = $table.find('colgroup')[0];
    if (!colgroup) {
      colgroup = document.createElement('colgroup');
    }
    $table.prepend(colgroup);
    const widths = (function (table) {
      const tr = table.find('tr')[0];
      const tds = $(tr).find('td');
      const widthArray = [];
      tds.each((td) => {
        let colWidth = $(td).attr('data-colwidth');
        let tdWidth = $(td).attr('width');
        const tdColSpan = $(td)[0].colSpan;
        if (colWidth) {
          colWidth = colWidth.split(',');
        } else if (tdWidth) {
          tdWidth = parseInt(tdWidth) / tdColSpan;
        }
        for (let o = 0; tdColSpan > o; o++) {
          if (colWidth && colWidth[o]) {
            widthArray.push(parseInt(colWidth[o]));
          } else if (tdWidth) {
            widthArray.push(parseInt(tdWidth));
          } else {
            widthArray.push(undefined);
          }
        }
      });
      const td = table.find('td');
      td.removeAttr('data-colwidth');
      td.removeAttr('width');
      return widthArray;
    }($table));
    const col = document.createElement('col');
    for (let f = 0; model.cols > f; f++) {
      const node = col.cloneNode();
      if (widths[f]) {
        node.setAttribute('width', widths[f]);
      }
      colgroup.appendChild(node);
    }
  }
  // 数据模型和实际 dom 结构的行数不一致，需要寻找并补齐行
  model.table.forEach((tr, r) => {
    if (!table.rows[r]) {
      table.insertRow(r);
    }
    const shadow = tr.filter((td) => {
      return td.isShadow;
    });
    let shadowCount = shadow.length;
    while (shadowCount--) {
      if (r === 0) {
        table.rows[r].insertCell(0);
      } else {
        table.rows[r].insertCell();
      }
    }
  });
  // 修正行高
  const trs = $table.find('tr');
  trs.each((tr) => {
    const $tr = $(tr);
    let height = $(tr).css('height');
    height = parseInt(height) || 33;
    $tr.css('height', `${height}px`);
  });
  return table;
};

/**
 * 过滤 table 中的首行空tr, 当表格尾部有空白单元格时，网页拷贝时头部会莫名其妙的出现一个空的Tr
 * @param {nodeModel} table 传入的table
 */
export const trimStartTr = (table) => {
  const tr = table.find('tr');
  if (tr[0].childNodes.length === 0) {
    $(tr[0]).remove();
  }
};

/**
 * 过滤 schema 中的 table 相关标签
 * @param {Array} schema 传入的schema
 * @return {Array} 过滤之后的schema
 */
export const tableInnerSchema = (schema) => {
  return schema.filter((rule) => {
    let allowed = true;
    if (isObject(rule)) {
      if (rule.table || rule.tr || rule.td || rule.th || rule.tbody || rule.col || rule.thead || rule.h1 || rule.h2 || rule.h3 || rule.h4 || rule.h5 || rule.h6) {
        allowed = false;
      }
    } else if (rule === 'table' || rule === 'tr' || rule === 'td' || rule === 'th' || rule === 'col' || rule === 'colgroup' || rule === 'tbody' || rule === 'thead') {
      allowed = false;
    }
    return allowed;
  });
};

/**
 * 去掉头尾空span
 * @param {nodeModel} node 传入的 node
 * @return {nodeModel} 去过头尾的 node
 */
export const trimBlankSpan = (node) => {
  const len = node.length;
  const nodelist = [];
  let i = 0;
  let j = len - 1;

  while (node[i] && node[i].tagName.toLowerCase() === 'span' && node[i].innerText.trim() === '') {
    i++;
  }

  while (node[j] && node[j].tagName.toLowerCase() === 'span' && node[j].innerText.trim() === '') {
    j--;
  }

  if (i <= j) {
    for (let k = i; k <= j; k++) {
      nodelist.push(node[k]);
    }
  }

  if (nodelist.length) {
    return $(nodelist);
  }
  return node;
};

export const copyTo = (from, to) => {
  const $to = $(to);
  const $from = $(from);
  $to.html(StringUtils.transformCustomTags(from.innerHTML));
  copyCss($from, $to);
};

export const copyCss = (from, to) => {
  const $to = $(to);
  const $from = $(from);
  $to.css('text-align', $from.css('text-align'));
  $to.css('vertical-align', $from.css('vertical-align'));
  let tdBgColor = $from.css('background-color');
  tdBgColor = tdBgColor !== 'rgba(0, 0, 0, 0)' ? tdBgColor : '#fff';
  $to.css('background-color', tdBgColor);
  $to.css('color', $from.css('color'));
  $to.css('font-weight', $from.css('font-weight'));
};

let clipboard = null;
export const copyHTML = (html) => {
  clipboard = {
    html,
    text: $(html).innerText,
  };
};

export const getCopyData = () => {
  return clipboard;
};

export const unWrapperTableHTML = (html) => {
  html = html.replace(/<p(>|\s+[^>]*>)/ig, '<div$1').replace(/<\/p>/ig, '</div>');
  const root = new DOMParser().parseFromString(html, 'text/html');
  unWrapperTable(root);
  return root.body.innerHTML;
};

export const unWrapperTable = (root) => {
  unWrapperTableCommon(root, (node) => {
    return node.isBlock() && (node.hasClass('bi-table') || node.attr('data-section-key') === 'table');
  });
  NodeUtils.walkTree(root, (node) => {
    node = $(node);
    unWrapperCodeBlock(node);
  });
};

export const unWrapperTableBI = (root) => {
  unWrapperTableCommon(root, (node) => {
    return node.isBlock() && node.hasClass('bi-table');
  });
};

export const unWrapperTableCommon = (root, check) => {
  NodeUtils.walkTree(root, (node) => {
    node = $(node);
    // 编辑页面
    if (check(node)) {
      const tableNode = node.find('table');
      if (tableNode.length > 0) {
        normalizeTdContent(tableNode);
        node.replaceWith(tableNode);
        return;
      }
      // 有表格容器没有内容，直接丢掉这个节点，
      // 如果表格前面有个标题，表格和标题之间没有空隙，前面的标题双击选择的时候会带上这个空的容器
      node.remove();
    }
  });
};

export const unWrapperCodeBlock = (node) => {
  if (node.isBlock() && node.attr('data-section-key') === 'codeblock') {
    const value = StringUtils.decodeSectionValue(node.attr('data-section-value'));
    if (value.code) {
      const lines = value.code.split('\n');
      const p = $('<p />');
      lines.forEach((line) => {
        const cloneLine = p.clone();
        cloneLine.html(StringUtils.escape(line).replace(/\t/g, '&nbsp;&nbsp;').replace(/\s/g, '&nbsp;'));
        node.before(cloneLine);
      });
      node.remove();
    }
  }
};

export const normalizeTdContent = (table) => {
  NodeUtils.walkTree(table, (node) => {
    node = $(node);
    // 编辑页面
    if (node.isBlock()) {
      let replacer;
      switch (node.name) {
        case 'h1':
          replacer = $('<span class="lake-fontsize-18"/>');
          replacer.html(node.html());
          break;

        case 'h2':
          replacer = $('<span class="lake-fontsize-16"/>');
          replacer.html(node.html());
          break;

        case 'h3':
        case 'h4':
          replacer = $('<span class="lake-fontsize-14"/>');
          replacer.html(node.html());
          break;

        case 'h5':
        case 'h6':
          replacer = $('<span class="lake-fontsize-12"/>');
          replacer.html(node.html());
          break;

        default:
          break;
      }

      if (replacer) {
        node.replaceWith(replacer);
      }
    }

    if (node.name === 'a') {
      const url = node.attr('href') || '';
      if (!url.startsWith('#') && !node.attr('target')) {
        node.attr('target', '_blank');
      }
    }
    unWrapperCodeBlock(node);
  });
};
// firefox 下的拖拽需要这样处理
// clearData 是为了防止新开 tab
// hack: 如果不 setData, firefox 不会触发拖拽事件，但设置 data 之后，又会开新 tab, 这里设置一个 firefox 不识别的 mimetype: lake
export const fixDragEvent = (e) => {
  e.dataTransfer.clearData();
  e.dataTransfer.setData('lake', null);
};

/**
 * 获得一个表格内包含内容的最大行列数
 */
export const getContentArea = (tableModel) => {
  const {table, cols, rows} = tableModel;
  let row = rows - 1;
  let col = cols - 1;
  let rowHasContent = false;
  let colHasContent = false;

  while (row > 0 && !rowHasContent) {
    for (let c = 0; c < cols; c++) {
      if (!isTdEmpty(table, row, c)) {
        rowHasContent = true;
        break;
      }
    }

    if (!rowHasContent) {
      row--;
    }
  }

  while (col > 0 && !colHasContent) {
    for (let r = 0; r < rows; r++) {
      if (!isTdEmpty(table, r, col)) {
        colHasContent = true;
        break;
      }
    }

    if (!colHasContent) {
      col--;
    }
  }

  return {
    row,
    col,
  };
};

const isTdEmpty = (table, row, col) => {
  const tdModel = table[row][col];
  let td;
  if (tdModel.isEmpty) {
    td = table[tdModel.parent.row][tdModel.parent.col].element;
  } else {
    td = tdModel.element;
  }

  return !(td && (td.innerText.trim() !== '' || $(td).find('img')[0]));
};

const fixNumberTr = (table) => {
  const rows = table.rows;
  const rowCount = rows.length;
  const colCounts = [];
  let firstColCount; // 第一列的单元格个数
  const cellCounts = []; // 每行单元格个数
  let totalCellCounts = 0; // 总单元格个数
  let emptyCounts = 0; // 跨行合并缺损的单元格
  // 已经存在一行中的 td 的最大数，最终算出来的最大列数一定要大于等于这个值
  let maxCellCounts = 0; // 在不确定是否缺少tr时，先拿到已经存在的td，和一些关键信息

  for (let r = 0; r < rowCount; r++) {
    const row = rows[r];
    const cells = row.cells;
    let cellCountThisRow = 0;

    for (let c = 0; c < cells.length; c++) {
      const {rowSpan, colSpan} = cells[c];
      totalCellCounts += rowSpan * colSpan;
      cellCountThisRow += colSpan;
      if (rowSpan > 1) {
        emptyCounts += (rowSpan - 1) * colSpan;
      }
    }
    cellCounts[r] = cellCountThisRow;
    if (r === 0) {
      firstColCount = cellCountThisRow;
    }
    maxCellCounts = Math.max(cellCountThisRow, maxCellCounts);
  }
  // number拷贝的一定是首行列数能被单元格总数整除
  const isNumber1 = isInteger(totalCellCounts / firstColCount);// number拷贝的一定是首行列数最大
  const isNumber2 = firstColCount === maxCellCounts;
  const isNumber = isNumber1 && isNumber2; // 判断是否是 number, 是因为 number 需要考虑先修复省略的 tr，否则后面修复出来就会有问题

  if (isNumber) {
    let lossCellCounts = 0;
    cellCounts.forEach((cellCount) => {
      lossCellCounts += maxCellCounts - cellCount;
    });

    if (lossCellCounts !== emptyCounts) {
      const missCellCounts = emptyCounts - lossCellCounts;
      if (isInteger(missCellCounts / maxCellCounts)) {
        const lossRowIndex = []; // 记录哪一行缺 tr

        for (let _r = 0; _r < rowCount; _r++) {
          const _row = rows[_r];
          const _cells = _row.cells;
          let realRow = _r + lossRowIndex.length;

          while (colCounts[realRow] === maxCellCounts) {
            lossRowIndex.push(realRow);
            realRow++;
          }

          for (let _c2 = 0; _c2 < _cells.length; _c2++) {
            const {rowSpan, colSpan} = _cells[_c2];
            if (rowSpan > 1) {
              for (let rr = 1; rr < rowSpan; rr++) {
                colCounts[realRow + rr] = (colCounts[realRow + rr] || 0) + colSpan;
              }
            }
          }
        }

        lossRowIndex.forEach((row) => {
          table.insertRow(row);
        });
      }
    }
  }
};
