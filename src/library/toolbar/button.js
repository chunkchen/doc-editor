import React from 'react';
import { Tooltip } from 'antd';
import 'antd/lib/tooltip/style';
import classnames from 'classnames';

export default class Button extends React.Component {
  state = {
    visible: false,
  }

  onClick = (event) => {
    const { name, onClick, isPrevent, disabled } = this.props;

    if (isPrevent !== false) {
      event.preventDefault();
    }

    if (disabled) return;

    this.setState({
      visible: false,
    });

    onClick && onClick(event, name);
  }

  onMouseOver = (event) => {
    const { onMouseOver, disabled } = this.props;
    if (disabled) return;
    onMouseOver && onMouseOver();
    event.preventDefault();
  }

  onMouseDown = (event) => {
    event.preventDefault();
    const { name, onMouseDown, disabled } = this.props;
    if (disabled) return;
    // fix：避免执行工具栏的 mousedown 事件里的 engine.focus()，这个会导致格式刷功能失效
    if (name === 'paintformat' || name === 'video') {
      event.stopPropagation();
    }
    onMouseDown && onMouseDown(event);
  }

  onMouseEnter = (event) => {
    const { outerVisible, onMouseEnter } = this.props;
    if (onMouseEnter) {
      onMouseEnter(event);
    }
    if (!outerVisible) {
      this.setState({
        visible: true,
      });
    }
  }

  onMouseLeave = (event) => {
    const { outerVisible, onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave(event);
    }
    if (!outerVisible) {
      this.setState({
        visible: false,
      });
    }
  }

  getIcon = () => {
    const { icon } = this.props;
    if (icon && typeof icon === 'string') {
      return <span dangerouslySetInnerHTML={{ __html: icon }} />;
    }
    if (icon) {
      return icon;
    }
    return null;
  }

  render() {
    let { name, className, title, hotkey, active, disabled, hasArrow, currentText, content, mobile, contentVisible, tooltip } = this.props;
    if (hotkey) {
      title = (
        <div style={{ textAlign: 'center' }}>
          {title}
          <br />
          <span className="lake-button-hotkey">{hotkey}</span>
        </div>
      );
    }

    let visible = this.state.visible;
    // 没有 title 时，不展示 tooltip

    if (!title || mobile) {
      visible = false;
    }
    const accessbilityid = 'main-'.concat(name, '-button');
    const showContent = contentVisible === undefined ? true : contentVisible;

    const button = (
      <button
        accessbilityid={accessbilityid}
        className={classnames('lake-button', className, {
          'lake-button-active': active,
          'lake-button-disabled': disabled,
        })
        }
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseOver={this.onMouseOver}
      >
        {
          showContent && content
        }
        {
          currentText && <span className="lake-button-inner-text">{currentText}</span>
        }
        {
          this.getIcon()
        }
        {
          hasArrow && <span className="lake-icon lake-icon-arrow" />
        }
      </button>
    );
    return (
      tooltip === undefined || tooltip === true
        ? (
          <Tooltip
            title={title}
            placement="bottom"
            visible={visible}
            overlayClassName="lake-toolbar-tooltip"
          >
            {button}
          </Tooltip>
        )
        : button
    );
  }
}
