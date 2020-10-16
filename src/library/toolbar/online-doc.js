import React from 'react';
import { Button, Modal } from 'antd';
import 'antd/lib/modal/style';

class OnlineDoc extends React.Component {
  state = {
    visible: false,
    activated: false,
  }

  constructor() {
    super();
    this.iframe = React.createRef();
  }

  handleMouseEnter() {
    this.setState({
      activated: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      activated: false,
    });
  }

  handleMouseDown = (event) => {
    // 弹窗时，禁止 focus 编辑器
    event.stopPropagation();
  }

  handleClick = (event) => {
    const { hideDropdown } = this.props;
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      visible: true,
    }, () => {
      if (hideDropdown) {
        hideDropdown();
      }
    });
  }

  handleInsert = (event, collapsed) => {
    event.preventDefault();
    event.stopPropagation();
    const { item, removeSelect } = this.props;
    const { fetchSelectedFile } = this.iframe.current.contentWindow;
    if (fetchSelectedFile) {
      const files = fetchSelectedFile();
      const file = files.length > 0 ? files[0] : undefined;
      if (file && item && item.onReadLocal) {
        item.onReadLocal({
          src: file.preView,
          download: file.download,
          name: file.fileName,
          size: 0,
          collapsed,
        });
      }
    }
    this.setState({
      visible: false,
    }, () => {
      if (removeSelect) {
        removeSelect();
      }
    });
  }

  handleCancel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { removeSelect } = this.props;
    this.setState({
      visible: false,
    }, () => {
      if (removeSelect) {
        removeSelect();
      }
    });
  }

  render() {
    const { visible } = this.state;
    const { item, index, engine } = this.props;
    const activeClass = this.state.activated ? ' itellyou-collapse-list-item-active' : '';
    const style = item.subTitle ? {
      height: 'auto',
    } : {};
    const options = engine.options.onlinedoc || {};
    return (
      <div
        key={index}
        data-index={index}
        data-aspm-click={''.concat(item.name)}
        accessbilityid={''.concat(item.name, '-section-button')}
        className={'itellyou-collapse-list-item'.concat(activeClass)}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        onMouseDown={this.handleMouseDown}
        style={style}
      >
        <div
          className="itellyou-collapse-item-icon"
          dangerouslySetInnerHTML={{ __html: item.icon }}
        />
        <div
          className="itellyou-collapse-item-text"
        >
          <div className="itellyou-collapse-item-title">
            {item.title}
            {
              item.subTitle && <span className="itellyou-collapse-item-sub-title">{item.subTitle}</span>
            }
            {
              item.subNew && <span className="itellyou-sub-new-tag">{item.subNew}</span>
            }
            {
              item.isNew ? <span className="itellyou-svg-icon-new-section" /> : ''
            }
          </div>
        </div>
        <Modal
          title="嵌入文件"
          getContainer="div[data-itellyou-element=toolbar]"
          visible={visible}
          centered
          mask={false}
          destroyOnClose
          style={{
            minWidth: '1300px',
          }}
          footer={(
            <div>
              <Button onClick={event => this.handleInsert(event, false)} type="primary">预览插入</Button>
              <Button onClick={event => this.handleInsert(event, true)} type="primary">文件插入</Button>
              <Button onClick={this.handleCancel}>取消</Button>
            </div>
          )}
        >
          <iframe ref={this.iframe}
            style={{ width: '100%', minHeight: '480px' }}
            frameBorder={0}
            allowFullScreen
            src={options.action}
          />
        </Modal>
      </div>
    );
  }
}

export default OnlineDoc;
