import EventEmitter from 'eventemitter2'
import Util from './util'

class Base extends EventEmitter {
  constructor(cfg) {
    super()
    const defaultCfg = this.getDefaultCfg()
    this._cfg = Util.mix(true, {}, this._cfg, defaultCfg, cfg)
  }

  getDefaultCfg() {
    return {}
  }

  get(name) {
    return this._cfg[name]
  }

  set(name, value) {
    this._cfg[name] = value
  }

  destroy() {
    this._cfg = {}
    this.destroyed = true
  }
}

export default Base
