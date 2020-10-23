import Engine from 'doc-engine/lib';
import { getHeight, getWidth } from '../utils/dom';

class SectionBase {
  constructor() {
    this.onBeforeRenderImage = (src) => {
      return this.getOptions().onBeforeRenderImage(src);
    };
    this.events = [];
  }

  embedToolbar() {
  }

  toolbar() {
  }

  maximize() {
  }

  restore() {
  }

  render() {
  }

  activate() {
  }

  unactivate() {
  }

  saveValue() {
  }

  select() {
    const { container } = this;
    if (container[0].childNodes.length > 0) {
      container.addClass(this.constructor.selectStyleType === 'background' ? 'lake-selected-background' : 'lake-selected-outline');
    }
  }

  unselect() {
    const { container } = this;
    if (container[0].childNodes.length > 0) {
      container.removeClass(this.constructor.selectStyleType === 'background' ? 'lake-selected-background' : 'lake-selected-outline');
    }
  }

  selectByOther(outline, background) {
    const { container } = this;
    if (container[0].childNodes.length > 0) {
      if (this.constructor.selectStyleType === 'background') {
        container.css('background', background);
      } else {
        container.css('outline', `2px solid ${outline}`);
      }
    }
  }

  unselectByOther() {
    const { container } = this;
    if (container[0].childNodes.length > 0) {
      container.css(this.constructor.selectStyleType === 'background' ? 'background' : 'outline', '');
    }
  }

  activateByOther(outline, background) {
    return this.selectByOther(outline, background);
  }

  unactivateByOther() {
    this.unselectByOther();
  }

  getContainerWidth() {
    return getWidth(this.container[0]);
  }

  getContainerHeight() {
    return getHeight(this.container[0]);
  }

  addResizeController(container) {
    let height;
    let start;
    let
      cssHeight;
    this.resizeController = this.createResizeController({
      container: this.container,
      dragstart: () => {
        height = getHeight(container[0]);
        start = true;
      },
      dragmove: (y) => {
        if (start) {
          container.css('height', `${cssHeight = (cssHeight = height + y) < 80 ? 80 : cssHeight}px`);
        }
      },
      dragend: () => {
        if (start) {
          this.setValue({
            height: getHeight(container[0]),
          });
          start = false;
        }
      },
    });
    this.resizeController.hide();
  }

  createResizeController(cfg) {
    const { container, dragstart, dragmove, dragend } = cfg;
    const resizeImg = Engine.$('<div class="section-resize-button-ud" draggable="true" />');
    let point;
    container.append(resizeImg);
    this.bindEvent(resizeImg, 'dragstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      point = {
        x: e.clientX,
        y: e.clientY,
      };
      dragstart(point);
    });

    this.bindEvent(Engine.$(document), 'mousemove', (e) => {
      if (point) {
        dragmove(e.clientY - point.y);
      }
    });

    this.bindEvent(Engine.$(document), 'mouseup', () => {
      point = undefined;
      dragend();
    });

    resizeImg.on('click', (event) => {
      event.stopPropagation();
    });
    return resizeImg;
  }

  destroy() {
    this.destroyed = true;
    this.removeEvent();
  }

  removeEvent() {
    this.events.forEach((event) => {
      const { element, type, callback } = event;
      element.off(type, callback);
    });
    this.events = [];
  }

  getViewEngine() {
    return this.engine || this.contentView;
  }

  bindEvent(element, type, callback) {
    element.on(type, callback);
    this.events.push({
      element,
      callback,
      type,
    });
  }

  getOptions() {
    return this.state.readonly ? this.contentView.options : this.engine.options;
  }

  getLang() {
    return this.getOptions().lang;
  }

  setValue(value, saveHistory) {
    const sectionRoot = this.sectionRoot;
    const readonly = this.state.readonly;

    if (!readonly && value) {
      const { section, history, change } = this.engine;
      section.setValue(sectionRoot, Object.assign(this.value, value));

      if (saveHistory) {
        history.save();
      } else {
        change.change();
      }
    }
  }

  remove() {
    if (!this.state.readonly) {
      this.engine.change.removeSection(this.sectionRoot);
    }
  }
}

SectionBase.canSearch = false;
export default SectionBase;
