import React from 'react'
import classnames from 'classnames'
import Engine from '@hicooper/doc-engine'
import Button from './button'
import Dropdown from './dropdown'

class DropdownButton extends React.Component {
  state = {
    active: false,
    currentValue: undefined,
  }

  toggleDropdown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (this.props.disabled) {
      return
    }

    if (this.state.active) {
      this.hideDropdown()
    } else {
      this.showDropdown()
    }
  }

  showDropdown = () => {
    const { name, getActive } = this.props
    let currentValue
    if (name === 'alignment') {
      currentValue = getActive()
    }
    Engine.$('div[data-lake-element=toolbar]')
      .attr('style', 'z-index:202')
    document.addEventListener('click', this.hideDropdown)
    this.setState({
      active: true,
      currentValue,
    })
  }

  hideDropdown = () => {
    Engine.$('div[data-lake-element=toolbar]')
      .removeAttr('style')
    document.removeEventListener('click', this.hideDropdown)
    this.setState({
      active: false,
      currentValue: undefined,
    })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown)
  }

  render() {
    const active = this.state.active
    const buttonProps = { ...this.props }
    delete buttonProps.onClick
    delete buttonProps.active
    return (
      <div
        className="lake-button-set"
        onClick={this.toggleDropdown}
      >
        <div className={classnames('lake-button-set-trigger', {
          'lake-button-set-trigger-active': active,
        })}
        >
          <Button {...({ active, ...buttonProps })} />
        </div>
        <Dropdown
          className={this.props.className}
          active={active}
          name={this.props.name}
          data={this.props.data}
          currentValue={this.state.currentValue || this.props.active}
          onSelect={this.props.onClick}
          engine={buttonProps.engine}
        />
      </div>
    )
  }
}

export default DropdownButton
