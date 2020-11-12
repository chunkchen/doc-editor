import Engine from '@hicooper/doc-engine/lib';

const { $ } = Engine;
/**
 * @fileOverview 阅读态
 */
export default {
  // 绑定阅读态事件
  _bindReadEvent() {
    // TODO: 暂时由Section内部控制本Section的聚焦和失焦状态
    this.bindEvent($(document), 'click', (_ref) => {
      const target = _ref.target;
      if (this.sectionRoot[0].contains(target)) {
        this.activate();
      }
    });
    this.bindEvent($(document), 'mousedown', (_ref) => {
      const target = _ref.target;
      if (!this.sectionRoot[0].contains(target)) {
        this.unactivate();
      }
    });
  },
  // 渲染阅读视图
  _renderReadView() {
    if (!this.page) {
      this.renderPage();
    }
    this._renderTool();
    this._bindReadEvent();
    this._readValue();
    this.unactivate();
    // 如果存在 src 则使用 src
    // if (this.value.src) {
    //   const { onBeforeRenderImage } = this.rendererOptions;
    //   const src = onBeforeRenderImage(this.value.src);
    //   this.imageContainer.html(this._getImageHtml(src));
    // }
  },
};
