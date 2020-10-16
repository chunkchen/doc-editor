import lang_en from '../lang/en';
import lang_zh_cn from '../lang/zh-cn';
import app_data from './app-data';

const language = {
  'en-us': lang_en,
  'zh-cn': lang_zh_cn,
};

export default (locale) => {
  locale = locale || language[app_data.locale];
  return [
    {
      group: 'heading',
      name: 'h1',
      text: locale.heading.heading_1,
      keys: ['mod', '+', 'opt', '+', '1'],
    },
    {
      group: 'heading',
      name: 'h2',
      text: locale.heading.heading_2,
      keys: ['mod', '+', 'opt', '+', '2'],
    },
    {
      group: 'heading',
      name: 'h3',
      text: locale.heading.heading_3,
      keys: ['mod', '+', 'opt', '+', '3'],
    },
    {
      group: 'heading',
      name: 'h4',
      text: locale.heading.heading_4,
      keys: ['mod', '+', 'opt', '+', '4'],
    },
    {
      group: 'heading',
      name: 'h5',
      text: locale.heading.heading_5,
      keys: ['mod', '+', 'opt', '+', '5'],
    },
    {
      group: 'heading',
      name: 'h6',
      text: locale.heading.heading_6,
      keys: ['mod', '+', 'opt', '+', '6'],
    },
    {
      name: 'codeblock',
      text: locale.section.codeblock,
      keys: ['mod', '+', 'opt', '+', 'c'],
    },
    {
      name: 'bold',
      text: locale.bold.text,
      keys: ['mod', '+', 'B'],
    }, {
      name: 'italic',
      text: locale.italic.text,
      keys: ['mod', '+', 'I'],
    }, {
      name: 'strikethrough',
      text: locale.strikethrough.text,
      keys: ['mod', '+', 'shift', '+', 'X'],
    }, {
      name: 'underline',
      text: locale.underline.text,
      keys: ['mod', '+', 'U'],
    }, {
      group: 'moremark',
      name: 'sup',
      text: locale.sup.text,
      keys: ['mod', '+', '.'],
    }, {
      name: 'sub',
      group: 'moremark',
      text: locale.sub.text,
      keys: ['mod', '+', ','],
    }, {
      group: 'moremark',
      name: 'code',
      text: locale.code.text,
      keys: ['mod', '+', ';'],
    }, {
      name: 'link',
      text: locale.link.buttonTitle,
      keys: ['mod', '+', 'K'],
    }, {
      name: 'mention',
      text: locale.mention.text,
      keys: ['@'],
    }, {
      name: 'section',
      text: locale.section.buttonTitle,
      keys: ['mod', '+', '/'],
    }, {
      name: 'print',
      text: locale.editor.print,
      keys: ['mod', '+', 'P'],
    }, {
      group: 'alignment',
      name: 'left',
      text: locale.alignment.alignLeft,
      keys: ['mod', '+', 'shift', '+', 'L'],
    }, {
      group: 'alignment',
      name: 'center',
      text: locale.alignment.alignCenter,
      keys: ['mod', '+', 'shift', '+', 'C'],
    }, {
      group: 'alignment',
      name: 'right',
      text: locale.alignment.alignRight,
      keys: ['mod', '+', 'shift', '+', 'R'],
    }, {
      group: 'alignment',
      name: 'justify',
      text: locale.alignment.alignJustify,
      keys: ['mod', '+', 'shift', '+', 'J'],
    }, {
      name: 'orderedlist',
      text: locale.list.orderedList,
      keys: ['mod', '+', 'shift', '+', '7'],
    }, {
      name: 'unorderedlist',
      text: locale.list.unorderedList,
      keys: ['mod', '+', 'shift', '+', '8'],
    }, {
      name: 'tasklist',
      text: locale.list.taskList,
      keys: ['mod', '+', 'shift', '+', '9'],
    }, {
      group: 'indent-list',
      name: 'indent',
      text: locale.indent.increase,
      keys: ['mod', '+', ']'],
    }, {
      group: 'indent-list',
      name: 'outdent',
      text: locale.indent.decrease,
      keys: ['mod', '+', '['],
    }, {
      name: 'hr',
      text: locale.hr.menuTitle,
      keys: ['mod', '+', 'opt', '+', 'h'],
    }, {
      name: 'quote',
      text: locale.hr.menuTitle,
      keys: ['mod', '+', 'shift', '+', 'u'],
    }, {
      name: 'removeformat',
      text: locale.hr.menuTitle,
      keys: ['mod', '+', '\\'],
    }, {
      name: 'save',
      text: locale.editor.save,
      keys: ['mod', '+', 'S'],
    }, {
      name: 'undo',
      text: locale.history.undo,
      keys: ['mod', '+', 'Z'],
    }, {
      name: 'redo',
      text: locale.history.redo,
      keys: ['mod', '+', 'shift', '+', 'Z'],
    }, {
      name: 'paste',
      text: locale.paste.paste,
      keys: ['mod', '+', 'V'],
    }, {
      name: 'pasteplaintext',
      text: locale.paste.pastePlainText,
      keys: ['mod', '+', 'shift', '+', 'V'],
    }, {
      name: 'findandreplace',
      text: locale.search.searchAndReplace,
      keys: ['mod', '+', 'shift', '+', 'G'],
    }, {
      name: 'inlinecode',
      text: locale.code.text,
      keys: ['mod', '+', 'E'],
    }];
};
