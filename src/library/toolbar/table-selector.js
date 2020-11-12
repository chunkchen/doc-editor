import React from 'react';
import classnames from 'classnames';

class TableSelector extends React.Component {
  state = {
    maxRows: 10,
    maxCols: 10,
    minRows: 4,
    minCols: 4,
    currentCols: 4,
    currentRows: 4,
    selectedCols: 0,
    selectedRows: 0,
  };

  onSelect = (e, rows, cols) => {
    this.props.onSelect(e, rows + 1, cols + 1);
  };

  onHover = (rows, cols) => {
    const showRows = Math.max(this.state.minRows, Math.min(this.state.maxRows, rows + 2));
    const showCols = Math.max(this.state.minCols, Math.min(this.state.maxCols, cols + 2));

    this.setState({
      currentRows: showRows,
      currentCols: showCols,
      selectedRows: rows + 1,
      selectedCols: cols + 1,
    });
  };

  renderTr = (r, cols) => {
    const { selectedRows, selectedCols } = this.state;
    const tds = [];
    const _loop = (c) => {
      const cls = classnames({
        'lake-toolbar-table-selector-td': true,
        actived: r < selectedRows && c < selectedCols,
      });
      tds.push(<div
          className={cls}
          key={c}
          onMouseDown={(e) => {
            return this.onSelect(e, r, c);
          }}
          onMouseOver={() => {
            return this.onHover(r, c);
          }}
        />,
      );
    };

    for (let c = 0; c < cols; c++) {
      _loop(c);
    }
    return tds;
  };

  renderTable = (rows, cols) => {
    const trs = [];
    for (let r = 0; r < rows; r++) {
      trs.push(<div className="lake-toolbar-table-selector-tr" key={r}>{this.renderTr(r, cols)}</div>);
    }
    return trs;
  };

  render() {
    const { currentCols, currentRows } = this.state;
    const selectedRows = this.state.selectedRows === undefined ? 0 : this.state.selectedRows;
    const selectedCols = this.state.selectedCols === undefined ? 0 : this.state.selectedCols;
    return (
      <div className="lake-toolbar-table-selector" data-lake-element="table-selector">
        {this.renderTable(currentRows, currentCols)}
        <div className="lake-toolbar-table-selector-info">
          {selectedRows}
          " x "
          {selectedCols}
        </div>

      </div>
    );
  }
}

export default TableSelector;
