import {EventEmitter2} from 'eventemitter2';
import Keymaster from 'keymaster';
import Engine from '@hicooper/doc-engine/lib';
import {copyCss, getTableModel} from './utils';

const {$} = Engine;

class Selection extends EventEmitter2 {
  constructor(_section) {
    super(_section);

    this.selectFirstCell = () => {
      const tds = this.section.tableRoot.find('td');
      this.selectCell(tds[0]);
    };

    this.rowCount = () => {
      if (!this.area) return 0;
      const {row, row2} = this.area;
      return Math.abs(row - row2) + 1;
    };

    this.colCount = () => {
      if (!this.area) return 0;
      const {col, col2} = this.area;
      return Math.abs(col - col2) + 1;
    };

    this.selectCell = (td, mode) => {
      if (!td || !td.tagName || td.tagName.toLowerCase() !== 'td') {
        return;
      }
      const table = this.tableModel.table;
      const tr = td.parentNode;
      const rowSpan = td.rowSpan;
      const colSpan = td.colSpan;
      const row = tr.rowIndex;
      // 找到鼠标所在单元格 td 的列索引 col
      let col = 0;
      table[row].forEach((tdModel, i) => {
        if (tdModel.element === td) {
          col = i;
        }
      });
      const row2 = row + rowSpan - 1;
      const col2 = col + colSpan - 1;
      const hoverArea = {
        row,
        col,
        row2,
        col2,
      };

      if (!mode || !this.area) {
        this.area = hoverArea;
        delete this.from_col;
        delete this.from_row;
        delete this.shift_base_area;
        this.renderActiveBox();
        return;
      }
      const {rowMin, rowMax, colMin, colMax} = this.normalizeArea();
      if (mode === 'contextmenu') {
        if (rowMin <= row && row <= rowMax && colMin <= col && col <= colMax) {
          return;
        }
        this.area = hoverArea;
        delete this.shift_base_area;
        this.renderActiveBox();
        return;
      }

      if (mode === 'shift') {
        this.shift_base_area = this.shift_base_area || this.area;
        this.area = this.getAdjustArea(this.shift_base_area, hoverArea);
        this.renderActiveBox();
        return;
      }

      switch (mode) {
        case 'drag_nw':
          this.base_area = this.base_area || this._getSouthEastTdArea();
          break;

        case 'drag_se':
          this.base_area = this.base_area || this._getNorthWestTdArea();
          break;

        case 'drag_n':
          this.row_base = this.row_base !== undefined ? this.row_base : rowMax;
          break;

        case 'drag_s':
          this.row_base = this.row_base !== undefined ? this.row_base : rowMin;
          break;

        case 'drag_w':
          this.col_base = this.col_base !== undefined ? this.col_base : colMax;
          break;

        case 'drag_e':
          this.col_base = this.col_base !== undefined ? this.col_base : colMin;
          break;

        default:
          break;
      }
      if (this.base_area) {
        this.area = this.getAdjustArea(this.base_area, hoverArea);
      }

      if (this.col_base !== undefined) {
        if (this.area.col === this.col_base && this.area.col2 === col) {
          return
        }
        this.area.col = this.col_base;
        this.area.col2 = col;
      }

      if (this.row_base !== undefined) {
        if (this.area.row === this.row_base && this.area.row2 === row) {
          return
        }
        this.area.row = this.row_base;
        this.area.row2 = row;
      }
      this.renderActiveBox();
    };

    this.getAdjustArea = (oldArea, newArea) => {
      const table = this.tableModel.table;
      const row = oldArea.row;
      const col = oldArea.col;
      const row2 = oldArea.row2;
      const col2 = oldArea.col2;
      const row3 = newArea.row;
      const row4 = newArea.row2;
      const col3 = newArea.col;
      const col4 = newArea.col2;
      const row_min = Math.min(row, row2, row3, row4);
      const row_max = Math.max(row, row2, row3, row4);
      const col_min = Math.min(col, col2, col3, col4);
      const col_max = Math.max(col, col2, col3, col4);
      const comboArea = {
        row: row_min,
        col: col_min,
        row2: row_max,
        col2: col_max,
      };

      for (let r = row_min; r <= row_max; r++) {
        for (let c = col_min; c <= col_max; c++) {
          if (table[r][c].isEmpty) {
            const parent = table[r][c].parent;
            if (parent.row < row_min || parent.col < col_min) {
              const parentTd = table[parent.row][parent.col];
              const outerArea = {
                row: parent.row,
                col: parent.col,
                row2: parent.row + parentTd.rowSpan - 1,
                col2: parent.col + parentTd.colSpan - 1,
              };
              return this.getAdjustArea(comboArea, outerArea);
            }
          }

          if (table[r][c].isMulti) {
            const _parentTd = table[r][c];

            if (r + _parentTd.rowSpan - 1 > row_max || c + _parentTd.colSpan - 1 > col_max) {
              const _outerArea = {
                row: r,
                col: c,
                row2: r + _parentTd.rowSpan - 1,
                col2: c + _parentTd.colSpan - 1,
              };
              return this.getAdjustArea(comboArea, _outerArea);
            }
          }
        }
      }
      return comboArea;
    };

    this.isSingleArea = () => {
      const {area, tableModel} = this;
      const {table} = tableModel;
      if (!area) return false;

      const {rowMin, rowMax, colMin, colMax} = this.normalizeArea();
      const firstTd = table[rowMin][colMin];
      return firstTd && (rowMin + firstTd.rowSpan - 1 === rowMax) && (colMin + firstTd.colSpan - 1 === colMax);
    };

    this.hasMergeCell = () => {
      const area = this.area;
      if (!area) return false;
      let result = false;

      this.each((td) => {
        if (td.isEmpty || td.isMulti) {
          result = true;
        }
      });
      return result;
    };

    this._getSouthEastTdArea = () => {
      const {tableModel, area} = this;
      const {table} = tableModel;
      if (!area) return null;
      const {rowMax, colMax} = this.normalizeArea();
      let td = table[rowMax][colMax];
      let row = rowMax;
      let col = colMax;

      if (td.isEmpty) {
        td = table[td.parent.row][td.parent.col];
        row = td.parent.row;
        col = td.parent.col;
      }

      return {
        row,
        col,
        row2: rowMax,
        col2: colMax,
      };
    };

    this._getNorthWestTdArea = () => {
      const {tableModel, area} = this;
      const {table} = tableModel;
      if (!area) return null;

      const {rowMin, colMin} = this.normalizeArea();
      const td = table[rowMin][colMin];
      return {
        row: rowMin,
        col: colMin,
        row2: rowMin + td.rowSpan - 1,
        col2: colMin + td.colSpan - 1,
      };
    };

    this.selectCol = (index) => {
      const {tableModel} = this;
      this.area = {
        row: 0,
        row2: tableModel.rows - 1,
        col: Keymaster.shift && this.area.total_col ? this.area.col : index,
        col2: index,
        total_col: true,
      };
      this.renderActiveBox();
    };

    this.selectCols = (col, col2) => {
      const {tableModel} = this;
      this.area = {
        row: 0,
        row2: tableModel.rows - 1,
        col,
        col2,
        total_col: true,
      };
      this.renderActiveBox();
    };

    this.selectRow = (index) => {
      const {tableModel} = this;
      this.area = {
        row: Keymaster.shift && this.area.total_row ? this.area.row : index,
        row2: index,
        col: 0,
        col2: tableModel.cols - 1,
        total_row: true,
      };
      this.renderActiveBox();
    };

    this.selectRows = (row, row2) => {
      const {tableModel} = this;
      this.area = {
        row,
        row2,
        col: 0,
        col2: tableModel.cols - 1,
        total_row: true,
      };

      this.renderActiveBox();
    };

    this.selectArea = (area) => {
      this.area = area;
      this.renderActiveBox();
    };

    this.selectTable = (e) => {
      if (!this.section.active) return;
      if (e && this.section.subEngine) return;

      const {area, tableModel} = this;
      if (area && area.total_table) {
        this.clear();
        return;
      }

      this.selectArea({
        row: 0,
        row2: tableModel.rows - 1,
        col: 0,
        col2: tableModel.cols - 1,
        total_table: true,
      });
    };

    this.selectLeft = (e, isTab) => {
      if (this.section.subEngine) return;
      const {area, tableModel} = this;
      if (!area) return;

      const {rowMin, colMin} = this.normalizeArea();
      let new_row = this.from_row || rowMin;
      let new_col = Math.max(colMin - 1, 0);
      this.from_row = this.from_row || new_row;
      if (colMin === 0 && isTab && new_row > 0) {
        new_col = tableModel.cols - 1;
        new_row -= 1;
        this.from_row = new_row;
      }
      delete this.from_col;
      this.selectTd(new_row, new_col);
    };

    this.selectRight = (e, isTab) => {
      if (this.section.subEngine) return;
      const {area, tableModel} = this;
      if (!area) return;
      const {rowMin, colMax} = this.normalizeArea();
      let new_row = this.from_row || rowMin;
      let new_col = Math.min(colMax + 1, tableModel.cols - 1);
      this.from_row = this.from_row || new_row;

      if (colMax + 1 === tableModel.cols && isTab) {
        new_col = 0;
        new_row += 1;
        if (new_row === tableModel.rows) {
          this.section.command.insertRow('end');
        }
        this.from_row = new_row;
      }
      delete this.from_col;
      this.selectTd(new_row, new_col);
    };

    this.selectUp = () => {
      if (this.section.subEngine) return;
      const {area} = this;
      if (!area) return;
      const {rowMin, colMin} = this.normalizeArea();
      const new_row = Math.max(rowMin - 1, 0);
      const new_col = this.from_col || colMin;
      this.from_col = this.from_col || colMin;
      delete this.from_row;
      this.selectTd(new_row, new_col);
    };

    this.selectDown = () => {
      if (this.section.subEngine) return;
      const {area, tableModel} = this;
      if (!area) return;
      const {rowMax, colMin} = this.normalizeArea();
      const new_row = Math.min(rowMax + 1, tableModel.rows - 1);
      const new_col = this.from_col || colMin;
      this.from_col = this.from_col || colMin;
      delete this.from_row;
      this.selectTd(new_row, new_col);
    };

    this.selectTab = (e) => {
      if (this.section.subEngine) {
        this.section.removeEditor();
      }

      e.preventDefault();
      if (Keymaster.shift) {
        this.selectLeft(e, true);
      } else {
        this.selectRight(e, true);
      }
    };

    this.selectEnter = (e) => {
      if (this.section.subEngine) return;
      e.preventDefault();
      this.selectDown();
    };

    this.selectTd = (row, col) => {
      const {tableModel} = this;

      const table = tableModel.table;
      const tdModel = table[row][col];

      if (tdModel.isEmpty) {
        const parentTd = table[tdModel.parent.row][tdModel.parent.col];

        this.selectArea({
          row: tdModel.parent.row,
          col: tdModel.parent.col,
          row2: tdModel.parent.row + parentTd.rowSpan - 1,
          col2: tdModel.parent.col + parentTd.colSpan - 1,
        });
        return;
      }

      this.selectArea({
        row,
        col,
        row2: row + tdModel.rowSpan - 1,
        col2: col + tdModel.colSpan - 1,
      });

      const left = parseInt(this.activeBox.css('left'));

      if (left < this.viewport[0].scrollLeft) {
        this.viewport[0].scrollLeft = left;
      } else if (left + 80 > this.viewport[0].scrollLeft + this.viewport[0].offsetWidth) {
        this.viewport[0].scrollLeft = left - this.viewport[0].offsetWidth + 80;
      }
    };

    this.renderActiveBox = () => {
      // this.hideSubEditor();
      this.reRenderActiveBox();
      // 这里需要每次都触发，否则头部不会选中，性能的优化放到后续操作中
      this.emit('select');
    };

    this.reRenderActiveBox = (actionPreview) => {
      const {area, tableModel} = this;
      const template = this.section.template;
      if (!area) return;
      this.single = this.isSingleArea();
      const table = tableModel.table;
      const {rowMin, rowMax, colMin, colMax} = this.normalizeArea();
      let left;
      let top;
      let width;
      let height;

      if (this.single) {
        const td = table[rowMin][colMin].element;
        left = td.offsetLeft;
        top = td.parentNode.offsetTop;
        width = td.offsetWidth;
        height = td.offsetHeight;
      } else {
        const colBars = this.colsHeader.find(template.COLS_HEADER_ITEM_CLASS);
        const rowBars = this.rowsHeader.find(template.ROWS_HEADER_ITEM_CLASS);
        left = colBars[colMin].offsetLeft;
        top = rowBars[rowMin].offsetTop;
        width = colBars[colMax].offsetLeft - left + colBars[colMax].offsetWidth;
        height = rowBars[rowMax].offsetTop - top + rowBars[rowMax].offsetHeight;
      }
      this.showActiveBox(left, top, height, width, actionPreview);
      this.areaWidth = width;
      this.areaHeight = height;
      this.areaLeft = left;
      // this.reRenderSubEditor();
      this.td = this.single ? table[rowMin][colMin].element : null;
    };

    this.showActiveBox = (left, top, height, width, actionPreview) => {
      const {activeBox, hideTextarea} = this;
      // 4 边 上下左右
      const t = activeBox.find('.t');
      const b = activeBox.find('.b');
      const l = activeBox.find('.l');
      const r = activeBox.find('.r');
      // 遮罩
      const mask = activeBox.find('.mask');
      const maskCol = activeBox.find('.mask-col');
      const maskRow = activeBox.find('.mask-row');
      // 东南角 点
      const se = activeBox.find('.se');
      // 4 点 上下左右
      const n = activeBox.find('.n');
      const s = activeBox.find('.s');
      const w = activeBox.find('.w');
      const e = activeBox.find('.e');

      activeBox.removeClass('col');
      activeBox.removeClass('row');
      activeBox.removeClass('total');
      activeBox.removeClass('preview-mask-col');
      activeBox.removeClass('preview-mask-row');

      if (this.area.total_col) {
        activeBox.addClass('col');
      }

      if (this.area.total_row) {
        activeBox.addClass('row');
      }

      if (this.area.total_table) {
        activeBox.addClass('total');
      }

      if (actionPreview === 'removeCol') {
        activeBox.addClass('preview-mask-col');
      }

      if (actionPreview === 'removeRow') {
        activeBox.addClass('preview-mask-row');
      }
      l.css('height', ''.concat(height, 'px'));
      r.css('height', ''.concat(height + 1, 'px'));
      r.css('left', ''.concat(width, 'px'));
      t.css('width', ''.concat(width, 'px'));
      b.css('top', ''.concat(height, 'px'));
      b.css('width', ''.concat(width, 'px'));
      se.css('left', ''.concat(width - 3, 'px'));
      se.css('top', ''.concat(height - 3, 'px'));
      n.css('top', '-4px');
      n.css('left', ''.concat(width / 2 - 3, 'px'));
      s.css('top', ''.concat(height - 3, 'px'));
      s.css('left', ''.concat(width / 2 - 3, 'px'));
      w.css('left', '-4px');
      w.css('top', ''.concat(height / 2 - 3, 'px'));
      e.css('left', ''.concat(width - 3, 'px'));
      e.css('top', ''.concat(height / 2 - 3, 'px'));
      mask.css('width', ''.concat(width, 'px'));
      mask.css('height', ''.concat(height, 'px'));
      maskCol.css('width', ''.concat(width + 1, 'px'));
      maskCol.css('height', ''.concat(height, 'px'));
      maskCol.css('top', '-'.concat(top, 'px'));
      maskRow.css('height', ''.concat(height + 1, 'px'));
      maskRow.css('width', ''.concat(width, 'px'));
      maskRow.css('left', '-'.concat(left, 'px'));
      activeBox.css('left', ''.concat(left, 'px'));
      activeBox.css('top', ''.concat(top, 'px'));
      activeBox.css('display', 'block');
      hideTextarea.css('left', ''.concat(this.clickX + 10, 'px'));
      hideTextarea.css('top', ''.concat(this.clickY - 10, 'px'));
    };

    this.showSubEditor = () => {
      this.reRenderSubEditor();
      this.container.css('display', 'table');
      this.activeBox.addClass('editing');
    };

    this.reRenderSubEditor = () => {
      this.editAreaContent = this.container.find(this.section.template.SUB_EDITOR_CONTENT_CLASS);
      this.container.css('width', ''.concat(this.areaWidth - 1, 'px'));
      this.editAreaContent.css('width', ''.concat(this.areaWidth - 2, 'px'));
      this.editAreaContent.css('max-width', ''.concat(this.areaWidth - 2, 'px'));
      this.editAreaContent.css('height', ''.concat(this.areaHeight, 'px'));
      copyCss(this.td, this.editAreaContent);
    };

    this.hideSubEditor = () => {
      const template = this.section.template;
      this.container.html('');
      this.container[0].remove();
      this.container = $(template.SubEditor);
      this.activeBox.append(this.container);
      this.activeBox.removeClass('editing');
    };

    this.hideActiveBox = () => {
      this.activeBox.css('display', 'none');
    };

    this.startDragTriggerToSelectCell = (e) => {
      const template = this.section.template;
      const dragTrigger = $(e.target).closest(template.ACTIVE_TD_TRIGGER_CLASS);
      if (!dragTrigger[0]) return;
      e.preventDefault();
      const direction = dragTrigger.attr('direction');
      this.dragSelecting = true;
      this.tableWrapper.addClass('drag-selecting');
      this.dragDirection = direction;
      this.addDragEvent();
    };

    this.onTdMouseDown = (e) => {
      Keymaster.shift = e.shiftKey;
      const td = $(e.target).closest('td');
      if (!td[0]) return;
      let mode;

      if (Keymaster.shift) {
        mode = 'shift';
      }
      if (e.button === 2) {
        mode = 'contextmenu';
      }
      // active 状态的 mousedown 阻止冒泡，可以避免外部编辑器的一些事件带来的性能开销
      if (this.section.active) {
        e.stopPropagation();
      }
      // 记录下鼠标点击的位置，隐藏的输入框改为 fixed 定位，就定位在这个位置
      // 改为 fixed 是为了增加行列时不滚动页面
      this.clickX = e.clientX;
      this.clickY = e.clientY;
      // 已经选中单元格，第二次点击激活编辑器，可以进行编辑
      const activeClick = this.td === td[0];
      const isEditing = this.section.isEditing(td);
      if (activeClick && !isEditing && !mode) {
        this.emit('active', td);
        return;
      }
      // 当前单元格处于编辑态，再次点击不做任何事

      if (this.section.isEditing(td)) {
        return;
      }
      // 点击非编辑态的单元格，需要阻止默认行为，否则会选中文本，而表格里的选区是自己控制的，非文本流
      e.preventDefault();
      this.selectCell(td[0], mode);
      // 右键不触发拖选
      if (mode === 'contextmenu') return;
      this.delayStartDrag(td);
    };

    this.delayStartDrag = (td) => {
      if (this.dragTimer) {
        clearTimeout(this.dragTimer);
      }
      this.section.container.on('mouseup', this.cancelStartDrag);
      this.dragTimer = setTimeout(() => {
        // mousedown 之后可以拖选
        this.tableWrapper.addClass('drag-selecting');
        this.dragSelecting = true;
        this.dragDirection = 'drag_se';
        this.dragoverTd = td[0];
        this.addDragEvent();
      }, 100);
    };

    this.cancelStartDrag = () => {
      if (this.dragTimer) {
        clearTimeout(this.dragTimer);
        this.section.container.off('mouseup', this.cancelStartDrag);
      }
    };

    this.addDragEvent = () => {
      this.section.tableRoot.addClass('drag-select');
      this.section.tableRoot.addClass(this.dragDirection);
      this.areaMask.addClass(this.dragDirection);
      this.section.container
        .on('mouseup', this.dragEnd)
        .on('mouseleave', this.delayDragEnd)
        .on('mousemove', this.dragToSelectCell);
    };

    this.removeDragEvent = () => {
      this.section.tableRoot.removeClass('drag-select');
      this.section.tableRoot.removeClass(this.dragDirection);
      this.areaMask.removeClass(this.dragDirection);
      this.section.container
        .off('mouseup', this.dragEnd)
        .off('mouseleave', this.delayDragEnd)
        .off('mousemove', this.dragToSelectCell);
    };

    // 鼠标拖动，改变当前选取
    this.dragToSelectCell = (e) => {
      if (!this.dragSelecting) return;
      if (this.timer) clearTimeout(this.timer);
      const dragoverTd = $(e.target).closest('td');
      if (!dragoverTd[0]) return;
      if (!dragoverTd.isRoot()) {
        e.preventDefault();
      }
      if (dragoverTd[0] !== this.dragoverTd) {
        this.selectCell(dragoverTd[0], this.dragDirection);
        this.dragoverTd = dragoverTd[0]
      }
    };

    this.dragEnd = () => {
      this.tableWrapper.removeClass('drag-selecting');
      if (this.dragSelecting) {
        this.dragSelecting = false;
        delete this.base_area;
        delete this.row_base;
        delete this.col_base;
        this.removeDragEvent();
      }
    };

    this.delayDragEnd = () => {
      this.timer = setTimeout(this.dragEnd, 500);
    };

    this.preview = (action) => {
      switch (action) {
        case 'removeCol':
        case 'removeRow':
          this.reRenderActiveBox(action);
          break;

        default:
          this.reRenderActiveBox();
          break;
      }
    };

    this.clear = () => {
      this.area = null;
      this.td = null;
      this.hideActiveBox();
      this.emit('cancelSelect');
    };

    this.normalizeArea = () => {
      if (!this.area) return;
      const {row, col, row2, col2} = this.area;
      const rowMin = Math.min(row, row2);
      const rowMax = Math.max(row, row2);
      const colMin = Math.min(col, col2);
      const colMax = Math.max(col, col2);
      return {
        rowMin,
        rowMax,
        colMin,
        colMax,
      };
    };

    this.getEffectRows = () => {
      if (!this.area) return;
      const {rowMin, rowMax} = this.normalizeArea();
      const table = this.tableModel.table;
      let row_min_min = rowMin;
      let row_max_max = rowMax;
      const trMin = table[rowMin];
      const trMax = table[rowMax];
      trMin.forEach((td) => {
        if (td.isEmpty) {
          const parentRow = td.parent.row;
          const parentCol = td.parent.col;
          row_min_min = Math.min(row_min_min, parentRow);
          row_max_max = Math.max(row_max_max, parentRow + table[parentRow][parentCol].rowSpan - 1);
        }
      });
      trMax.forEach((td) => {
        if (td.isEmpty) {
          const parentRow = td.parent.row;
          const parentCol = td.parent.col;
          row_max_max = Math.max(row_max_max, parentRow + table[parentRow][parentCol].rowSpan - 1);
        }

        if (td.isMulti) {
          row_max_max = Math.max(row_max_max, rowMax + td.rowSpan - 1);
        }
      });
      return {
        row_min: row_min_min,
        row_max: row_max_max,
      };
    };

    this.each = (fn, reverse) => {
      const {area, tableModel} = this;
      const table = tableModel.table;
      if (!area) return;

      const {rowMin, rowMax, colMin, colMax} = this.normalizeArea();
      if (reverse) {
        for (let r = rowMax; r >= rowMin; r--) {
          for (let c = colMax; c >= colMin; c--) {
            const tdModel = table[r][c];
            fn(tdModel, r, c);
          }
        }
      } else {
        for (let _r = rowMin; _r <= rowMax; _r++) {
          for (let _c = colMin; _c <= colMax; _c++) {
            const _tdModel = table[_r][_c];
            fn(_tdModel, _r, _c);
          }
        }
      }
    };

    this.getTdIndex = (row, col) => {
      const {tableModel} = this;
      const table = tableModel.table;
      const trModel = table[row];
      let index = 0;

      for (let i = 0; i < col; i++) {
        if (trModel[i].element) {
          index++;
        }
      }
      return index;
    };

    this.getTdElement = (row, col) => {
      const table = this.tableModel.table;
      const tdModel = table[row][col];

      if (tdModel.element) {
        return tdModel.element;
      }

      if (tdModel.isEmpty) {
        return table[tdModel.parent.row][tdModel.parent.col].element;
      }
    };

    this.getTdRowCol = (td) => {
      const table = this.tableModel.table;
      const tr = td.parentNode;
      const row = tr.rowIndex;
      const trModel = table[row];
      let col = 0;
      trModel.forEach((tdModel, c) => {
        if (tdModel.element === td) {
          col = c;
        }
      });
      return {
        row,
        col,
      };
    };

    this.getSelectionHtml = () => {
      const {area, tableModel, section} = this;
      const table = tableModel.table;
      const tableRoot = section.tableRoot;
      if (!area) return null;
      const {rowMin, rowMax, colMin, colMax} = this.normalizeArea();
      const colsEl = tableRoot.find('col');
      const cols = [];
      let tableWidth = 0;

      for (let c = colMin; c <= colMax; c++) {
        cols.push('<col width="'.concat(colsEl[c].width, '" />'));
        tableWidth += parseInt(colsEl[c].width);
      }

      const colgroup = '<colgroup>'.concat(cols.join(''), '</colgroup>');
      const trHtml = [];

      for (let r = rowMin; r <= rowMax; r++) {
        const tdHtml = [];

        for (let _c2 = colMin; _c2 <= colMax; _c2++) {
          const tdModel = table[r][_c2];
          let rowRemain;
          let colRemain;
          let tdClone;

          if (tdModel.element) {
            tdClone = tdModel.element.cloneNode(true);
          }

          if (tdModel.isMulti) {
            // 合并单元格尾部被选区切断的情况，需要重新计算合并单元格的跨度
            rowRemain = Math.min(r + tdModel.rowSpan - 1, rowMax) - r + 1;
            colRemain = Math.min(_c2 + tdModel.colSpan - 1, colMax) - _c2 + 1;
          }

          if (tdModel.isEmpty) {
            const parentTd = table[tdModel.parent.row][tdModel.parent.col];
            // 选区中含有合并单元格的一部分时，需要补充这一部分的dom结构，这种情况只会出现在行列选择时
            // 列选择时，切断合并单元格后，第一个和父单元格同行，并在选取左测第一个列的位置，补充此单元格
            if (tdModel.parent.row === r && tdModel.parent.col < colMin && _c2 === colMin) {
              const colCut = colMin - tdModel.parent.col;
              colRemain = Math.min(parentTd.colSpan - colCut, colMax - colMin + 1);
              rowRemain = parentTd.rowSpan;
              tdClone = parentTd.element.cloneNode(true);
            }
            // 行选择时，切断合并单元格后，第一个和父单元格同列，并在选取上测第一个行的位置，补充此单元格
            if (tdModel.parent.col === _c2 && tdModel.parent.row < rowMin && r === rowMin) {
              const rowCut = rowMin - tdModel.parent.row;
              rowRemain = Math.min(parentTd.rowSpan - rowCut, rowMax - rowMin + 1);
              colRemain = parentTd.colSpan;
              tdClone = parentTd.element.cloneNode(true);
            }
          }

          if (tdClone) {
            tdClone.setAttribute('rowspan', rowRemain);
            tdClone.setAttribute('colspan', colRemain);
            tdHtml.push(tdClone.outerHTML);
          }
        }
        trHtml.push('<tr>'.concat(tdHtml.join(''), '</tr>'));
      }

      return '<table style="width: '
        .concat(tableWidth, 'px">')
        .concat(colgroup)
        .concat(trHtml.join(''), '</table>');
    };

    this.refreshModel = () => {
      this.tableModel = getTableModel(this.section.tableRoot[0]);
    };

    this.cancelSelect = () => {
      if (this.section.subEngine) {
        this.emit('cancelSelect');
        return;
      }
      this.clear();
    };

    this.onClickMask = (e) => {
      if (e.button === 2) return;
      const {offsetX, offsetY} = e;
      const td = this.getTdByMaskXY(offsetX, offsetY);
      this.selectCell(td);
    };

    // 遮罩层鼠标移动事件
    this.onMouseMoveMask = (e) => {
      if (!this.dragSelecting) return;
      const {offsetX, offsetY} = e;
      const td = this.getTdByMaskXY(offsetX, offsetY);
      if (this.dragoverTd !== td) {
        this.selectCell(td, this.dragDirection);
        this.dragoverTd = td
      }
    };

    this.getTdByMaskXY = (x, y) => {
      const {tableModel} = this;
      const template = this.section.template;
      const {rowMin, colMin} = this.normalizeArea();
      const colBars = this.colsHeader.find(template.COLS_HEADER_ITEM_CLASS);
      const rowBars = this.rowsHeader.find(template.ROWS_HEADER_ITEM_CLASS);

      let row = rowMin;
      let col = colMin;
      let w = colBars[col].offsetWidth;
      let h = rowBars[row].offsetHeight;
      while (w < x) {
        col++;
        w += colBars[col].offsetWidth
      }
      while (h < y) {
        row++;
        h += rowBars[row].offsetHeight
      }
      let td = tableModel.table[row][col];
      if (td.isEmpty) {
        td = tableModel.table[td.parent.row][td.parent.col];
      }
      return td.element;
    };

    this.render = (action) => {
      this.refreshModel();
      const {tableModel, area} = this;
      if (!area) {
        return;
      }
      const {rowMin, colMin} = this.normalizeArea();
      switch (action) {
        case 'removeRow':
          this.selectRow(Math.min(rowMin, tableModel.rows - 1));
          break;
        case 'removeCol':
          this.selectCol(Math.min(colMin, tableModel.cols - 1));
          break;
        default:
          this.renderActiveBox();
      }
    };
    this.section = _section;
  }

