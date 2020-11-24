import React from 'react'
import CollapseButton from './collapse-button'
import DropdownButton from './dropdown-button'
import ColorButton from './color-button'
import UploadButton from './upload-button'
import VideoButton from './video-button'
import TableButton from './table-button'
import Button from './button'

class ToolbarGroup extends React.Component {
  render() {
    const { engine, locale, toolbar, toolbarState, mobile } = this.props

    return (
      <div className="lake-toolbar-area">
        {
          toolbar.map((name, index) => {
            // 配置参数
            if (typeof name === 'object') {
              if (name.items && name.items.length === 0) return null
              name = name.name
            }

            const buttonProps = toolbarState[name] || {}
            const type = buttonProps.type
            buttonProps.hasArrow = type === 'dropdown'
            buttonProps.engine = engine
            buttonProps.mobile = mobile
            if (!buttonProps.getEngine) {
              buttonProps.getEngine = () => {
                return engine
              }
            }
            buttonProps.locale = locale
            if (name === 'table') {
              return <TableButton {...({ key: index, ...buttonProps })} />
            }
            if (type === 'collapse') {
              return <CollapseButton {...({ key: index, ...buttonProps })} />
            }

            if (type === 'dropdown') {
              return <DropdownButton {...({ key: index, ...buttonProps })} />
            }

            if (type === 'color') {
              buttonProps.activeColors = [buttonProps.active]
              return <ColorButton {...({ key: index, ...buttonProps })} />
            }

            if (type === 'upload') {
              return <UploadButton {...({ key: index, ...buttonProps })} />
            }

            if (type === 'video') {
              return <VideoButton {...({ key: index, ...buttonProps })} />
            }

            return <Button {...({ key: index, ...buttonProps })} />
          })
        }
      </div>
    )
  }
}

ToolbarGroup.defaultProps = {
  isFirstGroup: false,
}
export default ToolbarGroup
