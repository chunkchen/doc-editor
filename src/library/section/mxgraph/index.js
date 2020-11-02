import React from 'react';
import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine/lib';
import {Modal} from 'antd';
import Embed from '../embed/embed';
import GraphView from './graph-view';
import 'antd/lib/modal/style';

class Visio extends Embed {
  hitBlack() {
    return false;
  }

  embedToolbar() {
    const config = this.getGraphOptions();
    const embed = [
      {
        type: 'dnd',
      }, {
        type: 'maximize',
      }, {
        type: 'separator',
      }, {
        type: 'copy',
      }, {
        type: 'delete',
      },
    ];
    if (Array.isArray(config.embed)) {
      return config.embed;
    }
    if (typeof config.embed === 'object') {
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

  getGraphOptions() {
    const {engine, contentView} = this;
    const options = engine ? engine.options : contentView.options;
    return options.mxgraph || {};
  }

  getUrl() {
    const {src, url} = this.value;
    return url || src || undefined;
  }

  activate() {
    if (this.state.maximize) {
      this.hideRisizeController();
    } else {
      this.showRisizeController();
    }
    this.hideMask();
  }

  // 最大化
  maximize() {
    if (this.state.readonly) return;
    this.view.setState(this.state);
    this.renderIframeView();
    this.engine.toolbar.hide();
    this.iframe.css('height', this.getHeight());
    this.hideRisizeController();
  }

  // 还原之前
  restoreBefore() {
    if (this.value.draft && this.value.draft !== this.value.xml) {
      ReactDOM.render(
        <Modal
          okText="继续编辑"
          cancelText="取消更改"
          zIndex={2000}
          onOk={() => {
            ReactDOM.unmountComponentAtNode(this.modal[0]);
          }}
          onCancel={() => {
            this.setValue({
              draft: null,
            });
            this.hideGraphEditor();
            ReactDOM.unmountComponentAtNode(this.modal[0]);
          }}
          visible
        >
          所有修改均将会丢失！确认要取消更改吗?
        </Modal>,
        this.modal[0]
      );
      return false;
    }
  }

  // 还原
  restore() {
    if (this.state.readonly) return;
    // 未返回值的情况下，删除 Section
    if (!this.value.xml) {
      this.destroy();
      this.engine.change.removeSection(this.sectionRoot);
    }
    this.view.setState(this.state);
    this.removeIframeView();
    this.engine.toolbar.show();
    if (this.state.activated) {
      this.showRisizeController();
    }
  }

  getHeight() {
    return this.getContainerHeight();
  }

  setGraphMessage = (jsonMsg) => {
    const iframeWindow = this.iframe ? this.iframe[0].contentWindow : null;
    if (iframeWindow && iframeWindow.postMessage) {
      iframeWindow.postMessage(JSON.stringify(jsonMsg), '*');
    }
  }

  onGraphMessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.event === 'configure') {
      this.setGraphMessage({
        action: 'configure',
        config: {defaultFonts: ['Humor Sans', 'Helvetica', 'Times New Roman']},
      });
    } else if (msg.event === 'init') {
      this.setGraphMessage({action: 'load', autosave: 1, xml: this.value.xml});
    } else if (msg.event === 'load') {
      this.setGraphMessage({action: 'status'});
    } else if (msg.event === 'autosave') {
      this.setValue({
        draft: msg.xml,
      });
    } else if (msg.event === 'save') {
      this.setGraphMessage({action: 'export', format: 'xmlsvg', xml: msg.xml, spin: 'Updating page'});
    } else if (msg.event === 'export') {
      const dataWidth = Math.ceil(msg.width / msg.scale);
      const dataHeight = Math.ceil(msg.height / msg.scale);
      this.setValue({
        draft: null,
        xml: msg.xml,
        data: msg.data,
        format: msg.format,
        dataWidth,
        dataHeight,
      });
      this.hideGraphEditor();
    } else if (msg.event === 'exit') {
      this.hideGraphEditor();
    }
  }

  showGraphEditor = () => {
    const {sectionRoot, engine, contentView} = this;
    engine.section.maximize({
      sectionRoot,
      engine,
      contentView,
    });
  }

  hideGraphEditor = () => {
    const {contentView, sectionRoot, engine} = this;
    engine.section.restore({
      sectionRoot,
      engine,
      contentView,
    });
  }

  destroy() {
    this.removeIframeView();
    super.destroy.call(this);
  }

  removeIframeView() {
    window.removeEventListener('message', this.onGraphMessage);
    this.iframe = null;
    if (this.warp) {
      this.warp.empty();
    }
  }

  renderIframeView() {
    const {container, value, options} = this;
    const height = this.getHeight();
    const {transition} = options;
    const embedNode = Engine.$('\n      <div class="lake-embed lake-embed-active">\n   <div class="lake-embed-modal"></div>     <div class="lake-embed-content">\n          <div class="lake-embed-content-bg">\n            <span class="lake-icon lake-icon-loading"></span>\n          </div>\n          <iframe data-role="iframe" \n            class="lake-embed-content-frame" \n            frameborder="0" \n            allowfullscreen="true" \n            style="height: '.concat(height, 'px; transition: ').concat(transition, '"\n            >\n          </iframe>\n        </div>\n      </div>\n    '));

    const iframe = embedNode.find('iframe');

    if (value.height) {
      iframe.attr('data-height', height);
    }

    iframe.on('load', () => {
      iframe.addClass('lake-embed-content-frame-loaded');
      window.addEventListener('message', this.onGraphMessage, false);
    });
    const url = this.getUrl();
    this.warp = container.find('.lake-mxgraph-warp');
    this.modal = embedNode.find('.lake-embed-modal');
    this.warp.append(embedNode);
    this.iframe = iframe;
    this.renderIframe(iframe, Engine.StringUtils.sanitizeUrl(url));
    if (this.state.activated === true) this.hideMask();
  }

  renderEditView() {
    const {url} = this.getGraphOptions();
    this.setValue({
      url,
    });

    const {value} = this;
    ReactDOM.render(<GraphView
      showGraphEditor={this.showGraphEditor}
      value={value}
      onLoad={(ref) => {
        this.view = ref.view;
      }}
    />, this.container[0], () => {
      this.root = this.container.find('.lake-mxgraph-preview');
      const {height} = this.value;
      this.addResizeController(this.root);
      if (!value.xml) {
        this.showGraphEditor();
      }
      if (height) {
        this.root.css('height', `${height}px`);
      }
    });
  }

  renderReadView() {
    ReactDOM.render(<GraphView
      value={this.value}
    />, this.container[0]);
  }
}

Visio.type = 'block';
Visio.uid = true;
export default Visio;
