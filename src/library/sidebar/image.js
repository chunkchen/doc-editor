import React from 'react';
import { Button, Checkbox, Input } from 'antd';
import 'antd/lib/button/style';
import 'antd/lib/input/style';
import 'antd/lib/checkbox/style';

const { Group } = Button;

class ImageSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeWidth = (e) => {
      const width = parseInt(e.target.value, 10) || 0;
      const height = Math.round(width * this.rate);
      this.setState({
        width,
        height,
      });
    };

    this.handleChangeHeight = (e) => {
      const height = parseInt(e.target.value, 10) || 0;
      const width = Math.round(height / this.rate);

      this.setState({
        width,
        height,
      });
    };

    this.handleSizeKeyPress = (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        this.handleUpdateSize();
      }
    };

    this.handleUpdateSize = () => {
      const engine = this.props.engine;
      const { width, height } = this.state;
      const sectionRoot = engine.change.activeSection;
      if (!sectionRoot) {
        return;
      }
      const component = engine.section.getComponent(sectionRoot);
      if (!component) {
        return;
      }
      component.changeSize(width, height);
    };

    this.handleUpdateZoom = (zoomRate) => {
      const width = Math.round(this.originWidth * zoomRate);
      const height = Math.round(this.originHeight * zoomRate);
      this.setState({
        width,
        height,
      }, () => {
        return this.handleUpdateSize();
      });
    };

    this.handleChangeLink = (e) => {
      const link = e.target.value;
      this.setState({
        link,
      });
    };

    this.handleLinkKeyPress = (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        this.handleUpdateLink();
      }
    };

    this.handleUpdateLink = () => {
      const engine = this.props.engine;
      const { link, linkTarget } = this.state;
      const sectionRoot = engine.change.activeSection;

      if (!sectionRoot) {
        return;
      }
      const component = engine.section.getComponent(sectionRoot);
      if (!component) {
        return;
      }
      component.changeLink(link, linkTarget);
    };

    this.handleChangeLinkTarget = (e) => {
      const linkTarget = e.target.checked ? '' : '_blank';
      this.setState({
        linkTarget,
      }, () => {
        return this.handleUpdateLink();
      });
    };

    const data = props.data;
    this.state = {
      width: data.width,
      height: data.height,
      link: data.link,
      linkTarget: data.linkTarget,
    };
    this.originWidth = data.originWidth;
    this.originHeight = data.originHeight;
    this.rate = data.originHeight / data.originWidth;
  }

  componentWillUnmount() {
    this.handleUpdateSize();
    this.handleUpdateLink();
  }

  componentDidUpdate(props) {
    const data = props.data;
    const { width } = data;
    if (width !== this.props.data.width) {
      this.setState({
        width,
        height: data.height,
      });
    }
  }

  render() {
    const engine = this.props.engine;
    const { width, height, link, linkTarget } = this.state;
    const locale = engine.locale.image;
    return (
      <div>
        <div className="lake-sidebar-group">
          <div className="lake-sidebar-group-title">{locale.sizeTitle}</div>
          <div className="lake-sidebar-group-item">
            <div className="lake-sidebar-size-input">
              <Input
                type="text"
                size="small"
                className="lake-sidebar-width"
                defaultValue={width}
                value={width}
                onKeyPress={this.handleSizeKeyPress}
                onBlur={this.handleUpdateSize}
                onChange={this.handleChangeWidth}
              />
              <span className="lake-sidebar-lock"> </span>
              <Input
                type="text"
                size="small"
                className="lake-sidebar-height"
                defaultValue={height}
                value={height}
                onKeyPress={this.handleSizeKeyPress}
                onBlur={this.handleUpdateSize}
                onChange={this.handleChangeHeight}
              />
            </div>
            <div className="lake-sidebar-size-title">
              <span className="lake-sidebar-width-title">{locale.width}</span>
              <span className="lake-sidebar-lock" />
              <span className="lake-sidebar-height-title">{locale.height}</span>
            </div>
          </div>
          <div
            className="lake-sidebar-group-item lake-sidebar-image-percent"
            style={
              { marginBottom: '14px' }
            }
          >
            <Group>
              <Button
                size="small"
                onClick={() => {
                  return this.handleUpdateZoom(0.25);
                }
                }
              >
                25%
              </Button>
              <Button
                size="small"
                onClick={() => {
                  return this.handleUpdateZoom(0.5);
                }
                }
              >
                50%
              </Button>
              <Button
                size="small"
                onClick={() => {
                  return this.handleUpdateZoom(0.75);
                }
                }
              >
                75%
              </Button>
              <Button
                size="small"
                onClick={() => {
                  return this.handleUpdateZoom(1);
                }
                }
              >
                100%
              </Button>
            </Group>
          </div>
          <div className="lake-sidebar-group-item lake-sidebar-image-100">
            <Button
              size="small"
              style={{
                width: '100%',
              }}
              onClick={() => {
                return this.handleUpdateZoom(1);
              }
              }
            >
              {locale.originSize}
            </Button>
          </div>
          <div className="lake-sidebar-group">
            <div className="lake-sidebar-group-title">{locale.linkTitle}</div>
            <div className="lake-sidebar-group-item">
              <Input
                type="text"
                size="small"
                className="lake-sidebar-link"
                placeholder={locale.linkPlaceholder}
                defaultValue={link}
                value={link}
                onKeyPress={this.handleLinkKeyPress}
                onBlur={this.handleUpdateLink}
                onChange={this.handleChangeLink}
                style={{
                  marginBottom: '12px',
                }}
              />
            </div>
            <div>
              <Checkbox
                defaultChecked={linkTarget === ''}
                checked={linkTarget === ''}
                onChange={this.handleChangeLinkTarget}
              >
                {locale.linkTargetTips}
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageSidebar;
