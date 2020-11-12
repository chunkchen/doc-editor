import Engine from '@hicooper/doc-engine/lib';
import { MODE_NAME_MAP, setMode, template as codeblockTemplate } from '../section/codeblock';
import { getPreviewUrl } from '../utils/string';

const locale = {
  'zh-cn': {
    hereIsOnlineVideo:
      '\u6b64\u5904\u4e3a\u89c6\u9891\uff0c\u70b9\u51fb\u94fe\u63a5\u67e5\u770b\uff1a',
    hereIsOnlineDoc: '此处为在线文档，点击链接查看：',
    hereIsLockText:
      '\u6b64\u5904\u4e3a\u8bed\u96c0\u52a0\u5bc6\u6587\u672c\uff0c\u70b9\u51fb\u94fe\u63a5\u67e5\u770b\uff1a',
  },
  en: {
    hereIsVideo: 'Here is the video, click on the link to view:',
    hereIsOnlineDoc: 'Here is online doc section, click on the link to view:',
    hereIsLockText: 'Here is the lake lock text section, click on the link to view:',
  },
}[window.appData && window.appData.locale !== 'zh-cn' ? 'en' : 'zh-cn'];

function getUrl(section) {
  section.empty();
  const value = Engine.section.getValue(section);
  if (value && value.url) {
    section.append('<img src="'.concat(value.url, '" />'));
  }
}

function getLink(href, html) {
  return '<a href="'
    .concat(
      href,
      '" style="\n    word-wrap: break-word;\n    color: #096DD9;\n    touch-action: manipulation;\n    background-color: rgba(0,0,0,0);\n    text-decoration: none;\n    outline: none;\n    cursor: pointer;\n    transition: color .3s;\n  ">',
    )
    .concat(html, '</a>');
}

function setStyle(root, attrs) {
  Engine.NodeUtils.walkTree(root, (node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.length > 0) {
      const style = window.getComputedStyle(node);
      attrs.forEach((attr) => {
        node.style[attr] = style.getPropertyValue(attr);
      });
    }
  });
}

class ExportParser extends Engine.ExportParser {
  getDocUrl() {
    if (this.options.docUrl) return this.options.docUrl;
    const location = window.location;
    return location.origin + location.pathname.replace('/edit', '');
  }

  getDefaultSectionParsers() {
    return Object.assign({}, super.getDefaultSectionParsers.call(this), {
      table: (section) => {
        const table = section.find('table');
        section.empty();
        if (table.length > 0) {
          table.css({
            outline: 'none',
            'border-collapse': 'collapse',
          });
          table.find('td')
            .css({
              'min-width': '90px',
              'font-size': '14px',
              'white-space': 'normal',
              'word-wrap': 'break-word',
              border: '1px solid #d9d9d9',
              padding: '4px 8px',
              cursor: 'default',
            });
          section.append(table);
        }
      },
      image: (section) => {
        const img = section.find('img');
        section.empty();
        if (img.length > 0) {
          const value = Engine.section.getValue(section);
          img.attr('src', value.src);
          img.css('visibility', 'visible');
          section.append(img);
        }
      },
      file: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.src) {
          section.append(
            getLink(value.src, `<span style="font-size: 14px;">\ud83d\udcce</span>${value.name}`),
          );
        }
      },
      math: (section) => {
        const img = section.find('img');
        section.empty();
        if (img.length > 0) {
          img.css('vertical-align', 'middle');
          section.append(img);
        }
      },
      codeblock: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.code) {
          const mode = MODE_NAME_MAP[value.mode] ? value.mode : 'plain';
          section.append(
            codeblockTemplate({
              mode,
            }),
          );
          const content = section.find('.lake-codeblock-content');
          content.css({
            border: '1px solid #e8e8e8',
            'max-width': '750px',
          });
          setMode(content, mode, value.code);
          content.addClass('lake-engine-view');
          content.hide();
          document.body.appendChild(content[0]);
          setStyle(content, ['color', 'margin', 'padding', 'background']);
          section.find('.lake-codeblock')
            .remove();
          content.show();
          content.css('background', '#f9f9f9');
          section.append(content);
          content.removeClass('lake-engine-view');
        }
      },
      label: (section) => {
        const label = section.find('.lake-section-label-container');
        section.empty();
        if (label.length > 0) {
          label.css({
            'font-weight': 400,
            'font-size': '12px',
            overflow: 'hidden',
            'max-width': '200px',
            display: 'inline-block',
            'white-space': 'nowrap',
            'margin-bottom': '-4px',
            'border-radius': '4px',
            border: 'none',
            padding: '2px 5px',
            'text-overflow': 'ellipsis',
            'line-height': '14px',
            'margin-left': '1px',
            'margin-right': '1px',
          });
          section.append(label);
        }
      },
      diagram: getUrl,
      mermaid: getUrl,
      flowchart: getUrl,
      graphviz: getUrl,
      puml: getUrl,
      mindmap: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.src) {
          const height = value.height;
          section.append(
            '<img src="'.concat(value.src, '" ')
              .concat(height ? `height=${height}` : '', '/>'),
          );
        }
      },
      onlinedoc: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.src) {
          section.append('<span>'.concat(locale.hereIsOnlineDoc, '</span>'));
          section.append(getLink(value.src, value.src));
        }
      },
      localdoc: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.src) {
          section.append(getLink(window.location.origin + getPreviewUrl(value.src), value.name));
        }
      },
      video: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.status && value.status === 'done') {
          section.append(getLink(`${this.getDocUrl()}#${value.id}`, value.name));
        }
      },
      mention: (section) => {
        const mention = section.find('a');
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.login) {
          section.append(mention);
        }
      },
      lockedtext: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.id) {
          section.append('<span>'.concat(locale.hereIsLockText, '</span>'));
          const url = `${this.getDocUrl()}#${value.id}`;
          section.append(getLink(url, url));
        }
      },
      riddle: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.src) {
          section.append(getLink(value.src, value.src));
        }
      },
      youku: (section) => {
        section.empty();
        const value = Engine.section.getValue(section);
        if (value && value.src) {
          section.append('<span>'.concat(locale.hereIsOnlineVideo, '</span>'));
          section.append(getLink(value.src, value.src));
        }
      },
    });
  }
}

export default ExportParser;
