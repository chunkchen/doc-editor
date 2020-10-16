import React from 'react';
import { preview } from '../../utils/image-generator';

class TextDiagramViewer extends React.Component {
  state = {
    // 图片地址
    url: this.props.url,
    error: null,
  }

  onImgLoad = () => {
    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad();
    }
  }

  componentDidMount() {
    // 优先使用 section src，没有时再使用 code 生成图片来渲染
    if (!this.state.url && this.props.code) {
      this.genImg();
    }
  }

  // 保证更新了 code 后，重新生成图片
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.code !== prevProps.code) {
      this.genImg();
    }
  }

  genImg() {
    preview(this.props.type, this.props.code).then((res) => {
      if (!res.success) {
        this.setState({
          error: res.message,
        });
      } else {
        const src = `data:image/svg+xml,${encodeURIComponent(res.svg).replace(/'/g, '%27').replace(/"/g, '%22')}`;
        this.setState({
          url: src,
          error: null,
        });
      }
    }).catch((error) => {
      this.setState({
        error: error.message,
      });
    });
  }

  render() {
    let { type, className, onBeforeRenderImage } = this.props;
    className = className === undefined ? '' : className;
    const { url, error } = this.state;
    const src = onBeforeRenderImage(url);
    const children = error !== null ? <pre>{error}</pre>
      : (src ? (
        <img
          src={src}
          onLoad={this.onImgLoad}
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      ) : <span className="itellyou-icon itellyou-icon-loading" />);

    return (
      <div
        className={'itellyou-text-diagram-viewer itellyou-text-diagram-'.concat(type, ' ').concat(className)}
      >
        {
        children
      }
      </div>
    );
  }
}

export default TextDiagramViewer;
