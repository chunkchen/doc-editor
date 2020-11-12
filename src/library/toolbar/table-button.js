import React from 'react';
import { Popover } from 'antd';
import 'antd/lib/popover/style';
import Button from './button';
import TableSelector from './table-selector';

export default class extends React.Component {
  handleClick = (event, opts) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onClick(opts);
  };

  onMouseEnter = (event) => {
    event.stopPropagation();
  };

  onMouseLeave = (event) => {
    event.stopPropagation();
  };

  render() {
    return (
      <Popover
        content={(
          <TableSelector onSelect={(event, rows, cols) => {
            this.handleClick(event, {
              rows,
              cols,
            });
          }}
          />
        )}
        placement="bottomLeft"
        arrowPointAtCenter
      >
        <Button
          {...this.props}
          tooltip={false}
          outerVisible
          onClick={(event) => {
            this.handleClick(event);
          }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      </Popover>
    );
  }
}
