import LockedTextSection from '../section/locked-text';

const PLUGIN_NAME = 'lockedtext';

export default {
  initialize() {
    this.command.add(PLUGIN_NAME, {
      execute: () => {
        this.change.insertSection(PLUGIN_NAME);
      },
    });
  },
};
export {
  LockedTextSection,
};
