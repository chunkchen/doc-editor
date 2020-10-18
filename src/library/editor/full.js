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
          engine.container.closest('.lake-editor').addClass('lake-maximize-section');
        });

        engine.on('restoresection', () => {
          engine.container.closest('.lake-editor').removeClass('lake-maximize-section');
        });

        this.props.onLoad(engine);
      },
    );
  };

  handleScroll = () => {
    if (this.lakeFullEditorWrapperContent[0].scrollTop > 16) {
      this.lakeToolbar.addClass('lake-toolbar-active');
    } else {
      this.lakeToolbar.removeClass('lake-toolbar-active');
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
    this.lakeToolbar = Engine.$('.lake-toolbar');
    this.lakeFullEditorWrapperContent = Engine.$('.lake-max-editor-wrapper-content');
    this.lakeFullEditorWrapperContent.on('scroll', this.handleScroll);
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

    const editorOptions = () => {
      const options = Object.assign({}, this.props);
      const { onLoad, header, type, toolbar, ...editorOptions } = options;
      return editorOptions;
    };

    return (
      <div className="lake-editor lake-max-editor">
        <div className="lake-max-editor-wrapper">
          {engine && <Dialog engine={engine} />}
          {engine && <Toolbar {...Object.assign({ hasMore: false }, toolbarOptions)} />}
          {engine && <Sidebar engine={engine} />}
          <div className="lake-max-editor-wrapper-content">
            <div className="lake-max-editor-content">
              <div className="lake-content-editor show-return-tag" ref={this.contentEditor}>
                {header && <div className="lake-content-editor-extra">{header}</div>}
                <Editor
                  {...Object.assign(
                    {
                      onEngineReady: this.onEngineReady,
                    },
                    editorOptions(),
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
