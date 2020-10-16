export default [{
  table: {
    class: 'itellyou-table',
    style: {
      width: '@length',
    },
  },
}, 'colgroup', {
  col: {
    width: '@number',
    span: '@number',
  },
}, 'thead', 'tbody', {
  tr: {
    style: {
      height: '@length',
    },
  },
}, {
  td: {
    colspan: '@number',
    rowspan: '@number',
    style: {
      'text-align': ['left', 'center', 'right', 'justify'],
      'vertical-align': ['top', 'middle', 'bottom'],
      'background-color': '@color',
      background: '@color',
      color: '@color',
    },
  },
}, {
  th: {
    colspan: '@number',
    rowspan: '@number',
    style: {
      'text-align': ['left', 'center', 'right', 'justify'],
      'vertical-align': ['top', 'middle', 'bottom'],
      'background-color': '@color',
      background: '@color',
      color: '@color',
    },
  },
}];
