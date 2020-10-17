import React from 'react';
import ReactDOM from 'react-dom';
import Engine from 'doc-engine/lib';
import CodeMirror from 'codemirror';
import debounce from 'lodash/debounce';
import { message } from 'antd';
import runMode from './run-mode';
import Header from './header';
import modeConfig from './mode-config';
import 'antd/lib/message/style';
import SectionBase from '../base';
import './index.css';

const { StringUtils, $ } = Engine;
// Map: 代码块支持的模式 -> 名称

const qa = [
  'c',
  'cpp',
  'csharp',
  'erlang',
  'go',
  'groovy',
  'java',
  'kotlin',
  'makefile',
  'objectivec',
  'perl',
  'python',
  'rust',
  'swift',
  'vbnet',
];

export const MODE_NAME_MAP = {};
// Map: 代码块支持的模式 -> 在 codemirror 中的语法 mode
export const MODE_SYNTAX_MAP = {};
modeConfig.forEach((item) => {
  MODE_NAME_MAP[item.value] = item.name;
  MODE_SYNTAX_MAP[item.value] = item.syntax;
});
// 传给 CodeMirror 的 mode
const getCodeMirrorMode = (mode) => {
  return MODE_SYNTAX_MAP[mode] || mode;
};

export const template = (data) => {
  const escape = StringUtils.escape;
  const mode = data.mode;
  return '\n  <div class="lake-codeblock lake-codeblock-'.concat(
    escape(mode),
    '">\n    <div class="lake-codeblock-header"></div>\n    <div class="lake-codeblock-content"></div>\n  </div>\n  ',
  );
};

export const setMode = (root, mode, code) => {
  mode = getCodeMirrorMode(mode);
  const stage = $('<div class="CodeMirror"><pre class="cm-s-default" /></div>');
  root.append(stage);
  const pre = stage.find('pre')[0];
  runMode(code || '', mode, pre, {
    tabSize: 2,
  });
};

class CodeBlock extends SectionBase {
  constructor(engine) {
    super();
    this.engine = engine;
    if (!engine) {
      return;
    }
    const viewEngine = this.getViewEngine();
    this.section = engine.section;
    this.locale = viewEngine.locale.codeBlock;

    const options = this.loadOptions();
    this.mode = MODE_NAME_MAP[options.mode] ? options.mode : 'plain';
  }

  adaptMode = (value) => {
    // 是指定语言类型
    if (MODE_NAME_MAP[value.mode]) {
      return value.mode;
    }
    return this.mode;
  };

  saveValue = () => {
    // 中文输入过程需要判断
    if (this.engine.domEvent.isComposing) {
      return;
    }
    const code = this.codeMirror.getValue();
    this.section.setValue(this.sectionRoot, {
      mode: this.mode,
      code,
    });
  };

  focusToCodeEditor = () => {
    this.codeMirror.focus();
  };

  loadOptions() {
    const options = localStorage.getItem('lake-codeblock');
    if (options) {
      try {
        return JSON.parse(options);
      } catch (e) {
      }
    }
    return {};
  }

  setOptions(options) {
    localStorage.setItem('lake-codeblock', JSON.stringify(options));
  }

