import React from 'react';
import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine';
import ajax from '../../network/ajax';
import lang from './lang';
import SectionBase from '../base';
import Lock from './Lock';
import Unlock from './Unlock';

const template = (isTitle, locale) => {
  return '\n    <div class="lake-lockedtext">\n      '
    .concat(
      isTitle
        ? '\n      <div class="lake-lockedtext-header">\n        <h5>'
          .concat(
            locale.title,
            '</h5>\n        <span class="locktrigger">\n          <span class="lake-icon lake-icon-lock"></span>\n          <span class="text">',
          )
          .concat(locale.setPassword, '</span>\n        </span>\n      </div>')
        : '',
      '\n      <div class="lake-lockedtext-content">\n        <textarea class="lockedtext"></textarea>\n      </div>\n      <div class="unlock-container ',
    )
    .concat(
      isTitle ? 'editing' : 'reading',
      '"></div>\n      <div class="lock-container"></div>\n    </div>\n  ',
    );
};

const uid = Math.random();
const cacheList = {};

class LockedText extends SectionBase {
  constructor(engine, contentView) {
    super();
    this.engine = engine;
    this.contentView = contentView;
    if (engine) {
      this.section = engine.section;
      this.locale = lang[engine.options.lang];
      this.cyptoApi = engine.options.lockedtext && engine.options.lockedtext.action
        ? engine.options.lockedtext.action
        : '';
    } else {
      this.locale = lang[contentView.options.lang];
      this.cyptoApi = contentView.options.lockedtext && contentView.options.lockedtext.action
        ? contentView.options.lockedtext.action
        : '';
      this.originData = '';
      this.cryptoData = '';
      this.password = '';
      this.locked = false;
      this.errorCount = 0;
    }
  }

  destroy = () => {
    if (this.engine) this.engine.toolbar.disable(false);
  };

  updateValue = (fore) => {
    if (this.password) {
      if (this.crypting && !fore) return;
      this.crypting = true;
      ajax({
        url: this.cyptoApi,
        data: {
          pwd: this.password,
          text: this.originData,
          action: 'encrypt',
        },
        method: 'POST',
        success: (res) => {
          if (!res.result) {
            this.crypting = false;
            this.engine.messageError(this.locale.encryptoError);
            return;
          }
          this.crypting = false;
          this.cryptoData = res.data;
          this.setValue(
            {
              pageUid: uid,
              locked: this.locked,
              cryptoData: this.cryptoData,
              originData: '',
            },
            true,
          );
          if (fore) {
            this.showUnLockpanel();
            this.showStatus();
          }
        },
        error: () => {
          this.crypting = false;
          if (fore) {
            this.engine.messageError(this.locale.encryptoError);
          }
        },
      });
    } else {
      this.setValue(
        {
          pageUid: uid,
          locked: false,
          originData: this.originData,
        },
        true,
      );
    }
  };

  lock = (key) => {
    if (key !== undefined) this.cachePassword(key);
    if (this.engine) {
      if (!this.password) {
        this.showLockPanel();
        return;
      }
      this.updateValue(true);
    }
  };

  unLock = (key) => {
    if (key && this.cryptoData && !this.disabled && !this.crypting) {
      this.crypting = true;
      ajax({
        url: this.cyptoApi,
        data: {
          pwd: key,
          text: this.cryptoData,
          action: 'decrypt',
        },
        method: 'POST',
        success: (res) => {
          if (!res.result) {
            this.crypting = false;
            this.showError();
            return;
          }
          this.crypting = false;
          this.originData = res.data !== undefined ? res.data : '';
          this.cachePassword(key);
          this.showOriginData(this.originData);
          this.locktrigger.find('.text')
            .html(this.locale.lock);
          this.showStatus();
        },
        error: () => {
          this.crypting = false;
          this.showError();
        },
      });
    }
  };

  showError = () => {
    this.errorCount += 1;
    if (this.errorCount === 5) {
      this.disabled = true;
      Engine.$(this.unLockContainer)
        .addClass('locked');
      this.delayClearLockStatus();
    }
    Engine.$(this.unLockContainer)
      .addClass('error');
  };

