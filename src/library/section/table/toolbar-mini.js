import Engine from '@hicooper/doc-engine';

const { userAgent: { macos } } = Engine;
export default function (section) {
  const { command, locale } = section;
  return [
    {
      name: 'table:bold',
      title: locale.bold,
      hotkey: macos ? '\u2318+B' : 'Ctrl+B',
      icon: '<span class="lake-icon lake-icon-bold" />',
      getDisabled: () => {
        return !section.selection.area;
      },
      getActive: () => {
        return command.queryState('bold');
      },
      onClick: () => {
        command.execute('bold');
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
        return command.queryState('italic');
      },
      onClick: () => {
        command.execute('italic');
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
        return command.queryState('strikethrough');
      },
      onClick: () => {
        command.execute('strikethrough');
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
        return command.queryState('underline');
      },
      onClick: () => {
        command.execute('underline');
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
      data: [{
        key: 'left',
        icon: '<span class="lake-icon lake-icon-align-left" />',
        title: locale.alignLeft,
        className: 'lake-button-set-list-item-icon',
      }, {
        key: 'center',
        icon: '<span class="lake-icon lake-icon-align-center" />',
        title: locale.alignCenter,
        className: 'lake-button-set-list-item-icon',
      }, {
        key: 'right',
        icon: '<span class="lake-icon lake-icon-align-right" />',
        title: locale.alignRight,
        className: 'lake-button-set-list-item-icon',
      }, {
        key: 'justify',
        icon: '<span class="lake-icon lake-icon-align-justify" />',
        title: locale.alignJustify,
        className: 'lake-button-set-list-item-icon',
      }],
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
      data: [{
        key: 'top',
        icon: '<span class="lake-icon lake-icon-align-top" />',
        title: locale.alignTop,
        className: 'lake-button-set-list-item-icon',
      }, {
        key: 'middle',
        icon: '<span class="lake-icon lake-icon-align-middle" />',
        title: locale.alignMiddle,
        className: 'lake-button-set-list-item-icon',
      }, {
        key: 'bottom',
        icon: '<span class="lake-icon lake-icon-align-bottom" />',
        title: locale.alignBottom,
        className: 'lake-button-set-list-item-icon',
      }],
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
        return section.subEngine && section.subEngine.command.queryState('tasklist') === 'unorderedlist';
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
        return section.subEngine && section.subEngine.command.queryState('tasklist') === 'orderedlist';
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
      name: 'table:fontcolor',
      type: 'color',
      title: locale.fontcolor,
      moreTitle: locale.fontcolor,
      defaultColor: '#000000',
      currentColor: '#F5222D',
      getActive: () => {
        return command.queryState('fontcolor') || [];
      },
      onClick: (value) => {
        command.execute('fontcolor', value, '#000000');
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
      type: 'separator',
    },
    {
      name: 'table:image',
      type: 'upload',
      title: locale.image,
      icon: '<span class="lake-icon lake-icon-image" />',
      getDisabled: () => {
        return !section.subEngine;
      },
    },
    {
      name: 'table:file',
      type: 'upload',
      title: locale.file,
      icon: '<span class="lake-icon lake-icon-attachment" />',
      getDisabled: () => {
        return !section.subEngine;
      },
    },
    {
      name: 'table:label',
      icon: '<span class="lake-icon lake-icon-label" />',
      title: locale.label,
      getDisabled: () => {
        return !section.subEngine;
      },
      onClick: () => {
        section.subEngine.command.execute('label');
      },
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
