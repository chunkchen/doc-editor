export default () => {
  return [
    {
      name: 'bold',
      keys: ['mod', '+', 'B'],
    }, {
      name: 'italic',
      keys: ['mod', '+', 'I'],
    }, {
      name: 'strikethrough',
      keys: ['mod', '+', 'shift', '+', 'X'],
    }, {
      name: 'underline',
      keys: ['mod', '+', 'U'],
    }, {
      group: 'moremark',
      name: 'sup',
      keys: ['mod', '+', '.'],
    }, {
      name: 'sub',
      group: 'moremark',
      keys: ['mod', '+', ','],
    }, {
      group: 'moremark',
      name: 'code',
      keys: ['mod', '+', ';'],
    }, {
      name: 'link',
      keys: ['mod', '+', 'K'],
    }, {
      name: 'mention',
      keys: ['@'],
    }, {
      name: 'print',
      keys: ['mod', '+', 'P'],
    }, {
      group: 'alignment',
      name: 'left',
      keys: ['mod', '+', 'shift', '+', 'L'],
    }, {
      group: 'alignment',
      name: 'center',
      keys: ['mod', '+', 'shift', '+', 'C'],
    }, {
      group: 'alignment',
      name: 'right',
      keys: ['mod', '+', 'shift', '+', 'R'],
    }, {
      group: 'alignment',
      name: 'justify',
      keys: ['mod', '+', 'shift', '+', 'J'],
    }, {
      group: 'verticalAlignment',
      name: 'top',
      keys: ['mod', '+', 'shift', '+', 't'],
    }, {
      group: 'verticalAlignment',
      name: 'middle',
      keys: ['mod', '+', 'shift', '+', 'm'],
    }, {
      group: 'verticalAlignment',
      name: 'bottom',
      keys: ['mod', '+', 'shift', '+', 'b'],
    }, {
      name: 'orderedlist',
      keys: ['mod', '+', 'shift', '+', '7'],
    }, {
      name: 'unorderedlist',
      keys: ['mod', '+', 'shift', '+', '8'],
    }, {
      name: 'tasklist',
      keys: ['mod', '+', 'shift', '+', '9'],
    }, {
      group: 'indent-list',
      name: 'indent',
      keys: ['mod', '+', ']'],
    }, {
      group: 'indent-list',
      name: 'outdent',
      keys: ['mod', '+', '['],
    }, {
      name: 'hr',
      keys: ['mod', '+', 'opt', '+', 'h'],
    }, {
      name: 'quote',
      keys: ['mod', '+', 'shift', '+', 'u'],
    }, {
      name: 'removeformat',
      keys: ['mod', '+', '\\'],
    }, {
      name: 'save',
      keys: ['mod', '+', 'S'],
    }, {
      name: 'undo',
      keys: ['mod', '+', 'Z'],
    }, {
      name: 'redo',
      keys: ['mod', '+', 'shift', '+', 'Z'],
    }, {
      name: 'paste',
      keys: ['mod', '+', 'V'],
    }, {
      name: 'pasteplaintext',
      keys: ['mod', '+', 'shift', '+', 'V'],
    }];
};
