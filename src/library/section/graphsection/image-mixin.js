import Engine from '@hicooper/doc-engine/lib';

const {StringUtils} = Engine;
/**
 * @fileOverview 图片渲染
 */
const escape = StringUtils.escape;
const sanitizeUrl = StringUtils.sanitizeUrl;
export default {
  // 获取图片 dom 节点
  _getImageHtml(src) {
    const pageWidth = this.page.getWidth();
    const pageHeight = this.page.getHeight();
    return '<img src="'.concat(escape(sanitizeUrl(src)), '" style="width: ').concat(escape(pageWidth), 'px; height: ').concat(escape(pageHeight), 'px;"/>');
  },
  // 存 canvas base64 图片
  _saveImageBase64() {
    const pageCanvas = this.page.getCanvas();
    const pageCanvasDOM = pageCanvas.get('el');
    const pixelRatio = pageCanvas.get('pixelRatio');
    const pageWidth = this.page.getWidth();
    const pageHeight = this.page.getHeight();
    const pageCanvasWidth = pageWidth * pixelRatio;
    const pageCanvasHeight = pageHeight * pixelRatio;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    pageCanvas._drawSync();

    canvas.width = pageCanvasWidth;
    canvas.height = pageCanvasHeight;
    ctx.drawImage(pageCanvasDOM, 0, 0, pageCanvasWidth, pageCanvasHeight, 0, 0, pageCanvasWidth, pageCanvasHeight);
    return canvas.toDataURL('image/png', 2.0);
  },
  // 渲染图片
  _renderImage() {
    const src = this._saveImageBase64();
    this.imageContainer.html(this._getImageHtml(src));
    const mask = this._renderImageMask();
    this.imageContainer.append(mask);
  },
  _renderImageMask() {
    const {page} = this;
    const lactions = page.getTextDomLactions();
    const zoom = page.getZoom();
    let search = '';
    let mask = '<div class="lake-image-mask">';
    lactions.forEach((laction) => {
      const {x, y, text, fontSize} = laction;
      const style = 'font-size: '.concat(fontSize * zoom, 'px;left: ').concat(x, 'px;top: ').concat(y, 'px;');
      mask += '<p class="lake-image-mask-point" style="'.concat(style, '">').concat(text, '</p>');
      search += ' '.concat(text);
    });
    this.searchContent = search;
    return mask += '</div>';
  },
};
