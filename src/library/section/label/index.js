import React from 'react';
import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine/lib';
import SectionBase from '../base';
import {
  addScrollAndResizeEventListener,
  bindKeydownEvent,
  removeScrollAndResizeEventListener,
  setCursor,
} from '../../utils/event';
import Palette from '../../utils/palette';
import InputLabel from './input';

const colors = Palette.getColors();
const backgroundColors = [[colors[2][0], colors[6][0]], [colors[2][3], colors[6][3]], [colors[2][4], colors[6][4]], [colors[0][6], colors[0][2]], [colors[2][6], colors[6][6]], [colors[2][7], colors[6][7]]];

const locale = {
  en: {
    defaultLabel: 'SET A STATUS',
  },
  'zh-cn': {
    defaultLabel: '\u8bbe\u7f6e\u72b6\u6001',
  },
};

class Label extends SectionBase {
  onChange(value) {
    this.setValue(value);
    this.updateLabel();
  }

  focusInput() {
    this.editorContainer.find('input')[0].focus();
  }

  unactivate() {
    if (this.state.readonly) return;
    this.editorContainer.hide();
    this.setValue({}, true);
    this.labelContainer.removeClass('lake-label-selected');
    this.engine.readonly(false);
    removeScrollAndResizeEventListener(this);
  }

  updateEditorPosition() {
    const client_rect = this.labelContainer.getBoundingClientRect();
    this.editorContainer.css('left', ''.concat(client_rect.left, 'px'));
    this.editorContainer.css('top', ''.concat(client_rect.top + 24, 'px'));
  }

  activate() {
    if (this.state.readonly) return;
    this.editorContainer.show();
    this.labelContainer.addClass('lake-label-selected');
    this.updateEditorPosition();
    addScrollAndResizeEventListener(this);
  }

  select() {
    this.labelContainer.addClass('lake-label-selected');
  }

  unselect() {
    if (!this.state.activated || this.state.readonly) {
      this.labelContainer.removeClass('lake-label-selected');
    }
  }

  selectByOther(color) {
    this.labelContainer.css('border', `2px solid ${color}`);
  }

  unselectByOther() {
    this.labelContainer.css('border', '');
  }

  updateLabel() {
    const {colorIndex, label} = this.value;
    const color = backgroundColors[colorIndex][1];
    let text = label;
    let opacity = 1;
    if (!label) {
      text = this.locale.defaultLabel;
      opacity = 0.45;
    }
    this.labelContainer.css('background', backgroundColors[colorIndex][0]);
    this.labelContainer.css('color', color);
    this.labelContainer.css('opacity', opacity);
    this.state.activated ? this.labelContainer.addClass('lake-label-selected') : this.labelContainer.removeClass('lake-label-selected');
    this.labelContainer.html(text);
  }

  renderView() {
    this.labelContainer = Engine.$('\n      <span class="lake-section-label-container"></span>\n    ');
    this.container.append(this.labelContainer);
    this.updateLabel();
    if (!this.state.readonly) {
      setCursor(this.labelContainer);
    }
  }

  renderEditor() {
    const {container, value, engine, sectionRoot} = this;
    const editorContainer = Engine.$('<div class="lake-section-label-editor"></div>');
    this.editorContainer = editorContainer;
    container.append(editorContainer);
    bindKeydownEvent({
      editorContainer,
      engine,
      sectionRoot,
    });
    ReactDOM.render(<InputLabel
      colors={backgroundColors.map((color) => {
        return color[0];
      })}
      onChange={(value) => {
        this.onChange(value);
      }}
      onFocus={() => {
        editorContainer.addClass('input-focus');
        this.engine.readonly(true);
      }}
      onBlur={() => {
        editorContainer.removeClass('input-focus');
      }}
      sectionValue={value}
      defaultValue={this.defaultValue}
    />, editorContainer[0]);
  }

  getDefaultValue() {
    return {
      label: '',
      colorIndex: 0,
    };
  }

  render() {
    const lang = this.getLang();
    this.locale = locale[lang];
    const value = this.getDefaultValue();
    this.value = this.value || {};
    this.value = Object.assign({}, value, {}, this.value);
    this.defaultValue = value;
    this.renderView();
    if (!this.state.readonly) {
      this.renderEditor();
    }
  }

  destroy() {
    super.destroy.call(this);
    removeScrollAndResizeEventListener(this);
  }
}

Label.type = 'inline';
export default Label;
