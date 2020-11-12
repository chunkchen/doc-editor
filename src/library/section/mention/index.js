import lodash_uniqBy from 'lodash/uniqBy';
import Keymaster from 'keymaster';
import Engine from '@hicooper/doc-engine';
import ajax from '../../network/ajax';

const SCOPE_NAME = 'lake-plugin-mention';

const suggestionItemTemplate = function (data) {
  let depHtml = '';
  if (data.dep) {
    const dep = data.dep && data.dep.split('-')[0];
    depHtml = '<span class="lake-mention-item-dep">'.concat(Engine.StringUtils.escape(dep), '</span><span class="lake-mention-item-split">-</span>');
  }
  const avatar = data.avatar ? Engine.StringUtils.escape(data.avatar) : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTcxNTU3NjI5NTIzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijk2ODciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMiAwQzIyOS42NzQ2NjcgMCAwIDIyOS42NzQ2NjcgMCA1MTJzMjI5LjY3NDY2NyA1MTIgNTEyIDUxMiA1MTItMjI5LjY3NDY2NyA1MTItNTEyUzc5NC4zMjUzMzMgMCA1MTIgMHpNNTIzLjIyMTMzMyAxNTIuMTcwNjY3YzE5My42IDAgMTkzLjkyIDE0OC4xMTczMzMgMTkzLjkyIDIzMS40MjRzLTc3LjU2OCAyMzguMDgtMTkzLjkyIDIzOC4yNzJjLTExNi4zNTIgMC4xNzA2NjctMTkzLjkyLTE1NC45NDQtMTkzLjkyLTIzOC4yNTA2NjdDMzI5LjMwMTMzMyAzMDAuMzA5MzMzIDMyOS42NDI2NjcgMTUyLjE3MDY2NyA1MjMuMjIxMzMzIDE1Mi4xNzA2Njd6TTUxMiA5OTUuNzc2Yy0xNDguMTYgMC0yODAuNjgyNjY3LTY2LjY4OC0zNjkuNDI5MzMzLTE3MS41ODQgMTEuNjQ4LTMyLjIxMzMzMyAyOC42OTMzMzMtNjcuMTE0NjY3IDUxLjczMzMzMy04NS4wMzQ2NjcgNDkuNTM2LTM4LjU0OTMzMyAxOTIuMjk4NjY3LTEwMi42MTMzMzMgMTkyLjI5ODY2Ny0xMDIuNjEzMzMzbDkwLjEzMzMzMyAxNzEuNDEzMzMzIDE2LjM4NC00MS41NTczMzMtMjUuNDA4LTUxLjI0MjY2NyA1MC43OTQ2NjctNTEuMjY0IDUwLjc3MzMzMyA1MS4yNjQtMjUuMzY1MzMzIDUxLjI0MjY2NyAxMy43Mzg2NjcgNDAuNTk3MzMzIDkyLjcxNDY2Ny0xNzAuNDUzMzMzYzAgMCAxNDIuNzg0IDY0LjA2NCAxOTIuMzIgMTAyLjYxMzMzMyAyMi41NzA2NjcgMTcuNTc4NjY3IDM4LjQyMTMzMyA0NC44NjQgNDkuNTc4NjY3IDcxLjcyMjY2N0M4MDMuNjkwNjY3IDkyMy4zOTIgNjY2LjMyNTMzMyA5OTUuNzc2IDUxMiA5OTUuNzc2eiIgZmlsbD0iIzhhOGE4YSIgcC1pZD0iOTY4OCI+PC9wYXRoPjwvc3ZnPg==';
  return '\n  <div class="lake-mention-item" data-index="'.concat(Engine.StringUtils.escape(data.index), '" data-key="')
    .concat(Engine.StringUtils.escape(data.key), '" data-name="')
    .concat(Engine.StringUtils.escape(data.name), '">\n    <span class="lake-mention-item-avatar">\n      <img src="')
    .concat(avatar, '">\n    </span>\n    <span class="lake-mention-item-text">\n      <span class="lake-mention-item-text-item">\n        <span class="lake-mention-item-name">')
    .concat(Engine.StringUtils.escape(data.name), '</span>\n      </span>\n      <span class="lake-mention-item-text-item" style="font-size: 12px;">\n        ')
    .concat(depHtml, '<span class="lake-mention-item-id">')
    .concat(Engine.StringUtils.escape(data.key), '</span>\n      </span>\n    </span>\n  </div>\n  ');
};

