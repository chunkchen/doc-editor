import React from 'react'
import classnames from 'classnames'
import Button from './button'

class ToolbarPluginsMore extends React.Component {
  state = {
    active: false,
  }

  constructor() {
    super()

    this.toggleDropdown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (this.state.active) {
        this.hideDropdown()
      } else {
        this.showDropdown()
      }
    }

    this.showDropdown = () => {
      document.addEventListener('click', this.hideDropdown)
      this.setState({
        active: true,
      })
    }

    this.hideDropdown = () => {
      document.removeEventListener('click', this.hideDropdown)

      this.setState({
        active: false,
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown)
  }

  render() {
    const { children, width } = this.props
    const { active } = this.state
    const moreIcon = '<span class="lake-icon lake-icon-more" />'
    return (
      <div className={classnames('lake-toolbar-area', {
        'lake-toolbar-area-hide': !children || !children.length,
      })}
      >
        <div className="lake-button-set">
          <div className={classnames('lake-button-set-trigger', {
            'lake-button-set-trigger-active': active,
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
          <div className={classnames('lake-button-set-list', 'lake-button-set-list-hoz', {
            'lake-button-set-list-active': active,
          })}
            style={{ width: ''.concat(width, 'px') }}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default ToolbarPluginsMore
