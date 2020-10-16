export default [
  'cursor', 'anchor', 'focus',
  {
    section: {
      type: /^[\w\-]+$/,
      name: /^[\w\-]+$/,
      value: '*',
      focus: ['true', 'false'],
    },
  },
  {
    span: {
      class: /^itellyou-fontsize-\d+$|itellyou\-section\-[\w\-]{1,100}/,
      style: {
        color: '@color',
        'background-color': '@color',
      },
    },
  },
  'strong', 'em', 'del', 'u',
  {
    h1: {
      id: /^[\w\.\-]+$/,
    },
  },
  {
    h2: {
      id: /^[\w\.\-]+$/,
    },
  },
  {
    h3: {
      id: /^[\w\.\-]+$/,
    },
  },
  {
    h4: {
      id: /^[\w\.\-]+$/,
    },
  },
  {
    h5: {
      id: /^[\w\.\-]+$/,
    },
  },
  {
    h6: {
      id: /^[\w\.\-]+$/,
    },
  },
  'p', 'hr', 'code', 'mark',
  {
    pre: {
      'data-lang': /^[\w\.\-]+$/,
    },
  },
  {
    blockquote: {
      class: [
        'itellyou-alert',
        'itellyou-alert-info',
        'itellyou-alert-warning',
        'itellyou-alert-danger',
        'itellyou-alert-success',
        'itellyou-alert-tips',
      ],
    },
  },
  'sub', 'sup', 'br',
  {
    img: {
      src: '@url',
      width: '@number',
      height: '@number',
      style: {
        'max-width': '@length',
        'max-height': '@length',
        width: '@length',
        height: '@length',
      },
      alt: '*',
      title: '*',
      'data-size': '@number',
      'data-width': '@number',
      'data-height': '@number',
    },
  },
  {
    image: {
      src: '@url',
      width: '@number',
      height: '@number',
      style: {
        'max-width': '@length',
        width: '@length',
        height: '@length',
      },
      alt: '*',
      title: '*',
      'data-size': '@number',
      'data-width': '@number',
      'data-height': '@number',
    },
  },
  {
    a: {
      name: '*',
      href: '@url',
      target: ['_blank', '_parent', '_top'],
      ref: '*',
      class: ['itellyou-video-link'],
    },
  },
  {
    ul: {
      class: ['itellyou-list'],
      'data-itellyou-indent': '@number',
    },
  },
  {
    ol: {
      start: '@number',
      'data-itellyou-indent': '@number',
    },
  },
  {
    li: {
      class: ['itellyou-list-node', 'itellyou-list-task'],
    },
  },
  {
    table: {
      class: 'itellyou-table',
      style: {
        width: '@length',
        height: '@length',
      },
    },
  },
  'colgroup',
  {
    col: {
      width: '@length',
    },
  },
  'tbody', 'th', 'tr',
  {
    td: {
      rowspan: '@number',
      colspan: '@number',
    },
  },
  {
    block: {
      style: {
        'text-align': ['left', 'center', 'right', 'justify'],
        'text-indent': '@length',
        'padding-left': '@length',
        'background-color': '@color',
      },
    },
  },
  {
    input: {
      type: ['checkbox'],
      checked: 'checked',
      $allow: {
        type: ['checkbox'],
      },
    },
  },
  {
    video: {
      src: '@url',
      'data-size': '@number',
      'data-type': /^\w{1,100}\/\w{1,100}$/,
      'data-name': '*',
      controls: true,
    },
  },
  {
    iframe: {
      src: /^https?:\/\/(?:riddle\.alibaba\-inc\.com|\w{0,100}\.youku\.com|\w{0,100}\.bilibili\.com)\//,
      height: '@number',
      frameborder: ['yes', 'no'],
      allowtransparency: ['true', 'false'],
      allowfullscreen: ['true', 'false'],
    },
  },
];
