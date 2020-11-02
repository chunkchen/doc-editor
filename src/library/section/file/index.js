import React from 'react';
import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine/lib';
import Error from '../../tips/error';
import SectionBase from '../base';

const canPreview = (ext) => {
  ext = String(ext || '');
  return (
    Engine.UploadUtils.isOffice(ext)
    || Engine.UploadUtils.isImage(ext)
    || Engine.UploadUtils.isVideo(ext)
    || ['pdf', 'mp3'].indexOf(ext) >= 0
  );
};

const template = (value, locale) => {
  if (value.status === 'error') {
    const messageElement = document.createElement('div');

    ReactDOM.render(
      <Error
        sectionIcon='<span class="lake-svg-icon lake-svg-icon-error-file"></span>'
        variableCo={value.message ? value.message : locale.invalid}
        fixedContent={value.name ? value.name : ''}
        message={value}
      />,
      messageElement,
    );
    return messageElement;
  }
  let iconHtml = '<span class="lake-icon lake-icon-attachment"></span>';

  if (value.status === 'uploading' || value.status === 'transfering') {
    iconHtml = '\n    <i class="lake-anticon lake-anticon-loading">\n      <svg viewBox="0 0 1024 1024" class="lake-anticon-spin" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">\n        <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>\n      </svg>\n    </i>\n    ';
  }

  let fileSizeHtml = '';
  let fileSize = null;
  if (value.size) {
    fileSize = Engine.UploadUtils.getFileSize(value.size);
  }

  if (fileSize) {
    fileSizeHtml = '\n    <span class="lake-file-size">('.concat(
      Engine.StringUtils.escape(fileSize),
      ')</span>\n    ',
    );
  }

  let percent = '';
  if (value.status === 'uploading') percent = '<span data-role="percent"></span> &nbsp;';
  else if (value.status === 'transfering') percent = '<span></span> &nbsp;';

  return '\n  <span class="lake-file lake-file-'
    .concat(value.status, '">\n    <span class="lake-file-icon">')
    .concat(iconHtml, '</span>\n    ')
    .concat(percent, '\n    <span class="lake-file-title">')
    .concat(Engine.StringUtils.escape(value.name), '</span>')
    .concat(fileSizeHtml, '\n  </span>\n  ');
};

class File extends SectionBase {
  constructor(engine, contentView) {
    super();

    this.destroy = () => {
      window.removeEventListener('resize', this.onWindowResize);
      if (this.engine) {
        this.engine.asyncEvent.off('save:before', this.onSaveBefore);
      }
    };

    this.getMaxWidth = () => {
      const block = Engine.ChangeUtils.getClosestBlock(this.sectionRoot);
      return block[0].clientWidth - 6;
    };

    this.onWindowResize = () => {
      this.maxWidth = this.getMaxWidth();
      this.updateMaxWidth();
    };

    this.onSaveBefore = () => {
      return new Promise((resolve, reject) => {
        if (this.value.status === 'uploading') {
          reject(this.locale.stillUploading);
        } else if (this.value.status !== 'transfering') {
          resolve();
        } else {
          reject(this.locale.stillTransfering);
        }
      });
    };

    this.updateMaxWidth = () => {
      this.sectionRoot.find('.lake-file-title').css('max-width', `${this.maxWidth - 100}px`);
    };

    this.focusSection = () => {
      this.engine.change.focusSection(this.sectionRoot);
    };

    this.previewFile = () => {
      const {preview, src} = this.value;
      window.open(Engine.StringUtils.sanitizeUrl(preview || src));
    };

    this.downloadFile = () => {
      const {download, src} = this.value;
      window.open(Engine.StringUtils.sanitizeUrl(download || src));
    };

    this.section = Engine.section;
    this.engine = engine;
    this.contentView = contentView;
    this.isEditMode = !!engine;
    this.maxWidth = 752;
  }

  getToolbarConfig() {
    const items = [];
    if (this.value.status === 'done') {
      if (canPreview(this.value.ext)) {
        items.push({
          type: 'button',
          name: 'preview',
          iconName: 'preview',
          title: this.locale.preview,
          onClick: this.previewFile,
        });
      }

      items.push({
        type: 'button',
        name: 'download',
        iconName: 'download',
        title: this.locale.download,
        onClick: this.downloadFile,
      });

      if (this.isEditMode) {
        items.push({
          type: 'copy',
        });
        items.push({
          type: 'separator',
        });
      }
    }

    if (this.isEditMode) {
      items.push({
        type: 'delete',
      });
    }
    return items;
  }

  didInsert(value) {
    if (value.status === 'uploading' || value.status === 'transfering') {
      this.engine.asyncEvent.on('save:before', this.onSaveBefore);
    }
  }

  activate() {
    this.container.find('lake-file').addClass('lake-file-active');
  }

  unactivate() {
    this.container.find('lake-file').removeClass('lake-file-active');
  }

  renderViewMode() {
    // 默认点击都是预览
    this.sectionRoot.on('click', this.downloadFile);
    // Section工具栏
    const config = this.getToolbarConfig();
    const embedToolbar = new Engine.EmbedToolbar({
      list: config,
    });
    const toolbarRoot = embedToolbar.root;
    toolbarRoot.addClass('lake-section-toolbar');
    embedToolbar.render(this.sectionRoot.first());
    // 显示或隐藏工具栏
    let canHide = true;

    const handleMouseleave = () => {
      canHide = true;
      window.setTimeout(() => {
        if (canHide) {
          this.section.hideSectionToolbar(this.sectionRoot);
        }
      }, 300);
    };

    const handleMouseenter = () => {
      canHide = false;
      this.contentView.container.find('[data-section-key="file"]').each((node) => {
        this.section.hideSectionToolbar(Engine.$(node));
      });
      this.section.showSectionToolbar(this.sectionRoot);
    };

    this.sectionRoot.on('mouseenter', handleMouseenter);
    this.sectionRoot.on('mouseleave', handleMouseleave);
    toolbarRoot.on('mouseenter', () => {
      canHide = false;
    });
    toolbarRoot.on('mouseleave', handleMouseleave);
  }

  renderEditMode() {
    // Section工具栏
    this.embedToolbar = function () {
      return this.getToolbarConfig();
    };

    this.section.setToolbar({
      sectionRoot: this.sectionRoot,
      engine: this.engine,
      component: this,
    });
  }

  render(container, value) {
    this.locale = this.engine ? this.engine.locale.file : this.contentView.locale.file;
    this.maxWidth = this.getMaxWidth();
    value = value || {};
    this.value = value;
    value.status = value.status || 'done';
    // 补齐文件扩展名
    if (!value.ext && value.src) {
      value.ext = Engine.UploadUtils.getFileExtname(value.src);
    }

    const root = Engine.$(template(value, this.locale));
    if (!this.state.readonly) {
      root.attr('draggable', true);
    }
    container.append(root);
    this.updateMaxWidth();
    window.removeEventListener('resize', this.onWindowResize);
    window.addEventListener('resize', this.onWindowResize);
    // 阅读模式
    if (!this.engine) {
      this.renderViewMode();
      return;
    }
    // 编辑模式
    this.renderEditMode();
  }
}

File.type = 'inline';
File.selectStyleType = 'background';
File.uid = true;
export default File;
