import Engine from '@hicooper/doc-engine';
import { addDialogCommand } from '../utils/command';

const PLUGIN_NAME = 'search';

function getConfig() {
  const locale = this.locale[PLUGIN_NAME];
  return {
    name: PLUGIN_NAME,
    title: locale.title,
    className: `lake-dialog-${PLUGIN_NAME}`, // data: {},
  };
}

export default {
  initialize() {
    // 创建命令
    addDialogCommand(this, PLUGIN_NAME, getConfig);
    this.domEvent.onDocument('keydown', (e) => {
      if (Engine.isHotkey('mod+shift+f', e)) {
        e.preventDefault();
        this.command.execute(PLUGIN_NAME);
      }
    });
  },
};
