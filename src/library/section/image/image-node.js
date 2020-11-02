import React from 'react';
import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine/lib';
import Resizer from './resizer';
import {isBase64Image} from '../../utils/string';
import ErrorTips from '../../tips/error';

import Pswp from './pswp';

const {userAgent: {chrome, firefox, mobile}} = Engine;
const pswp = new Pswp();

const errorTemplate = (data) => {
  const content = Engine.StringUtils.escape(data.message);
  const element = document.createElement('div');
  ReactDOM.render(<ErrorTips
    sectionIcon='<span class="lake-svg-icon lake-svg-icon-error-image"></span>'
    variableContent={content}
    message={data}
  />, element);
  return element;
};
const winPixelRatio = window.devicePixelRatio;
let canvas;
const isSupportWebp = !(!(canvas = document.createElement('canvas')).getContext || !canvas.getContext('2d')) && (chrome || firefox || canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);
const convWebp = (src, isSupportWebp) => {
  if (src && src.endsWith('.webp') && !isSupportWebp) {
    src += '?x-oss-process=image/format,png';
  }
  return src;
};

const getResizeSrc = (options) => {
  const {maxWidth, data} = options;
  let {src} = options;
  const {width, originWidth, originHeight} = data;
  if (width && originWidth && originHeight && src.indexOf('x-oss-process=image/resize,') === -1 && originWidth < 3e4 && originHeight < 3e4) {
    let _width = parseInt(width);
    if (_width > maxWidth) {
      _width = maxWidth;
    }
    const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 2;
    _width = parseInt(_width * pixelRatio);
    const lowerSrc = src.toLowerCase();
    const enlargWidth = _width * (originHeight / originWidth);
    if (_width > 0 && _width * enlargWidth < 16777216 && _width < 4096 && enlargWidth < 4096 && originWidth > _width && !/^http?:\/\/\w+\.itellyou\.com\//i.test(lowerSrc) && !lowerSrc.endsWith('.gif') && !lowerSrc.endsWith('.svg')) {
      if (src.indexOf('?') === -1) {
        src += '?x-oss-process=image/resize,w_'.concat(width);
      } else if (src.indexOf('x-oss-process=image/') === -1) {
        src += '&x-oss-process=image/resize,w_'.concat(width);
      } else {
        src = src.replace('x-oss-process=image/', 'x-oss-process=image/resize,w_'.concat(width, '/'));
      }
      return src;
    }
  }
  return null;
};

