import React from 'react';
import ReactDOM from 'react-dom';
import lozad from 'lozad';
import Engine from './engine';
import lang_en from '../lang/en';
import lang_zh_cn from '../lang/zh-cn';
import schema_config from '../schema/config';
import IFrameHelper from '../helper/iframe';
import { getDocVersion } from '../utils/string';
import Outline from '../utils/outline';

const linkDomain = ['itellyou.com'];

const language = {
  en: lang_en,
  'zh-cn': lang_zh_cn,
};

const markdownPlaceholder = {
  PLACEHOLDER: '<div id="markdown-toc"></div>',
  TAG_ID: 'markdown-toc',
};

window.lozad_observer = lozad('.lozad', {
  rootMargin: '10px 0px',
  threshold: 0.1,
});

class ContentView extends React.Component {
  constructor() {
    super();
    this.viewArea = React.createRef();
  }

  containsMarkdownToc = (content) => {
    return !!content && content.includes(markdownPlaceholder.PLACEHOLDER);
  }

  adaptContent = (content) => {
    if (!content) return '';
    content += '';
    const sechema = new Engine.Schema();
    sechema.add(schema_config);
    const parser = new Engine.HTMLParser(content, sechema);
    this.docVerstion = getDocVersion(content);
    return parser.toLowerValue();
  }

  addRelToLink = () => {
    Engine.$(this.viewArea.current).find('a[target=_blank]').each((node) => {
      if (node.closest('[data-section-key=file]') || node.closest('[data-section-key=localdoc]')) return;
      const isDomain = (href) => {
        if (!/^(?:\w{1,20}:){0,1}\/\//i.test(href)) return true;
        let url;
        try {
          url = new URL(href);
        } catch (e) {
          return false;
        }
        const hostname = url.hostname;
        if (!hostname) return false;
        for (let i = 0; linkDomain.length > i; i++) {
          const domain = linkDomain[i];
          if (hostname === domain || hostname.endsWith('.'.concat(domain))) return true;
        }
        return false;
      };

      if (!isDomain(node.href)) Engine.$(node).attr('rel', 'noopener noreferrer');
    });
  }

  addHeadingAnchor = () => {
    Engine.$(this.viewArea.current).find('h1,h2,h3,h4,h5,h6').each((node) => {
      node = Engine.$(node);
      const id = node.attr('id');
      if (id) {
        node.prepend('<a class="lake-anchor" href="#'.concat(id, '"></a>'));
      }
    });
  }

  removeInvalidStyles = () => {
    Engine.$(this.viewArea.current).children().each((child) => {
      child = Engine.$(child);
      Engine.NodeUtils.removeMinusStyle(child, 'text-indent');
    });
  }

  renderContent = () => {
    const { lang, onBeforeRenderImage, customMaximizeRestore, customMaximize, autoMaximizeSection, renderParser, content, genAnchor, genOutline, onLoad, ...options } = this.props;
    const view = Engine.$(this.viewArea.current);
    const contentViewEngine = Engine.ContentView.create(view, {
      lang,
      section: Engine.section,
      plugin: Engine.plugin,
      onBeforeRenderImage,
      customMaximizeRestore,
      autoMaximizeSection,
      customMaximize,
      ...options,
    });
    contentViewEngine.docVerstion = this.docVerstion;
    contentViewEngine.iframeHelper = new IFrameHelper();
    contentViewEngine.locale = language[lang];
    contentViewEngine.schema.add(schema_config);
    Engine.section.renderAll(this.viewArea.current, undefined, contentViewEngine);
    this.container = view;

    if (autoMaximizeSection) {
      const autoNode = Engine.$(document.getElementById(autoMaximizeSection));
      if (autoNode) {
        Engine.section.maximize({
          sectionRoot: autoNode,
          contentView: contentViewEngine,
        });
      }
    }
    // 处理链接
    this.addRelToLink();
    this.removeInvalidStyles();
    if (renderParser) {
      const parentNode = this.viewArea.current.parentNode;
      renderParser.parse(this.viewArea.current);
      parentNode.appendChild(this.viewArea.current);
    }
    // 处理锚点
    if (genAnchor) {
      this.addHeadingAnchor();
    }
  }

  componentDidMount() {
    this.renderContent();
    const config = {
      outline: [],
    };
    if (this.props.genOutline === true) {
      config.outline = Outline.extractFromDom(this.viewArea.current);
      if (this.containsMarkdownToc(this.props.content)) {
        this.renderMarkdownToc(config.outline);
      }
    }
    // 渲染完毕后激活 onReady
    // 不应该复用 ContentViewer 去根据传入的 content 来渲染不同的内容
    // 由业务层保证不同的内容用 key 控制生成不同的实例，保持 ContentViewer 的简洁性
    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(this.viewArea.current, config);
    }
    this.container.attr('tabindex', 0);
    this.container.on('keydown', (event) => {
      if (Engine.isHotkey('mod+a', event)) {
        event.preventDefault();
        window.getSelection().getRangeAt(0).selectNode(this.container[0]);
      }
    });
    if (window.lozad_observer) {
      window.lozad_observer.observe();
    }
  }

  renderMarkdownToc(outline) {
    if (outline.length === 0) return;
    const prepend = document.createElement('div');
    this.viewArea.current.prepend(prepend);
    ReactDOM.render(<div
      className="lake-embed-outline"
    >
      <h3>{language[this.props.lang].toc.title}</h3>
      <ul>
        {
          outline.map((item) => {
            return (
              <li
                className={'lake-embed-outline lake-embed-outline-'.concat(item.depth)}
                key={item.id}
              >
                <a href={'#'.concat(encodeURIComponent(item.id))}>
                  <span>{item.text}</span>
                </a>
              </li>
            );
          })
        }
      </ul>
    </div>);
  }

  shouldComponentUpdate(props) {
    return this.props.content !== props.content;
  }

  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.renderContent();
    }
  }

  // 修复安全漏洞，target="blank" 属性，触发钓鱼风险
  // http://www.zerokeeper.com/web-security/target-blank-property-triggering-fishing-risk.html
  render() {
    const content = this.adaptContent(this.props.content);
    return (
      <div
        className="lake-engine-view"
        ref={this.viewArea}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
}

ContentView.defaultProps = {
  lang: 'zh-cn',
  content: '',
  genAnchor: false,
  genOutline: true,
  onLoad: () => {
  },
  onBeforeRenderImage: (url) => {
    return url;
  },
  image: {
    display: 'block',
    align: 'center',
  },
};

export default ContentView;