class Mention {
  constructor(_engine) {
    this.engine = _engine;
    this.readonly = !_engine;
  }

  handleSearch = (keyword) => {
    const config = this.engine.options.mention || {};
    const { action, paramName } = config;

    if (this.ajax) {
      this.ajax.abort();
    }

    const ajaxConfig = {
      url: action,
      data: {},
      method: 'GET',
      success: (res) => {
        this.ajax = null;
        let dataList = res.data || [];
        const userMap = {};
        dataList = dataList.map((row) => {
          userMap[row.key] = true;
          row.avatar = row.avatar_url || row.avatar;
          return row;
        });
        dataList = this.default.filter((row) => {
          let key = userMap[row.key];
          if (!key && row.key) {
            key = row.key.toLowerCase()
              .indexOf(keyword) !== -1;
          }
          if (!key && row.name) {
            key = row.name.toLowerCase()
              .indexOf(keyword) !== -1;
          }
          return key;
        })
          .concat(dataList);
        dataList = lodash_uniqBy(dataList, 'key');
        this.renderSuggestion(dataList);
      },
    };
    ajaxConfig.data[paramName] = keyword;
    this.ajax = ajax(ajaxConfig);
  };

  handleItemClick = (e) => {
    e.preventDefault();
    const node = Engine.$(e.target)
      .closest('.lake-mention-item');
    this.updateSection(node);
  };

  handlePreventDefault = (e) => {
    // Section已被删除
    if (this.sectionRoot.closest('body').length === 0) {
      return;
    }
    e.preventDefault();
    return false;
  };

  handleInput = (mentionNode) => {
    if (this.engine.domEvent.isComposing) {
      return;
    }
    const content = mentionNode[0].innerText;
    // 内容为空
    if (content === '') {
      this.engine.change.removeSection(this.sectionRoot);
      return;
    }
    const keyword = content.trim()
      .substr(1);
    if (keyword === '') {
      this.renderSuggestion();
      return;
    }
    this.handleSearch(keyword);
  };

  focusSection = () => {
    this.engine.change.focusSection(this.sectionRoot);
  };

  destroy() {
    this.unbindEvents();
  }

  activate() {
    if (this.status !== 'done') {
      this.container.find('.lake-mention-list')
        .show();
      this.bindEvents();
    }
  }

  unactivate() {
    if (this.status !== 'done') {
      this.container.find('.lake-mention-list')
        .hide();
      this.unbindEvents();
    }
  }

  unbindEvents() {
    Keymaster.deleteScope(SCOPE_NAME);
    Keymaster.unbind('enter', SCOPE_NAME);
    Keymaster.unbind('up', SCOPE_NAME);
    Keymaster.unbind('down', SCOPE_NAME);
    this.engine.off('keydown:enter', this.handlePreventDefault);
  }

  bindEvents() {
    this.unbindEvents();
    Keymaster.setScope(SCOPE_NAME);
    Keymaster('enter', SCOPE_NAME, (e) => {
      // 已被删除
      if (this.sectionRoot.closest('body').length === 0) {
        return;
      }
      e.preventDefault();
      const node = this.container.find('.lake-mention-list')
        .find('.lake-mention-item-selected');
      this.updateSection(node);
    });
    Keymaster('up', SCOPE_NAME, (e) => {
      // 已被删除
      if (this.sectionRoot.closest('body').length === 0) {
        return;
      }
      e.preventDefault();
      this.scrollItem('up');
    });
    Keymaster('down', SCOPE_NAME, (e) => {
      // 已被删除
      if (this.sectionRoot.closest('body').length === 0) {
        return;
      }
      e.preventDefault();
      this.scrollItem('down');
    });
    this.engine.on('keydown:enter', this.handlePreventDefault);
  }

  scrollItem(direction) {
    const mentionList = this.container.find('.lake-mention-list');
    const node = mentionList.find('.lake-mention-item-selected');
    const nextNode = direction === 'up' ? node.prevElement() : node.nextElement();
    if (!nextNode) {
      return;
    }

    this.selectItem(nextNode);
    const height = mentionList[0].clientHeight;
    const offset = node[0].clientHeight * nextNode.attr('data-index');
    mentionList[0].scrollTop = offset - height / 2;
  }

