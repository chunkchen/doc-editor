import { addIframeSection } from '../utils/command'

export default (engine) => {
  const locale = engine.locale
  return [
    {
      name: 'image',
      type: 'upload',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-image" />',
      title: locale.section.image,
      pinyin: 'tupian,image',
      description: locale.section.imageDescription,
    },
    {
      name: 'table',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-table" />',
      title: locale.section.table,
      pinyin: 'biaoge,table',
      description: locale.section.tableDescription,
      onClick() {
        const opts = arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : {
            rows: 3,
            cols: 3,
          }
        engine.command.execute('table', opts)
      },
    },
    {
      name: 'video',
      type: 'video',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-video" />',
      title: locale.section.video,
      pinyin: 'bendishipin,video',
      description: locale.section.videoDescription,
    },
    {
      name: 'youku',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-youku" />',
      title: locale.section.youku,
      subTitle: locale.section.youkuSubTitle,
      pinyin: 'zaixianshipin,youku,bilibili',
      description: locale.section.youkuDescription,
      tooltip: [
        {
          children: [
            {
              name: locale.section.youkuName,
              icon: 'youku',
            },
            {
              name: locale.section.bilibiliName,
              icon: 'bilibili',
            },
          ],
        },
      ],
      onClick: () => {
        addIframeSection(engine, 'youku')
      },
    },
    {
      name: 'codeblock',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-codeblock" />',
      title: locale.section.codeblock,
      pinyin: 'daimakuai,code',
      description: locale.section.codeblockDescription,
      onClick: () => {
        engine.command.execute('codeblock', '')
      },
    },
    {
      name: 'file',
      type: 'upload',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-file" />',
      title: locale.section.file,
      pinyin: 'fujian,file,attachment',
      description: locale.section.fileDescription,
    },
    {
      name: 'math',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-math" />',
      title: locale.section.math,
      pinyin: 'gongshi,formula,math,latex',
      description: locale.section.mathDescription,
      onClick: () => {
        engine.command.execute('math')
      },
    },
    {
      name: 'mindmap',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-mindmap" />',
      title: locale.section.mindmap,
      pinyin: 'siweinaotu,mindmap',
      description: locale.section.mindmapDescription,
      onClick: () => {
        engine.command.execute('mindmap')
      },
    },
    {
      name: 'diagram',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-puml" />',
      title: locale.section.diagram,
      subTitle: locale.section.diagramSubTitle,
      pinyin: 'huitu,wenbenhuitu,puml,graphviz,mermaid,flowchart',
      description: locale.section.diagramDescription,
      tooltip: [
        {
          children: [
            {
              name: 'PlantUML',
              icon: 'puml',
            },
            {
              name: 'Graphviz',
              icon: 'graphviz',
            },
            {
              name: 'Mermaid',
              icon: 'mermaid',
            },
            {
              name: 'Flowchart',
              icon: 'flowchart',
            },
          ],
        },
      ],
      onClick: () => {
        engine.command.execute('diagram')
      },
    },
    {
      name: 'lockedtext',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-lockedtext" />',
      title: locale.section.lockedtextTitle,
      pinyin: 'jiamiwenben,lockedtext',
      description: locale.section.lockedtextDescription,
      onClick: () => {
        engine.command.execute('lockedtext')
      },
    },
    {
      name: 'onlinedoc',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-onlinedoc" />',
      title: locale.section.onlinedoc,
      pinyin: 'onlinewendang,onlinedoc',
      description: locale.section.onlineDescription,
      onReadLocal: (value) => {
        addIframeSection(engine, 'localdoc', value)
      },
    },
    {
      name: 'website',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-website" />',
      title: locale.section.website,
      pinyin: 'qianruwangzhi,website',
      description: locale.section.websiteDescription,
      onClick: (url) => {
        addIframeSection(engine, 'onlinedoc', url)
      },
    },
    {
      name: 'localdoc',
      type: 'upload',
      icon: '<span class="lake-svg-icon lake-svg-icon-insert-localdoc" />',
      tooltip: [
        /** {
                name: locale.section.mindmapFile,
                subName: "(MindManager, XMind, MindNode)",
                children: [{
                    icon: "mmad"
                }, {
                    icon: "xmind"
                }, {
                    icon: "mindnode"
                }]
            }, {
                name: locale.section.designingFile,
                subName: "(Axure, Photoshop, Sketch)",
                children: [{
                    icon: "rp"
                }, {
                    icon: "psd"
                }, {
                    icon: "sketch"
                }]
            },* */ {
          name: locale.section.officeFile,
          subName: '(Word, Excel, PPT, PDF)', // Keynote, Pages, Numbers
          children: [
            {
              icon: 'doc',
            },
            {
              icon: 'xls',
            },
            {
              icon: 'ppt',
            },
            {
              icon: 'pdf',
            }, /** {                    icon: "keynote"
                }, {
                    icon: "pages"
                }, {
                    icon: "numbers"
                }* */
          ],
        },
      ],
      title: locale.section.localdoc,
      // subTitle: locale.section.localdocSubTitle,
      pinyin: 'bendiwendang,localdocument,pdf,word,excel,ppt,powerpoint',
      description: locale.section.localdocDescription,
      onClick: (value) => {
        addIframeSection(engine, 'localdoc', value)
      },
    },
    {
      name: 'label',
      icon: '<span class="lake-svg-icon lake-svg-icon-label" />',
      title: locale.section.label,
      pinyin: 'zhuangtai,status',
      description: locale.section.labelDescription,
      onClick: () => {
        engine.command.execute('label')
      },
    },
    {
      name: 'mxgraph',
      icon: '<span class="lake-icon lake-icon-liuchengtu" />',
      title: '流程图绘制',
      pinyin: 'mxgraph',
      description: 'mxgraph',
      onClick: () => {
        engine.command.execute('mxgraph')
      },
    },
  ]
}
