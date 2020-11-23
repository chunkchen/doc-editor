import { EventEmitter2 } from 'eventemitter2'
import isArray from 'lodash/isArray'
import isNumber from 'lodash/isNumber'
import Engine from '@hicooper/doc-engine'
import { copyCss, copyHTML, copyTo, getCopyData, getTableModel, normalizeTable, trimBlankSpan } from './utils'

const { HTMLParser, StringUtils, ChangeUtils, ClipboardUtils, TextParser, $ } = Engine

class Command extends EventEmitter2 {
  constructor(section) {
    super(section)

    this.insertColLeft = () => {
      this.insertCol('left')
    }

    this.insertColRight = () => {
      this.insertCol('right')
    }

    this.insertRowUp = () => {
      this.insertRow('up')
    }

    this.insertRowDown = () => {
      this.insertRow('down')
    }

    this.insertColAt = (colIndex, count, isLeft, silence, widths) => {
      const { container, selection, tableRoot, template } = this.section
      const tableModel = selection.tableModel
      const table = tableModel.table
      // 第一行插在前面，其他行插在后面
      isLeft = colIndex === 0 || isLeft
      const colBase = isLeft ? colIndex : colIndex - 1
      const insertMethod = isLeft ? 'after' : 'before'
      const colsHeader = container.find(template.COLS_HEADER_ITEM_CLASS)
      const baseColHeader = colsHeader[colBase]
      const head = container.find(template.COLS_HEADER_CLASS)
      let totalWidth = 0

      if (!widths) {
        widths = baseColHeader.offsetWidth
      }

      if (isArray(widths)) {
        widths.forEach((w) => {
          totalWidth += w
        })
      } else if (isNumber(widths)) {
        totalWidth = count * widths
      }

      head.css('width', `${head[0].offsetWidth + totalWidth}px`)
      const colgroup = tableRoot.find('colgroup')
      const trs = container.find('tr')
      const cols = tableRoot.find('col')
      const cloneNode = cols[colBase].cloneNode()
      const insertCol = colIndex
      let counter = count

      while (counter > 0) {
        // 插入头 和 col
        // const useWidthIndex = isLeft ? count - counter : counter - 1;
        const cloneColHeader = $(baseColHeader.outerHTML)
        // cloneColHeader.css('width', widths[useWidthIndex] + 'px');
        $(baseColHeader)[insertMethod](cloneColHeader)
        const insertCloneCol = cloneNode.cloneNode()
        $(insertCloneCol)
          .attr('width', isArray(widths) ? widths[count - counter] : widths)
        const baseCol = cols[insertCol]
        colgroup[0].insertBefore(insertCloneCol, baseCol)
        counter--
      }

      // 在指定行内的指定位置插入多个 td；并设置 rowSpan
      function insertMultiCell(tr, index, count, tdBase) {
        for (let i = 0; i < count; i++) {
          const td = tr.insertCell(index)
          td.innerHTML = template.EmptyCell
          td.rowSpan = tdBase.rowSpan
          copyCss(tdBase, td)
        }
      }

      // 插入 td
      trs.each((tr, r) => {
        const trModel = table[r]
        const tdModel = trModel[colBase]
        const insertIndex = selection.getTdIndex(r, insertCol)

        if (tdModel.isMulti) {
          if (!isLeft && tdModel.colSpan > 1) {
            tdModel.element.colSpan = tdModel.colSpan + count
          } else {
            insertMultiCell(tr, insertIndex, count, tdModel.element)
          }
          return
        }

        if (tdModel.isEmpty) {
          if (tdModel.parent.col === colBase) return
          const parentTd = table[tdModel.parent.row][tdModel.parent.col]

          if (tdModel.parent.col < insertCol && tdModel.parent.col + parentTd.colSpan - 1 >= insertCol) {
            parentTd.element.colSpan = parentTd.colSpan + count
          } else if (tdModel.parent.row === r) {
            insertMultiCell(tr, insertIndex, count, parentTd.element)
          }
          return
        }
        insertMultiCell(tr, insertIndex, count, tdModel.element)
      })

      this.emit('actioned', 'insertCol', silence)
      // 必须等插入完在选择，否则 tableModel 没更新
      if (selection.area) {
        const newArea = Object.assign(selection.area, {
          col: colIndex,
          col2: colIndex + count - 1,
        })
        selection.selectArea(newArea)
      }
    }

    this.insertCol = function (position) {
      let count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1
      const silence = arguments.length > 2 ? arguments[2] : undefined
      const selection = this.section.selection
      const area = selection.area
      const tableModel = selection.tableModel
      const isLeft = position === 'left'
      const isEnd = position === 'end' || !position

      const colBars = this.section.container.find(this.section.template.COLS_HEADER_ITEM_CLASS)
      let colBase = tableModel.cols - 1

      if (!isEnd) {
        count = selection.isSingleArea() ? 1 : selection.colCount()

        if (area) {
          const { colMin, colMax } = selection.normalizeArea()
          colBase = isLeft ? colMin : colMax
        }
      }

      const insertCol = isLeft ? colBase : colBase + 1
      const width = colBars[colBase].offsetWidth

      this.insertColAt(insertCol, count, isLeft, silence, width)
      if (isEnd) {
        const viewPort = this.section.selection.viewport[0]
        viewPort.scrollLeft = viewPort.scrollWidth - viewPort.offsetWidth
      }
    }

    this.removeCol = (silence) => {
      const { selection, tableRoot, controlBar, template } = this.section
      const area = selection.area
      const tableModel = selection.tableModel
      if (!area) return
      const table = tableModel.table
      const { col, col2 } = area
      const count = selection.colCount()
      const col_min = Math.min(col, col2)
      const col_max = Math.max(col, col2)
      const colgroup = tableRoot.find('colgroup')
      const trs = tableRoot.find('tr')
      const cols = colgroup.find('col')
      const isLastCol = col_max === cols.length - 1
      const isTotalTable = isLastCol && col_min === 0

      if (isTotalTable) {
        this.removeTable()
        return
      }

      for (let c = col_max; c >= col_min; c--) {
        controlBar.removeCol(c)
        cols[c].remove()
      }

      table.forEach((trModel, r) => {
        for (let _c = col_max; _c >= col_min; _c--) {
          const tdModel = trModel[_c]
          if (tdModel.isEmpty) {
            // 删除列如果在单元格内，修正单元格的 colSpan
            const parentTd = table[tdModel.parent.row][tdModel.parent.col]
            if (tdModel.parent.col < col_min) {
              const colRemoved = Math.min(count, tdModel.parent.col + parentTd.colSpan - col_min)
              parentTd.element.colSpan = parentTd.colSpan - colRemoved
            }
          } else {
            if (tdModel.isMulti) {
              // 合并单元格的头部被切掉，要生成尾部单元格补充到行内
              const cutHeader = _c + tdModel.colSpan - 1 > col_max
              const cutCount = col_max + 1 - _c

              if (cutHeader) {
                let insertIndex = 0

                for (let i = 0; i <= col_max; i++) {
                  if (!trModel[i].isEmpty) {
                    insertIndex++
                  }
                }

                const td = trs[r].insertCell(insertIndex)
                td.innerHTML = template.EmptyCell
                td.colSpan = tdModel.colSpan - cutCount
                td.rowSpan = tdModel.rowSpan
                copyCss(tdModel.element, td)
              }
            }
            tdModel.element.remove()
          }
        }
      })
      this.emit('actioned', 'removeCol', silence)
    }

    this.insertRowAt = function (rowIndex) {
      const count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1
      let isUp = arguments.length > 2 ? arguments[2] : undefined
      const silence = arguments.length > 3 ? arguments[3] : undefined
      const { container, selection, tableRoot, template } = this.section
      const tableModel = selection.tableModel
      const table = tableModel.table
      isUp = rowIndex === 0 || isUp
      const insertMethod = isUp ? 'after' : 'before'
      const baseRow = isUp ? rowIndex : rowIndex - 1
      const rowBars = container.find(template.ROWS_HEADER_ITEM_CLASS)
      const baseRowBar = rowBars[baseRow]
      const insertRow = isUp ? baseRow : baseRow + 1
      const trModel = table[baseRow]
      const insertTdProps = []

      trModel.forEach((tdModel, c) => {
        if (tdModel.isMulti) {
          if (!isUp && tdModel.rowSpan > 1) {
            tdModel.element.rowSpan = tdModel.rowSpan + count
          } else {
            insertTdProps.push({
              tdBase: tdModel.element,
            })
          }
          return
        }

        if (tdModel.isEmpty) {
          const parentTd = table[tdModel.parent.row][tdModel.parent.col]
          if (tdModel.parent.row < insertRow && tdModel.parent.row + parentTd.rowSpan - 1 >= insertRow) {
            parentTd.element.rowSpan = parentTd.rowSpan + count
          } else if (tdModel.parent.row < baseRow && tdModel.parent.col === c) {
            insertTdProps.push({
              tdBase: parentTd.element,
            })
          }
          return
        }
        insertTdProps.push({
          tdBase: tdModel.element,
        })
      })
      let _count = count

      const _loop = () => {
        // 复制相同的行
        const tr = tableRoot[0].insertRow(insertRow)
        insertTdProps.forEach((props) => {
          const td = tr.insertCell()
          td.innerHTML = template.EmptyCell
          td.colSpan = props.tdBase.colSpan
          copyCss(props.tdBase, td)
        })
        $(baseRowBar)[insertMethod]($(baseRowBar.outerHTML))
        _count--
      }

      while (_count > 0) {
        _loop()
      }

      this.emit('actioned', 'insertRow', silence)
      // 必须等插入完在选择，否则 tableModel 没更新
      if (selection.area) {
        const newArea = Object.assign(selection.area, {
          row: rowIndex,
          row2: rowIndex + count - 1,
        })
        selection.selectArea(newArea)
      }
      this.section.onTableSizeChange()
    }

    this.insertRow = (position) => {
      let count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1
      const silence = arguments.length > 2 ? arguments[2] : undefined
      const selection = this.section.selection
      const { area, tableModel } = selection
      const isUp = position === 'up'
      const isEnd = position === 'end' || !position
      let baseRow = tableModel.rows - 1

      if (!isEnd) {
        count = selection.isSingleArea() ? 1 : selection.rowCount()

        if (area) {
          const { row, row2 } = area
          baseRow = isUp ? Math.min(row, row2) : Math.max(row, row2)
        }
      }
      const insertRow = isUp ? baseRow : baseRow + 1
      this.insertRowAt(insertRow, count, isUp, silence)
    }

    this.removeRow = (silence) => {
      const { selection, tableRoot, controlBar, template } = this.section
      const { area, tableModel } = selection
      if (!area) return
      const table = tableModel.table
      const { row, row2 } = area
      const count = selection.rowCount()
      const row_min = Math.min(row, row2)
      const row_max = Math.max(row, row2)
      const trs = tableRoot.find('tr')
      const isLastRow = row_max === tableModel.rows - 1
      const isTotalTable = isLastRow && row_min === 0

      if (isTotalTable) {
        this.removeTable()
        return
      }
      // 修正 rowSpan 和 补充单元格
      const _loop = function _loop(r) {
        const trModel = table[r]
        trModel.forEach((tdModel, c) => {
          if (tdModel.isMulti && tdModel.rowSpan > 1) {
            // 合并单元格头部被切掉，需要补充 td
            if (r + tdModel.rowSpan - 1 > row_max) {
              const insertIndex = selection.getTdIndex(row_max + 1, c)
              const td = trs[row_max + 1].insertCell(insertIndex)
              const cutCount = row_max - r + 1
              td.innerHTML = template.EmptyCell
              td.colSpan = tdModel.colSpan
              td.rowSpan = tdModel.rowSpan - cutCount
            }
          }

          if (tdModel.isEmpty) {
            const parentTd = table[tdModel.parent.row][tdModel.parent.col] // 合并单元格尾部或中部被切掉，修正 rowSpan
            if (tdModel.parent.row < row_min) {
              const _cutCount = Math.min(count, tdModel.parent.row + parentTd.rowSpan - row_min)
              parentTd.element.rowSpan = parentTd.rowSpan - _cutCount
            }
          }
        })
      }

      for (let r = row_min; r <= row_max; r++) {
        _loop(r)
      }

      for (let r = row_max; r >= row_min; r--) {
        tableRoot[0].deleteRow(r)
        controlBar.removeRow(r)
      }
      this.emit('actioned', 'removeRow', silence)
      this.section.onTableSizeChange()
    }

    this.mergeCell = (silence) => {
      const selection = this.section.selection
      const area = selection.area
      if (!area) return

      this.splitCell()
      const { row, col, row2, col2 } = area
      const row_min = Math.min(row, row2)
      const col_min = Math.min(col, col2)
      const row_count = selection.rowCount()
      const col_count = selection.colCount()
      const content = []
      let mergeTd
      selection.each((tdModel, r, c) => {
        if (c === col_min && r === row_min) {
          mergeTd = tdModel.element
          mergeTd.rowSpan = row_count
          mergeTd.colSpan = col_count
          return
        }

        if (tdModel.element) {
          // 空单元格里面也有 html，只有在有实际内容时才会在合并的时候将内容合并
          if (tdModel.element.innerText.trim() !== '') {
            content.unshift(tdModel.element.innerHTML)
          }

          tdModel.element.remove()
        }
      })
      mergeTd.innerHTML += content.join('')
      this.emit('actioned', 'mergeCell', silence)
    }

    this.splitCell = (silence) => {
      const { selection, tableRoot, template } = this.section
      const area = selection.area
      const tableModel = selection.tableModel
      if (!area) return
      const table = tableModel.table
      const trs = tableRoot.find('tr')

      const { rowMin, rowMax, colMin, colMax } = selection.normalizeArea()
      // 注意这里用倒序，见 selection.each 方法的最后一个参数传的时 true
      // 因为是倒序，所有空位一定先转换为 td, 这样在补齐切断的单元格时，需要考虑插入时的偏移量

      selection.each((tdModel, r, c) => {
        if (tdModel.isMulti) {
          tdModel.element.colSpan = 1
          tdModel.element.rowSpan = 1 // 切左上角

          if (r + tdModel.rowSpan - 1 > rowMax) {
            const insertRow = rowMax + 1
            const insertIndex = selection.getTdIndex(insertRow, c)
            const td = trs[insertRow].insertCell(insertIndex)
            td.rowSpan = r + tdModel.rowSpan - 1 - rowMax
            td.colSpan = tdModel.colSpan
            copyCss(tdModel.element, td)
            td.innerHTML = template.EmptyCell
          }
          // 切头
          if (c + tdModel.colSpan - 1 > colMax) {
            const _insertRow = r

            const _insertCol = colMax + 1

            const _insertIndex = selection.getTdIndex(_insertRow, _insertCol) // 之前的空位都会变成td，这里要补齐偏移量
            const emptyCount = colMax - c
            const _td = trs[_insertRow].insertCell(_insertIndex + emptyCount)
            _td.rowSpan = Math.min(tdModel.rowSpan, rowMax - r + 1)
            _td.colSpan = c + tdModel.colSpan - 1 - colMax
            copyCss(tdModel.element, _td)
            _td.innerHTML = template.EmptyCell
          }
        }

        if (tdModel.isEmpty) {
          const pRow = tdModel.parent.row
          const pCol = tdModel.parent.col
          const parentTd = table[pRow][pCol]
          const pRow2 = pRow + parentTd.rowSpan - 1
          const pCol2 = pCol + parentTd.colSpan - 1 // 如果选区切断了合并单元格，那么需要补齐被切断的部分
          // 会有以下切断方式：
          // 切左边，切左下角，切上边，切右上角
          // 其中要考虑选区是否贯穿单元格的情况
          // 切左边

          if (pRow < rowMin) {
            const cross = colMax >= pCol2
            parentTd.element.rowSpan = rowMin - pRow
            parentTd.element.colSpan = cross ? parentTd.colSpan : colMax - pCol + 1 // 为了防止重复补充单元格，只在遍历到选区的右上角的位置进行补充单元格，
            // 未贯穿
            if (!cross && c === colMax && r === rowMin) {
              const cutCol = colMax + 1
              const cutRow = pRow
              const _insertIndex3 = selection.getTdIndex(cutRow, cutCol)
              const _td3 = trs[cutRow].insertCell(_insertIndex3)
              _td3.rowSpan = parentTd.rowSpan
              _td3.colSpan = pCol2 - colMax
              copyCss(parentTd.element, _td3)
              _td3.innerHTML = template.EmptyCell
            }
            // 切左边非左下角，下方需要补合并单元格的左下缺口
            if (pRow2 > rowMax && c === Math.min(pCol2, colMax) && r === rowMin) {
              const _insertRow2 = rowMax + 1
              const _insertIndex4 = selection.getTdIndex(_insertRow2, pCol)
              const _td4 = trs[_insertRow2].insertCell(_insertIndex4)
              _td4.rowSpan = pRow2 - rowMax
              _td4.colSpan = cross ? parentTd.colSpan : colMax - pCol + 1
              copyCss(parentTd.element, _td4)
              _td4.innerHTML = template.EmptyCell
            }
          }
          // 切上边
          if (pCol < colMin) {
            const _cross = rowMax >= pRow2
            parentTd.element.colSpan = colMin - pCol
            parentTd.element.rowSpan = _cross ? parentTd.rowSpan : rowMax - pRow + 1 // 为了防止重复补充单元格，只在遍历到选区的左下角的位置进行补充单元格，
            // 非贯穿
            if (!_cross && r === rowMax && c === colMin) {
              const _cutRow = rowMax + 1
              const _insertIndex5 = selection.getTdIndex(_cutRow, pCol)
              const _td5 = trs[_cutRow].insertCell(_insertIndex5)
              _td5.colSpan = parentTd.colSpan
              _td5.rowSpan = pRow2 - rowMax
              copyCss(parentTd.element, _td5)
              _td5.innerHTML = template.EmptyCell
            } // 非右上角，需要在选区右边再补一个合并单元格的右上缺口

            if (pCol2 > colMax && r === Math.min(pRow2, rowMax) && c === colMax) {
              const _insertRow3 = pRow
              const _insertCol3 = colMax + 1
              const _insertIndex6 = selection.getTdIndex(_insertRow3, _insertCol3)
              const _td6 = trs[_insertRow3].insertCell(_insertIndex6)
              _td6.colSpan = pCol2 - colMax
              _td6.rowSpan = _cross ? parentTd.rowSpan : rowMax - pRow + 1
              copyCss(parentTd.element, _td6)
              _td6.innerHTML = template.EmptyCell
            }
          }
          const _insertIndex2 = selection.getTdIndex(r, c)
          const _td2 = trs[r].insertCell(_insertIndex2)
          _td2.innerHTML = template.EmptyCell
        }
      }, true)
      this.emit('actioned', 'splitCell', silence)
    }

    this.changed = () => {
      this.tableCleared = false
    }

    this.clear = () => {
      const { selection, subEngine, template } = this.section
      const area = selection.area
      if (!area || subEngine) return

      if (area.total_table) {
        if (this.tableCleared) {
          this.removeTable()
          this.tableCleared = false
          return
        }
        this.tableCleared = true
      }

      if (area.total_row) {
        if (this.rowCleared) {
          this.removeRow()
          this.rowCleared = false
          return
        }
        this.rowCleared = true
      }

      if (area.total_col) {
        if (this.colCleared) {
          this.removeCol()
          this.colCleared = false
          return
        }
        this.colCleared = true
      }

      selection.each((tdModel) => {
        if (tdModel.element) {
          tdModel.element.innerHTML = template.EmptyCell
        }
      })
      this.emit('actioned', 'clear')
    }

    this.clearFormat = () => {
      const selection = this.section.selection
      const area = selection.area
      if (!area) return
      selection.each((tdModel) => {
        if (tdModel.element) {
          tdModel.element.removeAttribute('style')
        }
      })
      this.emit('actioned', 'clearFormat')
    }

    this.hasCopyData = () => {
      return getCopyData()
    }

    this.mockPaste = (silence) => {
      const data = getCopyData()
      if (!data) return
      this.paste(data, silence)
    }

    this.shortcutPaste = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const data = ClipboardUtils.getClipboardData(e)
      this.paste(data)
    }

