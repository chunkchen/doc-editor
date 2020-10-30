import {addSidebarCommand} from '../utils/command';

const PLUGIN_NAME = 'translate';

function getConfig() {
  const locale = this.locale[PLUGIN_NAME];
  return {
    name: PLUGIN_NAME,
    title: locale.title,
    className: `lake-${PLUGIN_NAME}-sidebar`,
    data: null,
  };
}

export default {
  initialize() {
    // 创建工具栏命令
    addSidebarCommand(this, PLUGIN_NAME, getConfig);
  },
};
