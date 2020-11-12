const PLUGIN_NAME = 'onlinedoc';
export default {
  initialize() {
    this.command.add(PLUGIN_NAME, {
      execute: (url) => {
        const section = this.change.insertSection(PLUGIN_NAME, { url });
        if (!url) {
          this.section.getComponent(section)
            .focusInput();
        }
      },
    });
  },
};
