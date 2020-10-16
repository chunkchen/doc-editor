import React from 'react';
import lang_en from '../lang/en';
import lang_cn from '../lang/zh-cn';
import helper from '../helper';
import Engine from './engine';
import Dialog from '../dialog';
import Toolbar from '../toolbar';
import Sidebar from '../sidebar';
import Editor from './editor';

const language = {
  en: lang_en,
  'zh-cn': lang_cn,
};

class FullEditor extends React.Component {
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
        helper(engine, 'search', {
          target: this.contentEditor.current,
        });

        helper(engine, 'translate');
        const { image, file } = engine.options;
        helper(engine, 'uploader', {
          actions: {
            image: image ? image.action : '',
            file: file ? file.action : '',
          },
        });

        helper(engine, 'iframeHelper');

        this.bindScrollEvent();

        engine.on('maximizesection', () => {
          engine.container.closest('.itellyou-editor').addClass('itellyou-maximize-section');
        });

        engine.on('restoresection', () => {
          engine.container.closest('.itellyou-editor').removeClass('itellyou-maximize-section');
        });

        this.props.onLoad(engine);
      },
    );
  };

  handleScroll = () => {
    if (this.itellyouFullEditorWrapperContent[0].scrollTop > 16) {
      this.itellyouToolbar.addClass('itellyou-toolbar-active');
    } else {
      this.itellyouToolbar.removeClass('itellyou-toolbar-active');
    }
  };

  componentDidMount() {
  }

  componentWillUnmount() {
    Engine.$(document.body).css({
      'overscroll-behavior-x': '',
      'overflow-y': '',
    });
  }

  bindScrollEvent() {
    this.itellyouToolbar = Engine.$('.itellyou-toolbar');
    this.itellyouFullEditorWrapperContent = Engine.$('.itellyou-max-editor-wrapper-content');
    this.itellyouFullEditorWrapperContent.on('scroll', this.handleScroll);
    Engine.$(document.body).css({
      'overscroll-behavior-x': 'none',
      'overflow-y': 'hidden',
    });
  }

  render() {
    const { engine, toolbar } = this.state;
    const { type, header } = this.props;
    const toolbarOptions = {
      type,
      engine,
      toolbar,
      locale: this.locale,
    };

    const editorOptions = (function (props) {
      const options = Object.assign({}, props);
      const { onLoad, header, type, toolbar, ...editorOptions } = options;
      return editorOptions;
    }(this.props));
    return (
      <div className="itellyou-editor itellyou-max-editor">
        <div className="itellyou-max-editor-wrapper">
          {engine && <Dialog engine={engine} />}
          {engine && <Toolbar {...Object.assign({ hasMore: false }, toolbarOptions)} />}
          {engine && <Sidebar engine={engine} />}
          <div className="itellyou-max-editor-wrapper-content">
            <div className="itellyou-max-editor-content">
              <div className="itellyou-content-editor" ref={this.contentEditor}>
                {header && <div className="itellyou-content-editor-extra">{header}</div>}
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
          </div>
        </div>
      </div>
    );
  }
}

FullEditor.defaultProps = {
  lang: 'zh-cn',
  type: 'max',
  tabIndex: 2,
  toolbar: [
    ['section'],
    ['save', 'undo', 'redo', 'paintformat', 'removeformat'],
    ['heading', 'fontsize'],
    ['bold', 'italic', 'strikethrough', 'underline', 'moremark'],
    ['fontcolor', 'highlight'],
    ['alignment'],
    ['unorderedlist', 'orderedlist', 'tasklist', 'indent-list'],
    ['link', 'quote', 'hr'],
    ['search', 'translate', 'toc'],
  ],
  onLoad() {
  },
};
export default FullEditor;