  selectItem(node) {
    this.container.find('.lake-mention-list')
      .find('.lake-mention-item-selected')
      .removeClass('lake-mention-item-selected');
    node.addClass('lake-mention-item-selected');
  }

  updateSection(node) {
    this.unbindEvents();
    this.engine.change.updateSection(this.sectionRoot, {
      key: node.attr('data-key'),
      name: node.attr('data-name'),
    });
  }

  renderSuggestion(dataList) {
    dataList = dataList || this.default;
    this.unbindEvents();
    this.container.find('.lake-mention-list')
      .remove();
    if (dataList.length === 0) {
      return;
    }

    const mentionList = Engine.$('<div class="lake-mention-list" />');
    dataList.forEach((data, index) => {
      data.index = index;
      data.avatar = data.avatar_url || data.avatar;
      const itemNode = Engine.$(suggestionItemTemplate(data));
      if (index === 0) {
        itemNode.addClass('lake-mention-item-selected');
      }

      itemNode.on('click', (e) => {
        this.handleItemClick(e);
      });
      itemNode.on('mouseenter', () => {
        this.selectItem(itemNode);
      });
      mentionList.append(itemNode);
    });
    this.container.append(mentionList);
    this.bindEvents();
  }

  render(container, value) {
    const engine = this.engine;
    // 阅读模式
    if (this.readonly) {
      if (!value) {
        return;
      }
      const { key, name } = value;

      if (key) {
        container.append('<a class="lake-mention-at" href="/'.concat(Engine.StringUtils.escape(key), '">@')
          .concat(Engine.StringUtils.escape(name), '(')
          .concat(Engine.StringUtils.escape(key), ')</a>'));
      } else {
        container.append('<a class="lake-mention-at">@'.concat(Engine.StringUtils.escape(name), '</a>'));
      }
      return;
    }
    // 编辑模式
    if (value && value.name) {
      const { key, name } = value;

      if (key) {
        container.append('<a class="lake-mention-at" href="/'.concat(Engine.StringUtils.escape(key), '">@')
          .concat(Engine.StringUtils.escape(name), '(')
          .concat(Engine.StringUtils.escape(key), ')</a>'));
      } else {
        container.append('<a class="lake-mention-at">@'.concat(Engine.StringUtils.escape(name), '</a>'));
      }
      this.status = 'done';
    } else {
      container.append('<a class="lake-mention-at" contenteditable="true">@</a>');
      this.status = 'inputting';
    }

    const mentionNode = container.find('.lake-mention-at');
    mentionNode.on('click', (e) => {
      // 禁止跳转
      e.preventDefault();
    });
    // 已经选中了一个人
    if (this.status === 'done') {
      return;
    }
    // 监听输入事件
    mentionNode.on('keydown', (e) => {
      if (Engine.isHotkey('space', e)) {
        e.preventDefault();
        this.unbindEvents();
        const char = mentionNode[0].innerText.substr(1);
        if (char === '') {
          engine.change.removeSection(this.sectionRoot);
          engine.change.insertText('@');
          return;
        }

        engine.change.updateSection(this.sectionRoot, {
          key: '',
          name: char,
        });
        this.focusSection();
        engine.change.insertText('\xA0');
      }
    });
    const renderTime = Date.now();
    mentionNode.on('input', () => {
      // 在 Windows 上使用中文输入法，在 keydown 事件里无法阻止用户的输入，所以在这里删除用户的输入
      if (Date.now() - renderTime < 100) {
        const textNode = mentionNode.first();
        if (textNode && textNode.isText() && textNode[0].nodeValue === '@@') {
          const rightTextNode = textNode[0].splitText(1);
          Engine.$(rightTextNode)
            .remove();
        }
      }

      setTimeout(() => {
        this.handleInput(mentionNode);
      }, 10);
    });
    // 显示下拉列表
    const config = engine.options.mention || {};
    this.default = config.default || config.getDefault() || [];
  }
}

Mention.type = 'inline';
Mention.selectStyleType = 'background';
export default Mention;