    this.paste = (data, silence) => {
      const selection = this.section.selection
      const area = selection.area
      const tableModel = selection.tableModel
      if (!area) return

      const { rowMin, colMin, rowMax, colMax } = selection.normalizeArea()
      const isSingleTd = rowMin === rowMax && colMin === colMax
      const isSingleArea = selection.isSingleArea()
      const html = data.html
      const text = data.text
      const pasteHTML = new HTMLParser(html, this.section.engine.schema, this.section.engine.conversion).toValue()
      const element = trimBlankSpan($(pasteHTML))

      if (element.name === 'table') {
        normalizeTable(element[0])
        const pasteTableModel = getTableModel(element[0])
        const rowCount = pasteTableModel.rows
        const colCount = pasteTableModel.cols
        const { rowSpan, colSpan } = pasteTableModel.table[0][0]
        const isPasteSingle = rowSpan === rowCount && colSpan === colCount

        if (isPasteSingle && isSingleArea) {
          copyTo(pasteTableModel.table[0][0].element, tableModel.table[rowMin][colMin].element)
          this.emit('actioned', 'paste', silence)
          return
        } // 只在选中一个非合并单元格的时候才会延伸平铺，遇到表格边界会自动增加行列
        // 若选中的是一个区域或合并单元格，则只要将区域中的单元格填充上数据即可

        if (isSingleTd) {
          if (colCount + colMin > tableModel.cols) {
            const insertColCount = colCount + colMin - tableModel.cols
            this.insertCol('end', insertColCount, true)
          }

          if (rowCount + rowMin > tableModel.rows) {
            const insertRowCount = rowCount + rowMin - tableModel.rows
            this.insertRow('end', insertRowCount, true)
          }
          // 选中和将要粘贴表格等大的区域
          selection.selectArea({
            row: rowMin,
            col: colMin,
            row2: rowMin + rowCount - 1,
            col2: colMin + colCount - 1,
          })
        }

        const newArea = selection.area
        const row_min_new = Math.min(newArea.row, newArea.row2)
        const row_max_new = Math.max(newArea.row, newArea.row2)
        const col_min_new = Math.min(newArea.col, newArea.col2)
        const col_max_new = Math.max(newArea.col, newArea.col2)
        // 先拆分单元格，拷贝的表格中可能有合并单元格，需要重新复制合并单元格情况
        this.splitCell(true)
        selection.each((tdModel, r, c) => {
          const paste_r = (r - row_min_new) % rowCount
          const paste_c = (c - col_min_new) % colCount
          const paste_td = pasteTableModel.table[paste_r][paste_c]

          if (!paste_td) {
            return
          }

          if (paste_td.isMulti) {
            tdModel.element.rowSpan = Math.min(paste_td.rowSpan, row_max_new - r + 1)
            tdModel.element.colSpan = Math.min(paste_td.colSpan, col_max_new - c + 1)
            copyTo(paste_td.element, tdModel.element)
            return
          }

          if (paste_td.isEmpty) {
            tdModel.element.remove()
            return
          }

          if (paste_td.element) {
            copyTo(paste_td.element, tdModel.element)
          }
        })
      } else {
        this.mergeCell(true)
        const $td = $(tableModel.table[rowMin][colMin].element)
        this.section.createEditor($td, html || new TextParser(text).toHTML())
      }
      this.emit('actioned', 'paste', silence)
    }

