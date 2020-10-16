import React from 'react';
import { message } from 'antd';
import VideoUploader from './video-uploader';
import CollapseGroup from './collapse-group';
import OnlineDoc from './online-doc';

class CollapseItem extends React.PureComponent {
  state = {
    activated: false,
  };

  constructor() {
    super();
    this.videoTrigger = null;
    this.videoUploader = null;
  }

  onVideoTriggerClick() {
    const { engine, onToolBarClick } = this.props;
    if (!this.videoUploader) {
      this.videoUploader = new VideoUploader({
        trigger: this.videoTrigger,
        engine,
        onToolBarClick,
        onToolBarError: this.videoError,
      });
    }
    this.videoTrigger.click();
  }

  /**
   * -100 网络错误
   * @param {object} err 错误对象
   */
  videoError() {
    const err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    message.error(err.code === -100 ? '网络异常：Failed to fetch' : err.message);
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

  renderCommon() {
    const { item, index, itemOnClick } = this.props;
    const activeClass = this.state.activated ? ' itellyou-collapse-list-item-active' : '';
    const style = item.subTitle
      ? {
        height: 'auto',
      }
      : {};

    return (
      <div
        key={index}
        data-index={index}
        data-aspm-click={''.concat(item.name)}
        accessbilityid={''.concat(item.name, '-section-button')}
        className={'itellyou-collapse-list-item'.concat(activeClass)}
        onClick={itemOnClick}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        style={style}
      >
        {this.getIcon()}
        <div className="itellyou-collapse-item-text">
          <div className="itellyou-collapse-item-title">
            {item.title}
            {item.subTitle && (
              <span className="itellyou-collapse-item-sub-title">{item.subTitle}</span>
            )}
            {item.subNew && <span className="itellyou-sub-new-tag">{item.subNew}</span>}
            {item.isNew ? <span className="itellyou-svg-icon-new-section" /> : ''}
          </div>
        </div>
      </div>
    );
  }

  formatAcceptExts() {
    return '.3gp,.asf,.avi,.dv,.flv,.f4v,.gif,.m2t,.m4v,.mj2,.mjpeg,.mkv,.mov,.mp4,.mpg,.mpeg,.mts,.ogg,.rm,.rmvb,.swf,.ts,.vob,.wmv,.webm';
  }

  getIcon = () => {
    const { icon } = this.props.item;
    if (icon && typeof icon === 'string') {
      return (
        <div className="itellyou-collapse-item-icon" dangerouslySetInnerHTML={{ __html: icon }} />
      );
    }
    if (icon) {
      return <div className="itellyou-collapse-item-icon">{icon}</div>;
    }
    return null;
  };

  renderVideo() {
    const { item, index } = this.props;
    const activeClass = this.state.activated ? ' itellyou-collapse-list-item-active' : '';
    return (
      <div
        key={index}
        data-index={index}
        data-aspm-click={''.concat(item.name)}
        className={'itellyou-collapse-list-item'.concat(activeClass)}
        onClick={this.onVideoTriggerClick.bind(this)}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      >
        {this.getIcon()}
        <div className="itellyou-collapse-item-text">
          <div className="itellyou-collapse-item-title">{item.title}</div>
        </div>
        <input
          ref={e => (this.videoTrigger = e)}
          type="file"
          accept={this.formatAcceptExts()}
          className="uploader"
        />
      </div>
    );
  }

  render() {
    const { item, type } = this.props;
    let child;
    if (item.name === 'onlinedoc') {
      child = <OnlineDoc {...this.props} />;
    } else if (type === 'video') {
      child = this.renderVideo();
    } else {
      child = this.renderCommon();
    }
    return <CollapseGroup data={item.tooltip}>{child}</CollapseGroup>;
  }
}

export default CollapseItem;
