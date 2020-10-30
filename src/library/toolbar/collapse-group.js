import React from 'react';
import {Tooltip} from 'antd';
import 'antd/lib/tooltip/style';
import './collapse-group.css';

const locale = {
  'zh-cn': {
    supportFollowingExts: '\u652f\u6301\u4ee5\u4e0b\u683c\u5f0f',
  },
  en: {
    supportFollowingExts: 'The following file formats are supported',
  },
}[window.appData && window.appData.locale === 'en' ? 'en' : 'zh-cn'];

const tooltipContainer = document.createElement('div');
tooltipContainer.setAttribute('class', 'lake-section-tooltip-container');
tooltipContainer.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
});
document.body.appendChild(tooltipContainer);

class CollapseGroup extends React.Component {
  renderHierarchy(data) {
    return data.map((item, key) => {
      const children = item.children.map((child, child_key) => {
        return (
          <span
            className={'lake-svg-icon lake-svg-icon-'.concat(child.icon)}
            key={''.concat(key).concat(child_key)}
          />
        );
      });
      return (
        <div key={''.concat(key)} className="lake-section-tooltip-hierarchy-cell">
          <p className="lake-section-tooltip-hierarchy-name-container">
            <span className="lake-section-tooltip-hierarchy-name">{item.name}</span>
            <span className="lake-section-tooltip-hierarchy-sub-name">{item.subName}</span>
          </p>
          <p>{children}</p>
        </div>
      );
    });
  }

  renderFlat(data) {
    return data[0].children.map((item, index) => {
      return (
        <div key={'0'.concat(index)} className="lake-section-tooltip-flat-cell">
          <span>{item.name}</span>
          <br/>
          <span className={'lake-svg-icon lake-svg-icon-'.concat(item.icon)}/>
        </div>
      );
    });
  }

  renderTooltip() {
    const {data} = this.props;
    const tooltip = data.length > 1 ? this.renderHierarchy(data) : this.renderFlat(data);
    return (
      <div className="lake-section-tooltip-content-container">
        <p className="lake-section-tooltip-title">{locale.supportFollowingExts}</p>
        {tooltip}
      </div>
    );
  }

  render() {
    const {children, data} = this.props;
    return data ? (
      <Tooltip
        title={this.renderTooltip()}
        placement="right"
        getPopupContainer={() => {
          return tooltipContainer;
        }}
      >
        {children}
      </Tooltip>
    ) : (
      <div>{children}</div>
    );
  }
}

export default CollapseGroup;
