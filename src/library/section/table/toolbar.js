import Engine from 'doc-engine/lib';
import getSections from '../../config/section';
import emoji from '../../config/emoji';

const {
  userAgent: { macos },
} = Engine;
export default function (section) {
  const { engine, selection, command, locale } = section;
  const plugins = ['file', 'image', 'label'];
  let sections = getSections(engine);
  sections = sections.filter((plugin) => {
    if (plugins.indexOf(plugin.name) !== -1) {
      if (plugin.name === 'label') {
        plugin.onClick = () => {
          section.subEngine.command.execute('label');
        };
      }
      plugin.getDisabled = () => {
        return !selection.area;
      };
      plugin.name = `table:${plugin.name}`;
      return true;
    }
    return false;
  });
  const fontsizeArray = [
    {
      key: '9',
      value: '12px',
    },
    {
      key: '10',
      value: '13px',
    },
    {
      key: '11',
      value: '14px',
    },
    {
      key: '1515',
      value: '15px',
    },
    {
      key: '12',
      value: '16px',
    },
    {
      key: '14',
      value: '19px',
    },
    {
      key: '16',
      value: '22px',
    },
    {
      key: '18',
      value: '24px',
    },
    {
      key: '22',
      value: '29px',
    },
    {
      key: '24',
      value: '32px',
    },
    {
      key: '30',
      value: '40px',
    },
    {
      key: '36',
      value: '48px',
    },
  ];
  const fontsizeMap = {};
  fontsizeArray.forEach((fontsize) => {
    fontsizeMap[fontsize.key] = fontsize.value;
  });
  return [
    {
      name: 'table:section',
      type: 'collapse',
      title: locale.insertSection,
      icon: '<span class="lake-icon lake-icon-section" />',
      getDisabled: () => {
        return !section.subEngine;
      },
      data: [
        {
          items: sections,
        },
      ],
      onClick: (name) => {
        if (section.subEngine) {
          section.subEngine.command.execute(name);
        }
      },
    },
    {
      type: 'separator',
    },
    {
      name: 'table:save',
      title: locale.save,
      hotkey: macos ? '\u2318+S' : 'Ctrl+S',
      icon: '<span class="lake-icon lake-icon-save" />',
      onClick: () => {
        engine.command.execute('save');
      },
    },
    {
      name: 'table:undo',
      title: locale.undo,
      hotkey: macos ? '\u2318+Z' : 'Ctrl+Z',
      icon: '<span class="lake-icon lake-icon-undo" />',
      getDisabled: () => {
        if (section.subEngine && section.subEngine.command.queryState('undo')) {
          return false;
        }
        if (section.fullscreen) {
          return section.history.index === 0;
        }
        return !engine.command.queryState('undo');
      },
      onClick: () => {
        section.undo();
      },
    },
    {
      name: 'table:redo',
      title: locale.redo,
      hotkey: macos ? '\u2318+Shift+Z' : 'Ctrl+Shift+Z',
      icon: '<span class="lake-icon lake-icon-redo" />',
      getDisabled: () => {
        if (section.subEngine && section.subEngine.command.queryState('redo')) {
          return false;
        }
        if (section.fullscreen) {
          return section.history.isEnd();
        }
        return !engine.command.queryState('redo');
      },
      onClick: () => {
        section.redo();
      },
    },
    {
      name: 'table:removeformat',
      title: locale.removeformat,
      icon: '<span class="lake-icon lake-icon-clean" />',
      onClick: () => {
        command.clearFormat();
        command.execute('removeformat');
      },
    },
    {
      type: 'separator',
    },
    {
      name: 'table:fontsize',
      type: 'dropdown',
      title: locale.fontsizeTitle,
      className: 'lake-button-fontsize',
      data: fontsizeArray,
      getActive: () => {
        return section.command.queryState('fontsize') || '11';
      },
      getDisabled: () => {
        const tag = section.command.queryState('heading') || 'p';
        const isCodeblock = section.command.queryState('codeblock') === 'codeblock';
        return !section.selection.area || /^h\d$/.test(tag) || isCodeblock;
      },
      getCurrentText: (active) => {
        return fontsizeMap[active || '11'];
      },
      onClick: (value) => {
        section.command.execute('fontsize', value);
      },
    },
    {
      name: 'table:emoji',
      type: 'dropdown',
      title: locale.emoji,
      icon: '<span class="lake-icon lake-icon-emoji" />',
      data: emoji,
      onClick: (value) => {
        section.subEngine && section.subEngine.command.execute('emoji', value);
      },
    },
    {
      name: 'table:bold',
      title: locale.bold,
      hotkey: macos ? '\u2318+B' : 'Ctrl+B',
      icon: '<span class="lake-icon lake-icon-bold" />',
      getDisabled: () => {
        return !section.selection.area;
      },
      getActive: () => {
        return section.command.queryState('bold');
      },
      onClick: () => {
        section.command.execute('bold');
      },
    },
    {
      name: 'table:italic',
      title: locale.italic,
      hotkey: macos ? '\u2318+I' : 'Ctrl+I',
      icon: '<span class="lake-icon lake-icon-italic" />',
      getDisabled: () => {
        return !section.selection.area;
      },
      getActive: () => {
        return section.command.queryState('italic');
      },
      onClick: () => {
        section.command.execute('italic');
      },
    },
    {
      name: 'table:strikethrough',
      title: locale.strikethrough,
      key: macos ? '\u2318+Shift+X' : 'Ctrl+Shift+X',
      icon: '<span class="lake-icon lake-icon-strikethrough" />',
      getDisabled: () => {
        return !section.selection.area;
      },
      getActive: () => {
        return section.command.queryState('strikethrough');
      },
      onClick: () => {
        section.command.execute('strikethrough');
      },
    },
    {
      name: 'table:underline',
      title: locale.underline,
      key: macos ? '\u2318+U' : 'Ctrl+U',
      icon: '<span class="lake-icon lake-icon-underline" />',
      getDisabled: () => {
        return !section.selection.area;
      },
      getActive: () => {
        return section.command.queryState('underline');
      },
      onClick: () => {
        section.command.execute('underline');
      },
    },
    {
      type: 'separator',
    },
    {
      name: 'table:fontcolor',
      type: 'color',
      title: locale.fontcolor,
      moreTitle: locale.fontcolor,
      defaultColor: '#000000',
      currentColor: '#F5222D',
      getActive: () => {
        return section.command.queryState('fontcolor') || [];
      },
      onClick: (value) => {
        section.command.execute('fontcolor', value, '#000000');
      },
    },
    {
      name: 'table:highlight',
      type: 'color',
      title: locale.highlightColor,
      moreTitle: locale.highlightColor,
      defaultColor: '#FFFFFF',
      currentColor: '#FADB14',
      getActive: () => {
        return section.command.queryState('backcolor') || '';
      },
      onClick: (value) => {
        section.command.execute('backcolor', value, '#FFFFFF');
      },
    },
    {
      name: 'table:backcolor',
      type: 'color',
      title: locale.backcolor,
      moreTitle: locale.backcolor,
      defaultColor: '#FFFFFF',
      currentColor: '#f5f5f5',
      onClick: (value) => {
        command.background(value);
      },
    },
    {
      name: 'insertRowUp',
      title: locale.insertRowUp,
      icon: '<span class="lake-icon lake-icon-table-insert-row-up" />',
      getDisabled: () => {
        return !selection.area;
      },
      onClick: () => {
        section.removeEditor();
        command.insertRowUp();
      },
    },
    {
      name: 'insertRowDown',
      title: locale.insertRowDown,
      icon: '<span class="lake-icon lake-icon-table-insert-row-down" />',
      getDisabled: () => {
        return !selection.area;
      },
      onClick: () => {
        section.removeEditor();
        command.insertRowDown();
      },
    },
    {
      name: 'removeRow',
      title: locale.removeRow,
      icon: '<span class="lake-icon lake-icon-table-remove-row" />',
      getDisabled: () => {
        return !selection.area;
      },
      onClick: () => {
        section.removeEditor();
        command.removeRow();
      },
    },
    {
      type: 'separator',
    },
    {
      name: 'insertColLeft',
      title: locale.insertColLeft,
      icon: '<span class="lake-icon lake-icon-table-insert-col-left" />',
      getDisabled: () => {
        return !selection.area;
      },
      onClick: () => {
        section.removeEditor();
        command.insertColLeft();
      },
    },
    {
      name: 'insertColRight',
      title: locale.insertColRight,
      icon: '<span class="lake-icon lake-icon-table-insert-col-right" />',
      getDisabled: () => {
        return !selection.area;
      },
      onClick: () => {
        section.removeEditor();
        command.insertColRight();
      },
    },
    {
      name: 'removeCol',
      title: locale.removeCol,
      icon: '<span class="lake-icon lake-icon-table-remove-col" />',
      getDisabled: () => {
        return !selection.area;
      },
      onClick: () => {
        section.removeEditor();
        command.removeCol();
      },
    },
    {
      type: 'separator',
    },
    {
      name: 'mergecell',
      title: locale.mergeCell,
      icon: '<span class="lake-icon lake-icon-table-merge-cell" />',
      getDisabled: () => {
        return !selection.area || selection.isSingleArea();
      },
      onClick: () => {
        command.mergeCell();
      },
    },
    {
      name: 'splitCell',
      title: locale.splitCell,
      icon: '<span class="lake-icon lake-icon-table-split-cell" />',
      getDisabled: () => {
        return !selection.hasMergeCell();
      },
      onClick: () => {
        section.removeEditor();
        command.splitCell();
      },
    },
    {
      type: 'separator',
    },
    {
      name: 'table:alignment',
      type: 'dropdown',
      title: locale.align,
      icon: '<span class="lake-icon lake-icon-align-left" />',
      className: 'lake-button-icon-list',
      data: [
        {
          key: 'left',
          icon: '<span class="lake-icon lake-icon-align-left" />',
          title: locale.alignLeft,
          className: 'lake-button-set-list-item-icon',
        },
        {
          key: 'center',
          icon: '<span class="lake-icon lake-icon-align-center" />',
          title: locale.alignCenter,
          className: 'lake-button-set-list-item-icon',
        },
        {
          key: 'right',
          icon: '<span class="lake-icon lake-icon-align-right" />',
          title: locale.alignRight,
          className: 'lake-button-set-list-item-icon',
        },
        {
          key: 'justify',
          icon: '<span class="lake-icon lake-icon-align-justify" />',
          title: locale.alignJustify,
          className: 'lake-button-set-list-item-icon',
        },
      ],
      getActive: () => {
        return command.queryState('alignment');
      },
      onClick: (value) => {
        command.align(value);
      },
    },
    {
      name: 'table:verticalAlignment',
      type: 'dropdown',
      title: locale.verticalAlign,
      icon: '<span class="lake-icon lake-icon-align-top" />',
      className: 'lake-button-icon-list',
      data: [
        {
          key: 'top',
          icon: '<span class="lake-icon lake-icon-align-top" />',
          title: locale.alignTop,
          className: 'lake-button-set-list-item-icon',
        },
        {
          key: 'middle',
          icon: '<span class="lake-icon lake-icon-align-middle" />',
          title: locale.alignMiddle,
          className: 'lake-button-set-list-item-icon',
        },
        {
          key: 'bottom',
          icon: '<span class="lake-icon lake-icon-align-bottom" />',
          title: locale.alignBottom,
          className: 'lake-button-set-list-item-icon',
        },
      ],
      getActive: () => {
        return command.queryState('alignment');
      },
      onClick: (value) => {
        command.valign(value);
      },
    },
    {
      type: 'separator',
    },
    {
      name: 'table:unorderedlist',
      title: locale.unorderedList,
      hotkey: macos ? '\u2318+Shift+8' : 'Ctrl+Shift+8',
      icon: '<span class="lake-icon lake-icon-unordered-list" />',
      getDisabled: () => {
        return !section.subEngine;
      },
      getActive: () => {
        return (
          section.subEngine && section.subEngine.command.queryState('tasklist') === 'unorderedlist'
        );
      },
      onClick: () => {
        section.subEngine && section.subEngine.command.execute('tasklist', 'unorderedlist');
      },
    },
    {
      name: 'table:orderedlist',
      title: locale.orderedList,
      hotkey: macos ? '\u2318+Shift+7' : 'Ctrl+Shift+7',
      icon: '<span class="lake-icon lake-icon-ordered-list" />',
      getDisabled: () => {
        return !section.subEngine;
      },
      getActive: () => {
        return (
          section.subEngine && section.subEngine.command.queryState('tasklist') === 'orderedlist'
        );
      },
      onClick: () => {
        section.subEngine && section.subEngine.command.execute('tasklist', 'orderedlist');
      },
    },
    {
      name: 'table:tasklist',
      title: locale.taskList,
      icon: '<span class="lake-icon lake-icon-task-list" />',
      getDisabled: () => {
        return !section.subEngine;
      },
      getActive: () => {
        return section.subEngine && section.subEngine.command.queryState('tasklist') === 'tasklist';
      },
      onClick: () => {
        section.subEngine && section.subEngine.command.execute('tasklist', 'tasklist');
      },
    },
    {
      type: 'separator',
    },
    {
      name: 'table:link',
      title: locale.link,
      className: 'lake-button-link',
      hotkey: macos ? '\u2318+K' : 'Ctrl+K',
      icon: '<span class="lake-icon lake-icon-link" />',
      getDisabled: () => {
        return !section.subEngine;
      },
      onClick: () => {
        section.subEngine && section.subEngine.command.execute('link');
      },
    },
  ];
}
