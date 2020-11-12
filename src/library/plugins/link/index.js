import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { shrinkToElementNode } from '@hicooper/doc-engine/lib/utils/range';
import { escapeRegExp, sanitizeUrl } from '@hicooper/doc-engine/lib/utils/string';
import Engine from '@hicooper/doc-engine/lib';
import LinkEditor from './editor';
import './index.css';

const PLUGIN_NAME = 'link';
const TAG_NAME = 'a';

function shouldTargetBlank(href) {
  return href && ['http:', 'https:', 'data:', 'ftp:'].some(protocol => href.startsWith(protocol));
}

function getLink(linkUrl) {
  const { location } = window;
  const url = escapeRegExp(location.origin + location.pathname.replace('/edit', ''));
  const reg = RegExp('^'.concat(url, '#'));
  linkUrl.replace(reg, '#')
    .trim();
  if (/^(\w+\.)+\w+(\/|$)/.test(linkUrl)) {
    linkUrl = `http://${linkUrl}`;
  }
  return linkUrl;
}

function go(node) {
  const type = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'preview';
  const isRmove = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
  const container = document.createElement('div');
  const removeLink = () => {
    Engine.$(node)
      .each((child) => {
        const range = this.change.getRange();
        range.selectNode(child);
        this.change.select(range);
        this.change.unwrapInline('<a />');
      });
  };
  const { body } = document;
  body.appendChild(container);
  ReactDOM.render(
    <ConfigProvider autoInsertSpaceInButton={false}>
      <LinkEditor
        target={node}
        shouldTargetBlank={shouldTargetBlank}
        getLink={getLink}
        type={type}
        container={container}
        onDeleteLink={() => {
          this.history.save();
          removeLink();
          ReactDOM.unmountComponentAtNode(container);
          body.removeChild(container);
        }}
        onConfirm={(text, href) => {
          if (shouldTargetBlank(href)) {
            node.setAttribute('target', '_blank');
          } else {
            node.removeAttribute('target');
          }
          node.setAttribute('href', sanitizeUrl(href));
          node.innerText = text;
          ReactDOM.unmountComponentAtNode(container);
          body.removeChild(container);
          this.history.save();
        }}
        onCancel={(options) => {
          if (!options.link && isRmove) {
            removeLink();
          }
          ReactDOM.unmountComponentAtNode(container);
          body.removeChild(container);
        }}
      />
    </ConfigProvider>,
    container,
  );
}

export default {
  initialize() {
    this.container.on('click', (event) => {
      const link = Engine.$(event.target)
        .closest(TAG_NAME);
      if (link.length > 0) {
        const section = this.section.closest(link);
        if (section) {
          const component = this.section.getComponent(section);
          if (component && component.name === 'table') {
            event.preventDefault();
            event.stopPropagation();
          }
        } else {
          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();
          if (link[0]) {
            go.call(this, link[0]);
          }
        }
      }
    });
    this.command.add(PLUGIN_NAME, {
      execute: () => {
        const range = this.change.getRange();
        if (range.collapsed) {
          const linkNode = Engine.$('<a>'.concat(this.lang.link.linkText, '</a>'));
          this.change.insertInline(linkNode);
          if (linkNode[0]) {
            go.call(this, linkNode[0], 'edit', true);
          }
          return linkNode;
        }
        this.history.stop();
        this.change.unwrapInline('<a />');
        this.change.wrapInline('<a href="" target="_blank" class="lake-link-marker" rel="noopener noreferrer"  />');
        shrinkToElementNode(range);
        this.change.select(range);
        this.history.save();
        let root = Engine.$(range.commonAncestorContainer);
        if (TAG_NAME !== root.name) {
          root = root.find('.lake-link-marker');
          if (root.length === 0) {
            root = Engine.$(range.commonAncestorContainer)
              .closest(TAG_NAME);
          }
        }
        root.removeClass('lake-link-marker');
        if (root[0]) {
          go.call(this, root[0], 'edit', true);
        }
        return root;
      },
    });

    this.on('paste:each', (node) => {
      if (TAG_NAME === node.name) {
        if (shouldTargetBlank(node.attr('href') || '')) {
          node.attr('target', '_blank');
        } else {
          node.removeAttr('target');
        }
      }
    });
    // 快捷键
    const options = this.options[PLUGIN_NAME] || {
      hotkey: 'mod+k',
    };

    if (options.hotkey) {
      this.hotkey.set(options.hotkey, PLUGIN_NAME);
    }
  },
};
