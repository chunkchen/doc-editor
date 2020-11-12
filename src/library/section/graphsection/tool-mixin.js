import React from 'react';
import ReactDom from 'react-dom';
import Engine from '@hicooper/doc-engine';
import { Dropdown, Menu } from 'antd';
import 'antd/lib/menu/style';
import 'antd/lib/dropdown/style';

const { $ } = Engine;
/**
 * @fileOverview 图Section工具
 */
export default {
  // 变更缩放控件缩放数值
  _updateToolZoom() {
    const tool = this.tool;
    if (!tool) {
      return;
    }
    const page = this.page;
    const zoom = page.getZoom();
    this.currentZoom = zoom;
    this.tool.find('.zoom-precent')
      .html(`${Math.round(zoom * 100)}%`);
  },
  // 点击缩放放大按钮
  _clickZoomUp() {
    const page = this.page;
    const maxZoom = page.getMaxZoom();
    let zoom = page.getZoom();
    zoom += this.zoomStep;
    zoom = zoom > maxZoom ? maxZoom : zoom;

    this._changeZoom(zoom);
  },
  // 点击缩放缩小按钮
  _clickZoomDown() {
    const page = this.page;
    const minZoom = page.getMinZoom();
    let zoom = page.getZoom();
    zoom -= this.zoomStep;
    zoom = zoom < minZoom ? minZoom : zoom;

    this._changeZoom(zoom);
  },
  // 点击缩放下拉框
  _clickZoomMenu(_ref) {
    const item = _ref.item;
    const zoom = item.props.value;
    this._changeZoom(zoom);
  },
  // // 点击折叠
  // _clickCollapse() {
  //   this.graphEditor.executeCommand('collapse');
  // }
  // // 点击展开
  // _clickExpand() {
  //   this.graphEditor.executeCommand('expand');
  // }
  // 渲染图缩放控件
  _renderTool() {
    if (this.tool) {
      return;
    }

    const page = this.page;
    const tool = $('<div class="tool"></div>');
    const menu = (
      <Menu
        className="zoom-menu"
        ref={element => (this.pageZoomMenu = ReactDom.findDOMNode(element))}
        onClick={this._clickZoomMenu.bind(this)}
      >
        <Menu.Item value={0.2}>20%</Menu.Item>
        <Menu.Item value={0.5}>50%</Menu.Item>
        <Menu.Item value={1}>100%</Menu.Item>
        <Menu.Item value={2}>200%</Menu.Item>
        <Menu.Item value="autoZoom">适合画布</Menu.Item>
      </Menu>
    );
    $(this.page.getGraphContainer())
      .append(tool);
    tool.hide();
    ReactDom.render(
      <div>
        <span
          className="lake-icon lake-icon-zoom-out"
          onClick={this._clickZoomDown.bind(this)}
        />
        <Dropdown
          className="zoom-dropdown"
          overlay={menu}
          placement="bottomCenter"
          trigger={['click']}
          getPopupContainer={() => {
            return this.pageContainer[0];
          }}
        >
          <span className="zoom-precent">
            {Math.round(this.currentZoom * 100)}
            %
          </span>
        </Dropdown>
        <span
          className="lake-icon lake-icon-zoom-in"
          onClick={this._clickZoomUp.bind(this)}
        />
      </div>,
      tool[0],
      () => {
        this._updateToolZoom();
      },
    );
    page.on('afterzoom', () => {
      this._updateToolZoom();
    });
    this.tool = tool;
  },
};
