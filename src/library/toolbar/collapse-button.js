import React from 'react';
import classnames from 'classnames';
import Button from './button';
import Collapse from './collapse';

class CollapseButton extends React.Component {
  constructor() {
    super();
    this.buttonArea = React.createRef();
  }

  state = {
    active: false,
  }

  toggleDropdown = () => {
    if (this.props.disabled) {
      return;
    }

    if (this.state.active) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  }

  showDropdown = () => {
    if (this.state.active === true) return;
    document.addEventListener('click', this.hideDropdown);
    this.setState({
      active: true,
    });
  }

  hideDropdown = (e) => {
    if (e) {
      let node = e.target;
      while (node) {
        if (node === this.buttonArea.current) {
          return;
        }
        node = node.parentNode;
      }
    }
    document.removeEventListener('click', this.hideDropdown);
    this.setState({
      active: false,
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown);
  }

  render() {
    const { active } = this.state;
    // button component

    const buttonProps = { ...this.props };
    buttonProps.active = active;
    buttonProps.onClick = this.toggleDropdown;
    // collapse component
    const collapseProps = { ...this.props };
    collapseProps.active = active;
    collapseProps.onClick = this.toggleDropdown;
    collapseProps.hideDropdown = this.hideDropdown;
    collapseProps.showDropdown = this.showDropdown;
    collapseProps.onBeforeUpload = this.toggleDropdown;
    collapseProps.activeKeys = collapseProps.data.map((item, index) => {
      return String(index);
    });
    return (
      <div className="itellyou-button-set itellyou-collapse-button" ref={this.buttonArea}>
        <div className={classnames('itellyou-button-set-trigger', { 'itellyou-button-set-trigger-active': active })}>
          <Button {...buttonProps} />
        </div>
        <Collapse {...collapseProps} />
      </div>
    );
  }
}

export default CollapseButton;