  isRowSelected() {
    return this.area && (this.area.total_row || this.area.total_table);
  }

  isColSelected() {
    return this.area && (this.area.total_col || this.area.total_table);
  }

  isTableSelected() {
    return this.area && this.area.total_table;
  }

  bindEvents() {
    this.section.container
      .on('mousedown', this.onTdMouseDown)
      .on('dragstart', (e) => {
        return e.stopPropagation();
      })
      .on('contextmenu', (e) => {
        return e.preventDefault();
      })
      .on('select', (e) => {
        return e.preventDefault();
      });
    this.activeBox.on('mousedown', this.startDragTriggerToSelectCell);
    this.areaMask.on('mousedown', this.onClickMask).on('mousemove', this.onMouseMoveMask);
  }

  init() {
    const {container, template} = this.section;
    this.activeBox = container.find(template.ACTIVE_TD_CLASS);
    this.colsHeader = container.find(template.COLS_HEADER_CLASS);
    this.rowsHeader = container.find(template.ROWS_HEADER_CLASS);
    this.viewport = container.find(template.VIEWPORT);
    this.container = this.activeBox.find(template.SUB_EDITOR_CLASS);
    this.tableWrapper = container.find(template.TABLE_WRAPPER_CLASS);
    this.editAreaContent = this.container.find(this.section.template.SUB_EDITOR_CONTENT_CLASS);
    this.areaMask = this.activeBox.find(template.AREA_MASK);
    this.hideTextarea = this.activeBox.find(template.TABLE_TEXTAREA_CLASS);
    this.refreshModel();
    this.bindEvents();
  }
}

export default Selection;
