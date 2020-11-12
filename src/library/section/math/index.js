import React from 'react';
import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine/lib';
import debounce from 'lodash/debounce';
import { preview } from '../../utils/image-generator';
import Toolbar from './toolbar';
import {
  addScrollAndResizeEventListener,
  bindKeydownEvent,
  removeScrollAndResizeEventListener,
  setCursor,
} from '../../utils/event';
import SectionBase from '../base';

class Math extends SectionBase {
  constructor() {
    super();
    this.renderMath = debounce(this._renderMath, 300);
  }

  renderImage(ele) {
    const maxWidth = this.getMaxWidth();
    const node = ele[0];
    const { naturalWidth, naturalHeight } = node;

    const width = parseInt((14 / 17.4) * naturalWidth);
    const height = parseInt((14 / 17.4) * naturalHeight);
    ele.css('width', ''.concat(width, 'px'));
    ele.css('height', ''.concat(height, 'px'));
    ele.css('max-width', ''.concat(maxWidth, 'px'));
    this.setValue({
      width,
      height,
    });
  }

  exConvertToPx(svg) {
    const regWidth = /width="([\d\\.]+ex)"/;
    const widthMaths = regWidth.exec(svg);
    const exWidth = widthMaths ? widthMaths[1] : null;

    const regHeight = /height="([\d\\.]+ex)"/;
    const heightMaths = regHeight.exec(svg);
    const exHeight = heightMaths ? heightMaths[1] : null;

    if (exWidth) {
      const pxWidth = exWidth.substring(0, exWidth.length - 2) * 9;
      svg = svg.replace(`width="${exWidth}"`, `width="${pxWidth}px"`);
    }

    if (exHeight) {
      const pxHeight = exHeight.substring(0, exHeight.length - 2) * 9;
      svg = svg.replace(`height="${exHeight}"`, `height="${pxHeight}px"`);
    }
    return svg;
  }

  _renderMath(code) {
    preview('latex', code)
      .then((res) => {
        this.hasSave = false;
        if (res.success) {
          res.svg = this.exConvertToPx(res.svg);
          const svg = `data:image/svg+xml,${
            encodeURIComponent(res.svg)
              .replace(/'/g, '%27')
              .replace(/"/g, '%22')}`;
          const image = new Image();
          image.src = svg;
          image.onload = () => {
            this.renderImage(Engine.$(image));
            this.viewContainer.empty();
            this.viewContainer.append(image);
            this.updateEditorPosition();
          };
          this.svg = res.svg;
          this.setValue(
            {
              src: svg,
              code,
            },
            false,
          );
        } else {
          this.renderPureText(code);
          this.svg = undefined;
          this.setValue(
            {
              src: null,
              code,
            },
            false,
          );
        }
      });
  }

  getMaxWidth() {
    const engine = this.getViewEngine();
    const style = window.getComputedStyle(engine.container[0]);
    const width = parseInt(style.width) - parseInt(style['padding-left']) - parseInt(style['padding-right']);
    return this.state.readonly ? width : width - 2;
  }

  renderPureText(text) {
    const maxWidth = this.getMaxWidth();
    this.viewContainer.html(
      '<span class="lake-math-content-tmp" style="max-width: '
        .concat(maxWidth, 'px">')
        .concat(text, '</span>'),
    );
    this.updateEditorPosition();
  }

  focusTextarea() {
    this.editorContainer.find('textarea')[0].focus();
  }

  unactivate() {
    if (!this.state.readonly) {
      this.engine.readonly(false);
      this.editorContainer.hide();
      removeScrollAndResizeEventListener(this);
    }
  }

  updateEditorPosition() {
    if (this.editorContainer) {
      const clientRect = this.viewContainer.getBoundingClientRect();
      this.editorContainer.css('left', ''.concat(clientRect.left, 'px'));
      this.editorContainer.css('top', ''.concat(clientRect.bottom + 8, 'px'));
    }
  }

  activate() {
    if (!this.state.readonly) {
      this.editorContainer.show();
      this.updateEditorPosition();
      addScrollAndResizeEventListener(this);
    }
  }

  renderView() {
    const { value, container, locale } = this;
    const { src, code, width, height } = value;
    const mathContainer = Engine.$('<span class="lake-math-container"></span>');
    container.append(mathContainer);
    this.viewContainer = mathContainer;
    if (src) {
      const image = Engine.$('<img src="'.concat(src, '" />'));
      mathContainer.append(image);
      if (width) {
        image.css('wdith', ''.concat(width, 'px'));
      }
      if (height) {
        image.css('height', ''.concat(height, 'px'));
      }
      this.img = image;
      image[0].onload = () => {
        this.renderImage(image);
      };

      image[0].onerror = () => {
        this._renderMath(code);
      };
    } else if (code) {
      if (this.state.readonly) {
        this.renderPureText(code);
      } else {
        this._renderMath(code);
      }
    } else {
      this.renderPureText(locale.placeholder);
    }
    if (!this.state.readonly) {
      setCursor(mathContainer);
    }
  }

  onChange(code) {
    this.code = code;
    this.renderMath(code);
  }

  renderEditor() {
    const { container, value, engine, sectionRoot, locale } = this;
    const editorContainer = Engine.$('<div class="lake-section-math-editor"></div>');
    this.editorContainer = editorContainer;
    container.append(editorContainer);
    bindKeydownEvent({
      editorContainer,
      engine,
      sectionRoot,
      callback: (event) => {
        return event.keyCode === 27 || (event.keyCode === 13 && (event.ctrlKey || event.metaKey));
      },
    });
    const options = engine.options.math || {};
    ReactDOM.render(
      <Toolbar
        code={value.code}
        locale={locale}
        options={options}
        onFocus={() => {
          editorContainer.addClass('textarea-focus');
          this.engine.readonly(true);
        }}
        onBlur={() => {
          editorContainer.removeClass('textarea-focus');
        }}
        onChange={(code) => {
          this.onChange(code);
        }}
      />,
      editorContainer[0],
      () => {
        editorContainer.find('[data-role="save"]')
          .on('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            engine.change.activateSection(document.body, 'manual');
            engine.change.focusSection(sectionRoot);
          });
        const textarea = editorContainer.find('textarea');
        textarea.on('mousedown', () => {
          textarea[0].focus();
        });
      },
    );
    this.bindEvent(engine.asyncEvent, 'save:before', () => {
      if (this.hasSave === false) {
        return preview('latex', this.code)
          .then((res) => {
            if (!res.success) return;
            res.svg = this.exConvertToPx(res.svg);
            const src = `data:image/svg+xml,${
              encodeURIComponent(res.svg)
                .replace(/'/g, '%27')
                .replace(/"/g, '%22')}`;
            this.svg = res.svg;
            this.hasSave = true;
            this.setValue(
              {
                src,
                code: this.code,
              },
              false,
            );
          });
      }
    });
  }

  getDefaultValue() {
    return {
      src: null,
      code: '',
    };
  }

  render() {
    const locale = this.getViewEngine().locale.math;
    const value = this.getDefaultValue();
    this.locale = locale;
    this.value = this.value || {};
    this.value = Object.assign({}, value, {}, this.value);
    this.defaultValue = value;
    this.value.code ? (this.code = this.value.code) : (this.value.src = null);
    this.renderView();
    this.state.readonly || this.renderEditor();
  }

  destroy() {
    super.destroy.call(this);
    removeScrollAndResizeEventListener(this);
  }
}

Math.type = 'inline';
Math.selectStyleType = 'background';
export default Math;
