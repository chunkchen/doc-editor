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

class MiniEditor extends React.Component {
  constructor(props) {
    super();

    this.onEngineReady = (engine) => {
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

          engine.on('maximizesection', () => {
            engine.container.closest('.lake-editor').addClass('lake-maximize-section');
          });

          engine.on('restoresection', () => {
            engine.container.closest('.lake-editor').removeClass('lake-maximize-section');
          });

          this.props.onLoad(engine);
          engine.sidebar.disable = true;
        },
      );
    };

    this.state = {
      engine: null,
      toolbar: props.toolbar,
    };
    this.locale = language[props.lang];
    this.contentEditor = React.createRef();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { engine, toolbar } = this.state;
    const { type } = this.props;
    const toolbarOptions = {
      type,
      engine,
      toolbar,
      locale: this.locale,
    };

    const editorOptions = (function (props) {
      const options = Object.assign({}, props);
      const { onLoad, header, toolbar, ...editorOptions } = options;
      return editorOptions;
    }(this.props));

    return (
      <div className="lake-editor lake-mini-editor">
        {engine && <Toolbar {...Object.assign({ hasMore: true }, toolbarOptions)} />}
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
      </div>
    );
  }
}

MiniEditor.defaultProps = {
  lang: 'zh-cn',
  type: 'mini',
  tabIndex: 2,
  toolbar: [
    ['heading', 'bold', 'italic', 'strikethrough', 'quote'],
    ['codeblock', 'table', 'math'],
    ['orderedlist', 'unorderedlist', 'tasklist'],
    ['alignment'],
    ['image', 'video', 'file', 'link', 'label'],
  ],
  save: false,
  search: false,
  sectionselect: false,
  heading: {
    showAnchor: false,
  },
  markdown: {
    action: '/api/document/convert',
    items: [
      'codeblcok',
      'bold',
      'strikethrough',
      'italic',
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
  onChange: () => {
  },
  onLoad: () => {
  },
  onBeforeRenderImage: (url) => {
    return url;
  },
};
export default MiniEditor;