    this.copy = () => {
      const areaHtml = this.section.selection.getSelectionHtml()
      if (!areaHtml) return
      ClipboardUtils.copyNode(areaHtml)
      copyHTML(areaHtml)
    }

    this.mockCopy = () => {
      const areaHtml = this.section.selection.getSelectionHtml()
      if (!areaHtml) return
      copyHTML(areaHtml)
    }

    this.shortcutCopy = (e) => {
      const areaHtml = this.section.selection.getSelectionHtml()
      if (!areaHtml) return
      e.clipboardData.clearData()
      e.clipboardData.setData('text/plain', $(areaHtml)[0].innerText)
      e.clipboardData.setData('text/html', areaHtml)
      copyHTML(areaHtml)
      e.preventDefault()
    }

    this.cut = () => {
      this.copy()
      this.clear()
    }

    this.shortcutCut = (e) => {
      this.shortcutCopy(e)
      this.clear()
    }

    this.removeTable = () => {
      this.emit('tableRemoved')
      this.section.engine.change.removeSection(this.section.sectionRoot)
    }

    this.alignLeft = () => {
      this.align('left')
    }

    this.alignCenter = () => {
      this.align('center')
    }

    this.alignRight = () => {
      this.align('right')
    }

    this.align = (direction) => {
      const selection = this.section.selection
      if (!selection.area) return
      selection.each((tdModel) => {
        if (tdModel.element) {
          $(tdModel.element)
            .css('text-align', direction)
        }
      })
      this.emit('actioned', 'align')
    }

