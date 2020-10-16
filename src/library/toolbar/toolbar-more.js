import React from 'react';
import classnames from 'classnames';
import Button from './button';

class ToolbarPluginsMore extends React.Component {
  state = {
    active: false,
  }

  constructor() {
    super();

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
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown);
  }

  render() {
    const { children, width } = this.props;
    const { active } = this.state;
    const moreIcon = '<span class="itellyou-icon itellyou-icon-more" />';
    return (
      <div className={classnames('itellyou-toolbar-area', {
        'itellyou-toolbar-area-hide': !children || !children.length,
      })}
      >
        <div className="itellyou-button-set">
          <div className={classnames('itellyou-button-set-trigger', {
            'itellyou-button-set-trigger-active': active,
          })}
          >
            <Button
              title={'\u66F4\u591A'}
              icon={moreIcon}
              active={active}
              hasArrow
              onClick={this.toggleDropdown}
              outerVisible={this.state.active}
            />
          </div>
          <div className={classnames('itellyou-button-set-list', 'itellyou-button-set-list-hoz', {
            'itellyou-button-set-list-active': active,
          })}
            style={{ width: ''.concat(width, 'px') }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default ToolbarPluginsMore;
