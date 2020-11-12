import Engine from '@hicooper/doc-engine';

export default {
  initialize() {
    // 移除未完成上传的文件
    this.on('setvalue', () => {
      this.container.find('[data-section-key=video]')
        .each((node) => {
          const sectionRoot = Engine.$(node);
          const value = this.section.getValue(sectionRoot);
          if (value.status === 'uploading') {
            this.section.removeNode(sectionRoot);
          }
        });
    });
  },
};