  delayClearLockStatus = () => {
    setTimeout(() => {
      this.disabled = false;
      this.errorCount = 0;
      Engine.$(this.unLockContainer)
        .removeClass('error');
      Engine.$(this.unLockContainer)
        .removeClass('locked');
    }, 60000);
  };

  showOriginData = (value) => {
    this.clear();
    this.textarea[0].value = value;
    this.textarea.attr('data-origin-data', value);
    this.originData = value;
    this.locked = false;
  };

  showLockPanel = () => {
    this.clear();
    ReactDOM.render(
      <Lock onLock={this.lock} onCancelLock={this.onCancelLock} locale={this.locale}/>,
      this.lockContainer,
    );
  };

  showUnLockpanel = () => {
    this.locked = true;
    this.clear();
    ReactDOM.render(<Unlock onUnlock={this.unLock} locale={this.locale}/>, this.unLockContainer);
  };

  cachePassword = (password) => {
    this.password = password;
    cacheList[this.value.uid] = password;
  };

  clear = () => {
    Engine.$(this.unLockContainer)
      .removeClass('error');
    Engine.$(this.unLockContainer)
      .removeClass('locked');
    ReactDOM.unmountComponentAtNode(this.unLockContainer);
    if (this.lockContainer) ReactDOM.unmountComponentAtNode(this.lockContainer);
  };

  onCancelLock = () => {
    this.clear();
  };

  onChangeValue = (e) => {
    const value = e.target.value;
    if (this.originData !== value) {
      this.originData = value;
      this.updateValue();
    }
  };

  onInput = (e) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.onChangeValue(e);
    }, 3000);
  };

  bindLockEvent = () => {
    this.locktrigger = this.container.find('.locktrigger');
    this.locktrigger.on('click', () => {
      this.lock();
    });
  };

  showStatus = () => {
    if (this.engine) {
      this.lockstatus.html(this.value.cryptoData ? '' : this.locale.unLockedInfo);
    }
  };

  renderHTML = (isTitle) => {
    this.cryptoData = this.value.cryptoData || '';
    this.originData = this.value.originData || '';
    this.pageUid = this.value.pageUid || '';
    this.container.append(Engine.$(template(isTitle, this.locale)));
    this.textarea = this.container.find('.lockedtext');
    this.unLockContainer = this.container.find('.unlock-container')[0];
    this.lockContainer = this.container.find('.lock-container')[0];
    this.lockstatus = this.container.find('.lockstatus');
    this.bindLockEvent();
    this.showStatus();
    this.locked = this.pageUid === uid ? this.value.locked : this.locked;
    if (!isTitle) {
      if (this.cryptoData) {
        this.locked = true;
      } else if (this.originData) {
        this.showOriginData(this.originData);
        return;
      }
    }
    if (!this.locked) {
      if (this.originData) {
        this.showOriginData(this.originData);
        return;
      }
      if (cacheList[this.value.uid]) {
        this.unLock(cacheList[this.value.uid]);
        return;
      }
    }
    if (this.cryptoData) this.showUnLockpanel();
  };

  embedToolbar() {
    const engine = this.engine;
    const config = (engine ? engine.options.lockedtext : this.contentView.options.lockedtext) || {};
    const embed = [
      {
        type: 'dnd',
      },
      {
        type: 'copy',
      },
      {
        type: 'separator',
      },
      {
        type: 'delete',
      },
    ];
    if (Array.isArray(config.embed)) {
      return config.embed;
    }
    if (typeof config.embed === 'object') {
      const embedArray = [];
      embed.forEach((item) => {
        if (config.embed[item.type] !== false) {
          embedArray.push(item);
        }
      });
      return embedArray;
    }
    return embed;
  }

  activate() {
    if (this.engine) this.engine.toolbar.disable(true);
  }

  unactivate() {
    if (this.engine) this.engine.toolbar.disable(false);
  }

  renderView() {
    this.renderHTML();
    this.textarea.attr('readonly', true);
  }

  renderEditor() {
    this.renderHTML(true);
    this.textarea.on('change', this.onChangeValue);
    this.textarea.on('input', this.onInput);
  }

  render(e, value) {
    this.value = value || {};
    if (this.contentView) {
      this.renderView();
    } else {
      this.renderEditor();
    }
  }
}

LockedText.type = 'block';
LockedText.uid = true;
export default LockedText;
