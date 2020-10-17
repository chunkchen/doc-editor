import { macos } from 'doc-engine/lib/utils/user-agent';

const CTRL = macos ? '\u2318' : 'Ctrl';
const backgroundOrColor = {
  fontColor: '字体颜色',
  bgColor: '背景颜色',
  moreColor: '更多颜色',
};
const layoutLocale = {
  layout: '布局方式',
  layoutBlock: '独占一行',
  layoutInline: '嵌入行内',
};
const alignmentLocale = {
  alignment: '对齐方式',
  alignLeft: '靠左对齐',
  alignCenter: '居中对齐',
  alignRight: '靠右对齐',
};

const uploadLocale = {
  uploadFailed: '文件上传失败，请重试',
  notSupportExt: '不支持该文件类型',
};

const dndLocale = {
  dndTips: '<span>拖动 调整位置<br />点击 打开更多菜单</span>',
  dndInsert: '插入空行',
  dndClone: '克隆',
  dndCopy: '拷贝锚点',
  dndCopySuccess: '已拷贝到粘贴板',
  dndEdit: '编辑锚点',
  dndDelete: '删除',
};
const linkLocale = {
  linkPlaceholder: '请输入链接地址或者锚点',
  linkSave: '保存',
  linkEdit: '编辑',
  linkDelete: '取消链接',
  linkOpen: '打开链接',
};
const editorModalLocale = {
  editorModalClose: '关闭',
  editorModalPopupTips: '确认要放弃刚才编辑的草稿吗？',
  editorModalPopupCancel: '返回编辑',
  editorModalPopupConfirm: '确认',
  editorModalSave: '保存并插入',
  editorModalConfirm: '要在退出前保存本次修改吗？',
  editorModalDissectionAndExit: '放弃编辑并退出',
  editorModalCancel: '取消',
  editorModalSaveAndExit: '保存并退出',
};