const template = (_ref) => {
  const {data, readonly, maxWidth, onBeforeRenderImage} = _ref;
  let {src} = _ref;
  if (data.status === 'error') {
    return errorTemplate(data);
  }

  const progressHtml = '\n  <span data-role="progress" class="progress">\n    <i class="lake-anticon lake-anticon-loading">\n      <svg viewBox="0 0 1024 1024" class="lake-anticon-spin" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">\n        <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>\n      </svg>\n    </i>\n    <span data-role="percent" class="percent">'.concat(Engine.StringUtils.escape(data.percent || 0), '%</span>\n  </span>\n  ');
  src = convWebp(data.status !== 'uploading' ? onBeforeRenderImage(data.src) : src, isSupportWebp);
  let rawSrc = '';
  if (readonly) {
    // align: "left"
    // display: "inline"
    // height: 204
    // linkTarget: "_blank"
    // message: "上传图片失败，请重试"
    // name: "image.png"
    // originHeight: 1754
    // originWidth: 2880
    // size: 284791
    // src: ""
    // status: "done"
    // width: 334
    const resizeSrc = getResizeSrc({
      maxWidth,
      src,
      data,
    });
    if (resizeSrc) {
      rawSrc = src;
      src = resizeSrc;
    }
  }

  const title = data.name ? Engine.StringUtils.escape(data.name) : '';
  const altAttr = title ? ' alt="'.concat(title, '" title="').concat(title, '"') : '';
  let imgHtml;

  if (data.link && readonly) {
    let target = '';
    if (data.linkTarget) {
      target = ' target="_blank"';
    }
    if (mobile) {
      imgHtml = '<a href="'.concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(data.link)), '"').concat(target, '><img data-role="image" data-src="').concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(src)), '" data-raw-src="').concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(rawSrc)), '" class="image lozad lake-drag-image"')
        .concat(altAttr, ' /></a>');
    } else {
      imgHtml = '<a href="'.concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(data.link)), '"').concat(target, '><img data-role="image" src="').concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(src)), '" data-raw-src="').concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(rawSrc)), '" class="image lake-drag-image"')
        .concat(altAttr, ' /></a>');
    }
  } else if (mobile && readonly) {
    imgHtml = '<img data-role="image" data-src="'.concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(src)), '" data-raw-src="').concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(rawSrc)), '" class="image lozad lake-drag-image"').concat(altAttr, ' />');
  } else {
    imgHtml = '<img data-role="image" src="'.concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(src)), '" data-raw-src="').concat(Engine.StringUtils.escape(Engine.StringUtils.sanitizeUrl(rawSrc)), '" class="image lake-drag-image"').concat(altAttr, ' />');
  }

  let maximize = '<span data-role="maximize" class="lake-image-editor-maximize" style="display: none;"><span class="lake-icon lake-icon-maximize"/></span>';
  if ((data.width && data.originWidth < 100) || (typeof data.width === 'number' && data.width < 100) || mobile) {
    maximize = '';
  }
  return '\n  <span class="lake-image">\n    <span class="lake-image-content lake-image-content-istmp">\n      <span data-role="detail" class="lake-image-detail">\n        <span class="lake-image-meta">\n          <span class="lake-image-warning" style="display: none;">\n            <i class="anticon anticon-exclamation-circle">\n              <svg viewBox="64 64 896 896" class="" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">\n                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM488 576h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>\n              </svg>\n            </i>\n          </span>\n          '.concat(imgHtml, '\n          ').concat(progressHtml, '\n          ').concat(maximize, '\n        </span>\n      </span>\n    </span>\n  </span>\n  ');
};

