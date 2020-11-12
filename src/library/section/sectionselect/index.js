import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import Engine from '@hicooper/doc-engine';
import keymaster, { deleteScope, setScope, unbind } from 'keymaster';
import ToolbarCollapse from '../../toolbar/collapse';
import toolbarConfig from '../../config/toolbar';
import SectionBase from '../base';

const SCOPE_NAME = 'lake-plugin-sectionselect';

class SectionSelect extends SectionBase {
  constructor(_engine) {
    super();

    this.handlePreventDefault = (e) => {
      // Section已被删除
      if (this.sectionRoot.closest('body').length !== 0) {
        e.preventDefault();
        return false;
      }
    };

    this.getClickNode = (listRoot) => {
      let node = listRoot.find('.lake-collapse-list-item-active');
      const uploadNode = node.closest('div.ant-upload-select');

      if (uploadNode.length > 0) {
        node = uploadNode.parent();
      }

      return node;
    };

    this.scrollItem = (direction) => {
      const listRoot = this.container.find('.lake-toolbar-collapse');
      const nodeList = listRoot.find('.lake-collapse-list-item');
      const activeNode = listRoot.find('.lake-collapse-list-item-active');
      let activeIndex = 0;
      nodeList.each((node, index) => {
        if (node === activeNode[0]) {
          activeIndex = index;
        }
      });
      const nextNode = nodeList.eq(direction === 'up' ? activeIndex - 1 : activeIndex + 1);
      if (!nextNode) {
        return;
      }
      this.selectItem(nextNode);

      let offset = listRoot.find('.ant-collapse-header')[0].clientHeight;
      const collapseItem = nextNode.closest('.ant-collapse-item');
      collapseItem.parent()
        .find('.ant-collapse-item')
        .each((node) => {
          if (node === collapseItem[0]) {
            return false;
          }

          offset += node.clientHeight;
        });
      offset += activeNode[0].clientHeight * nextNode.attr('data-index');
      listRoot[0].scrollTop = offset - listRoot[0].clientHeight / 2;
    };

    this.selectItem = (node) => {
      const listRoot = this.container.find('.lake-toolbar-collapse');
      listRoot.find('.lake-collapse-list-item-active')
        .removeClass('lake-collapse-list-item-active');
      node.addClass('lake-collapse-list-item-active');
    };

    this.searchData = (keyword) => {
      const items = [];
      // search with case insensitive
      if (typeof keyword === 'string') keyword = keyword.toLowerCase();

      this.data.forEach((group) => {
        group.items.forEach((item) => {
          if (item.title.toLowerCase()
            .indexOf(keyword) >= 0 || item.pinyin.toLowerCase()
            .indexOf(keyword) >= 0) {
            if (!items.find((dataItems) => {
              return dataItems.name === item.name;
            })) {
              items.push({ ...item });
            }
          }
        });
      });
      const newData = [];
      if (items.length > 0) {
        newData.push({
          title: '',
          items,
        });
      }
      return newData;
    };

    this.handleInput = () => {
      const engine = this.engine;
      if (engine.domEvent.isComposing) {
        return;
      }
      const content = this.keywordNode[0].innerText;
      // 内容为空
      if (content === '') {
        this.removeSectionSelect();

        engine.change.removeSection(this.sectionRoot);
        return;
      }

      const keyword = content.substr(1);
      // 搜索关键词为空
      if (keyword === '') {
        this.renderSectionSelect(this.data);

        return;
      }
      const newData = this.searchData(keyword);
      // 有搜索结果
      if (newData.length > 0) {
        this.renderSectionSelect(newData);
        return;
      }
      // 搜索结果为空
      this.changeToText();
    };

    this.removeSectionSelect = () => {
      const sectionSelectNode = this.container.find('.lake-sectionselect-list');

      if (sectionSelectNode.length > 0) {
        unmountComponentAtNode(sectionSelectNode[0]);
        sectionSelectNode.remove();
      }
    };

    this.removeSection = () => {
      this.removeSectionSelect();
      this.engine.change.removeSection(this.sectionRoot);
    };

    this.changeToText = () => {
      if (!this.sectionRoot.isEditable()) {
        return;
      }

      const content = this.keywordNode[0].innerText;
      this.removeSection();
      this.engine.change.insertText(content);
    };

    this.handleClick = () => {
      this.removeSectionSelect();
      this.engine.change.removeSection(this.sectionRoot);
    };

    this.handleBeforeUpload = () => {
      this.sectionRoot.hide();
      Engine.$(document.body)
        .append(this.sectionRoot);
    };

    this.handleAfterUpload = () => {
      // 上传结束之后删除Section
      this.removeSectionSelect();
      this.sectionRoot.remove();
    };

    this.renderSectionSelect = (data) => {
      this.unbindEvents();
      const engine = this.engine;
      this.removeSectionSelect();
      const sectionSelectNode = Engine.$('<div class="lake-sectionselect-list" />');

      this.container.append(sectionSelectNode);
      const classArray = [];
      const rootOffset = this.sectionRoot.offset();
      const editorHeader = Engine.$('.lark-editor-header');
      let height = 0;
      if (editorHeader.length > 0) {
        const toolbarElement = engine.container.closest('.lake-editor')
          .find('.lake-toolbar');
        if (toolbarElement.length > 0) height = editorHeader[0].clientHeight + toolbarElement[0].clientHeight;
      }
      if (rootOffset.top - height > 482) {
        classArray.push('lake-button-set-list-to-top');
      }
      if (data[0].title === '') {
        classArray.push('lake-button-set-list-search');
      }

      const collapseProps = {
        className: classArray.length > 0 ? classArray.join(' ') : undefined,
        active: true,
        engine,
        locale: engine.locale,
        data,
        activeKeys: data.map((item, index) => {
          return String(index);
        }),
        onClick: this.handleClick,
        hideDropdown: () => {
          this.container.hide();
        },
        removeSelect: this.handleClick,
        onBeforeUpload: this.handleBeforeUpload,
        onAfterUpload: this.handleAfterUpload,
      };
      ReactDOM.render(<ToolbarCollapse {...collapseProps} />, sectionSelectNode[0]);
      const listItem = sectionSelectNode.find('.lake-collapse-list-item');
      if (listItem.length > 0) {
        this.selectItem(listItem.eq(0));
      }
      this.bindEvents();
    };

    this.engine = _engine;
    this.readonly = !_engine;

    if (this.readonly) {
      return;
    }
    const { toolbar } = _engine.options;
    const toolbarConfigMap = {};
    // let data = []
    toolbarConfig(_engine)
      .forEach((row) => {
        toolbarConfigMap[row.name] = row;
      });
    /* const toolbarSection = toolbar['section'] || {}
    if(typeof toolbarSection === "object"){
        const sectionConfigMap = toolbarConfigMap['section']
        sectionConfigMap.data.forEach(group => {
            const items = group.items.filter(sectionItem => toolbarSection.items && toolbarSection.items.find(item => typeof item === "object" && item.name === sectionItem.name || item === sectionItem.name) || !toolbarSection.items)
            if(items && items.length > 0){
                data.push({
                    title:group.title,
                    items:items
                })
            }
        })
    }else if(toolbarSection === true){
        data = toolbarConfigMap['section'].data
    } */

    this.data = toolbarConfigMap.section.data;
  }

