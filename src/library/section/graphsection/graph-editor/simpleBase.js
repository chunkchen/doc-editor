import G6 from '@antv/g6';

const Util = G6.Util;

class Base {
  constructor(cfg) {
    const defaultCfg = this.getDefaultCfg();
    Util.mix(true, this, defaultCfg, cfg);
    this.init();
  }

  getDefaultCfg() {
    return {};
  }

  init() {
  }

  destroy() {
  }
}

export default Base;