class ImageNode {
  constructor(config) {
    this.destroy = () => {
      window.removeEventListener('resize', this.onWindowResize);
    };

    this.focus = () => {
      if (this.readonly) {
        return;
      }
      this.root.addClass('lake-image-active');
      if (this.status === 'done') {
        this.destroyEditor();
        this.renderEditor();
      }
    };

    this.blur = () => {
      if (this.readonly) {
        return;
      }
      this.root.removeClass('lake-image-active');
      if (this.status === 'done') {
        this.destroyEditor();
      }
      Engine.$('div[data-lake-element=embed-tooltip]').remove();
    };

    this.getMaxWidth = function (sectionRoot) {
      const block = Engine.ChangeUtils.getClosestBlock(sectionRoot);
      return block[0].clientWidth - 6;
    };

    this.isSvg = () => {
      return this.src.endsWith('.svg') || this.src.startsWith('data:image/svg+xml');
    };

    this.getValue = () => {
      const {width, height, src, originWidth, originHeight, display, align, angle, link, linkTarget, status} = this;
      const {name, size} = this.config.value;
      const newValue = {
        src,
        originWidth,
        originHeight,
        name,
        size,
        display,
        align,
        angle,
        link,
        linkTarget,
        status,
      };

      if (isBase64Image(newValue.src)) {
        delete newValue.src;
      }

      if (width) {
        newValue.width = width;
      }
      if (height) {
        newValue.height = height;
      }
      return newValue;
    };

    this.onWindowResize = () => {
      const sectionRoot = this.section.closest(this.root);
      if (!sectionRoot) {
        return;
      }

      this.maxWidth = this.getMaxWidth(sectionRoot);
      this.resetImageSize();
      const width = this.image[0].clientWidth;
      const height = this.image[0].clientHeight;

      if (this.resizer) {
        this.resizer.maxWidth = this.maxWidth;
        this.resizer.setSize(width, height);
      }
    };

    this.handleChangeSize = (width, height) => {
      const sectionRoot = this.section.closest(this.root);
      if (!sectionRoot) {
        return;
      }
      this.changeSize(width, height);
      const value = this.getValue();
      this.section.setValue(sectionRoot, value);
      this.engine.history.save();
      // 图片侧边栏存在，同时更新侧边栏数据
      if (this.engine.sidebar.activate === 'image') {
        this.setSidebar();
      }
    };

    this.setSidebar = () => {
      const value = this.getValue();
      this.engine.sidebar.set({
        name: 'image',
        title: this.locale.preferences,
        className: 'lake-image-sidebar',
        data: value,
        showCloseBtn: false,
      });
    };

    this.changeSize = (width, height) => {
      if (width < 24) {
        width = 24;
        height = width * this.rate;
      }

      if (width > this.maxWidth) {
        width = this.maxWidth;
        height = width * this.rate;
      }

      if (height < 24) {
        height = 24;
        width = height / this.rate;
      }

      width = Math.round(width);
      height = Math.round(height);
      this.width = width;
      this.height = height;
      this.image.css({
        width: ''.concat(width, 'px'),
        height: ''.concat(height, 'px'),
      });
      this.destroyEditor();
      this.renderEditor();
    };

    this.changeDisplay = (sectionRoot, display) => {
      const value = this.getValue();
      if (display === 'block' && value.align) {
        sectionRoot.addClass('lake-section-block');
        if (value.display === 'inline' && this.engine) {
          const align = this.engine.command.queryState('alignment');
          if (align) {
            value.align = align;
            this.align = align;
          }
          this.engine.command.execute('alignment', '');
        }
        sectionRoot.addClass('lake-image-'.concat(value.align));
      } else {
        if (value.display === 'block' && this.engine) {
          const align = this.engine.command.queryState('alignment');
          if (align) {
            value.align = align;
            this.align = align;
          }
        }
        sectionRoot.removeClass('lake-section-block');
        sectionRoot.removeClass('lake-image-left');
        sectionRoot.removeClass('lake-image-center');
        sectionRoot.removeClass('lake-image-right');
        sectionRoot.removeClass('lake-image-justify');
        if (this.engine) {
          this.engine.command.execute('alignment', value.align);
        }
      }
      this.display = display;
    };

    this.changeLink = (link, linkTarget) => {
      this.link = link;
      this.linkTarget = linkTarget;
    };

    this.openZoom = (e) => {
      if (!this.config.docEmbedView) {
        e.preventDefault();
        e.stopPropagation();

        const engine = this.config.engine || this.config.contentView;
        const imageArray = [];
        const sectionRoot = this.sectionRoot;
        let rootIndex = 0;

        engine.container.find('[data-section-key="image"]').toArray().filter((imgSection) => {
          imgSection = Engine.$(imgSection);
          return imgSection.find('[data-role="image"]').length > 0;
        }).forEach((imgSection, index) => {
          imgSection = Engine.$(imgSection);
          const image = imgSection.find('[data-role="image"]');
          const value = engine.section.getValue(imgSection);
          const imageWidth = parseInt(image.css('width'));
          const imageHeight = parseInt(image.css('height'));
          const width = value.width || imageWidth;
          const height = value.height || imageHeight;
          const originWidth = value.originWidth || imageWidth * winPixelRatio;
          const originHeight = value.originHeight || imageHeight * winPixelRatio;
          const maxWidth = mobile ? 1e3 : 4e3;
          const src = convWebp(value.src, isSupportWebp);
          const resizeSrc = getResizeSrc({
            maxWidth,
            src,
            data: {
              width,
              originWidth,
              originHeight,
            },
          });
          const msrc = image.attr('src');
          imageArray.push(
            resizeSrc ? {
              src: resizeSrc,
              msrc,
              w: maxWidth,
              h: height / width * maxWidth,
            } : {
              src,
              msrc,
              w: originWidth,
              h: originHeight,
            }
          );
          if (imgSection[0] === sectionRoot[0]) {
            rootIndex = index;
          }
        });
        pswp.open(imageArray, rootIndex);
      }
    };

    this.closeZoom = () => {
      pswp.close();
    };

    this.resetImageSize = () => {
      this.detailInner.css({
        'background-color': '',
        width: '',
        height: '',
      });

      this.image.css({
        width: '',
        height: '',
      });

      const img = this.image[0];
      let width = this.width;
      let height = this.height;

      if (typeof width === 'number' && !height) {
        height = Math.round(this.rate * width);
      } else if (!width && typeof height === 'number') {
        width = Math.round(height / this.rate);
      } else if (typeof width === 'number' && typeof height === 'number') {
        // 修正非正常的比例
        height = Math.round(this.rate * width);
        this.height = height;
      } else {
        width = img.clientWidth;
        height = img.clientHeight;
        // fix：svg 图片宽度 300px 问题
        if (this.isSvg() && this.originWidth && this.originHeight) {
          width = this.originWidth;
          height = this.originHeight;
        }
      }

      if (width > this.maxWidth) {
        width = this.maxWidth;
        height = Math.round(width * this.rate);
      }

      this.image.css('width', ''.concat(width, 'px'));
      this.image.css('height', ''.concat(height, 'px'));
    };

    this.addToolbarDelete = (itemList) => {
      itemList.push({
        type: 'button',
        name: 'delete',
        iconName: 'delete',
        title: this.config.locale.delete,
        onClick: this.config.onRemove,
      });
    };

    this.onLoad = () => {
      const sectionRoot = this.section.closest(this.root);
      if (!sectionRoot) {
        return;
      }

      if (this.status === 'done') {
        this.root.find('.lake-image-content').addClass('lake-image-content-isvalid');
        this.root.find('.lake-image-content').removeClass('lake-image-content-istmp');
      }

      const img = this.image[0];
      const originWidth = img.naturalWidth;
      const originHeight = img.naturalHeight;
      this.rate = originHeight / originWidth;
      this.originWidth = originWidth;
      this.originHeight = originHeight;

      if (this.scaleByPixelRatio) {
        this.width = originWidth / winPixelRatio;
        this.height = originHeight / winPixelRatio;
      }

      this.resetImageSize();
      this.image.css('visibility', 'visible');
      this.image.css('background-color', '');
      this.image.css('background-repeat', '');
      this.image.css('background-position', '');
      this.image.css('background-image', '');

      if (!this.width) {
        this.width = originWidth;
      }
      if (!this.height) {
        this.height = originHeight;
      }

      if (!this.readonly) {
        const value = this.getValue();
        this.section.setValue(sectionRoot, value);
      }
      window.removeEventListener('resize', this.onWindowResize);
      window.addEventListener('resize', this.onWindowResize);
      // 重新调整拖动层尺寸
      if (this.resizer) {
        this.resizer.setSize(img.clientWidth, img.clientHeight);
      }
    };

    this.onError = () => {
      this.container.empty();
      const root = Engine.$(template({
        data: Object.assign({}, this.config.value, {
          status: 'error',
          message: this.locale.loadFailed,
        }),
      }));
      this.container.append(root);
    };

    this.config = config;
    this.readonly = !config.engine;
    this.locale = config.locale;
    const onBeforeRenderImage = config[config.engine ? 'engine' : 'contentView'].options.onBeforeRenderImage;
    this.maxWidth = this.getMaxWidth(config.sectionRoot);
    this.src = config.src;
    this.root = Engine.$(template({
      data: config.value,
      src: this.src,
      locale: this.locale,
      readonly: this.readonly,
      maxWidth: this.maxWidth,
      onBeforeRenderImage,
    }));
    if (config.docEmbedView) this.root.addClass('doc-embed-view');
    this.image = this.find('image');
    this.detail = this.find('detail');
    this.detailInner = this.detail.find('.lake-image-meta');
    this.engine = config.engine;
    this.section = config.section;

    if (config.engine) {
      this.options = config.engine.options.image || {};
    }
    // 默认状态
    this.status = config.value.status;
    this.width = config.value.width;
    this.height = config.value.height;
    this.scaleByPixelRatio = config.value.scaleByPixelRatio;
    this.display = config.value.display;
    this.align = config.value.align;
    this.link = config.value.link;
    this.linkTarget = config.value.linkTarget;
  }

