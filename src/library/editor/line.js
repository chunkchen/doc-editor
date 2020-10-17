import React from 'react';
import lang_en from '../lang/en';
import lang_cn from '../lang/zh-cn';
import Editor from './editor';
import helper from '../helper';
import Toolbar from '../toolbar';

const language = {
  en: lang_en,
  'zh-cn': lang_cn,
};

class LineEditor extends React.Component {
  constructor(props) {
    super();

    this.state = {
      engine: null,
      toolbar: props.toolbar,
    };
    this.locale = language[props.lang];
    this.contentEditor = React.createRef();
  }

  onEngineReady = (engine) => {
    this.engine = engine;
    this.setState(
      {
        engine,
      },
      () => {
        const { image, file } = engine.options;
        helper(engine, 'uploader', {
          actions: {
            image: image ? image.action : '',
            file: file ? file.action : '',
          },
        });
        helper(engine, 'iframeHelper');

        this.props.onLoad(engine);
        engine.sidebar.disable = true;
      },
    );
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { engine, toolbar } = this.state;
    const { type, extra } = this.props;
    const toolbarOptions = {
      type,
      engine,
      toolbar,
      locale: this.locale,
    };

    const editorOptions = (function (props) {
      const options = Object.assign({}, props);
      const { onLoad, extra, toolbar, ...editorOptions } = options;
      return editorOptions;
    }(this.props));

    return (
      <div className="lake-editor lake-line-editor">
        <div className="lake-content-editor" ref={this.contentEditor}>
          <Editor
            {...Object.assign(
              {
                onEngineReady: this.onEngineReady,
              },
              editorOptions,
            )}
          />
        </div>
        {engine && (
          <div className="lake-editor-bottom">
            <Toolbar {...Object.assign({ hasMore: true }, toolbarOptions)} />
            {extra && <div className="lake-editor-extra">{extra}</div>}
          </div>
        )}
      </div>
    );
  }
}

LineEditor.defaultProps = {
  lang: 'zh-cn',
  type: 'line',
  tabIndex: 2,
  toolbar: [['emoji', 'image']],
  markdown: {
    action: '/api/document/convert',
    items: [],
  },
  save: false,
  search: false,
  sectionselect: false,
  heading: {
    showAnchor: false,
  },
  onChange: () => {
  },
  onLoad: () => {
  },
  onBeforeRenderImage: (url) => {
    return url;
  },
};
export default LineEditor;
