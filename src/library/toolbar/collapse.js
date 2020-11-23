import React from 'react'
import { Collapse, Popover } from 'antd'
import 'antd/lib/collapse/style'
import 'antd/lib/popover/style'
import classnames from 'classnames'
import TableSelector from './table-selector'
import Upload from './upload'
import CollapseItem from './collapse-item'

const { Panel } = Collapse

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.listNode = React.createRef()
    this.engine = props.engine
  }

  handleClick = (e, item, opts) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onClick()
    item.onClick(opts)
  }

  renderItem(item, index) {
    let onClick = () => {
    }

    if (item.type !== 'upload') {
      onClick = (e) => {
        return this.handleClick(e, item)
      }
    }

    return (
      <CollapseItem
        item={item}
        index={index}
        itemOnClick={onClick}
        toggleDropdown={this.props.onClick}
        hideDropdown={this.props.hideDropdown}
        showDropdown={this.props.showDropdown}
        removeSelect={this.props.removeSelect}
        key={'collapseItem'.concat(index)}
        engine={this.engine}
      />
    )
  }

  renderVideo(item, index) {
    return (
      <CollapseItem
        item={item}
        index={index}
        type="video"
        key={'collapseItem'.concat(index)}
        onToolBarClick={this.props.onClick}
        engine={this.engine}
      />
    )
  }

  renderTable(item, index) {
    return (
      <Popover
        key={index}
        content={(
          <TableSelector
            onSelect={(e, rows, cols) => {
              this.handleClick(e, item, {
                rows,
                cols,
              })
            }}
          />
        )}
        placement="rightTop"
      >
        <div>{this.renderItem(item, index)}</div>
      </Popover>
    )
  }

  render() {
    const { className, data, description, active, activeKeys } = this.props
    let toolbarDesc = ''
    if (description) {
      toolbarDesc = (
        <div className="lake-toolbar-collapse-description">
          <div className="description" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )
    }
    return (
      <div
        className={classnames('lake-button-set-list', className, {
          'lake-toolbar-collapse-no-header': data.length <= 1,
          'lake-button-set-list-active': active,
        })}
        ref={this.listNode}
        data-aspm="section_selector"
      >
        {toolbarDesc}
        <Collapse className="lake-toolbar-collapse" defaultActiveKey={activeKeys}>
          {data.map((row, index) => {
            return (
              <Panel showArrow={false} header={row.title} disabled key={index}>
                {row.items.map((item, i) => {
                  if (item.type === 'upload') {
                    const uploadProps = { ...this.props }
                    uploadProps.name = item.name
                    uploadProps.getEngine = item.getEngine
                    if (!uploadProps.getEngine) {
                      uploadProps.getEngine = () => {
                        return uploadProps.engine
                      }
                    }

                    return (
                      <Upload {...({ key: i, ...uploadProps })}>
                        {this.renderItem(item, i)}
                      </Upload>
                    )
                  }

                  if (item.name === 'table') {
                    return this.renderTable(item, i)
                  }

                  if (item.name === 'video') {
                    return this.renderVideo(item, i)
                  }

                  return this.renderItem(item, i)
                })}
              </Panel>
            )
          })}
        </Collapse>
      </div>
    )
  }
}
