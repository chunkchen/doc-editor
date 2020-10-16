import React, { Component } from 'react';
import { ScissorOutlined } from '@ant-design/icons';
import { CanvasBox } from '../../util/canvasCropImg';

import './index.less';

export default class CropImgBox extends Component {
  static displayName = 'CropImgBox';

  canvasBox = undefined

  constructor(props) {
    super(props);
    this.state = {};
  }


  componentDidMount() {
    this.initCanvas();
  }

  initCanvas = () => {
    console.log('init finished');
    const { canvasId, imgUrl, imgWidth, imgHeight, color, rectBackgroundColor } = this.props;
    this.canvasBox = new CanvasBox(
      canvasId,
      imgUrl,
      this.coordinates,
      {
        width: imgWidth,
        height: imgHeight,
        center: true,
        color,
        rectBackgroundColor,
      }, this.useWidth, this.callback);
  }

  callback = (selectPosition, zoom) => {
    this.props.onFinished(selectPosition, zoom);
  }

  startSelect = () => {
    if (this.canvasBox) {
      this.canvasBox.registerListener();
    }
  }

  cancelSelect = () => {
    if (this.canvasBox) {
      this.canvasBox.unRegisterListener();
    }
  }

  render() {
    const { canvasId } = this.props;
    return (
      <div className="crop-img-box">
        <canvas id={canvasId} />
        <div className="tools-bar">
          <ScissorOutlined style={{ cursor: 'pointer' }} title="截图" onClick={this.startSelect} />
        </div>
      </div>
    );
  }
}
