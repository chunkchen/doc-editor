import React from 'react';
import classnames from 'classnames';
import CodeMirror from 'codemirror';
import debounce from 'lodash/debounce';
import { Dropdown, Menu, Select, Tooltip } from 'antd';
import 'antd/lib/dropdown/style';
import 'antd/lib/icon/style';
import 'antd/lib/menu/style';
import 'antd/lib/select/style';
import 'antd/lib/tooltip/style';
import Engine from 'doc-engine/lib';
import Icon, { DownOutlined } from '@ant-design/icons';
import Template from './template';
import constants from './constants';
import Icons from './icons';
import TextDiagramViewer from './text-diagram-render';

const {
  userAgent: { macos },
} = Engine;
const {
  EDITOR_MODE,
  EDITOR_LAYOUT,
  TEXT_DIAGRAM_GUIDES,
  TEXT_DIAGRAM_SYNTAX,
  TEXT_DIAGRAM_TYPES,
  TEXT_DIAGRAMS,
} = constants;

class TextDiagramEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.switchType = (type) => {
      if (type !== this.state.type) {
        const syntax = this.getCodeMirrorMode(type);
        this.setState({
          type,
          mode: EDITOR_MODE.CODE,
          codeForPreview: null,
        });
        this.instance.codeMirror.setOption('mode', syntax);
        this.props.onDiagramTypeChange(type);
      }
    };

    this.switchLayout = (layout) => {
      this.setState({
        layout,
        mode: EDITOR_MODE.CODE,
      });

      const rootCenter = Engine.$(this.rootRef.current).closest('div[data-section-element=center]');
      const sectionResize = rootCenter.find('div.section-resize-button-ud');

      if (this.instance) {
        this.instance.focus();
      }
      // 在预览模式下切换为双栏模式时，重置 body 区域高度
      if (layout === EDITOR_LAYOUT.TWO_COLUMN) {
        const body = this.bodyRef.current;
        body.style.height = '100%';
        sectionResize.hide();
      } else {
        sectionResize.show();
      }
    };

    this.switchTemplate = (id) => {
      // console.log(`switch tpl: ${id}`);
      const template = Template.getTemplates(this.state.type);
      if (template) this.instance.codeMirror.setValue(template[id].text);
    };

    this.switchView = (mode) => {
      const value = this.instance.getValue();
      this.setState(
        {
          mode,
          codeForPreview: mode === EDITOR_MODE.PREVIEW ? value : null,
        },
        () => {
          // 切换为编辑模式时，修订 body 区域尺寸
          if (mode === EDITOR_MODE.CODE) {
            this.fixEditorBodySize();
          }
        },
      );
    };

    this.doPreview = () => {
      const code = this.instance.getValue();
      this.setState({
        codeForPreview: code,
      });
    };

    this.getHelpUrl = () => {
      return TEXT_DIAGRAM_GUIDES[this.state.type];
    };

    this.getRootDom = () => {
      return this.rootRef.current;
    };

    this.onPreviewDone = () => {
      this.fixEditorBodySize();
    };

    this.handlePreviewButtonClick = () => {
      const { mode, layout } = this.state;
      // 双栏模式直接执行预览
      if (layout === EDITOR_LAYOUT.TWO_COLUMN) {
        this.doPreview();
        return;
      }

      const rootCenter = Engine.$(this.rootRef.current).closest('div[data-section-element=center]');
      const sectionResize = rootCenter.find('div.section-resize-button-ud');

      if (mode === EDITOR_MODE.PREVIEW) {
        sectionResize.show();
        this.switchView(EDITOR_MODE.CODE);
        return;
      }

      if (mode === EDITOR_MODE.CODE) {
        sectionResize.hide();
        this.switchView(EDITOR_MODE.PREVIEW);
      }
    };

    this.needShowPreviewPanel = () => {
      if (this.state.layout === EDITOR_LAYOUT.TWO_COLUMN) return true;
      return this.state.mode === EDITOR_MODE.PREVIEW;
    };

    this.renderPreview = () => {
      const { mode, layout, codeForPreview } = this.state;
      // 单栏布局、代码模式，不渲染
      if (layout === EDITOR_LAYOUT.DEFAULT && mode === EDITOR_MODE.CODE) return null;
      // 无待预览代码，不渲染
      if (!codeForPreview) return null;
      return (
        <TextDiagramViewer
          type={this.state.type}
          code={codeForPreview}
          onBeforeRenderImage={this.props.onBeforeRenderImage}
          onLoad={this.onPreviewDone}
        />
      );
    };

    this.renderDiagramSelect = () => {
      return (
        <Select
          className="lake-diagram-select"
          showSearch
          defaultValue={this.props.type}
          size="small"
          style={{
            width: 128,
          }}
          getPopupContainer={this.getRootDom}
          onSelect={(type) => {
            this.switchType(type);
          }}
          filterOption={this.handlerFilter}
        >
          {TEXT_DIAGRAMS.map((item) => {
            return (
              <Select.Option name={item.name.toLowerCase()} value={item.type} key={item.name}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      );
    };
    this.state = {
      mode: EDITOR_MODE.CODE,
      type: props.type || TEXT_DIAGRAM_TYPES.PUML,
      layout: EDITOR_LAYOUT.DEFAULT,
      // 待预览代码
      codeForPreview: null,
    };
    this.rootRef = React.createRef(); // 代码编辑器宿主引用
    this.editorRef = React.createRef(); // 编辑框主体区域引用
    this.bodyRef = React.createRef(); // 支持的模板
    this.templates = Template.getTemplates(props.type); // 编辑器实例
    this.instance = null;
  }

  componentDidMount() {
    this.initEditor();
  }

  initEditor() {
    const textAreaDom = this.editorRef.current;
    const options = this.getOptions(this.props.type);
    const { isMaximize } = this.props;
    const doPreview = debounce(() => {
      this.doPreview();
    }, 300);
    // 构造代码编辑器
    const cm = CodeMirror.fromTextArea(textAreaDom, options);
    cm.on('change', () => {
      const value = cm.getValue();
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(value);
      }
      if (isMaximize()) {
        doPreview();
      }
    });
    // 点击编辑区域会触发 codemiror 的 focus()
    // 同时也会触发 section 绑定的 onclick 导致再次执行 focus()
    // 但 codemirror 做到了 focus 态时再执行 focus() 时不会再次触发 on focus 事件，

    cm.on('focus', () => {
      if (typeof this.props.onFocus === 'function') {
        this.props.onFocus();
      }
    });
    cm.on('blur', () => {
      if (typeof this.props.onBlur === 'function') {
        const value = cm.getValue();
        this.props.onBlur(value);
      }
    });
    this.instance = {
      codeMirror: cm,
      switchLayout: this.switchLayout,
      focus: () => {
        cm.focus();
      },
      getValue: () => {
        return cm.getValue();
      },
      doPreview: () => {
        this.doPreview();
      },
    };

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad({
        editor: this.instance,
      });
    }
  }

  getCodeMirrorMode() {
    return TEXT_DIAGRAM_SYNTAX[this.props.type] || 'simplemode';
  }

  getDiagramName(type) {
    const diagram = TEXT_DIAGRAMS.find(item => item.type === type);
    return diagram ? diagram.name : '';
  }

  getOptions(type) {
    return {
      tabSize: 2,
      mode: this.getCodeMirrorMode(type),
      lineNumbers: true,
      lineWrapping: false,
      indentWithTabs: true,
      styleActiveLine: false,
      matchBrackets: true,
      autofocus: false,
      dragDrop: false,
      readOnly: false,
      scrollbarStyle: 'null',
      viewportMargin: 1 / 0,
    };
  }

  // hack: 将 popover dorpdown 限定在容器范围内，阻止 meun popover 事件被拦截
  // 修订编辑区域的展示尺寸，保证给预览区域足够的空间展示图片
  fixEditorBodySize() {
    const { mode, layout } = this.state;
    // 仅单栏模式需要调整
    if (layout !== EDITOR_LAYOUT.DEFAULT) return;
    const body = this.bodyRef.current;
    let node = null;
    let height = null;

    if (mode === EDITOR_MODE.PREVIEW) {
      node = body.querySelector('.lake-text-diagram-preview');
      height = node.scrollHeight;
      body.style.height = `${height}px`;
    } else {
      body.style.height = 'auto';
    }
  }

  renderTemplates() {
    const locale = this.props.locale;
    const template = Template.getTemplates(this.state.type);
    return template ? (
      <Dropdown
        trigger={['click']} // 将 Dropdown 控制在 section 内，以便控制焦点
        getPopupContainer={this.getRootDom}
        disabled={this.state.mode !== EDITOR_MODE.CODE}
        placement="bottomLeft"
        overlay={(
          <Menu
            onClick={(_ref) => {
              const { key, domEvent } = _ref;
              // 需要阻止事件被编辑器捕获
              domEvent.stopPropagation();
              this.switchTemplate(key);
            }}
          >
            {Object.values(this.templates).map((template) => {
              return <Menu.Item key={template.id}>{template.name}</Menu.Item>;
            })}
          </Menu>
        )}
      >
        <a className="diagram-template-selector" rel="noopener noreferrer">
          {locale.template}
          <DownOutlined />
        </a>
      </Dropdown>
    ) : null;
  }

  render() {
    const locale = this.props.locale;
    const { mode, layout } = this.state;
    return (
      <div
        className={classnames([
          'lake-text-diagram-stage',
          'lake-text-diagram-layout-'.concat(layout),
        ])}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.keyCode === 80) {
            event.preventDefault();
            this.handlePreviewButtonClick();
          }
        }}
        ref={this.rootRef}
      >
        <div className="lake-text-diagram-nav">
          {this.props.canChangeType ? (
            this.renderDiagramSelect()
          ) : (
            <span className="diagram-name">{this.getDiagramName(this.props.type)}</span>
          )}
          <div className="diagram-actions">
            {this.renderTemplates()}
            <a className="diagram-help" href={this.getHelpUrl()} target="_blank" rel="noopener noreferrer" >
              {locale.help}
            </a>
            <Tooltip title={macos ? locale.macPreviewTooltip : locale.winPreviewTooltip}>
              <button
                size="small"
                className={classnames({
                  'diagram-preview': true,
                  'diagram-preview-active': mode === EDITOR_MODE.PREVIEW,
                })}
                onClick={this.handlePreviewButtonClick}
              >
                <Icon component={Icons.Preview} />
                {locale.preview}
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="lake-text-diagram-editor-wrap" ref={this.bodyRef}>
          <div className="lake-text-diagram-editor">
            <textarea
              value={this.props.code}
              ref={this.editorRef}
              autoComplete="off"
              tabIndex="1"
              readOnly
            />
          </div>
          <div
            className="lake-text-diagram-preview"
            style={{ display: this.needShowPreviewPanel() ? 'block' : 'none' }}
          >
            {this.renderPreview()}
          </div>
        </div>
      </div>
    );
  }
}

export default TextDiagramEditor;
