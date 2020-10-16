import { post } from '@itellyou/itellyou-request';
import Engine from 'doc-engine/lib';

class Transfer {
  constructor(options) {
    this.options = Object.assign({
      needTransferSections: ['file', 'localdoc'],
      engine: null,
    }, options);

    this.action = this._getAttachmentCopyAction();
    this.bindEvent();
  }

  _getAttachmentCopyAction() {
    const fileOptions = this.options.engine.options.file || {};
    const { copyAction, action } = fileOptions;
    if (copyAction) return copyAction;
    if (action) {
      return action.replace(/token=[^&]+&/, '');
    }
    return '';
  }

  _transferFile(node, value) {
    const { engine } = this.options;
    post(this.action, {
      attachments: [value.refSrc.replace(/(.*?)attachments\//, '')],
    }).then((res) => {
      const url = res.data[0].url;
      Engine.UploadUtils.updateSection(engine, node, url ? {
        src: url,
        status: 'done',
      } : {
        status: 'error',
        message: '\u8f6c\u5b58\u5931\u8d25\uff1a\u8d44\u6e90\u4e0d\u5b58\u5728\u6216\u8005\u65e0\u6743\u8bbf\u95ee',
      }, true);
    }).catch(() => {
      Engine.UploadUtils.updateSection(engine, node, {
        status: 'error',
      }, true);
    });
  }

  bindEvent() {
    const { engine, needTransferSections } = this.options;
    engine.on('paste:each', (node) => {
      const data = node.attr('data-ready-section');
      if (needTransferSections.indexOf(data) > -1) {
        const value = engine.section.getValue(node);
        const src = value.src;
        if (src) {
          value.src = '';
          value.status = 'transfering';
          value.refSrc = src;
          engine.section.setValue(node, value);
        }
      }
    });
    const selector = `[data-section-key=${needTransferSections.join('],[data-section-key=')}]`;
    engine.on('paste:after', () => {
      engine.container.find(selector).each((node) => {
        const section = Engine.$(node);
        const value = engine.section.getComponent(section).value;
        if (value.status === 'transfering' && value.refSrc) {
          this._transferFile(section, value);
        }
      });
    });
  }
}

export default Transfer;