    this.valign = (direction) => {
      const selection = this.section.selection
      if (!selection.area) return
      selection.each((tdModel) => {
        if (tdModel.element) {
          $(tdModel.element)
            .css('vertical-align', direction)
        }
      })
      this.emit('actioned', 'align')
    }

    // 边框
    this.border = (type) => {
      const selection = this.section.selection
      if (!selection.area) return
      if (type === 'top') {
        // first row => row
        const firstRow = selection.area.row
        selection.each((tdModel, row) => {
          if (tdModel.element && row === firstRow) {
            $(tdModel.element)
              .removeClass('lake-no-border')
            if (this.checkHasBorderAttr(tdModel, ['border-top', 'border'])) {
              $(tdModel.element)
                .removeAttr('border-top')
              $(tdModel.element)
                .css('border-top', '')
              $(tdModel.element)
                .removeAttr('border')
            } else {
              $(tdModel.element)
                .attr('border-top', true)
              $(tdModel.element)
                .css('border-top', '2px solid #222222')
            }
          }
        })
      }
      if (type === 'bottom') {
        // last row => row2
        const lastRow = selection.area.row2
        selection.each((tdModel, row) => {
          if (tdModel.element && row === lastRow) {
            $(tdModel.element)
              .removeClass('lake-no-border')
            if (this.checkHasBorderAttr(tdModel, ['border-bottom', 'border'])) {
              $(tdModel.element)
                .removeAttr('border-bottom')
              $(tdModel.element)
                .removeAttr('border')
              $(tdModel.element)
                .css('border-bottom', '')
            } else {
              $(tdModel.element)
                .attr('border-bottom', true)
              $(tdModel.element)
                .css('border-bottom', '2px solid #222222')
            }
          }
        })
      }
      if (type === 'left') {
        // first col => col
        const firstCol = selection.area.col
        selection.each((tdModel, row, col) => {
          if (tdModel.element && col === firstCol) {
            $(tdModel.element)
              .removeClass('lake-no-border')
            if (this.checkHasBorderAttr(tdModel, ['border-left', 'border'])) {
              $(tdModel.element)
                .removeAttr('border-left')
              $(tdModel.element)
                .removeAttr('border')
              $(tdModel.element)
                .css('border-left', '')
            } else {
              $(tdModel.element)
                .attr('border-left', true)
              $(tdModel.element)
                .css('border-left', '2px solid #222222')
            }
          }
        })
      }
      if (type === 'right') {
        // last col => col2
        const lastCol = selection.area.col2
        selection.each((tdModel, row, col) => {
          if (tdModel.element && (tdModel.colSpan + col - 1) === lastCol) {
            $(tdModel.element)
              .removeClass('lake-no-border')
            if (this.checkHasBorderAttr(tdModel, ['border-right', 'border'])) {
              $(tdModel.element)
                .removeAttr('border-right')
              $(tdModel.element)
                .removeAttr('border')
              $(tdModel.element)
                .css('border-right', '')
            } else {
              $(tdModel.element)
                .attr('border-right', true)
              $(tdModel.element)
                .css('border-right', '2px solid #222222')
            }
          }
        })
      }
      if (type === 'outBorder') {
        const { row, col, row2, col2 } = selection.area
        if (selection.single) {
          // 单个单元格
          $(selection.td)
            .removeClass('lake-no-border')
          $(selection.td)
            .attr('border', true)
          $(selection.td)
            .css('border', '2px solid #222222')
        } else {
          selection.each((tdModel, r, c) => {
            if (tdModel.element) {
              if (r === row) {
                $(tdModel.element)
                  .css('border-top', '2px solid #222222')
              }
              if (c === col) {
                $(tdModel.element)
                  .css('border-left', '2px solid #222222')
              }
              if (r === row2) {
                $(tdModel.element)
                  .css('border-bottom', '2px solid #222222')
              }
              if (c + tdModel.colSpan - 1 === col2) {
                $(tdModel.element)
                  .css('border-right', '2px solid #222222')
              }
            }
          })
        }
      }
      if (type === 'allBorder') {
        selection.each((tdModel) => {
          if (tdModel.element) {
            $(tdModel.element)
              .removeClass('lake-no-border')
            if (this.checkHasBorderAttr(tdModel, ['border'])) {
              $(tdModel.element)
                .removeAttr('border')
              $(tdModel.element)
                .css('border', '')
            } else {
              this.removeAnyBorderAttr(tdModel)
              $(tdModel.element)
                .attr('border', true)
              $(tdModel.element)
                .css('border', '2px solid #222222')
            }
          }
        })
      }
      // 重置默认边框
      if (type === 'reset') {
        selection.each((tdModel) => {
          if (tdModel.element) {
            this.removeAnyBorderAttr(tdModel)
            $(tdModel.element)
              .removeClass('lake-no-border')
            $(tdModel.element)
              .removeAttr('style')
          }
        })
      }
      this.emit('actioned', 'border')
    }