  find(role) {
    return this.root.find('[data-role='.concat(role, ']'));
  }

  destroyEditor() {
    if (this.resizer) {
      this.resizer.destroy();
    }
  }

  renderEditor() {
    const width = this.image[0].clientWidth;
    const height = this.image[0].clientHeight;

    if (!width || !height) {
      return;
    }

    const sectionRoot = this.section.closest(this.root);
    this.rate = height / width;
    // 拖动调整图片大小
    const resizer = new Resizer({
      src: this.src,
      width,
      height,
      rate: this.rate,
      angle: this.angle,
      maxWidth: this.maxWidth,
      onChange: this.handleChangeSize,
      openZoom: this.openZoom,
      onClose: () => {
        this.engine.change.focus();
        const range = this.engine.change.getRange();
        this.section.focus(range, sectionRoot, false);
      },
    });
    resizer.render(this.detail);
    this.resizer = resizer;
  }

  render(container) {
    this.sectionRoot = this.section.closest(container);
    this.container = container;
    this.maxWidth = this.getMaxWidth(this.sectionRoot);
    // 阅读模式，不展示错误提示
    if (this.readonly) {
      if (this.status === 'error') return;
      if (this.status === 'uploading') this.status = 'done';
    }
    // 上传失败
    if (this.status === 'error') {
      container.append(this.root);
      return;
    }

    if (this.status === 'uploading') {
      this.find('progress').show();
    } else {
      this.find('progress').remove();
    }

    if (this.readonly) {
      if (this.width && this.height) {
        let width = this.width;
        let height = this.height;
        if (width > this.maxWidth) {
          width = this.maxWidth;
          height = Math.round(width * this.height / this.width);
        }
        this.image.css('width', `${width}px`);
        this.image.css('height', `${height}px`);
        this.image.css('background-color', '#FAFAFA');
        this.image.css('background-repeat', 'no-repeat');
        this.image.css('background-position', 'center');
        this.image.css('background-image', "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjhweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjggMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5pbWFnZS1maWxs5aSH5Lu9PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9Iuafpeeci+WbvueJh+S8mOWMljQuMCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWKoOi9veWbvueJhyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU3Mi4wMDAwMDAsIC01MDYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpbWFnZS1maWxs5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NzAuMDAwMDAwLCA1MDEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yOSw1IEwzLDUgQzIuNDQ2ODc1LDUgMiw1LjQ0Njg3NSAyLDYgTDIsMjYgQzIsMjYuNTUzMTI1IDIuNDQ2ODc1LDI3IDMsMjcgTDI5LDI3IEMyOS41NTMxMjUsMjcgMzAsMjYuNTUzMTI1IDMwLDI2IEwzMCw2IEMzMCw1LjQ0Njg3NSAyOS41NTMxMjUsNSAyOSw1IFogTTEwLjU2MjUsOS41IEMxMS42NjU2MjUsOS41IDEyLjU2MjUsMTAuMzk2ODc1IDEyLjU2MjUsMTEuNSBDMTIuNTYyNSwxMi42MDMxMjUgMTEuNjY1NjI1LDEzLjUgMTAuNTYyNSwxMy41IEM5LjQ1OTM3NSwxMy41IDguNTYyNSwxMi42MDMxMjUgOC41NjI1LDExLjUgQzguNTYyNSwxMC4zOTY4NzUgOS40NTkzNzUsOS41IDEwLjU2MjUsOS41IFogTTI2LjYyMTg3NSwyMy4xNTkzNzUgQzI2LjU3ODEyNSwyMy4xOTY4NzUgMjYuNTE4NzUsMjMuMjE4NzUgMjYuNDU5Mzc1LDIzLjIxODc1IEw1LjUzNzUsMjMuMjE4NzUgQzUuNCwyMy4yMTg3NSA1LjI4NzUsMjMuMTA2MjUgNS4yODc1LDIyLjk2ODc1IEM1LjI4NzUsMjIuOTA5Mzc1IDUuMzA5Mzc1LDIyLjg1MzEyNSA1LjM0Njg3NSwyMi44MDYyNSBMMTAuNjY4NzUsMTYuNDkzNzUgQzEwLjc1NjI1LDE2LjM4NzUgMTAuOTE1NjI1LDE2LjM3NSAxMS4wMjE4NzUsMTYuNDYyNSBDMTEuMDMxMjUsMTYuNDcxODc1IDExLjA0Mzc1LDE2LjQ4MTI1IDExLjA1MzEyNSwxNi40OTM3NSBMMTQuMTU5Mzc1LDIwLjE4MTI1IEwxOS4xLDE0LjMyMTg3NSBDMTkuMTg3NSwxNC4yMTU2MjUgMTkuMzQ2ODc1LDE0LjIwMzEyNSAxOS40NTMxMjUsMTQuMjkwNjI1IEMxOS40NjI1LDE0LjMgMTkuNDc1LDE0LjMwOTM3NSAxOS40ODQzNzUsMTQuMzIxODc1IEwyNi42NTkzNzUsMjIuODA5Mzc1IEMyNi43NDA2MjUsMjIuOTEyNSAyNi43MjgxMjUsMjMuMDcxODc1IDI2LjYyMTg3NSwyMy4xNTkzNzUgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjRThFOEU4Ij48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==')");
      }
    } else {
      this.image.css('visibility', 'hidden');
    }

    this.image.on('load', this.onLoad);
    this.image.on('error', this.onError);
    container.append(this.root);
    // 表格单元格的阅读态不做图片缩放
    if (!(this.readonly && this.image.isEditable())) {
      const maximizeBtn = this.find('maximize');
      this.root.on('mouseenter', () => {
        return maximizeBtn.show();
      });
      this.root.on('mouseleave', () => {
        return maximizeBtn.hide();
      });

      if (this.readonly) {
        const linkNode = this.image.closest('a');
        if (linkNode.length === 0) {
          this.image.on('click', this.openZoom);
        }
      }
      // 无链接
      this.image.on('dblclick', this.openZoom);
      maximizeBtn.on('click', this.openZoom);
    }

    // 避免图片抖动，让加载过程比较好看
    if (!isBase64Image(this.src) && ( // 远程 URL
      this.status === 'uploading' || this.status === 'done')) {
      const isLoaded = !!this.image[0].clientHeight;
      // 只有在上传过程中加背景
      if (this.status === 'uploading' && !isLoaded) {
        this.detailInner.css('background-color', '#F5F5F5');
      }
      // 图片比编辑器大
      if (typeof this.width === 'number' && this.width > this.maxWidth) {
        this.detailInner.css('width', ''.concat(this.maxWidth, 'px'));
        // 图片比编辑器小
      } else {
        if (this.width) {
          let _width = this.width;
          _width = typeof _width === 'number' ? ''.concat(_width, 'px') : _width;
          this.detailInner.css('width', _width);
        } else {
          !isLoaded && this.detailInner.css('width', '300px');
        }

        if (this.height) {
          let height = this.height;
          height = typeof height === 'number' ? ''.concat(height, 'px') : height;
          this.detailInner.css('height', height);
        } else {
          !isLoaded && this.detailInner.css('height', '200px');
        }
      }
    }
  }
}

export default ImageNode;
