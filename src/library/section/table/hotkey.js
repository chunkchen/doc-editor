import Keymaster from 'keymaster';
import Engine from '@hicooper/doc-engine/lib';

const {$} = Engine;

const hotkey = {
  handler: {},
  filter(section) {
    Keymaster.filter = (e) => {
      const template = section.template;
      const tagName = (e.target || e.srcElement).tagName.toLocaleUpperCase();
      const target = $(e.target).closest(template.TABLE_TEXTAREA_CLASS);
      if (target[0]) return true;
      return !(tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA');
    };
  },
  add(key, callback) {
    if (this.handler[key]) {
      this.handler[key].push(callback);
      return;
    }
    this.handler[key] = [callback];
    Keymaster(key, (e) => {
      this.handler[key].forEach((fn) => {
        fn(e);
      });
    });
  },
  clear() {
  },
};

class Hotkey {
  constructor(section) {
    this.section = section;
    hotkey.filter(section);
  }

  add(key, callback) {
    hotkey.add(key, (e) => {
      if (!this.section || !this.section.active) return;
      callback(e);
    });
  }
}

export default Hotkey;
