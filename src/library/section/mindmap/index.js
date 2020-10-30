import Engine from 'doc-engine/lib';
import GraphSection from '../graphsection';
import GraphEditor from '../graphsection/graph-editor';

const {userAgent} = Engine;

/**
 * @fileOverview 思维脑图
 */
class MindMap extends GraphSection {
  constructor(engine, contentView) {
    super({
      engine,
      contentView,
      pageType: 'mindmap',
    });
  }

  topToolbar() {
    const {engine, locale, graphEditor} = this;
    return [{
      name: 'save',
      title: locale.save,
      hotkey: userAgent.macos ? '⌘+S' : 'Ctrl+S',
      icon: '<span class="lake-icon lake-icon-save" />',
      onClick: () => {
        engine.command.execute('save');
      },
    }, {
      name: 'mindmap:undo',
      title: locale.undo,
      hotkey: userAgent.macos ? '⌘+Z' : 'Ctrl+Z',
      icon: '<span class="lake-icon lake-icon-undo" />',
      getDisabled: () => {
        return !graphEditor.commandEnable('undo');
      },
      onClick: () => {
        graphEditor.executeCommand('undo');
      },
    }, {
      name: 'mindmap:redo',
      title: locale.redo,
      hotkey: userAgent.macos ? '⌘+Y' : 'Ctrl+Y',
      icon: '<span class="lake-icon lake-icon-redo" />',
      getDisabled: () => {
        return !graphEditor.commandEnable('redo');
      },
      onClick: () => {
        graphEditor.executeCommand('redo');
      },
    }, {
      type: 'separator',
    }, {
      name: 'mindmap:append',
      title: locale.insertSibling,
      hotkey: 'Enter',
      icon: '<span class="lake-icon lake-icon-sister-node" />',
      getDisabled: () => {
        return !graphEditor.commandEnable('append');
      },
      onClick: () => {
        graphEditor.executeCommand('append');
      },
    }, {
      name: 'mindmap:appendChild',
      title: locale.insertChild,
      hotkey: 'Tab',
      icon: '<span class="lake-icon lake-icon-sub-node" />',
      getDisabled: () => {
        return !graphEditor.commandEnable('appendChild');
      },
      onClick: () => {
        graphEditor.executeCommand('appendChild');
      },
    }, {
      name: 'mindmap:collapse',
      title: locale.collapse,
      hotkey: userAgent.macos ? '⌘+/' : 'Ctrl+/',
      icon: '<span class="lake-icon lake-icon-collapse-subtree" />',
      getDisabled: () => {
        return !graphEditor.commandEnable('collapse');
      },
      onClick: () => {
        graphEditor.executeCommand('collapse');
      },
    }, {
      name: 'mindmap:expand',
      title: locale.expand,
      hotkey: userAgent.macos ? '⌘+/' : 'Ctrl+/',
      icon: '<span class="lake-icon lake-icon-expand-subtree" />',
      getDisabled: () => {
        return !graphEditor.commandEnable('expand');
      },
      onClick: () => {
        graphEditor.executeCommand('expand');
      },
    }, {
      type: 'separator',
    }];
  }

  getChangeDataCommandNames() {
    return ['update', 'append', 'appendChild', 'collapseExpand', 'redo', 'undo', 'delete', 'selectAll', 'moveMindNode'];
  }

  renderPage() {
    const mind = new GraphEditor.Mind({
      graph: {
        ...this.defaultGraphCfg,
        container: this.pageContainer[0],
      },
    });
    this.graphEditor.add(mind);
    this.page = mind;
  }
}

export default MindMap;
