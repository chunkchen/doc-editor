import Engine from 'doc-engine/lib';
import ImageNode from './image-node';
import { isBase64Image } from '../../utils/string';
import SectionBase from '../base';

class Image extends SectionBase {
  constructor(engine, contentView) {
    super();
    this.section = Engine.section;
    this.engine = engine;
    this.contentView = contentView;
    this.docEmbedView = window.location.search.indexOf('view=doc_embed') > 0;
  }

  onRemove = () => {
    this.imageNode.blur();
    this.engine.change.removeSection(this.sectionRoot);
  }

  onSaveBefore = () => {
    return new Promise((resolve, reject) => {
      if (this.value.status === 'uploading') {
        reject(this.locale.stillUploading);
        return;
      }
      resolve();
    });
  }

  saveSectionValue = () => {
    const value = this.imageNode.getValue();
    this.section.setValue(this.sectionRoot, value);
    this.engine.history.save();
  }

  embedToolbar() {
    const engine = this.engine;
    if (!engine) {
      return;
    }
    const locale = this.engine.locale.image;
    const options = this.getOptions();
    const items = [];
    if (this.value.status === 'done') {
      const rootParent = this.sectionRoot ? this.sectionRoot.closest('h1,h2,h3,h4,h5,h6,blockquote,ul,ol,div.sub-editor') : [];
      if (rootParent.length === 0) {
        items.push({
          type: 'button',
          name: 'mode',
          style: 'min-width:64px',
          getTitle: () => (this.value.display === 'block' ? locale.inlineMode : locale.blockMode),
          onLoad: (item) => {
            this.modeButton = item;
          },
          onClick: () => {
            const display = this.value.display === 'block' ? 'inline' : 'block';
            if (this.engine) {
              this.imageNode.changeDisplay(this.sectionRoot, display);
              this.saveSectionValue();
              if (this.modeButton) {
                this.modeButton.find('span.embed-text').html(display === 'block' ? locale.inlineMode : locale.blockMode);
              }
            }
          },
        });
        items.push({
          type: 'separator',
        });
      }

      items.push({
        type: 'copy',
      });
      if (!engine.sidebar.disable && !engine.isSub() && (!options.type || options.type === 'max')) {
        items.push({
          type: 'preferences',
          onClick: () => {
            this.imageNode.setSidebar();
          },
        });
      }

      items.push({
        type: 'separator',
      });
    }

    items.push({
      type: 'delete',
    });
    const config = options.image || {};
    if (Array.isArray(config.embed)) {
      return config.embed;
    } if (typeof config.embed === 'object') {
      const embedArray = [];
      items.forEach((item) => {
        if (config.embed[item.type] !== false) {
          embedArray.push(item);
        }
      });
      return embedArray;
    }
    return items;
  }

  destroy() {
    this.imageNode.destroy();
    if (this.engine) {
      this.engine.asyncEvent.off('save:before', this.onSaveBefore);
    }
  }

  didInsert(value) {
    if (value.status === 'uploading') {
      this.engine.asyncEvent.on('save:before', this.onSaveBefore);
    }
  }

  activate() {
    this.imageNode.focus();
  }

  unselect() {
    if (!this.state.activated) {
      super.unselect.call(this);
    }
  }

  unactivate() {
    if (this.engine) {
      this.engine.sidebar.restore();
      super.unselect.call(this);
    }
    this.imageNode.blur();
  }

  changeSize(width, height) {
    this.imageNode.changeSize(width, height);
    this.saveSectionValue();
  }

  changeLink(link, linkTarget) {
    this.imageNode.changeLink(link, linkTarget);
    this.saveSectionValue();
  }

  getSrc() {
    if (this.value.src) return this.value.src;
    if (this.engine && this.engine.uploader) {
      const uploader = this.engine.uploader;
      if (uploader && this.value.uid) {
        const file = uploader.uploadingFiles[this.value.uid];
        if (file) return file.src;
      }
    }
    return '';
  }

  render(container, value) {
    const options = this.getOptions().image || {};
    let align = options.align || 'left';
    let display = options.display || 'inline';

    const readonly = !this.engine;

    const rootParent = this.sectionRoot.closest('h1,h2,h3,h4,h5,h6,blockquote,ul,ol,div.sub-editor');
    if (rootParent.length > 0) {
      align = 'left';
      display = 'inline';
    }

    const locale = readonly ? this.contentView.locale.image : this.engine.locale.image;
    this.locale = locale;
    const section = this.section;
    const src = this.getSrc();
    value = value || {};
    this.value = value;
    value.status = value.status || 'done';
    // uploading, done, error
    value.align = value.align || align;
    value.linkTarget = value.linkTarget === undefined ? '_blank' : value.linkTarget;
    // 新交互只有 inline 样式
    if (readonly) {
      // 阅读模式继续保持原来的 display
      value.display = value.display || display;
    } else {
      // 编辑模式
      value.display = value.display || display;
    }

    if (value.src && isBase64Image(value.src)) {
      value.src = '';
      this.section.setValue(this.sectionRoot, value);
    }

    value.message = value.message || locale.uploadFailed;
    const sectionRoot = this.section.closest(container);

    const imageNode = new ImageNode({
      locale,
      engine: this.engine,
      contentView: this.contentView,
      section,
      src,
      value,
      sectionRoot,
      onChange: this.onChange,
      onRemove: this.onRemove,
      docEmbedView: this.docEmbedView,
    });

    if (this.engine || this.contentView) {
      imageNode.changeDisplay(sectionRoot, value.display);
    }

    imageNode.render(container);
    this.imageNode = imageNode;
    // Section工具栏
    this.section.setToolbar({
      sectionRoot,
      engine: this.engine,
      component: this,
    });
  }
}

Image.type = 'inline';
export default Image;
