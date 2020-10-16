import React, { Component } from 'react';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import CropImgBox from '../../components/CropImgBox';

export default class BlankPage extends Component {
  static displayName = 'BlankPage';

  cropImgRef = undefined

  constructor(props) {
    super(props);
    this.state = {};
  }

  finishedCrop = (selectPosition, zoom) => {
    console.log(selectPosition, zoom);
  }

  render() {
    return (
      <PageHeaderWrapper>
        BlankPage
        <CropImgBox
          canvasId="testId"
          imgUrl="https://www.hicooper.cn:8077/ajax/bucket/file/test2/北极熊.jpg"
          imgWidth={800}
          imgHeight={700}
          color="#dddddd"
          rectBackgroundColor="#dfdfd"
          onFinished={this.finishedCrop}
        />
      </PageHeaderWrapper>
    );
  }
}
