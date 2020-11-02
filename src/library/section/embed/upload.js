import React from 'react';
import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine/lib';
import {sanitizeUrl} from '@hicooper/doc-engine/lib/utils/string';
import Embed from './embed';
import Error from '../../tips/error';

class Upload extends Embed {
  constructor(props) {
    super({
      defaultHeight: 467,
      ...props,
    });
  }

  downloadFile = () => {
    const src = this.value.download || this.value.src;
    if (src) {
      window.open(src);
    }
  };

  onSaveBefore = () => {
    return new Promise((resolve, reject) => {
      if (this.value.status === 'uploading') {
        reject(this.locale.stillUploading);
        return;
      }
      if (this.value.status !== 'transfering') {
        resolve();
      } else {
        reject(this.locale.stillTransfering);
      }
    });
  };

  hitBlack(src) {
    src = new URL(src, window.location.href);
    //! src.pathname.startsWith("/office/") && !src.pathname.startsWith("/preview/")
    return false;
  }

  embedToolbar() {
    const toolbar = [
      {
        type: 'separator',
      },
      {
        type: 'dnd',
      },
      {
        type: 'copy',
      },
      {
        type: 'delete',
      },
      {
        type: 'separator',
      },
      {
        type: 'expand',
      },
      {
        type: 'collapse',
      },
      {
        type: 'preferences',
        onClick: () => {
          this.setSidebar();
        },
      },
    ];
    if (!this.state.readonly || this.value.allowDownload) {
      toolbar.unshift({
        type: 'download',
        onClick: this.downloadFile.bind(this),
      });
    }
    return toolbar;
  }

  setSidebar() {
  }

  collapse() {
    this.setValue({
      collapsed: true,
    });
    this.render();
  }

  expand() {
    this.setValue({
      collapsed: false,
    });
    this.render();
  }

  getUrl() {
    const {preview, src} = this.value;
    return sanitizeUrl(preview || src);
  }

  getAcceptExt() {
    let {ext, name} = this.value;
    if (name && /\.mindnode\.zip$/.test(name)) {
      ext = 'mindnode';
    } else if (name && /\.xmind\.zip$/.test(name)) {
      ext = 'xmind';
    }
    return ext;
  }

  renderCollapse() {
    const value = this.value;
    const url = this.getUrl();
    const ext = this.getAcceptExt();
    const size = value.size
      ? '<span class="lake-embed-upload-collapse-file-size">'.concat(
        Engine.StringUtils.escape(Engine.UploadUtils.getFileSize(value.size)),
        '</span>\n',
      )
      : '';
    const root = this.container.append(
      '\n      <div class="lake-embed lake-embed-upload lake-embed-upload-collapse" style="position: relative">\n        <div class="lake-embed-upload-file-icon lake-svg-icon-'
        .concat(
          Engine.StringUtils.escape(ext),
          '"></div>\n        <div class="lake-embed-upload-collapse-body">\n          <div class="lake-embed-upload-collapse-name" >\n            <a href="',
        )
        .concat(url, '" target="_blank" rel="noopener noreferrer" >')
        .concat(Engine.StringUtils.escape(value.name), '</a>\n ')
        .concat(
          size,
          '</div>\n        </div>\n        <a class="lake-embed-upload-icon lake-svg-icon-preview" href="',
        )
        .concat(url, '" target="_blank" rel="noopener noreferrer" ></a>\n      </div>\n    '),
    );
    this.root = root;
  }

  getStatusTips() {
    return this.value.status === 'uploading' ? this.locale.uploading : '';
  }

