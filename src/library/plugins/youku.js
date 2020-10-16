const PLUGIN_NAME = 'youku';
export default {
  initialize() {
    // 创建命令
    this.command.add(PLUGIN_NAME, {
      execute: (url) => {
        const sectionRoot = this.change.insertSection('youku', url);
        this.section.getComponent(sectionRoot).focusInput();
      },
    });
  },
};