  destroy() {
    this.unbindEvents();
    this.removeSectionSelect();
  }

  unactivate() {
    this.unbindEvents();
    this.changeToText();
  }

  unbindEvents() {
    deleteScope(SCOPE_NAME);
    unbind('enter', SCOPE_NAME);
    unbind('up', SCOPE_NAME);
    unbind('down', SCOPE_NAME);
    unbind('esc', SCOPE_NAME);
    this.engine.off('keydown:enter', this.handlePreventDefault);
  }

  bindEvents() {
    this.unbindEvents();
    setScope(SCOPE_NAME);
    keymaster('enter', SCOPE_NAME, (e) => {
      // Section已被删除
      if (this.sectionRoot.closest('body').length === 0) {
        return;
      }

      e.preventDefault();
      const listRoot = this.container.find('.lake-toolbar-collapse');

      const node = this.getClickNode(listRoot);
      const fileInput = node.find('input[type=file]');
      if (fileInput.length > 0) {
        fileInput[0].click();
      } else {
        node[0].click();
      }
    });
    keymaster('up', SCOPE_NAME, (e) => {
      // Section已被删除
      if (this.sectionRoot.closest('body').length === 0) {
        return;
      }
      e.preventDefault();
      this.scrollItem('up');
    });
    keymaster('down', SCOPE_NAME, (e) => {
      // Section已被删除
      if (this.sectionRoot.closest('body').length === 0) {
        return;
      }
      e.preventDefault();
      this.scrollItem('down');
    });
    keymaster('esc', SCOPE_NAME, (e) => {
      e.preventDefault();

      this.unbindEvents();

      this.changeToText();
    });
    this.engine.on('keydown:enter', this.handlePreventDefault);
  }

  resetPlaceHolder() {
    if (this.keywordNode[0].innerText === '/') {
      this.placeholder.show();
    } else {
      this.placeholder.hide();
    }
  }

  render(container) {
    // 阅读模式
    if (this.readonly) {
      return;
    }
    this.sectionRoot.attr('data-transient', 'true');
    this.sectionRoot.attr('contenteditable', false);
    // 编辑模式
    container.append('\n      <span class="lake-sectionselect-keyword" contenteditable="true">/</span>\n      <span class="lake-sectionselect-placeholder" style="\n        color: rgba(0,0,0,0.25);\n        pointer-events: none;\n        position: absolute;\n        width: 76px;\n        left: 7px;\n      ">'.concat(this.engine.locale.section.placeholder, '</span>\n    '));
    const keywordNode = container.find('.lake-sectionselect-keyword');
    this.keywordNode = keywordNode;
    this.placeholder = container.find('.lake-sectionselect-placeholder');
    // 监听输入事件
    keywordNode.on('keydown', (e) => {
      if (Engine.isHotkey('enter', e)) {
        e.preventDefault();
      }
    });
    const renderTime = Date.now();
    keywordNode.on('input', () => {
      this.resetPlaceHolder();
      // 在 Windows 上使用中文输入法，在 keydown 事件里无法阻止用户的输入，所以在这里删除用户的输入
      if (Date.now() - renderTime < 100) {
        const textNode = keywordNode.first();
        if ((textNode && textNode.isText() && textNode[0].nodeValue === '/、') || textNode[0].nodeValue === '//') {
          const rightTextNode = textNode[0].splitText(1);
          Engine.$(rightTextNode)
            .remove();
        }
      }

      setTimeout(() => {
        this.handleInput();
      }, 10);
    });
    // 显示下拉列表
    this.renderSectionSelect(this.data);
  }
}

SectionSelect.type = 'inline';
SectionSelect.singleSelectable = false;
export default SectionSelect;