  renderExpand() {
    const {value, options} = this;
    const {status, ext} = value;
    const height = this.getHeight();
    const url = this.getUrl();
    const {transition} = options;
    const readonlyClass = this.state.readonly ? ' lake-section-readonly' : '';
    const tips = this.getStatusTips();
    const acceptExt = this.getAcceptExt();
    const root = Engine.$(
      '\n      <div class="lake-embed lake-embed-upload'
        .concat(
          readonlyClass,
          '">\n        <div class="lake-embed-upload-header">\n          <span class="lake-embed-upload-icon lake-embed-upload-file-icon lake-svg-icon-',
        )
        .concat(Engine.StringUtils.escape(acceptExt), '"></span>\n          <a href="')
        .concat(
          url,
          '" target="_blank">\n            <span class="lake-embed-upload-file-name" style="max-width: calc(100% - 60px)"> ',
        )
        .concat(
          Engine.StringUtils.escape(value.name),
          ' </span>\n            <span data-role="status-tips">',
        )
        .concat(
          tips,
          '</span> <span data-role="percent"></span>\n          </a>\n          <a class="lake-embed-upload-icon lake-svg-icon-preview" href="',
        )
        .concat(
          url,
          '" target="_blank"></a>\n        </div>\n        <div class="lake-embed-upload-body">\n          <div class="lake-embed-content-bg">\n            <span class="lake-icon lake-icon-loading"></span>\n          </div>\n          <iframe\n            frameborder="0"\n            allowfullscreen="true"\n            style="height: ',
        )
        .concat(Engine.StringUtils.escape(height), 'px; transition: ')
        .concat(
          Engine.StringUtils.escape(transition),
          '"\n          ></iframe>\n          <div class="lake-embed-mask"></div>\n        </div>\n      </div>\n    ',
        ),
    );

    const iframe = root.find('iframe');
    this.container.append(root);
    this.root = root;
    this.iframe = iframe;
    iframe.on('load', () => {
      root.find('.lake-embed-content-bg').hide();
    });
    this.mask = root.find('.lake-embed-mask');
    if (value.height) {
      iframe.attr('data-height', height);
    }
    if (status === 'done') {
      if (ext === 'xls' || ext === 'xlsx') {
        iframe.css('border-top', 'none');
      }
      let src = url;
      if (src.indexOf('?') > -1) {
        src += '&view=doc_embed';
      } else {
        src += '?view=doc_embed';
      }
      this.renderIframe(iframe, src, 2e3);
    }
    if (this.state.activated === true) {
      this.hideMask();
    }
  }

  renderReadView() {
    if (this.state.collapsed) {
      this.renderCollapse();
    } else {
      this.renderExpand();
      this.hideMask();
    }
  }

  didInsert(value) {
    if (value.status === 'uploading' || value.status === 'transfering') {
      this.bindEvent(this.engine.asyncEvent, 'save:before', this.onSaveBefore);
    }
  }

  getEmbedEmbedTitle() {
    const ext = this.getAcceptExt();
    const value = this.value;
    return '\n        <span class="lake-svg-icon-'
      .concat(
        Engine.StringUtils.escape(ext),
        '" style="\n          float: left;\n          margin-top: 5px;\n          margin-right: 6px;\n          width: 12.6px;\n          height: 13.5px;\n          background-size: 12.6px 13.5px;\n        "></span>\n        ',
      )
      .concat(Engine.StringUtils.escape(value.name), '\n    ');
  }

  renderEditView() {
    if (this.state.collapsed) {
      this.renderCollapse();
    } else {
      this.renderExpand();
      this.renderResizeController();
    }
  }

  isError() {
    return this.value.status === 'error';
  }

  renderError() {
    const {value, container} = this;
    ReactDOM.render(
      <Error
        sectionIcon={'<span class="lake-svg-icon lake-svg-icon-error-file"></span>'}
        variableContent={`${value.message ? value.message : this.locale.invalid} ${value.name}`}
        fixedContent={value.ext ? value.ext : ''}
        message={value}
        block
        docWidth={this.getContainerWidth()}
      />,
      container[0],
    );
  }

  render(_, value) {
    value = {...this.value, value};
    const {collapsed} = value;
    this.value = value;
    value.status = value.status || 'done';
    this.state.collapsed = undefined !== collapsed && collapsed;
    if (!value.ext && value.src) {
      value.ext = Engine.UploadUtils.getFileExtname(value.src);
    }
    value.ext = value.ext || 'html';
    super.render.call(this);
  }
}

Upload.type = 'block';
export default Upload;
