import {macos} from '@hicooper/doc-engine/lib/utils/user-agent';

const CTRL = macos ? '\u2318' : 'Ctrl';
const backgroundOrColor = {
  fontColor: 'Text color',
  bgColor: 'Highlight color',
  moreColor: 'More',
};
const layoutLocale = {
  layout: 'Layout',
  layoutBlock: 'Break text',
  layoutInline: 'In line',
};
const alignmentLocale = {
  alignment: 'Align',
  alignLeft: 'Left align',
  alignCenter: 'Centre align',
  alignRight: 'Right align',
};

const uploadLocale = {
  uploadFailed: 'Failed to upload the file, please retry',
  notSupportExt: 'This file type is not supported',
};

const dndLocale = {
  dndTips: '<span>Drag to reposition<br />Click for more options </span>',
  dndInsert: 'Insert newline',
  dndClone: 'Clone',
  dndCopy: 'Copy anchor',
  dndCopySuccess: 'Copied successfully',
  dndEdit: 'Edit anchor',
  dndDelete: 'Delete',
};
const linkLocale = {
  linkPlaceholder: 'Please input a link or an anchor',
  linkSave: 'Apply',
  linkEdit: 'Change',
  linkDelete: 'Remove',
  linkOpen: 'Open',
};
const editorModalLocale = {
  editorModalClose: 'Dissection',
  editorModalPopupTips: 'Are you sure?',
  editorModalPopupCancel: 'Cancel',
  editorModalPopupConfirm: 'Dissection',
  editorModalSave: 'Apply',
  editorModalConfirm: 'Do you want to dissection changes?',
  editorModalDissectionAndExit: 'Dissection and exit',
  editorModalCancel: 'Cancel',
  editorModalSaveAndExit: 'Save and exit',
};
export default {
  pure: {
    support: 'support',
  },
  editor: {
    save: 'Save draft',
    print: 'Print',
    file: 'File',
    edit: 'Edit',
    view: 'View',
    insert: 'Insert',
    format: 'Format',
    lab: 'Lab',
    version: 'Version',
    help: 'Help',
  },
  alignment: {
    buttonTitle: 'Align',
    alignLeft: 'Left align',
    alignCenter: 'Centre align',
    alignRight: 'Right align',
    alignJustify: 'Justify',
  },
  background: backgroundOrColor,
  blockquote: {
    buttonTitle: 'Quotation',
    menuTitle: 'Quotation',
  },
  bold: {
    macTitle: 'Bold ⌘+B',
    winTitle: 'Bold Ctrl+B',
    text: 'Bold',
  },
  paintformat: {
    buttonTitle: 'Paint format',
  },
  clearFormat: {
    buttonTitle: 'Clear formatting',
  },
  code: {
    macTitle: 'Inline code',
    winTitle: 'Inline code',
    text: 'Inline code',
  },
  codeBlock: {
    ...dndLocale,
    buttonTitle: 'Code block',
    menuTitle: 'Code block',
    preview: 'Preview',
    delete: 'Delete',
    copyCode: 'Copy Code',
    copySuccess: 'Successful copy!',
  },
  color: backgroundOrColor,
  localdoc: {
    ...uploadLocale,
    formatError: 'The file embed preview is not supported',
    allowDownload: 'Allow downloading of files under the reading page',
  },
  preview: {
    office: 'Office preview, upload file size is limited to 100 MB',
    macOffice: 'The local file preview, file size is limited to 200 MB',
    pdf: 'PDF preview, upload file size is limited to 100 MB',
  },
  file: {
    ...uploadLocale,
    ...dndLocale,
    buttonTitle: 'Attachment',
    menuTitle: 'Attachment',
    stillUploading: 'Some files are still in the process of uploading',
    stillTransfering: 'Some files are still transfering',
    formatError: 'Unsupported file format, please compress it to ZIP before uploading',
    sizeError: 'Failed to upload for the file size is larger than 500M',
    placeholder: 'Upload an attachment(maximum file size: 500M)',
    preview: 'Preview',
    replace: 'Replace',
    download: 'Download',
    delete: 'Delete',
    transfering: 'Transferring...',
    invalid: 'Attachment invalid',
    failReadFile: 'File read failed, please re-upload',
  },
  'table:file': {
    uploadFailed: 'Failed to upload the attachment, please retry',
  },
  heading: {
    ...dndLocale,
    buttonTitle: 'Heading and text',
    normal: 'Normal',
    heading_1: 'Heading 1',
    heading_2: 'Heading 2',
    heading_3: 'Heading 3',
    heading_4: 'Heading 4',
    heading_5: 'Heading 5',
    heading_6: 'Heading 6',
  },
  fontsize: {
    buttonTitle: 'Font size',
  },
  history: {
    undo: 'Undo',
    redo: 'Redo',
  },
  hr: {
    ...dndLocale,
    buttonTitle: 'Horizontal line',
    menuTitle: 'Horizontal line',
  },
  image: {
    ...uploadLocale,
    ...layoutLocale,
    ...alignmentLocale,
    ...dndLocale,
    ...linkLocale,
    buttonTitle: 'Image',
    menuTitle: 'Image',
    sizeError: 'Failed to upload the image (maximum image size: 10M)',
    uploadFailed: 'Failed to upload the image, please retry',
    stillUploading: 'Some images are still in the process of uploading',
    uploadTips: 'Drag an image here or click to choose one to upload (maximum image size: 10M)',
    copyFailed: 'Failed to copy the image',
    copyFailedTips: 'Image does not support copy, please copy and upload separately',
    loadFailed: "Network error, can't display image",
    placeholder: 'Upload an image (maximum image size: 10M)',
    sizeTitle: 'Size',
    width: 'Width',
    formatError: 'This file type is not supported',
    height: 'Height',
    originSize: 'Original size',
    linkTitle: 'Link',
    linkPlaceholder: 'Link address',
    linkTargetTips: 'Open on current page',
    preferences: 'Preferences',
    replace: 'Replace',
    delete: 'Delete',
    inlineMode: 'Embedded inline',
    blockMode: 'An exclusive line',
  },
  'table:image': {
    uploadFailed: 'Failed to upload the image, please retry',
  },
  indent: {
    buttonTitle: 'Indent',
    decrease: 'Decrease indent',
    increase: 'Increase indent',
  },
  italic: {
    macTitle: 'Italic ⌘+I',
    winTitle: 'Italic Ctrl+I',
    text: 'Italic',
  },
  link: {
    ...linkLocale,
    buttonTitle: 'Link',
    menuTitle: 'Link',
  },
  list: {
    buttonTitle: 'List',
    orderedList: 'Numbered list',
    unorderedList: 'Bulleted list',
    taskList: 'To-Do list',
  },
  mark: {
    macTitle: 'Highlight text',
    winTitle: 'Highlight text',
    text: 'Highlight text',
  },
  math: {
    ...layoutLocale,
    ...alignmentLocale,
    ...dndLocale,
    ...linkLocale,
    buttonTitle: 'Equation',
    menuTitle: 'Equation',
    success: 'Copied successfully',
    placeholder: 'New equation',
    edit: 'Change',
    copy: 'Copy source code',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Apply',
    sourceCodeRequired: 'Please input source code',
    syntaxInvalid: 'Syntax error',
    help: 'Help',
    enterTooltips: ''.concat(CTRL, ' + Enter'),
  },
  mindmap: {
    ...alignmentLocale,
    ...dndLocale,
    ...editorModalLocale,
    menuTitle: 'Mind Map',
    buttonTitle: 'Mind Map',
    editorTitle: 'Mind Map',
    edit: 'Change',
    delete: 'Delete',
    saveDraft: 'Save',
    help: 'Help',
    undo: 'Undo',
    redo: 'Redo',
    insertSibling: 'Topic',
    insertChild: 'Subtopic',
    collapse: 'Fold subtopics',
    expand: 'Unfold subtopics',
    autoAdjust: 'Auto',
  },
  moremark: {
    buttonTitle: 'More text styles',
  },
  paste: {
    copy: 'Copy',
    cut: 'Cut',
    paste: 'Paste',
    pastePlainText: 'Paste plain text',
    pasteMarkdown: 'Paste Markdown',
    selectAll: 'Select all',
  },
  textDiagram: {
    ...alignmentLocale,
    ...dndLocale,
    ...editorModalLocale,
    edit: 'Edit',
    save: 'Save',
    preview: 'Preview',
    template: 'Template',
    help: 'Help',
    winPreviewTooltip: 'Ctrl+Shift+P',
    macPreviewTooltip: '\u2318+Shift+P',
  },
  riddle: {
    ...dndLocale,
    buttonTitle: 'Riddle',
    menuTitle: 'Riddle',
    active: 'Click to active',
    replace: 'Replace',
    delete: 'Delete',
    addressInvalid: 'Invalid hyperlink',
    placeholder: 'Please input link to your riddle and then enter to insert it',
  },
  strikethrough: {
    macTitle: 'Strike-through ⌘+Shift+X',
    winTitle: 'Strike-through Ctrl+Shift+X',
    text: 'Strike-through',
  },
  sub: {
    macTitle: 'Subscript',
    winTitle: 'Subscript',
    text: 'Subscript',
  },
  sup: {
    macTitle: 'Superscript',
    winTitle: 'Superscript',
    text: 'Superscript',
  },
  table: {
    buttonTitle: 'Table',
    menuTitle: 'Table',
    copy: 'Copy',
    cut: 'Cut',
    merge: 'Merge cells',
    unmerge: 'Unmerge cells',
    clear: 'Clear content',
    deleteColumn: 'Delete selected column(s)',
    deleteRow: 'Delete selected row(s)',
    deleteTable: 'Delete table',
  },
  underline: {
    macTitle: 'Underline ⌘+U',
    winTitle: 'Underline Ctrl+U',
    text: 'Underline',
  },
  video: {
    ...dndLocale,
    buttonTitle: 'Video',
    menuTitle: 'Video',
    play: 'Play',
    replace: 'Replace',
    download: 'Download',
    delete: 'Delete',
    sizeError: 'Failed to upload the video (maximum size: 2G)',
  },
  toc: {
    title: 'TOC',
    open: 'Open TOC',
    close: 'Close TOC',
  },
  section: {
    mindmapFile: 'MindMap File',
    designingFile: 'Designing File',
    officeFile: 'Office File',
    localdocSubTitle: 'Office, XMind, Sketch, etc.',
    label: 'Status',
    labelDescription: 'simple status tag',
    localdoc: 'Local file',
    localdocDescription: 'Support Word, Excel, PPT, PDF',
    iframeOverLimit: 'Documents support up to ${limit} embedded sections',
    placeholder: 'section name',
    embed: 'embed',
    onlinedoc: 'Online doc',
    onlinedocDescription: 'Supports embedded text documents, tables, brain maps',
    website: 'Embedded a website',
    websiteDescription: 'Embedded a website',
    buttonTitle: 'Insert image, table,<br />attachment, codeblock, etc.',
    normal: ' ',
    media: 'Media',
    engineering: 'Engineering',
    description: 'Enter  <code>'.concat(CTRL, '</code> + <code>/</code>  quickly insert a section'),
    table: 'Table',
    tableDescription: 'Insert online table',
    image: 'Image',
    imageDescription: 'Upload one or more images',
    video: 'Local video',
    videoDescription: 'Upload local video',
    youku: 'Online video',
    youkuName: 'Youku',
    youkuDescription: 'Insert Youku video',
    youkuSubTitle: 'Youku, Bilibli',
    bilibili: 'bilibili',
    bilibiliName: 'Bilibili',
    bilibiliDescription: 'Insert Bilibili video',
    codeblock: 'Code block',
    codeblockDescription: 'Enter code snippet',
    file: 'Attachment',
    fileDescription: 'Upload one or more files',
    math: 'Formula',
    mathDescription: 'Enter Latex formula',
    riddle: 'Riddle',
    riddleDescription: 'Insert Riddle code snippet',
    mindmap: 'Mind map',
    mindmapDescription: 'Draw a simple mind map',
    puml: 'PlantUML',
    pumlDescription: 'Draw a PlantUML diagram',
    flowchart: 'Flowchart',
    flowchartDescription: 'Draw a Flowchart diagram',
    mermaid: 'Mermaid',
    mermaidDescription: 'Draw a Mermaid diagram',
    graphviz: 'Graphviz',
    graphvizDescription: 'Draw a Graphviz diagram',
    diagram: 'Text diagram',
    diagramDescription: 'Draw text based diagram',
    diagramSubTitle: 'PlantUML, Mermaid, etc.',
    lockedtextTitle: 'LockedText',
    lockedtextDescription: 'Locked text',
  },
  mention: {
    text: 'Mention',
  },
  markdown: {
    pasteTitle: 'Do you need to do a style conversion?',
    pasteContent: 'It is detected that the paste content conforms to the Markdown syntax. Do you need to do style conversion?',
    pasteButton: 'Convert now',
  },
  search: {
    searchAndReplace: 'Search & Replace',
    search: 'search',
    replace: 'replace',
    replaceAll: 'replace all',
    replaceTo: 'replace to',
    pleaseEnter: 'please enter',
    next: 'next',
    previous: 'prevs',
  },
  translate: {
    title: 'Translate',
    subTitle: 'source & target',
    automaticDetection: 'automatic detection',
    zh: 'chinese',
    en: 'english',
    translation: 'translation',
    insertDoc: 'Insert document',
    placeholder: 'please select what needs to be translated in the document.',
  },
};
