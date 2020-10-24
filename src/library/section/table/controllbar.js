import { EventEmitter2 } from 'eventemitter2';
import 'antd/lib/input-number/style';
import Engine from 'doc-engine/lib';
import { fixDragEvent } from './utils';

const { $ } = Engine;

class ControllBar extends EventEmitter2 {
  constructor(section) {
    super(section);

    this.render = (action) => {
      let needRenderCol = true;
      let needRenderRow = true;
      let opts;

      switch (action) {
        case 'insertRow':
        case 'removeRow':
          needRenderCol = false;
          break;
        case 'clearFormat':
        case 'align':
        case 'fontcolor':
        case 'background':
          needRenderRow = false;
          needRenderCol = false;
          break;
        case 'input':
        case 'select':
        case 'paste':
          needRenderCol = false;
          opts = this.section.selection.getEffectRows();
          break;
        default:
          break;
      }
      if (needRenderRow) {
        this.renderRowBars(opts);
      }
      if (needRenderCol) {
        this.renderColBars();
      }
    };

    this.renderColBars = () => {
      const { tableRoot, selection, template } = this.section;
      const tableModel = selection.tableModel;
      const table = tableModel.table;
      const colBars = this.colsHeader.find(template.COLS_HEADER_ITEM_CLASS);
      const cols = tableRoot.find('col');
      let isNew = true;
      const tableWidth = tableRoot[0].offsetWidth;
      tableRoot.css('width', ''.concat(tableWidth, 'px'));
      this.colsHeader.css('width', ''.concat(tableWidth, 'px'));
      const colWidthArray = {};
      let allColWidth = 0;
      let colIndex = 0;
      cols.each((col, i) => {
        const colWidth = $(col).attr('width');
        if (colWidth) {
          colWidthArray[i] = colWidth;
          allColWidth += parseInt(colWidth);
          isNew = false;
        } else {
          colIndex++;
        }
      });

      if (isNew) {
        const tdWidth = [];
        table.forEach((trModel) => {
          trModel.forEach((tdModel, c) => {
            if (!tdWidth[c] && !tdModel.isEmpty && !tdModel.isMulti && tdModel.element) {
              tdWidth[c] = tdModel.element.offsetWidth;
            }
          });
        });
        // 合并单元格的存在，可能出现某些列全部属于合并单元格，导致无法通过 td 的 offsetWidth 直接获得，需要把剩余zhi
        let unkownCount = 0;
        let knownWidth = 0;
        for (let c = 0; c < cols.length; c++) {
          if (!tdWidth[c]) {
            unkownCount++;
          } else {
            knownWidth += tdWidth[c];
          }
        }
        let averageWidth = 0;
        if (unkownCount > 0) {
          averageWidth = Math.round((tableWidth - knownWidth) / unkownCount);
        }
        for (let _c = 0; _c < cols.length; _c++) {
          const width = tdWidth[_c] || averageWidth;
          $(colBars[_c]).css('width', `${width}px`);
          $(cols[_c]).attr('width', width);
        }
      } else if (colIndex) {
        const averageWidth = Math.round((tableWidth - allColWidth) / colIndex);
        cols.each((col, index) => {
          const width = undefined === colWidthArray[index] ? averageWidth : colWidthArray[index];
          $(colBars[index]).css('width', `${width}px`);
          $(col).attr('width', width);
        });
      } else {
        cols.each((col, index) => {
          const width = Math.round(tableWidth * colWidthArray[index] / allColWidth);
          $(colBars[index]).css('width', `${width}px`);
          $(col).attr('width', width);
        });
      }
      this.width = tableWidth;
    };

    this.renderRowBars = (opts) => {
      const { tableRoot, template } = this.section;
      const trs = tableRoot[0].rows;
      const rowBars = this.rowsHeader.find(template.ROWS_HEADER_ITEM_CLASS);

      let start = 0;
      let end = trs.length - 1;
      if (opts) {
        start = opts.row_min;
        end = opts.row_max;
      }
      for (let renderIndex = start; renderIndex <= end; renderIndex++) {
        $(rowBars[renderIndex]).css('height', `${trs[renderIndex].offsetHeight}px`);
      }
      this.height = tableRoot[0].offsetHeight;
    };

    // 拖动列
    this.onDragCol = (e) => {
      e.stopPropagation();
      if (!this.colDragging) return;
      if (undefined === this.rowDraggingPosiX) {
        this.rowDraggingPosiX = e.offsetX;
      }
      // dragover会不断的触发事件，这里做一个截流，鼠标在3像素以内不去计算
      if (Math.abs(this.rowDraggingPosiX - e.offsetX) < 3) return;
      this.rowDraggingPosiX = e.offsetX;
      this.dragBar.removeClass('dragging');
      const td = $(e.target).closest('td');
      const colBar = $(e.target).closest(this.section.template.COLS_HEADER_ITEM_CLASS);
      if (!td[0] && !colBar[0]) return;

      if (colBar[0]) {
        const currentCol = colBar.index();
        const _dropCol = e.offsetX > colBar[0].offsetWidth / 2 ? currentCol + 1 : currentCol;
        this.showPlaceHolder(_dropCol);
        return;
      }
      const colBars = this.colsHeader.find(this.section.template.COLS_HEADER_ITEM_CLASS);
      const colSpan = td[0].colSpan;
      const { col } = this.section.selection.getTdRowCol(td[0]);
      let dropCol = col;
      let _passWidth = 0;

      for (let i = 0; i < colSpan; i++) {
        if (_passWidth + colBars[col + i].offsetWidth / 2 > e.offsetX) {
          dropCol = col + i;
          break;
        }
        if (_passWidth + colBars[col + i].offsetWidth > e.offsetX) {
          dropCol = col + i + 1;
          break;
        }
        _passWidth += colBars[col + i].offsetWidth;
      }
      this.showPlaceHolder(dropCol);
    };

    // 正在拖动行 dragging
    this.onDragRow = (e) => {
      e.stopPropagation();
      if (!this.rowDragging) return;
      if (undefined === this.rowDraggingPosiY) {
        this.rowDraggingPosiY = e.offsetY;
      }
      // dragover会不断的触发事件，这里做一个截流，鼠标在3像素以内不去计算
      if (Math.abs(this.rowDraggingPosiY - e.offsetY) < 3) return;
      this.rowDraggingPosiY = e.offsetY;
      this.dragBar.removeClass('dragging');
      const td = $(e.target).closest('td');
      const rowBar = $(e.target).closest(this.section.template.ROWS_HEADER_ITEM_CLASS);
      if (!td[0] && !rowBar[0]) return;

      if (rowBar[0]) {
        const currentRow = rowBar.index();
        const _dropRow = e.offsetY > rowBar[0].offsetHeight / 2 ? currentRow + 1 : currentRow;
        this.showPlaceHolder(_dropRow);
        return;
      }
      const rowBars = this.rowsHeader.find(this.section.template.ROWS_HEADER_ITEM_CLASS);
      const rowSpan = td[0].rowSpan;
      const { row } = this.section.selection.getTdRowCol(td[0]);
      let dropRow = row;
      let _passHeight = 0;

      for (let i = 0; i < rowSpan; i++) {
        if (_passHeight + rowBars[row + i].offsetHeight / 2 > e.offsetY) {
          dropRow = row + i;
          break;
        }
        if (_passHeight + rowBars[row + i].offsetHeight > e.offsetY) {
          dropRow = row + i + 1;
          break;
        }
        _passHeight += rowBars[row + i].offsetHeight;
      }
      this.showPlaceHolder(dropRow);
    };

    // 显示即将 放置的位置
    this.showPlaceHolder = (dropIndex) => {
      if (this.colDragging) {
        if (dropIndex === this.dropCol) return;
        if (this.colDraggingIndex.colMin <= dropIndex && dropIndex <= this.colDraggingIndex.colMax + 1) {
          delete this.dropCol;
          this.placeholder.css('display', 'none');
          return;
        }

        this.dropCol = dropIndex;
        const colBars = this.colsHeader.find(this.section.template.COLS_HEADER_ITEM_CLASS);
        const left = this.dropCol !== colBars.length ? colBars[this.dropCol].offsetLeft + 2 : colBars[this.dropCol - 1].offsetLeft + colBars[this.dropCol - 1].offsetWidth + 2;
        const { scrollLeft, offsetWidth } = this.viewport[0];
        if (left < scrollLeft) {
          this.viewport[0].scrollLeft = left - 5;
        }
        if (left > scrollLeft + offsetWidth) {
          this.viewport[0].scrollLeft = left - offsetWidth + 5;
        }
        this.placeholder.css('width', '3px');
        this.placeholder.css('height', `${this.height + (this.section.options.type === 'mini' && !this.section.state.maximize ? 0 : 24)}px`);
        this.placeholder.css('left', `${left}px`);
        this.placeholder.css('top', `${0}px`);
        this.placeholder.css('display', 'block');
      }

      if (this.rowDragging) {
        if (dropIndex === this.dropRow) return;
        if (this.rowDraggingIndex.rowMin <= dropIndex && dropIndex <= this.rowDraggingIndex.rowMax + 1) {
          delete this.dropRow;
          this.placeholder.css('display', 'none');
          return;
        }
        this.dropRow = dropIndex;
        const rowBars = this.rowsHeader.find(this.section.template.ROWS_HEADER_ITEM_CLASS);
        const top = this.dropRow !== rowBars.length ? rowBars[this.dropRow].offsetTop + 2 : rowBars[this.dropRow - 1].offsetTop + rowBars[this.dropRow - 1].offsetHeight + 2;
        this.placeholder.css('height', '3px');
        this.placeholder.css('width', `${this.width}px`);
        this.placeholder.css('left', '3px');
        this.placeholder.css('top', `${top}px`);
        this.placeholder.css('display', 'block');
      }
    };

    // 拖动列-事件结束
    this.onDragColEnd = () => {
      this.unBindDragColEvent();
      if (!this.colDragging || this.dropCol === undefined) return;
      const { command, selection } = this.section;
      const { colMin, colMax } = selection.normalizeArea();
      const colBars = this.section.container.find(this.section.template.COLS_HEADER_ITEM_CLASS);
      const widths = [];
      for (let c = colMin; c <= colMax; c++) {
        widths.push(colBars[c].offsetWidth);
      }
      const dragCount = selection.colCount();
      command.mockCopy();
      if (colMin > this.dropCol) {
        command.insertColAt(this.dropCol, dragCount, false, true, widths);
        selection.selectCols(this.dropCol, this.dropCol + dragCount - 1);
        command.mockPaste(true);
        selection.selectCols(colMin + dragCount, colMax + dragCount);
        command.removeCol();
        selection.selectCols(this.dropCol, this.dropCol + dragCount - 1);
      } else {
        command.insertColAt(this.dropCol, dragCount, false, true, widths);
        selection.selectCols(this.dropCol, this.dropCol + dragCount - 1);
        command.mockPaste(true);
        selection.selectCols(colMin, colMax);
        command.removeCol();
        selection.selectCols(this.dropCol - dragCount, this.dropCol - 1);
      }
      this.placeholder.css('display', 'none');
      this.colDragging = false;
      delete this.dropCol;
    };

    // 拖动行-事件结束
    this.onDragRowEnd = () => {
      this.unBindDragRowEvent();
      if (!this.rowDragging || this.dropRow === undefined) return;
      const { command, selection } = this.section;
      const { rowMin, rowMax } = selection.normalizeArea();
      command.mockCopy();
      if (rowMin > this.dropRow) {
        command.insertRowAt(this.dropRow, this.dragCount, false, true);
        selection.selectRows(this.dropRow, this.dropRow + this.dragCount - 1);
        command.mockPaste(true);
        selection.selectRows(rowMin + this.dragCount, rowMax + this.dragCount);
        command.removeRow();
        selection.selectRows(this.dropRow, this.dropRow + this.dragCount - 1);
      } else {
        command.insertRowAt(this.dropRow, this.dragCount, false, true);
        selection.selectRows(this.dropRow, this.dropRow + this.dragCount - 1);
        command.mockPaste(true);
        selection.selectRows(rowMin, rowMax);
        command.removeRow();
        selection.selectRows(this.dropRow - this.dragCount, this.dropRow - 1);
      }
      this.placeholder.css('display', 'none');
      this.rowDragging = false;
      delete this.dropRow;
    };

    this.unBindDragColEvent = () => {
      const colBars = this.colsHeader.find(this.section.template.COLS_HEADER_ITEM_CLASS);
      colBars.removeClass('dragging');
      this.colsHeader.removeClass('dragging');
      this.section.container.off('dragover', this.onDragCol);
      this.section.container.off('drop', this.onDragColEnd);
      this.section.container.off('dragend', this.onDragColEnd);
    };

    this.unBindDragRowEvent = () => {
      const rowBars = this.rowsHeader.find(this.section.template.ROWS_HEADER_ITEM_CLASS);
      rowBars.removeClass('dragging');
      this.rowsHeader.removeClass('dragging');
      this.section.container.off('dragover', this.onDragRow);
      this.section.container.off('drop', this.onDragRowEnd);
      this.section.container.off('dragend', this.onDragRowEnd);
    };

    this.bindDragColEvent = () => {
      this.section.container.on('dragover', this.onDragCol);
      this.section.container.on('drop', this.onDragColEnd);
      this.section.container.on('dragend', this.onDragColEnd);
    };

    this.bindDragRowEvent = () => {
      this.section.container.on('dragover', this.onDragRow);
      this.section.container.on('drop', this.onDragRowEnd);
      this.section.container.on('dragend', this.onDragRowEnd);
    };

    this.onDragStartColsHeader = (e) => {
      e.stopPropagation();
      const area = this.section.selection.area;
      if (!area || !area.total_col) return;
      const colBar = $(e.target).closest(this.section.template.COLS_HEADER_ITEM_CLASS);
      if (!colBar[0]) return;
      const dragCol = colBar.index();
      const { colMin, colMax } = this.section.selection.normalizeArea();
      if (dragCol < colMin || dragCol > colMax) return;
      this.colDragging = true;
      this.dragBar = colBar;
      this.colDraggingIndex = {
        colMin,
        colMax,
      };
      this.dragCount = this.section.selection.colCount();
      this.dragBar.addClass('dragging');
      this.dragBar.find('.drag-info').html('\u6B63\u5728\u79FB\u52A8 '.concat(this.dragCount, ' \u5217'));
      this.colsHeader.addClass('dragging');
      fixDragEvent(e);
      this.bindDragColEvent();
    };

    this.onDragStartRowsHeader = (e) => {
      e.stopPropagation();
      const area = this.section.selection.area;
      if (!area || !area.total_row) return;
      const rowBar = $(e.target).closest(this.section.template.ROWS_HEADER_ITEM_CLASS);
      if (!rowBar[0]) return;
      const dragRow = rowBar.index();

      const { rowMin, rowMax } = this.section.selection.normalizeArea();
      if (dragRow < rowMin || dragRow > rowMax) return;
      this.rowDragging = true;
      this.dragBar = rowBar;
      this.rowDraggingIndex = {
        rowMin,
        rowMax,
      };
      this.dragCount = this.section.selection.rowCount();
      this.dragBar.addClass('dragging');
      this.dragBar.find('.drag-info').html('\u6B63\u5728\u79FB\u52A8 '.concat(this.dragCount, ' \u884C'));
      this.rowsHeader.addClass('dragging');
      fixDragEvent(e);
      this.bindDragRowEvent();
    };

    this.onMouseDownColsHeader = (e) => {
      const { template, selection } = this.section;
      this.trigger = $(e.target).closest(template.COLS_HEADER_TRIGGER_CLASS);
      if (!this.trigger[0]) {
        if (e.button === 2) {
          const colHeader = $(e.target).closest(template.COLS_HEADER_ITEM_CLASS);
          if (!colHeader[0]) return;
          const col = colHeader.index();
          let currentColSelected = false;
          if (selection.area && selection.area.total_col) {
            const { colMin, colMax } = selection.normalizeArea();
            if (col >= colMin && col <= colMax) {
              currentColSelected = true;
            }
          }

          if (!currentColSelected) {
            this.emit('clickColsHeader', col);
          }
          this.showContextMenu(e);
        }
        return;
      }
      this.startChangeCol(this.trigger, e);
    };

    this.startChangeCol = (trigger, e) => {
      e.stopPropagation();
      e.preventDefault();
      this.emit('startChangeCellSize');
      this.dragging = 'col';
      this.draggingX = e.clientX;
      this.currentCol = $(trigger[0].parentNode);
      this.currentColWidth = this.currentCol[0].offsetWidth;
      this.width = this.colsHeader[0].offsetWidth;
      this.currentColIndex = this.currentCol.index();
      this.bindChangeSizeEvent();
    };

    this.onMouseDownRowsHeader = (e) => {
      const { template, selection } = this.section;
      this.trigger = $(e.target).closest(template.ROWS_HEADER_TRIGGER_CLASS);
      if (!this.trigger[0]) {
        if (e.button === 2) {
          const rowHeader = $(e.target).closest(template.ROWS_HEADER_ITEM_CLASS);
          if (!rowHeader[0]) return;
          const row = rowHeader.index();
          let currentRowSelected = false;
          if (selection.area && selection.area.total_row) {
            const { rowMin, rowMax } = selection.normalizeArea();
            if (row >= rowMin && row <= rowMax) {
              currentRowSelected = true;
            }
          }

          if (!currentRowSelected) {
            this.emit('clickRowsHeader', row);
          }
          this.showContextMenu(e);
        }
        return;
      }
      this.startChangeRow(this.trigger, e);
    };

    this.startChangeRow = (trigger, e) => {
      e.stopPropagation();
      e.preventDefault();
      this.emit('startChangeCellSize');
      this.dragging = 'row';
      this.draggingY = e.clientY;
      this.currentRow = $(trigger[0].parentNode);
      this.currentRowHeight = this.currentRow[0].offsetHeight;
      this.currentRowIndex = this.currentRow.index();
      this.bindChangeSizeEvent();
    };

    this.onChangeSize = (e) => {
      if (!this.dragging) return;
      if (this.dragging === 'row') {
        this.onChangeRowHeight(e);
      } else if (this.dragging === 'col') {
        this.onChangeColWidth(e);
      }
    };

    this.onChangeColWidth = (e) => {
      let dx = e.clientX - this.draggingX;
      const itemWidth = Math.max(this.MIN_WIDTH, this.currentColWidth + dx);
      dx = itemWidth - this.currentColWidth;
      const tableWidth = this.width + dx;
      this.currentCol.css('width', `${itemWidth}px`);
      this.colsHeader.css('width', `${tableWidth}px`);
      const viewport = this.viewport[0];
      // 拖到边界时，需要滚动表格视窗的滚动条
      const currentColRightSide = this.currentCol[0].offsetLeft + this.currentCol[0].offsetWidth;
      if (currentColRightSide - viewport.scrollLeft + 20 > viewport.offsetWidth) {
        // 拖宽单元格时，若右侧已经到边，需要滚动左侧的滚动条
        viewport.scrollLeft = currentColRightSide + 20 - viewport.offsetWidth;
      } else if (viewport.scrollLeft + viewport.offsetWidth === viewport.scrollWidth) {
        // 拖窄单元格时，若右侧已经到边，需要滚动左侧的滚动条
        viewport.scrollLeft = Math.max(0, tableWidth + 34 - viewport.offsetWidth);
      }
      this.clearActiveStatus();
      this.hideContextMenu();
      this.renderRowBars();
      this.renderColSplitBars();
      this.changeColWidth(itemWidth, tableWidth);
    };

    this.onChangeRowHeight = (e) => {
      let dy = e.clientY - this.draggingY;
      const itemHeight = Math.max(this.MIN_HEIGHT, this.currentRowHeight + dy);
      dy = itemHeight - this.currentRowHeight;
      this.currentRow.css('height', `${itemHeight}px`);
      this.clearActiveStatus();
      this.hideContextMenu();
      this.renderRowSplitBars();
      this.changeRowHeight(itemHeight);
      this.emit('heightchanging');
    };

    this.changeColWidth = (colWidth, tableWidth) => {
      const tableRoot = this.section.tableRoot;
      const cols = tableRoot.find('col');
      tableRoot.css('width', `${tableWidth}px`);
      $(cols[this.currentColIndex]).attr('width', colWidth);
    };

    this.changeRowHeight = (rowHeight) => {
      const tableRoot = this.section.tableRoot;
      const trs = tableRoot.find('tr');
      $(trs[this.currentRowIndex]).css('height', `${rowHeight}px`);
    };

    this.renderColSplitBars = () => {
      this.trigger.addClass('dragging').css('height', `${this.height + (this.section.options.type === 'mini' && !this.section.state.maximize ? 0 : 24)}px`);
    };

    this.renderRowSplitBars = () => {
      const width = Math.min(this.viewport[0].offsetWidth, this.width);
      this.trigger.addClass('dragging').css('width', `${width + (this.section.options.type === 'mini' && !this.section.state.maximize ? 0 : 24)}px`);
    };

    this.onChangeSizeEnd = (e) => {
      if (e.type === 'mouseleave' && this.section.container.contains(e.toElement)) {
        return;
      }

      if (this.dragging) {
        if (this.section.options.type === 'mini' && !this.section.state.maximize) {
          const triggerCols = this.section.container.find(this.section.template.COLS_HEADER_TRIGGER_CLASS);
          const triggerRows = this.section.container.find(this.section.template.ROWS_HEADER_TRIGGER_CLASS);
          triggerCols.css('height', `${this.section.tableRoot[0].offsetHeight}px`);
          const tableWidth = this.section.tableRoot[0].offsetWidth;
          const wrapperWidth = this.section.tableWrapper[0].offsetWidth;
          triggerRows.css('width', `${tableWidth > wrapperWidth ? wrapperWidth : tableWidth}px`);
        }
        this.trigger.removeClass('dragging');
        if (this.dragging === 'col' && this.section.options.type !== 'mini') {
          this.trigger.css('height', '17px');
        }

        if (this.dragging === 'row' && this.section.options.type !== 'mini') {
          this.trigger.css('width', '17px');
        }
        this.dragging = null;
        // 拖完再渲染一次，行高会受内容限制，无法拖到你想要的高度
        this.renderRowBars();
        this.unBindChangeSizeEvent();
        this.width = this.section.tableRoot[0].offsetWidth;
        this.height = this.section.tableRoot[0].offsetHeight;
        this.emit('sizeChanged');
      }
    };

    this.hide = () => {
      this.tableWrapper.removeClass('editing');
      this.hideContextMenu();
    };

    this.show = () => {
      this.tableWrapper.addClass('editing');
    };

    this.clearActiveStatus = () => {
      const template = this.section.template;
      const colBars = this.colsHeader.find(template.COLS_HEADER_ITEM_CLASS);
      const rowBars = this.rowsHeader.find(template.ROWS_HEADER_ITEM_CLASS);
      colBars.removeClass('active');
      colBars.removeClass('selected');
      colBars.removeClass('no-dragger');
      colBars.removeClass('multi-selected');
      rowBars.removeClass('active');
      rowBars.removeClass('selected');
      rowBars.removeClass('no-dragger');
      rowBars.removeClass('multi-selected');
      this.tableHeader.removeClass('selected');
    };

    this.activeHeader = () => {
      const { selection, template } = this.section;
      const { area, tableModel } = selection;
      this.clearActiveStatus();
      if (!area) return;
      const colBars = this.colsHeader.find(template.COLS_HEADER_ITEM_CLASS);
      const rowBars = this.rowsHeader.find(template.ROWS_HEADER_ITEM_CLASS);
      const { total_col, total_row, total_table } = area;
      const { rowMin, rowMax, colMin, colMax } = selection.normalizeArea();
      for (let r = rowMin; r <= rowMax; r++) {
        $(rowBars[r]).addClass('active');
        if (total_row || total_table) {
          $(rowBars[r]).addClass('selected');
        }
        if (total_row && (rowMin !== rowMax)) {
          $(rowBars[r]).addClass('multi-selected');
        }
        if (total_table) {
          $(rowBars[r]).addClass('no-dragger');
          $(rowBars[r]).addClass('multi-selected');
        }
      }
      for (let c = colMin; c <= colMax; c++) {
        $(colBars[c]).addClass('active');
        if (total_col || total_table) {
          $(colBars[c]).addClass('selected');
        }
        if (total_col && (colMin !== colMax)) {
          $(colBars[c]).addClass('multi-selected');
        }
        if (total_table) {
          $(colBars[c]).addClass('no-dragger');
          $(colBars[c]).addClass('multi-selected');
        }
      }
      const table_select = rowMin === 0 && rowMax === tableModel.rows - 1 && colMin === 0 && colMax === tableModel.cols - 1;
      if (table_select) {
        this.tableHeader.addClass('selected');
      } else {
        this.tableHeader.removeClass('selected');
      }
    };

    this.removeRow = (index) => {
      const template = this.section.template;
      const rowsHeaderItem = this.rowsHeader.find(template.ROWS_HEADER_ITEM_CLASS);
      this.rowsHeader[0].removeChild(rowsHeaderItem[index]);
    };

    this.removeCol = (index) => {
      const template = this.section.template;
      const colsHeaderItem = this.colsHeader.find(template.COLS_HEADER_ITEM_CLASS);
      this.colsHeader.css('width', `${this.colsHeader[0].offsetWidth - colsHeaderItem[index].offsetWidth}px`);
      this.colsHeader[0].removeChild(colsHeaderItem[index]);
      this.section.tableRoot.css('width', this.colsHeader.css('width'));
    };

    this.clickRowsHeader = (e) => {
      const template = this.section.template;
      const trigger = $(e.target).closest(template.ROWS_HEADER_TRIGGER_CLASS);
      if (trigger[0]) return;
      const rowHeader = $(e.target).closest(template.ROWS_HEADER_ITEM_CLASS);
      if (!rowHeader[0]) return;
      this.emit('clickRowsHeader', rowHeader.index());
    };

    this.clickColsHeader = (e) => {
      const template = this.section.template;
      const trigger = $(e.target).closest(template.COLS_HEADER_TRIGGER_CLASS);
      if (trigger[0]) return;
      const colHeader = $(e.target).closest(template.COLS_HEADER_ITEM_CLASS);
      if (!colHeader[0]) return;
      this.emit('clickColsHeader', colHeader.index());
    };

    this.clickTableHeader = () => {
      this.emit('clickTableHeader');
    };

    this.handleClickContainer = (e) => {
      const td = $(e.target).closest('td');
      if (!td[0]) {
        const mask = $(e.target).closest('.mask');
        if (!mask[0]) {
          return;
        }
      }
      if (e.button === 2) {
        e.preventDefault();
        this.showContextMenu(e);
      } else {
        this.hideContextMenu();
      }
    };

    this.handleHoverMenu = (e) => {
      const menu = $(e.target).closest('.table-menubar-item');
      if (!menu[0]) return;
      e.stopPropagation();
      if (!menu.hasClass('disabled')) {
        const action = menu.attr('data-action');
        this.section.selection.preview(action);
      }
    };

    this.handleLeaveMenu = (e) => {
      e.stopPropagation();
      this.section.selection.preview();
    };

    this.handleClickMenu = (e) => {
      const menu = $(e.target).closest('.table-menubar-item');
      if (!menu[0]) return;
      e.stopPropagation();
      if (!menu.hasClass('disabled')) {
        const action = menu.attr('data-action');
        this.section.command[action]();
      }
      this.hideContextMenu();
    };

    this.hideContextMenu = () => {
      if (!this.contextVisible) {
        return;
      }
      this.contextVisible = false;
      this.menuBar.css('display', 'none');
    };

    this.getMenuDisabled = (action) => {
      switch (action) {
        case 'splitCell':
          return !this.section.selection.hasMergeCell();
        case 'mergeCell':
          return this.section.selection.isSingleArea();
        case 'mockPaste':
          return !this.section.command.hasCopyData();
        case 'removeCol':
        case 'insertColLeft':
        case 'insertColRight':
          return this.section.selection.isRowSelected();
        case 'removeRow':
        case 'insertRowUp':
        case 'insertRowDown':
          return this.section.selection.isColSelected();
        default:
          return false;
      }
    };

    this.showContextMenu = (e) => {
      const area = this.section.selection.area;
      const currentTd = $(e.target).closest('td')[0];
      if (!currentTd && !area) return;

      const menuItems = this.menuBar.find(this.section.template.MENUBAR_ITEM_CLASS);
      const y = Math.min(Math.max(120, document.body.offsetHeight - 500), e.clientY);
      menuItems.removeClass('disabled');
      menuItems.each((menu) => {
        const action = $(menu).attr('data-action');
        if (this.getMenuDisabled(action)) {
          $(menu).addClass('disabled');
        }
      });
      this.menuBar.css('left', `${e.clientX + 30}px`);
      this.menuBar.css('top', `${y}px`);
      this.menuBar.css('display', 'block');
      this.contextVisible = true;
    };

    this.focusTextArea = () => {
      if (this.focusTimer) {
        clearTimeout(this.focusTimer);
      }
      this.focusTimer = setTimeout(() => {
        // 先失焦再聚焦，保证能真的 focus,否则可能出现多次聚焦失效的情况
        this.textArea[0].value = '';
        this.textArea[0].blur();
        this.textArea[0].focus();
      }, 100);
    };

    this.filterEvent = (e) => {
      const template = this.section.template;
      const tagName = (e.target || e.srcElement).tagName.toLocaleUpperCase();
      const target = $(e.target).closest(template.TABLE_TEXTAREA_CLASS);
      return !!target[0] || !(tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA');
    };

    this.bindChangeSizeEvent = () => {
      this.colsHeader.addClass('resize');
      this.rowsHeader.addClass('resize');
      document.addEventListener('mousemove', this.onChangeSize);
      document.addEventListener('mouseup', this.onChangeSizeEnd);
      document.addEventListener('mouseleave', this.onChangeSizeEnd);
    };

    this.unBindChangeSizeEvent = () => {
      this.colsHeader.removeClass('resize');
      this.rowsHeader.removeClass('resize');
      document.removeEventListener('mousemove', this.onChangeSize);
      document.removeEventListener('mouseup', this.onChangeSizeEnd);
      document.removeEventListener('mouseleave', this.onChangeSizeEnd);
    };

    this.onMultiChangeRowCol = (value, type) => {
      const { rows, cols } = this.section.selection.tableModel;
      if (type === 'row') {
        value = Math.max(this.contentRow + 1, value);
        if (value > rows) {
          this.section.command.insertRow('end', value - rows);
        } else if (value < rows) {
          this.section.selection.selectRows(value, rows - 1);
          this.section.command.removeRow();
        }
      }
      if (type === 'col') {
        value = Math.max(this.contentCol + 1, value);
        if (value > cols) {
          this.section.command.insertCol('end', value - cols);
        } else if (value < cols) {
          this.section.selection.selectCols(value, cols - 1);
          this.section.command.removeCol();
        }
      }
      this.section.selection.clear();
    };

    this.refresh = (action) => {
      this.hideContextMenu();
      this.render(action);
      this.show();
      this.activeHeader();
      this.focusTextArea();
    };

    this.bindEvents = () => {
      this.colsHeader.on('mousedown', this.onMouseDownColsHeader).on('click', this.clickColsHeader).on('dragstart', this.onDragStartColsHeader);
      this.rowsHeader.on('mousedown', this.onMouseDownRowsHeader).on('click', this.clickRowsHeader).on('dragstart', this.onDragStartRowsHeader);
      this.tableHeader.on('click', this.clickTableHeader);
      // this.rowsAddition.on('click', () => {
      //   this.section.command.insertRow();
      // });
      // this.colsAddition.on('click', () => {
      //   this.section.command.insertCol();
      // });
      this.section.container.on('mousedown', this.handleClickContainer);
      this.section.container.on('dragover', (e) => {
        return e.stopPropagation();
      });
      this.menuBar.on('click', this.handleClickMenu);
      this.menuBar.on('mouseover', this.handleHoverMenu);
      this.menuBar.on('mouseleave', this.handleLeaveMenu);
      this.textArea.on('paste', this.section.command.shortcutPaste);
      this.textArea.on('copy', this.section.command.shortcutCopy);
      this.textArea.on('cut', this.section.command.shortcutCut);
    };

    this.section = section;
    this.dragging = false;
    this.draggingX = 0;
    this.draggingY = 0;
    this.width = 0;
    this.height = 0;
    this.MIN_WIDTH = 40;
    this.MIN_HEIGHT = 33;
    this.currentCol = null;
    this.currentColWidth = 0;
    this.currentColIndex = 0;
    this.currentRow = null;
    this.currentRowHeight = 0;
    this.currentRowIndex = 0;
  }

  init() {
    const { container, template } = this.section;
    this.tableHeader = container.find(template.HEADER_CLASS);
    this.colsHeader = container.find(template.COLS_HEADER_CLASS);
    this.rowsHeader = container.find(template.ROWS_HEADER_CLASS);
    this.menuBar = container.find(template.MENUBAR_CLASS);
    this.textArea = container.find(template.TABLE_TEXTAREA_CLASS);
    this.viewport = container.find(template.VIEWPORT);
    this.placeholder = container.find(template.PLACEHOLDER_CLASS);
    this.tableWrapper = container.find(template.TABLE_WRAPPER_CLASS);
    this.render();
    this.hide();
    this.bindEvents();
  }
}

export default ControllBar;
