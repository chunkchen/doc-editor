import React from 'react';
import {Button, Input, message, Modal, Tabs} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import 'antd/lib/message/style';
import 'antd/lib/modal/style';
import 'antd/lib/button/style';
import 'antd/lib/tabs/style';
import 'antd/lib/input/style';
import 'antd/lib/icon/style';
import VideoUploader from './video-uploader';
import ToolbarButton from './button';
import {getDocEmbedURL} from '../section/youku';

const InputGroup = Input.Group;

export default class extends React.Component {
  state = {
    visible: false,
    embedUrl: '',
  };

  /**
   * -100 网络错误
   * @param {object} err 错误对象
   */
  videoError() {
    const err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    message.error(err.code === -100 ? '网络异常：Failed to fetch' : err.message);
  }

  formatAcceptExts() {
    return '.3gp,.asf,.avi,.dv,.flv,.f4v,.gif,.m2t,.m4v,.mj2,.mjpeg,.mkv,.mov,.mp4,.mpg,.mpeg,.mts,.ogg,.rm,.rmvb,.swf,.ts,.vob,.wmv,.webm';
  }

  handleMouseDown = (event) => {
    // 弹窗时，禁止 focus 编辑器
    event.stopPropagation();
  };

  handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      visible: true,
    });
  };

  handleCancel = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({
      visible: false,
    });
  };

  handleOnlineVideo = (event) => {
    event.stopPropagation();
    const {embedUrl} = this.state;
    const {engine, setOnline} = this.props;
    const url = getDocEmbedURL(embedUrl);
    if (!url) {
      engine.messageError('链接错误，请检查后重新输入');
    } else if (setOnline) {
      this.handleCancel();
      this.setState({
        embedUrl: '',
      });
      setOnline({
        url,
        name: embedUrl,
      });
    }
  };

  onUrlChange = (event) => {
    this.setState({
      embedUrl: event.target.value,
    });
  };

  render() {
    const {visible, embedUrl} = this.state;
    const {engine} = this.props;
    return (
      <ToolbarButton
        {...this.props}
        isPrevent={false}
        outerVisible={visible}
        contentVisible={visible}
        content={(
          <Modal
            title={null}
            className="lake-toolbar-uploader-modal"
            getContainer="div[data-lake-element=toolbar]"
            visible
            centered
            mask={false}
            destroyOnClose
            style={{
              minWidth: '600px',
            }}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Tabs>
              <Tabs.TabPane tab="本地上传" key="local-upload">
                <div
                  className="lake-toolbar-uploader"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!this.videoUploader) {
                      this.videoUploader = new VideoUploader({
                        trigger: this.videoTrigger,
                        engine,
                        onToolBarClick: this.handleCancel,
                        onToolBarError: this.videoError,
                      });
                    }
                    this.videoTrigger.click();
                  }}
                >
                  <input
                    ref={trigger => (this.videoTrigger = trigger)}
                    type="file"
                    accept={this.formatAcceptExts()}
                    className="input-uploader"
                  />
                  <UploadOutlined/>
                  <p className="uploader-text">单击此区域选择需要上传的文件</p>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="在线视频" key="online-upload">
                <InputGroup size="large" compact>
                  <Input
                    value={embedUrl}
                    onChange={this.onUrlChange}
                    onMouseDown={event => event.stopPropagation()}
                    onMouseMove={event => event.stopPropagation()}
                    onPressEnter={this.handleOnlineVideo}
                    placeholder="请输入视频链接，支持优酷、哔哩哔哩"
                    style={{width: '86%'}}
                  />
                  <Button
                    size="large"
                    type="primary"
                    style={{width: '14%'}}
                    onClick={this.handleOnlineVideo}
                  >
                    确定
                  </Button>
                </InputGroup>
              </Tabs.TabPane>
            </Tabs>
          </Modal>
        )}
        onClick={this.handleClick}
      />
    );
  }
}
