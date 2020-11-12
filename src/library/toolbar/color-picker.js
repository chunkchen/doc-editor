import React from 'react';
import tinycolor from 'tinycolor2';
import classnames from 'classnames';
import Palette from '../utils/palette';

class ColorPickerItem extends React.Component {
  constructor() {
    super();
    this.toState = (data, oldHue) => {
      const color = data.hex ? tinycolor(data.hex) : tinycolor(data);
      const hsl = color.toHsl();
      const hsv = color.toHsv();
      const rgb = color.toRgb();
      const hex = color.toHex();

      if (hsl.s === 0) {
        hsl.h = oldHue || 0;
        hsv.h = oldHue || 0;
      }

      const transparent = hex === '000000' && rgb.a === 0;
      return {
        hsl,
        hex: transparent ? 'transparent' : '#'.concat(hex),
        rgb,
        hsv,
        oldHue: data.h || oldHue || hsl.h,
        source: data.source,
      };
    };

    this.getContrastingColor = (data) => {
      if (!data) {
        return '#fff';
      }
      const col = this.toState(data);
      if (col.hex === 'transparent') {
        return 'rgba(0,0,0,0.4)';
      }

      const yiq = (col.rgb.r * 299 + col.rgb.g * 587 + col.rgb.b * 114) / 1000;
      return yiq >= 210 ? '#8C8C8C' : '#FFFFFF';
    };

    this.onSelect = (color, event) => {
      event.preventDefault();
      event.stopPropagation();
      this.props.onSelect && this.props.onSelect(color);
    };
  }

  render() {
    const { color, activeColors, defaultColor, setStroke } = this.props;
    const needborder = ['#FFFFFF', '#FAFAFA'].indexOf(color) >= 0;
    const active = activeColors.indexOf(color) >= 0;
    const special = color === defaultColor;
    const styls = {
      check: {
        fill: this.getContrastingColor(color),
        display: active ? 'block' : 'none',
      },
      block: {
        backgroundColor: ''.concat(color),
      },
    };
    if (setStroke) {
      styls.block.border = '1px solid '.concat(Palette.getStroke(color));
    }
    return (
      <span
        className={classnames('lake-colorboard-group-item', {
          'lake-colorboard-group-item-border': needborder,
          'lake-colorboard-group-item-active': active,
          'lake-colorboard-group-item-special': special,
        })}
        onClick={this.onSelect.bind(this, color)}
      >
        <span style={styls.block}>
          <svg style={styls.check} viewBox="0 0 18 18">
            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
          </svg>
        </span>
      </span>
    );
  }
}

class ColorPickerGroup extends React.Component {
  render() {
    const data = this.props.data === void 0 ? [] : this.props.data;
    const { activeColors, defaultColor, onSelect, setStroke } = this.props;

    return (
      <span className="lake-colorboard-group">
        {
          data.map((c) => {
            return (
              <ColorPickerItem
                color={c}
                key={c}
                activeColors={activeColors}
                defaultColor={defaultColor}
                onSelect={onSelect}
                setStroke={setStroke}
              />
            );
          })
        }
      </span>
    );
  }
}

class ColorPicker extends React.Component {
  render() {
    const { activeColors, defaultColor, onSelect, setStroke } = this.props;
    let { colors } = this.props;
    if (!colors) colors = Palette.getColors();
    return (
      <div className="lake-colorboard">
        {
          colors.map((data, index) => {
            return (
              <ColorPickerGroup
                data={data}
                key={index}
                activeColors={activeColors}
                defaultColor={defaultColor}
                onSelect={onSelect}
                setStroke={setStroke}
              />
            );
          })
        }
      </div>
    );
  }
}

export default ColorPicker;
