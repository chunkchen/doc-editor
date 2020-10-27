import React from 'react';
import { message } from 'antd';
import langEn from '../lang/en';
import langCn from '../lang/zh-cn';
import { addMentionAttrs, DocVersion, getDocVersion } from '../utils/string';
import HtmlParser from '../parser/html';
import Migrate from '../helper/migrate';
import schemaConfig from '../schema/config';
import Engine from './engine';

const language = {
  en: langEn,
  'zh-cn': langCn,
};

const migrate = new Migrate();

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.engine = null;
    this.locale = language[props.lang];
    this.container = React.createRef();
  }

  extendEngine = (engine) => {
    engine.getContent = () => {
      return addMentionAttrs(engine.getValue());
    };

    engine.getPureContent = () => {
      return addMentionAttrs(engine.getPureValue());
    };

    engine.disable = (disabled) => {
      engine.toolbar.disable(disabled);
      engine.readonly(disabled);
      engine.isDisabled = disabled;
    };

    engine.messageSuccess = (msg) => {
      message.success(msg);
    };

    engine.messageError = (msg) => {
      message.error(msg);
    };

    engine.getPureHtml = () => {
      return engine.getHtml(new HtmlParser());
    };

    // helper(engine, "pasteFileTransfer", {})
  };

  componentDidMount() {
    const { onEngineReady, ot } = this.props;
    this.engine = this.renderEditor();
    if (!ot) this.engine.setDefaultValue(this.engine.options.defaultValue);
    this.extendEngine(this.engine);
    onEngineReady(this.engine);
  }

  componentDidUpdate({ onSave, onChange }) {
    this.engine.options = { ...this.engine.options, onSave, onChange };
  }

  componentWillUnmount() {
    if (this.engine) {
      this.engine.destroy();
    }
  }

  renderEditor() {
    const { defaultValue, ...options } = this.props;
    let value = (`${defaultValue || '<p><br /></p>'}`).trim();
    value = Engine.StringUtils.removeBookmarkTags(value);
    options.defaultValue = value;
    options.parentNode = this.container.current.parentNode;
    const engine = Engine.create(this.container.current, options);
    const version = getDocVersion(defaultValue);
    engine.schema.add(schemaConfig);
    engine.locale = this.locale;
    engine.on('change', (val) => {
      let pageContentHeight = 0;
      this.container.current.childNodes.forEach((node) => {
        pageContentHeight += node.offsetHeight;
        console.log(pageContentHeight);
        if (pageContentHeight > 601) {
          console.log('分页');
        }
      });
      value = addMentionAttrs(val);
      this.engine.options.onChange(value);
      this.engine.toolbar.updateState();
    });
    engine.on('select', () => {
      this.engine.toolbar.updateState();
    });
    engine.setDefaultValue = () => {
      value = (`${defaultValue || ''}`).trim();
      value = Engine.StringUtils.removeBookmarkTags(value);
      this.engine.history.stop();
      this.engine.setValue(value || '<p><br /></p>');
      if (value) {
        migrate.update(version, DocVersion, this.engine.container);
      }
      this.engine.history.start();
      this.engine.history.save(true, false);
    };
    return engine;
  }

  render() {
    const { pageSize } = this.props;
    return (
      <div ref={this.container} className={`lake-content-editor-core lake-typography-${pageSize}`} />
    );
  }
}

Editor.defaultProps = {
  pageSize: 'a4',
  lang: 'zh-cn',
  onChange: () => {
  },
  onEngineReady: () => {
  },
  onBeforeRenderImage: (url) => {
    return url;
  },
  mxgraph: {
    url: 'http://www.draw.io/?embed=1&ui=atlas&spin=1&proto=json&configure=1&lang=zh',
  },
  lockedtext: {
    action: '/api/crypto',
  },
  image: {
    action: '/api/upload/image',
    display: 'block',
    align: 'center',
  },
  file: {
    action: '/api/upload/file',
  },
  video: {
    action: {
      create: '/api/upload/video',
      save: '/api/upload/video/save',
      query: '/api/upload/video/query',
    },
  },
  translate: {
    action: '/api/translate',
  },
  mention: {
    action: '/api/user/search',
    paramName: 'q',
    default: [],
  },
  onlinedoc: {
    action: '/hwme-service/richFilemanager/index.html',
  },
  markdown: {
    action: '/api/document/convert',
    items: [
      'codeblcok',
      'code',
      'mark',
      'bold',
      'strikethrough',
      'italic',
      'sup',
      'sub',
      'orderedlist',
      'unorderedlist',
      'tasklist',
      'checkedtasklist',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'quote',
      'link',
    ],
  },
  ot: false,
};
export default Editor;
