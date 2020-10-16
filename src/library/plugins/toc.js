import Engine from 'doc-engine/lib';
import Outline from '../utils/outline';
import { addSidebarCommand } from '../utils/command';

const PLUGIN_NAME = 'toc';

function getData() {
  // 从编辑区域提取符合结构要求的标题 Dom 节点
  const nodes = [];
  this.container.find('h1,h2,h3,h4,h5,h6').each((node) => {
    node = Engine.$(node);
    // Section里的标题，不纳入大纲
    if (this.section.closest(node)) {
      return;
    }
    // 非一级深度标题，不纳入大纲
    if (!node.parent().isRoot()) {
      return;
    }
    nodes.push(node[0]);
  });
  return Outline.normalize(nodes);
}

function getConfig() {
  const locale = this.locale[PLUGIN_NAME];
  let data = null;

  try {
    data = getData.call(this);
  } catch (e) {
    data = [];
  }

  return {
    name: PLUGIN_NAME,
    title: locale.title,
    className: `itellyou-${PLUGIN_NAME}-sidebar`,
    data,
  };
}

export default {
  initialize() {
    // 创建工具栏命令
    addSidebarCommand(this, PLUGIN_NAME, getConfig);
    // 编辑时候更新侧边栏
    const change = () => {
      if (!this.command.queryState(PLUGIN_NAME)) {
        return;
      }

      window.setTimeout(() => {
        if (!this.isDestroyed) {
          const config = getConfig.call(this);
          this.sidebar.store(config);
          this.sidebar.set(config);
        }
      }, 100);
    };
    if (this.ot) {
      this.ot.on('load', change);
    }
    this.on('change', change);
  },
};
