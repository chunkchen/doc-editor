/**
 * @fileOverview 图Section基类 - 用于拓展各式各样的Section
 */
import Engine from 'doc-engine/lib';
import GraphEditor from './graph-editor';
import ToolMixin from './tool-mixin';
import ReadMixin from './read-mixin';
import EditMixin from './edit-mixin';
import ImageMixin from './image-mixin';
import MaximizeMixin from './maximize-mixin';
import SectionBase from '../base';

const { $ } = Engine;
const Mixins = [ToolMixin, ReadMixin, EditMixin, ImageMixin, MaximizeMixin];

class GraphSection extends SectionBase {
  constructor(_ref) {
    super();
    const { engine, contentView, pageType } = _ref;
    this.engine = engine;
    this.graphEditor = new GraphEditor();
    this.rendererOptions = engine ? engine.options : contentView.options;
    this.state = {};
    this.pageType = pageType;
    this.zoomStep = 0.1;
    // 缩放步长
    this.currentZoom = 1;
    this.minHeight = 240;
    this.defaultGraphCfg = {
      minZoom: 0.2,
      maxZoom: 2,
      height: this.minHeight,
      mode: !engine ? 'readOnly' : 'default',
    };
    this.searchContent = '';
    Mixins.forEach((Mixin) => {
      Object.assign(this, Mixin);
    });

    if (!engine) {
      return this;
    }
    this.locale = this.engine.locale[this.pageType];
    this.mobile = this.engine.options.type === 'mobile';
  }

  topToolbar() {
  }

  getChangeDataCommandNames() {
  }

  embedToolbar() {
    const config = this.rendererOptions.graphsection || {};
    const embed = this.mobile ? [{
      type: 'copy',
    }, {
      type: 'delete',
    }] : [
      {
        type: 'dnd',
      }, {
        type: 'maximize',
      }, {
        type: 'separator',
      }, {
        type: 'copy',
      }, {
        type: 'delete',
      },
    ];
    if (Array.isArray(config.embed)) {
      return config.embed;
    } if (typeof config.embed === 'object') {
      const embedArray = [];
      embed.forEach((item) => {
        if (config.embed[item.type] !== false) {
          embedArray.push(item);
        }
      });
      return embedArray;
    }
    return embed;
  }

  // 变更缩放
  _changeZoom(zoom) {
    this._changePageZoom(zoom);
    this._updateToolZoom();
  }

  // 变更图缩放
  _changePageZoom(zoom) {
    const page = this.page;
    if (GraphEditor.Util.isNumber(zoom)) {
      page.zoom(zoom);
    }

    if (GraphEditor.Util.isString(zoom)) {
      const maxZoom = page.getMaxZoom();
      page.setMaxZoom(1);
      page.setFitView(zoom);
      page.setMaxZoom(maxZoom);
    }
    // 改变画布缩放记录视口
    if (!this.state.maximize) {
      this.setValue({
        matrix: page.getMatrix(),
      });
    }
  }

  // 渲染画布尺寸变更控件
  _renderResizeController() {
    if (this.resizeController) {
      return;
    }

    const resizeController = $('<div class="section-resize-button-ud" draggable="true" />');
    this.container.append(resizeController);
    let changeHeight;
    let startClientPoint;
    let width;
    let height;
    resizeController.hide();
    this.bindEvent(resizeController, 'dragstart', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      ev.cancelBubble = true;
      startClientPoint = {
        x: ev.clientX,
        y: ev.clientY,
      };
      width = this.page.getWidth();
      height = this.page.getHeight();
    });
    this.bindEvent($(document), 'mousemove', (ev) => {
      if (!startClientPoint) {
        return;
      }

      const dy = ev.clientY - startClientPoint.y;
      changeHeight = height + dy;

      if (changeHeight >= this.minHeight) {
        this.page.changeSize(width, changeHeight);
      }
    });
    this.bindEvent($(document), 'mouseup', () => {
      startClientPoint = undefined;
      if (changeHeight) {
        this.setValue({
          height: changeHeight,
        });
      }
      changeHeight = undefined;
    });
    this.resizeController = resizeController;
  }

  /**
   * Section获得焦点时调用
   */
  activate() {
    if (this.state.activated === true || this.destroyed) {
      return;
    }

    this.tool.show();
    this.pageContainer[0].style.visibility = 'visible';
    this.imageContainer.hide();

    if (!this.engine) {
      this.page.changeMode('readOnly');
    } else {
      this.container.css('border', '1px solid #D9D9D9');
      this.resizeController.show();
      this.engine.toolbar.set(this.topToolbar());
      this.page.changeMode('default');
    }
    this.state.focus = true;
  }

  /**
   * Section失去焦点时调用
   */
  unactivate() {
    if (this.state.activated === false || this.destroyed) {
      return;
    }

    if (!this.engine) {
      this.page.changeMode('none');
      this._renderImage();
    } else {
      this.container.css('border', '1px solid rgba(0, 0, 0, 0)');
      this.resizeController.hide();
      this.engine.toolbar.restore();
      this.page.changeMode('none');
      this._renderImage();
    }

    this.tool.hide();
    this.pageContainer[0].style.visibility = 'hidden';
    this.imageContainer.show();
    this.page.clearSelected();
  }

  // 保存数据
  // setValue(value) {
  //   if (this.state.maximize === true && Util.isPlainObject(value)) {
  //     for (const key in value) {
  //       if (key !== 'graphData') delete value[key];
  //     }
  //   }
  //   section.setValue(this.sectionRoot, Object.assign(this.value, value));
  // }
  _initContainer(container) {
    const imageContainer = $('<div class="image-container"></div>');
    const pageContainer = $('<div class="page-container"></div>');
    container.addClass('graph-section');
    this.imageContainer = imageContainer;
    this.pageContainer = pageContainer;
    this.container.append(pageContainer);
    this.container.append(imageContainer);
  }

  normalizeValue() {
    const { value } = this;
    if (value.width) {
      value.width = +value.width;
    }
    if (value.height) {
      value.height = +value.height;
    }
  }

  /**
   * 渲染Section
   * @param  {$DOM} container - Section容器
   * @param  {boolean} value - Section值
   */
  render(container, value) {
    this.value = value || {};
    this._initContainer(container);
    this.normalizeValue();
    if (this.engine) {
      // 编辑模式
      this._renderEditView();
    } else {
      // 阅读模式
      this._renderReadView();
    }
  }

  // 读取值
  _readValue() {
    const page = this.page;
    const { height, graphData, matrix } = this.value;
    const readonly = this.state.readonly;

    if (height) {
      const width = page.getWidth();
      page.changeSize(width, height);
    }

    if (graphData) {
      page.read(graphData);
    }

    if (!readonly) {
      if (matrix) {
        page.updateMatrix(matrix);
      }
    } else {
      this._changePageZoom('autoZoom');
    }
  }

  /**
   * 销毁Section
   */
  destroy() {
    // 记录是否Section销毁
    super.destroy.call(this);
    this.page.destroy();
    this.engine.toolbar.restore();
  }
}

GraphSection.type = 'block';
GraphSection.uid = true;
export default GraphSection;
