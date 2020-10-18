import React from 'react';
import classnames from 'classnames';
import Palette from '../utils/palette';
import Button from './button';
import ColorPicker from './color-picker';

class ColorButton extends React.Component {
  constructor(props) {
    super(props);
    this.toggleDropdown = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (this.state.active) {
        this.hideDropdown();
      } else {
        this.showDropdown();
      }
    };

    this.showDropdown = () => {
      document.addEventListener('click', this.hideDropdown);
      this.setState({
        active: true,
      });
    };

    this.hideDropdown = () => {
      document.removeEventListener('click', this.hideDropdown);
      this.setState({
        active: false,
      });
    };

    this.handleClick = () => {
      this.props.onClick(this.state.currentColor);
    };

    this.handleSelect = (color) => {
      this.setState({
        currentColor: color,
      });

      this.props.onClick(color);
    };

    this.getIcon = (name) => {
      if (name === 'fontcolor') {
        return this.fontColorIcon();
      }
      if (name === 'backcolor') {
        return this.backgroundColorIcon();
      }
      if (name === 'highlight') {
        return this.textHighlightIcon();
      }
      return null;
    };

    this.state = {
      currentColor: props.currentColor,
      active: false,
    };
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown);
  }

  textHighlightIcon = () => {
    // 默认描边 & 填充
    let stroke = '#FFD666';
    let fill = '#FFFBE6';

    if (this.state.disabled) {
      fill = '#BFBFBF';
      stroke = '#BFBFBF';
    }

    const currentColor = this.state.currentColor;

    if (currentColor) {
      fill = currentColor;
      stroke = Palette.getStroke(currentColor);
    }

    return (
      <svg
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
        version="1.1"
      >
        <title>highlight</title>
        <desc>Created with Sketch.</desc>
        <g
          id="highlight"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <rect
            id="Rectangle-55"
            stroke={stroke}
            strokeWidth="0.5"
            fill={fill}
            x="2"
            y="12.75"
            width="12"
            height="1.5"
            rx="0.125"
          />
        </g>
        <g
          id="Group-2"
          transform="translate(2.781250, 1.375000)"
          fillRule="nonzero"
        >
          <path
            id="Combined-Shape"
            fill="#595959"
            d="M2.86079849,6.64817222 L2.05713835,5.84451208 C2.00832281,5.79569655 2.00832281,5.71655092 2.05713835,5.66773539 L3.61029491,4.11457882 L3.11963835,3.62392225 C3.07082281,3.57510672 3.07082281,3.49596109 3.11963835,3.44714556 L6.47839556,0.0883883476 C6.52721109,0.0395728112 6.60635672,0.0395728112 6.65517225,0.0883883476 L11.5165314,4.94974747 C11.5653469,4.998563 11.5653469,5.07770863 11.5165314,5.12652416 L8.15777416,8.48528137 C8.10895863,8.53409691 8.029813,8.53409691 7.98099747,8.48528137 L7.38889678,7.89318068 L5.83574021,9.44633725 C5.78692467,9.49515278 5.70777905,9.49515278 5.65896351,9.44633725 L5.0267407,8.81411444 L4.48856529,9.35326519 C4.39477378,9.44720966 4.26747335,9.5 4.13472392,9.5 L0.608857988,9.5 C0.470786801,9.5 0.358857988,9.38807119 0.358857988,9.25 C0.358857988,9.18363253 0.385247413,9.11998865 0.432210608,9.07309408 L2.86079849,6.64817222 Z M6.56678391,1.67937861 L4.71062861,3.53553391 L8.06938582,6.89429112 L9.92554112,5.03813582 L6.56678391,1.67937861 Z M3.64812861,5.75612373 L5.74735186,7.85534699 L6.54284699,7.05985186 L4.44362373,4.96062861 L3.64812861,5.75612373 Z"
          />
        </g>
      </svg>
    );
  }

  backgroundColorIcon = () => {
    // 默认描边 & 填充
    let stroke = '#FFD666';
    let fill = '#FFFBE6';

    if (this.state.disabled) {
      fill = '#BFBFBF';
      stroke = '#BFBFBF';
    }
    const currentColor = this.state.currentColor;
    if (currentColor) {
      fill = currentColor;
      stroke = Palette.getStroke(currentColor);
    }

    return (
      <svg
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
        version="1.1"
      >
        <title>color-bg</title>
        <desc>Created with Sketch.</desc>
        <g
          id="color-bg"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <path
            d="M11.9745711,7.921875 C11.9745711,7.921875 13.2147672,9.2863447 13.2147672,10.1226326 C13.2147672,10.8142992 12.6566789,11.3802083 11.9745711,11.3802083 C11.2924632,11.3802083 10.734375,10.8142992 10.734375,10.1226326 C10.734375,9.2863447 11.9745711,7.921875 11.9745711,7.921875 Z M9.07958999,6.47535893 L6.28501575,3.68078468 L3.4904415,6.47535893 L9.07958999,6.47535893 Z M5.3326566,3.04215357 L4.28223263,1.9917296 C4.22692962,1.93642659 4.22692962,1.84676271 4.28223263,1.7914597 L5.03228902,1.0414033 C5.08759203,0.986100299 5.17725591,0.986100299 5.23255892,1.0414033 L6.4546098,2.26345418 C6.46530408,2.27146914 6.4755605,2.28033918 6.48528564,2.29006432 L10.4848531,6.28963174 C10.5954591,6.40023775 10.5954591,6.57956552 10.4848531,6.69017153 L6.4838816,10.691143 C6.37327559,10.801749 6.19394782,10.801749 6.08334181,10.691143 L2.08377439,6.69157557 C1.97316838,6.58096956 1.97316838,6.40164179 2.08377439,6.29103578 L5.3326566,3.04215357 Z"
            id="Combined-Shape"
            fill="#595959"
          />
          <rect
            id="Rectangle-55"
            stroke={stroke}
            strokeWidth="0.5"
            fill={fill}
            x="2"
            y="12.75"
            width="12"
            height="1.5"
            rx="0.125"
          />
        </g>
      </svg>
    );
  }

  fontColorIcon() {
    // 默认描边 & 填充
    let stroke = '#F5222D';
    let fill = '#F5222D';

    if (this.state.disabled) {
      fill = '#BFBFBF';
      stroke = '#BFBFBF';
    }

    const currentColor = this.state.currentColor;

    if (currentColor) {
      fill = currentColor;
      stroke = Palette.getStroke(currentColor);
    }

    return (
      <svg
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
      >
        <title>color-font</title>
        <desc>Created with Sketch.</desc>
        <g
          id="color-font"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <rect
            id="Rectangle-55"
            stroke={stroke}
            strokeWidth="0.5"
            fill={fill}
            x="2"
            y="12.75"
            width="12"
            height="1.5"
            rx="0.125"
          />
          <path
            d="M5.29102819,11.25 L3.96365715,11.25 C3.87952002,11.25 3.8113134,11.1817934 3.8113134,11.0976562 C3.8113134,11.08076 3.81412419,11.0639814 3.81963067,11.0480076 L7.0756112,1.60269506 C7.09679504,1.5412426 7.15463644,1.5 7.21963767,1.5 L8.81868806,1.5 C8.883726,1.5 8.94159158,1.54128846 8.96274706,1.60278951 L12.2118,11.048102 C12.239168,11.1276636 12.1968568,11.2143472 12.1172952,11.2417152 C12.1013495,11.2472004 12.0846037,11.25 12.067741,11.25 L10.6761419,11.25 C10.6099165,11.25 10.5512771,11.2072154 10.531066,11.1441494 L9.69970662,8.55 L6.27433466,8.55 L5.43599205,11.1444975 C5.41567115,11.2073865 5.35711879,11.25 5.29102819,11.25 Z M8.02635163,3.18571429 L7.96199183,3.18571429 L6.63904023,7.30714286 L9.33500105,7.30714286 L8.02635163,3.18571429 Z"
            id="A"
            fill="#595959"
          />
        </g>
      </svg>
    );
  }

  render() {
    let { name, title, moreTitle, disabled } = this.props;
    const active = this.state.active;

    if (name.indexOf(':') >= 0) {
      name = name.split(':')[1];
    }

    const buttonContent = <span className="lake-icon lake-icon-svgs">{this.getIcon(name)}</span>;
    const moreContent = <span className="lake-icon" />;
    return (
      <div className="lake-button-set">
        <div className={classnames('lake-button-set-trigger lake-button-set-trigger-double', {
          'lake-button-set-trigger-active': active,
        }, {
          'lake-button-set-trigger-double-active': active,
        })}
        >
          <Button
            className="lake-button-current"
            name={name}
            content={buttonContent}
            onClick={this.handleClick}
            title={title}
            disabled={disabled}
          />
          <Button
            className="lake-button-dropdown"
            content={moreContent}
            onClick={this.toggleDropdown}
            name={''.concat(name, '-dropdown')}
            title={moreTitle}
            hasArrow
            disabled={disabled}
          />
        </div>
        <div className={classnames('lake-button-set-list lake-button-set-list-colorboard', {
          'lake-button-set-list-active': active,
        })}
        >
          <ColorPicker {...Object.assign({}, this.props, { onSelect: this.handleSelect })} />
        </div>
      </div>
    );
  }
}

export default ColorButton;