    this.removeAnyBorderAttr = (tdModel) => {
      ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'].forEach((item) => {
        if ($(tdModel.element)[0] && $(tdModel.element)[0].attributes[item]) {
          $(tdModel.element)
            .css(item, '')
          $(tdModel.element)
            .removeAttr(item)
        }
      })
    }

    this.checkHasBorderAttr = (tdModel, keys) => {
      if (!$(tdModel.element)[0] || !$(tdModel.element)[0].attributes.length) {
        return false
      }
      return keys.some((key) => {
        return $(tdModel.element)[0].attributes[key] && $(tdModel.element)[0].attributes[key].value === 'true'
      })
    }

    this.background = (rgb) => {
      const selection = this.section.selection
      if (!selection.area) return
      selection.each((tdModel) => {
        if (tdModel.element) {
          $(tdModel.element)
            .css('background-color', rgb || '#f0f0f0')
        }
      })
      this.emit('actioned', 'background')
    }

    this.fontcolor = (rgb) => {
      const selection = this.section.selection
      if (!selection.area) return
      selection.each((tdModel) => {
        if (tdModel.element) {
          $(tdModel.element)
            .css('color', rgb || '#666')
        }
      })
      this.emit('actioned', 'fontcolor')
    }

    this.queryState = (status) => {
      const { selection, engine, subEngine } = this.section
      if (subEngine) {
        return subEngine.command.queryState(status)
      }

      if (!selection.area) return false
      const selectHtml = selection.getSelectionHtml()
      const hasContent = $(selectHtml)[0].innerText.trim() !== ''
      let findContent = false
      let result
      selection.each((tdModel) => {
        if (tdModel.element && hasContent && !findContent && tdModel.element.innerText.trim() !== '') {
          $(tdModel.element)
            .attr('contenteditable', true)
          const range = engine.change.getRange()
          range.selectNodeContents(tdModel.element)
          engine.change.select(range)
          engine.change.marks = ChangeUtils.getActiveMarks(range)
          result = engine.command.queryState(status)
          findContent = true
          $(tdModel.element)
            .removeAttr('contenteditable')
        }
      })
      return result
    }

    this.fill = (table) => {
      const selection = this.section.selection
      const pasteTableModel = getTableModel(table[0])
      const { rowMin, colMin } = selection.normalizeArea()

      selection.each((tdModel, r, c) => {
        const paste_r = r - rowMin
        const paste_c = c - colMin
        const paste_td = pasteTableModel.table[paste_r][paste_c]

        if (!paste_td || !tdModel.element) {
          return
        }
        if (tdModel.element) {
          tdModel.element.innerHTML = paste_td.element.innerHTML
        }
      })
    }

    this.execute = function () {
      let _engine$command
      const { selection, sectionRoot, engine, subEngine, state } = this.section
      if (state.readonly) return
      if (subEngine) {
        let _subEngine$command;
        (_subEngine$command = subEngine.command).execute.apply(_subEngine$command, arguments)

        return
      }

      const area = selection.area
      if (!area) return
      // 暂停历史，否则执行 command.execute 时会执行 save 很耗时，放到最后执行
      engine.history.stop()
      let selectHtml = selection.getSelectionHtml()
      // 单元格内可能有Section
      selectHtml = new HTMLParser(selectHtml, engine.schema, engine.conversion).toValue()
      selectHtml = StringUtils.transformCustomTags(selectHtml)
      const tableShadow = $(selectHtml)
      sectionRoot.append(tableShadow)
      tableShadow.attr('contenteditable', true)
      tableShadow.addClass('tmp-table')
      const range = engine.change.getRange()
      range.selectNodeContents(tableShadow[0])
      engine.change.select(range);
      (_engine$command = engine.command).execute.apply(_engine$command, arguments)
      tableShadow.removeAttr('contenteditable')
      this.fill(tableShadow)
      tableShadow.remove()
      engine.history.start()
      this.emit('actioned', 'fontstyle')
    }

    this.section = section
  }
}

export default Command
