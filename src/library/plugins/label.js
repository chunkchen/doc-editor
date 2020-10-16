const PLUGIN_NAME = 'label';

export default {
  initialize() {
    this.command.add(PLUGIN_NAME, {
      execute: () => {
        const section = this.change.insertSection(PLUGIN_NAME);
        const component = this.section.getComponent(section);
        this.change.activateSection(section);
        setTimeout(() => {
          component.focusInput();
        }, 20);
      },
    });
  },
};
