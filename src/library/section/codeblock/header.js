import React from 'react';
import { Select } from 'antd';
import 'antd/lib/select/style';
import classNames from 'classnames';
import modeConfig from './mode-config';

const Option = Select.Option;

class Header extends React.PureComponent {
  state = {
    open: false,
  };

  onDropdownVisibleChange = (open) => {
    this.setState({
      open,
    });
  };

  handlerFilter = (input, option) => {
    input = input.toLowerCase();
    const key = option.key || '';
    let name = option.name || '';
    name = name.toLowerCase();
    return key.includes(input) || name.includes(input);
  };

  render() {
    return (
      <Select
        className={classNames('lake-codeblock-header-select', {
          'lake-codeblock-header-select-open': this.state.open,
        })}
        dropdownClassName="lake-codeblock-header-dropdown"
        showSearch
        size="small"
        style={{
          minWidth: 128,
        }}
        defaultValue={this.props.defaultValue}
        getPopupContainer={this.props.getPopupContainer}
        onSelect={this.props.onSelect}
        filterOption={this.handlerFilter}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
      >
        {modeConfig.map((item) => {
          return (
            <Option name={item.name} value={item.value} key={item.value}>
              {item.name}
            </Option>
          );
        })}
      </Select>
    );
  }
}

export default Header;