  embedToolbar() {
    const options = this.engine ? this.engine.options : this.contentView.options;
    const config = options.codeblock || {};
    const embed = options.type === 'mini' || options.type === 'mobile'
      ? [
        {
          type: 'copy',
        },
        {
          type: 'separator',
        },
        {
          type: 'copyContent',
          tips: this.getViewEngine().locale.codeBlock.copyCode,
        },
        {
          type: 'delete',
        },
      ]
      : [
        {
          type: 'dnd',
        },
        {
          type: 'copy',
        },
        {
          type: 'separator',
        },
        {
          type: 'copyContent',
          tips: this.getViewEngine().locale.codeBlock.copyCode,
        },
        {
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

  copyContent() {
    const successText = this.getViewEngine().locale.codeBlock.copySuccess;
    Engine.ClipboardUtils.copyText(this.codeArea.text());
    message.success(successText);
  }

  destroy() {
  }

  activate() {
    if (!this.state.readonly) {
      this.resizeController.show();
    }
  }

  unactivate() {
    this.setOptions({
      mode: this.mode,
    });
    this.saveValue();
    if (!this.state.readonly) {
      this.resizeController.hide();
    }
  }

  /**
   * 适配 section 取值为当前支持的标准模式
   *
   * @param {object} value section 取值
   * @param {string} value.mode section 存储的代码格式
   * @return {string} 归一化后的合法代码格式
   */
  renderToolbar() {
    this.blockHeader = this.container.find('.lake-codeblock-header');

    if (!this.engine) {
      this.blockHeader.remove();
      return;
    }

    const headerDom = this.blockHeader[0];
    ReactDOM.render(
      <Header
        defaultValue={this.mode}
        onSelect={(value) => {
          this.mode = value;
          this.updateMode(this.mode);
          this.saveValue();
          this.focusToCodeEditor();
        }}
        locale={this.locale}
        getPopupContainer={() => {
          return headerDom;
        }}
      />,
      headerDom,
    );
  }

  /**
   *
   * @param {string} mode codemirror 中的代码模式 https://codemirror.net/mode/
   * @param {string} code 代码取值
   */
  createCodeEditor(mode, code) {
    const config = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    this.codeMirror = CodeMirror(
      this.codeArea[0],
      Object.assign(
        {
          mode,
          value: code,
          lineNumbers: true,
          lineWrapping: false,
          styleActiveLine: false,
          matchBrackets: true,
          autofocus: false,
          dragDrop: false,
          tabSize: 2,
          readOnly: false,
          scrollbarStyle: 'null',
          viewportMargin: 1 / 0,
        },
        config,
      ),
    );

    this.codeMirror.on('focus', () => {
      this.engine.toolbar.disable(true);
    });

    this.codeMirror.on('blur', () => {
      this.engine.toolbar.disable(false);
    });

    this.codeMirror.on(
      'change',
      debounce(() => {
        this.engine.change.onChange(this.engine.change.getValue());
        this.saveValue();
      }, 1e3),
    );

    this.codeMirror.setOption('extraKeys', {
      Enter: (mirror) => {
        const cfg = this.getCfg(mirror.getValue());
        for (const item in cfg) mirror.setOption(item, cfg[item]);
        mirror.execCommand('newlineAndIndent');
      },
    });
  }

  getCfg(value) {
    const mode = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.mode;
    let tabSize = this.codeMirror
      ? this.codeMirror.getOption('indentUnit')
      : qa.includes(mode)
        ? 4
        : 2;
    let reg;
    if (value) {
      reg = value.match(/^ {2,4}(?=[^\s])/gm);
    }
    if (reg) {
      tabSize = reg.reduce((val1, val2) => {
        return Math.min(val1, val2.length);
      }, 1 / 0);
    }
    return {
      tabSize,
      indentUnit: tabSize,
    };
  }

  updateMode(mode) {
    const syntax = getCodeMirrorMode(mode);
    const code = this.codeMirror.getValue();
    const cfg = this.getCfg(code, mode);
    this.codeArea.empty();
    this.createCodeEditor(syntax, code || '', cfg);
  }

  // 阅读模式渲染代码
  renderCode(code) {
    this.codeArea = this.container.find('.lake-codeblock-content');
    setMode(this.codeArea, this.mode, code);
  }

  // 编辑模式渲染编辑器
  renderEditor(code) {
    this.sectionRoot = this.section.closest(this.container);
    this.codeArea = this.container.find('.lake-codeblock-content');
    const mode = getCodeMirrorMode(this.mode);
    const cfg = this.getCfg(code, mode);
    this.createCodeEditor(mode, code || '', cfg);

    this.container.on('click', (e) => {
      const hasSelect = $(e.target).closest('.ant-select');
      if (!hasSelect || hasSelect.length === 0) this.focusToCodeEditor();
    });
    this.addResizeController(this.codeArea);
  }

  render(container, value) {
    value = value || {};
    this.mode = this.adaptMode(value);
    // 初始化 section 节点
    container.append(
      template({
        mode: this.mode,
      }),
    );
    // 渲染工具条
    this.renderToolbar();
    // 渲染主体
    if (this.engine) {
      this.renderEditor(value.code);
    } else {
      this.renderCode(value.code);
    }
    const height = this.value.height;
    if (height) {
      this.codeArea.css('height', `${height}px`);
    }
  }
}

CodeBlock.type = 'block';
export default CodeBlock;
