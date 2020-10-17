import React from 'react';
import { Tooltip } from 'antd';
import 'antd/lib/tooltip/style';
import lang from './lang';

class Zoom extends React.Component {
  state = {
    prevStatus: 'default',
    nextStatus: 'default',
    zoomInStatus: 'default',
    zoomOutStatus: 'default',
    originSizeStatus: 'default',
    bestSizeStatus: 'default',
  }

  afterZoom() {
    const { imageBrowser } = this.props;
    const currentLevel = imageBrowser.getCurrentZoomLevel();
    const initLevel = imageBrowser.getInitialZoomLevel();
    let status;
    if (currentLevel === initLevel) {
      status = 'activated';
    }
    if (initLevel === 1) {
      status = 'disable';
    }
    this.setState({
      zoomOutStatus: currentLevel === 0.05 ? 'disable' : 'default',
      zoomInStatus: currentLevel === 5 ? 'disable' : 'default',
      originSizeStatus: currentLevel === 1 ? 'activated' : 'default',
      bestSizeStatus: status,
    });
  }

  afterChange() {
    const count = this.props.imageBrowser.getCount();
    this.setState({
      nextStatus: count === 1 ? 'disable' : 'default',
      prevStatus: count === 1 ? 'disable' : 'default',
    });
  }

  componentDidMount() {
    const { imageBrowser } = this.props;
    imageBrowser.on('afterzoom', () => {
      this.afterZoom();
    });

    imageBrowser.on('afterchange', () => {
      this.afterChange();
    });

    imageBrowser.on('resize', () => {
      setTimeout(() => {
        this.afterChange();
        this.afterZoom();
      }, 333);
    });
    this.setState({
      tooltipContainer: this.tooltipContainer,
    });
  }

  renderBtn(zoomClass, title, status, onClick) {
    const { tooltipContainer } = this.state;
    return tooltipContainer ? (
      <Tooltip
        title={title}
        getPopupContainer={
        () => {
          return tooltipContainer;
        }
      }
        mouseEnterDelay={1}
      >
        <span onClick={onClick}
          className={'lake-pswp-'.concat(zoomClass, ' btn ').concat(status)}
        />
      </Tooltip>
    ) : '';
  }

  render() {
    const { imageBrowser } = this.props;
    const { prevStatus, nextStatus, zoomInStatus, zoomOutStatus, originSizeStatus, bestSizeStatus } = this.state;
    return (
      <div
        className="lake-pswp-tool-bar"
      >
        <div ref={e => this.tooltipContainer = e} />
        <div
          className="pswp-toolbar-content"
        >
          {
            this.renderBtn('arrow-left', lang.prev, prevStatus, () => {
              if (prevStatus !== 'disable') imageBrowser.prev();
            })
          }
          <span className="lake-pswp-counter" />
          {
            this.renderBtn('arrow-right', lang.next, nextStatus, () => {
              if (nextStatus !== 'disable') imageBrowser.next();
            })
          }
          <span className="separation" />
          {
            this.renderBtn('zoom-in', lang.zoomIn, zoomInStatus, () => {
              if (zoomInStatus !== 'disable') imageBrowser.zoomIn();
            })
          }
          {
            this.renderBtn('zoom-out', lang.zoomOut, zoomOutStatus, () => {
              if (zoomOutStatus !== 'disable') imageBrowser.zoomOut();
            })
          }
          {
            this.renderBtn('origin-size', lang.originSize, originSizeStatus, () => {
              if (originSizeStatus !== 'disable') imageBrowser.zoomToOriginSize();
            })
          }
          {
            this.renderBtn('best-size', lang.bestSize, bestSizeStatus, () => {
              if (bestSizeStatus !== 'disable') imageBrowser.zoomToBestSize();
            })
          }
        </div>
      </div>
    );
  }
}

export default Zoom;
