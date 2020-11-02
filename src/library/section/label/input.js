import React from 'react';
import {Input} from 'antd';
import 'antd/lib/input/style';
import Engine from '@hicooper/doc-engine/lib';
import ColorPicker from '../../toolbar/color-picker';

class InputLabel extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeColors: [props.colors[props.sectionValue.colorIndex]],
    };
  }

  change(e) {
    this.props.onChange(Object.assign({}, this.props.sectionValue, {}, e));
  }

  render() {
    const {colors, sectionValue: {label}, onFocus, onBlur, onPressEnter} = this.props;
    const {activeColors} = this.state;

    return (
      <div>
        <Input
          defaultValue={label}
          onChange={(event) => {
            this.change({
              label: Engine.StringUtils.escape(event.target.value.trim()),
            });
          }}
          draggable={false}
          onDragStart={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
            event.target.focus();
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          onPressEnter={onPressEnter}
        />
        <ColorPicker
          activeColors={activeColors}
          setStroke
          onSelect={(color) => {
            this.change({
              colorIndex: colors.indexOf(color),
            });
            this.setState({
              activeColors: [color],
            });
          }}
          colors={[colors]}
        />
      </div>
    );
  }
}

export default InputLabel;