export default {
  pure: {
    support: '支持',
  },
  editor: {
    save: '保存草稿',
    print: '打印',
    file: '文档',
    edit: '编辑',
    view: '视图',
    insert: '插入',
    format: '格式',
    lab: '实验室',
    version: '历史',
    help: '帮助',
    publish: '发布更新',
  },
  alignment: {
    buttonTitle: '对齐方式',
    alignLeft: '左对齐',
    alignCenter: '居中对齐',
    alignRight: '右对齐',
    alignJustify: '两端对齐',
  },
  background: backgroundOrColor,
  blockquote: {
    buttonTitle: '插入引用',
    menuTitle: '引用',
  },
  bold: {
    macTitle: '粗体 ⌘+B',
    winTitle: '粗体 Ctrl+B',
    text: '粗体',
  },
  paintformat: {
    buttonTitle: '格式刷',
  },
  clearFormat: {
    buttonTitle: '清除格式',
  },
  code: {
    macTitle: '行内代码',
    winTitle: '行内代码',
    text: '行内代码',
  },
  codeBlock: {
    ...dndLocale,
    buttonTitle: '插入代码块',
    menuTitle: '代码块',
    preview: '预览',
    delete: '删除',
    copyCode: '复制代码',
    copySuccess: '复制成功！',
  },
  color: backgroundOrColor,
  emoji: {
    buttonTitle: 'Emoji 表情',
  },
  localdoc: {
    ...uploadLocale,
    formatError: '不支持该文件嵌入预览',
    allowDownload: '\u5728\u9605\u8bfb\u9875\u4e0b\u5141\u8bb8\u4e0b\u8f7d\u6587\u4ef6',
  },
  preview: {
    office: 'Office 预览，上传文件大小限制为 100 MB',
    macOffice: '本地文件预览，文件大小限制为 200 MB',
    pdf: 'PDF 预览，上传文件大小限制为 100 MB',
  },
  file: {
    ...uploadLocale,
    ...dndLocale,
    buttonTitle: '\u4e0a\u4f20\u9644\u4ef6',
    menuTitle: '\u9644\u4ef6',
    stillUploading: '\u6709\u6587\u4ef6\u8fd8\u5728\u4e0a\u4f20\u4e2d',
    stillTransfering: '\u6709\u6587\u4ef6\u8fd8\u5728\u8f6c\u5b58\u4e2d',
    formatError: '\u8be5\u7c7b\u578b\u6587\u4ef6\u8bf7\u538b\u7f29\u4e3a ZIP \u6587\u4ef6\u4e0a\u4f20',
    sizeError: '\u4e0a\u4f20\u5931\u8d25\uff0c\u9644\u4ef6\u5927\u5c0f\u9650\u5236\u4e3a 500M',
    placeholder: '\u4e0a\u4f20\u9644\u4ef6\uff0c\u9650\u5236 500M',
    preview: '\u9884\u89c8',
    replace: '\u66ff\u6362',
    download: '\u4e0b\u8f7d',
    delete: '\u5220\u9664',
    transfering: '\u8f6c\u5b58\u4e2d\u2026',
    invalid: '\u9644\u4ef6\u5df2\u5931\u6548',
    failReadFile: '\u6587\u4ef6\u8bfb\u53d6\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u4e0a\u4f20',
  },
  'table:file': {
    uploadFailed: '附件上传失败，请重试',
  },
  heading: {
    ...dndLocale,
    buttonTitle: '正文与标题',
    normal: '正文',
    heading_1: '标题 1',
    heading_2: '标题 2',
    heading_3: '标题 3',
    heading_4: '标题 4',
    heading_5: '标题 5',
    heading_6: '标题 6',
  },
  fontsize: {
    buttonTitle: '字号',
  },
  history: {
    undo: '撤销',
    redo: '重做',
  },
  hr: {
    ...dndLocale,
    buttonTitle: '插入分割线',
    menuTitle: '分割线',
  },
  image: {
    ...uploadLocale,
    ...layoutLocale,
    ...alignmentLocale,
    ...dndLocale,
    ...linkLocale,
    buttonTitle: '\u63d2\u5165\u56fe\u7247',
    menuTitle: '\u56fe\u7247',
    sizeError: '\u4e0a\u4f20\u56fe\u7247\u5931\u8d25\uff1a\u56fe\u7247\u5927\u5c0f\u8d85\u8fc7 10M',
    uploadFailed: '\u4e0a\u4f20\u56fe\u7247\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5',
    stillUploading: '\u6709\u56fe\u7247\u8fd8\u5728\u4e0a\u4f20\u4e2d',
    uploadTips: '\u5c06\u56fe\u7247\u62d6\u81f3\u6b64\u5904\u6216\u70b9\u51fb\u9009\u62e9\u4e00\u4e2a\u4e0a\u4f20\uff0c\u5927\u5c0f\u9650\u5236\u4e3a 10M',
    copyFailed: '\u590d\u5236\u56fe\u7247\u5931\u8d25',
    copyFailedTips: '\u56fe\u7247\u4e0d\u652f\u6301\u62f7\u8d1d\u590d\u5236\uff0c\u8bf7\u5355\u72ec\u590d\u5236\u4e0a\u4f20',
    loadFailed: '\u7f51\u7edc\u5f02\u5e38\uff0c\u56fe\u7247\u65e0\u6cd5\u5c55\u793a',
    placeholder: '\u4e0a\u4f20\u56fe\u7247\uff0c\u9650\u5236 10M',
    sizeTitle: '\u5927\u5c0f',
    formatError: '\u4e0d\u652f\u6301\u8be5\u6587\u4ef6\u7c7b\u578b',
    width: '\u5bbd\u5ea6',
    height: '\u9ad8\u5ea6',
    originSize: '\u539f\u59cb\u5927\u5c0f',
    linkTitle: '\u94fe\u63a5',
    linkPlaceholder: '\u76ee\u6807\u94fe\u63a5',
    linkTargetTips: '\u5728\u5f53\u524d\u9875\u9762\u6253\u5f00',
    preferences: '\u56fe\u7247\u8bbe\u7f6e',
    replace: '\u66ff\u6362',
    delete: '\u5220\u9664',
    inlineMode: '嵌入行内',
    blockMode: '独占一行',
  },
  'table:image': {
    uploadFailed: '上传图片失败，请重试',
  },
  indent: {
    buttonTitle: '缩进',
    decrease: '减少缩进',
    increase: '增加缩进',
  },
  italic: {
    macTitle: '斜体 ⌘+I',
    winTitle: '斜体 Ctrl+I',
    text: '斜体',
  },
  link: {
    ...linkLocale,
    buttonTitle: '插入链接',
    menuTitle: '链接',
  },
  list: {
    buttonTitle: '列表',
    orderedList: '有序列表',
    unorderedList: '无序列表',
    taskList: '任务列表',
  },
  mark: {
    macTitle: '高亮文字',
    winTitle: '高亮文字',
    text: '高亮文字',
  },
  math: {
    ...layoutLocale,
    ...alignmentLocale,
    ...dndLocale,
    ...linkLocale,
    buttonTitle: '\u516c\u5f0f',
    menuTitle: '\u516c\u5f0f',
    success: '\u64cd\u4f5c\u6210\u529f',
    placeholder: '\u6dfb\u52a0 Tex \u516c\u5f0f',
    edit: '\u7f16\u8f91',
    copy: '\u62f7\u8d1d\u6e90\u7801',
    delete: '\u5220\u9664',
    cancel: '\u53d6\u6d88',
    save: '\u786e\u5b9a',
    sourceCodeRequired: '\u8bf7\u8f93\u5165\u6e90\u7801',
    syntaxInvalid: '\u8f93\u5165\u516c\u5f0f\u4e0d\u5408\u6cd5',
    help: '\u4e86\u89e3 LaTeX \u8bed\u6cd5',
    enterTooltips: ''.concat(CTRL, ' + Enter'),
  },
  mindmap: {
    ...alignmentLocale,
    ...dndLocale,
    ...editorModalLocale,
    menuTitle: '\u601d\u7ef4\u5bfc\u56fe',
    buttonTitle: '\u601d\u7ef4\u5bfc\u56fe',
    editorTitle: '\u601d\u7ef4\u5bfc\u56fe',
    edit: '\u7f16\u8f91',
    delete: '\u5220\u9664',
    saveDraft: '\u4fdd\u5b58',
    help: '\u5e2e\u52a9',
    undo: '\u64a4\u9500',
    redo: '\u91cd\u505a',
    insertSibling: '\u63d2\u5165\u540c\u7ea7',
    insertChild: '\u63d2\u5165\u5b50\u7ea7',
    collapse: '\u6298\u53e0',
    expand: '\u5c55\u5f00',
    autoAdjust: '\u9002\u5e94\u753b\u5e03',
  },
  moremark: {
    buttonTitle: '更多文本样式',
  },
  paste: {
    copy: '复制',
    cut: '剪切',
    paste: '粘贴',
    pastePlainText: '粘贴纯文本',
    pasteMarkdown: '粘贴 Markdown',
    selectAll: '全选',
  },
  textDiagram: {
    ...alignmentLocale,
    ...dndLocale,
    ...editorModalLocale,
    edit: '\u7f16\u8f91',
    save: '\u4fdd\u5b58',
    preview: '\u9884\u89c8',
    template: '\u6a21\u677f',
    help: '\u5e2e\u52a9',
    genImageError: '\u751f\u6210\u9884\u89c8\u5931\u8d25\uff0c\u8bf7\u4fee\u6539\u5185\u5bb9',
    winPreviewTooltip: 'Ctrl+Shift+P',
    macPreviewTooltip: '\u2318+Shift+P',
  },
  riddle: {
    ...dndLocale,
    buttonTitle: 'Riddle',
    menuTitle: 'Riddle',
    active: 'Click to active',
    replace: '替换',
    delete: '删除',
    addressInvalid: '请输入正确的链接地址',
    placeholder: '输入 Riddle 地址，按 Enter 生成',
  },
  strikethrough: {
    macTitle: '删除线 ⌘+Shift+X',
    winTitle: '删除线 Ctrl+Shift+X',
    text: '删除线',
  },
  sub: {
    macTitle: '下标',
    winTitle: '下标',
    text: '下标',
  },
  sup: {
    macTitle: '上标',
    winTitle: '上标',
    text: '上标',
  },
  table: {
    buttonTitle: '插入表格',
    menuTitle: '表格',
    copy: '复制',
    cut: '剪切',
    merge: '合并单元格',
    unmerge: '拆分单元格',
    clear: '清空选中区域',
    deleteColumn: '删除选中列',
    deleteRow: '删除选中行',
    deleteTable: '删除表格',
  },
  underline: {
    macTitle: '下划线 ⌘+U',
    winTitle: '下划线 Ctrl+U',
    text: '下划线',
  },
  video: {
    ...dndLocale,
    buttonTitle: '插入视频',
    menuTitle: '视频',
    play: '播放',
    replace: '替换',
    download: '下载',
    delete: '删除',
    sizeError: '上传失败，视频大小限制为 2G',
  },
  toc: {
    title: '大纲',
    open: '打开大纲',
    close: '关闭大纲',
  },
  section: {
    mindmapFile: '\u8111\u56fe',
    designingFile: '\u8bbe\u8ba1\u6587\u4ef6',
    officeFile: '\u529e\u516c\u6587\u4ef6',
    localdocSubTitle: '\u652f\u6301Office\u3001XMind\u3001Sketch \u7b49',
    label: '\u72b6\u6001',
    labelDescription: '\u7b80\u6613\u6587\u672c\u72b6\u6001',
    localdoc: '\u672c\u5730\u6587\u4ef6',
    localdocDescription: '\u652f\u6301 Word, Excel, PPT, PDF',
    iframeOverLimit: '\u6587\u6863\u6700\u591a\u652f\u6301 ${limit} \u5f20\u5d4c\u5165Section',
    placeholder: 'Section\u540d',
    embed: '\u5d4c\u5165',
    onlinedoc: '在线文档',
    onlinedocDescription: '\u652f\u6301\u5d4c\u5165\u8bed\u96c0\u6587\u6863\u3001\u8868\u683c\u3001\u8111\u56fe',
    website: '嵌入网址',
    websiteDescription: '嵌入一个网址',
    buttonTitle: '\u63d2\u5165\u56fe\u7247\u3001\u8868\u683c\u3001<br />\u9644\u4ef6\u3001\u4ee3\u7801\u5757\u7b49Section',
    normal: ' ',
    media: '\u5a92\u4f53',
    engineering: '\u5de5\u7a0b',
    description: '\u8f93\u5165  <code>'.concat(CTRL, '</code> + <code>/</code>  快速插入区块'),
    table: '\u8868\u683c',
    tableDescription: '\u63d2\u5165\u5728\u7ebf\u8868\u683c',
    image: '\u56fe\u7247',
    imageDescription: '\u4e0a\u4f20\u4e00\u5f20\u6216\u591a\u5f20\u56fe\u7247',
    video: '\u672c\u5730\u89c6\u9891',
    videoDescription: '\u4e0a\u4f20\u4e00\u4e2a\u672c\u5730\u89c6\u9891',
    youku: '\u5728\u7ebf\u89c6\u9891',
    youkuName: '\u4f18\u9177',
    youkuDescription: '\u63d2\u5165\u4f18\u9177\u89c6\u9891',
    youkuSubTitle: '\u652f\u6301\u4f18\u9177\u3001\u54d4\u54e9\u54d4\u54e9',
    bilibili: 'bilibili',
    bilibiliName: '\u54d4\u54e9\u54d4\u54e9',
    bilibiliDescription: '\u63d2\u5165\u54d4\u54e9\u54d4\u54e9\u89c6\u9891',
    codeblock: '\u4ee3\u7801\u5757',
    codeblockDescription: '\u8f93\u5165\u4ee3\u7801\u7247\u6bb5',
    file: '\u9644\u4ef6',
    fileDescription: '\u4e0a\u4f20\u5355\u4e2a\u6216\u591a\u4e2a\u9644\u4ef6',
    math: '\u516c\u5f0f',
    mathDescription: '\u8f93\u5165 Latex \u516c\u5f0f',
    riddle: '\u4ee3\u7801\u6f14\u793a\uff08Riddle\uff09',
    riddleDescription: '\u63d2\u5165 Riddle \u4ee3\u7801\u7247\u6bb5',
    mindmap: '\u8111\u56fe',
    mindmapDescription: '\u7ed8\u5236\u7b80\u6613\u8111\u56fe',
    puml: 'PlantUML',
    pumlDescription: '\u7ed8\u5236 PlantUML \u56fe',
    flowchart: 'Flowchart',
    flowchartDescription: '\u7ed8\u5236 Flowchart \u56fe',
    mermaid: 'Mermaid',
    mermaidDescription: '\u7ed8\u5236 Mermaid \u56fe',
    diagram: '\u6587\u672c\u7ed8\u56fe',
    diagramDescription: '\u901a\u8fc7\u4ee3\u7801\u7ed8\u56fe',
    diagramSubTitle: '\u652f\u6301PlantUML\u3001Mermaid \u7b49',
    graphviz: 'Graphviz',
    graphvizDescription: '\u7ed8\u5236 Graphviz \u56fe',
    lockedtextTitle: '\u52a0\u5bc6\u6587\u672c',
    lockedtextDescription: '\u9700\u8981\u5bc6\u7801\u624d\u53ef\u67e5\u770b',
  },
  mention: {
    text: '提及',
  },
  markdown: {
    pasteTitle: '是否需要做样式转换？',
    pasteContent: '检测到粘贴内容符合 Markdown 语法，是否需要做样式转换？',
    pasteButton: '立即转换',
  },
  search: {
    searchAndReplace: '\u67e5\u627e\u5e76\u66ff\u6362',
    search: '\u67e5\u627e',
    replace: '\u66ff\u6362',
    replaceAll: '\u66ff\u6362\u5168\u90e8',
    replaceTo: '\u66ff\u6362\u4e3a',
    pleaseEnter: '\u8bf7\u8f93\u5165',
    next: '\u4e0b\u4e00\u4e2a',
    previous: '\u4e0a\u4e00\u4e2a',
  },
  translate: {
    title: '翻译',
    subTitle: '源 & 目标',
    automaticDetection: '自动检测',
    zh: '中文',
    en: '英文',
    translation: '译文',
    insertDoc: '插入文档',
    placeholder: '请在文档中选择需要翻译的内容',
  },
};
