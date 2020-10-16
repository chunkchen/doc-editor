export default {
  // 当前支持的文本图类别
  TEXT_DIAGRAM_TYPES: {
    PUML: 'puml',
    MERMAID: 'mermaid',
    GRAPHVIZ: 'graphviz',
    FLOWCHART: 'flowchart',
  },
  TEXT_DIAGRAMS: [{
    type: 'puml',
    name: 'PlantUML',
  }, {
    type: 'mermaid',
    name: 'Mermaid',
  }, {
    type: 'flowchart',
    name: 'Flowchart',
  }, {
    type: 'graphviz',
    name: 'Graphviz',
  }],
  // 文本类图的帮助手册
  TEXT_DIAGRAM_GUIDES: {
    puml: '',
    flowchart: '',
    graphviz: '',
    mermaid: '',
  },
  // 语法格式，用于代码高亮，目前只支持 puml,
  TEXT_DIAGRAM_SYNTAX: {
    puml: 'plantuml',
  },
  // 编辑模式
  EDITOR_MODE: {
    CODE: 'code',
    PREVIEW: 'preview',
  },
  // 布局模式
  EDITOR_LAYOUT: {
    // 默认，单栏
    DEFAULT: 'default',
    // 双栏模式
    TWO_COLUMN: 'two-column',
  },
};
