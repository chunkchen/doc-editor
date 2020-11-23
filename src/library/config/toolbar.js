import React from 'react'
import section from './section'
import hotkey from './hotkey'
import { getHotkeyText } from '../utils/string'
import { addIframeSection } from '../utils/command'

const getSections = (engine) => {
  const locale = engine.locale
  const sectionMap = {}
  section(engine)
    .forEach((item) => {
      sectionMap[item.name] = item
    })
  // 分组形式的Section
  const groups = []
  // 普通Section
  groups.push({
    title: locale.section.normal,
    items: [
      sectionMap.image,
      sectionMap.table,
      sectionMap.file,
      sectionMap.math,
      sectionMap.codeblock,
      sectionMap.mindmap,
      sectionMap.diagram,
      // sectionMap.mxgraph,
      sectionMap.lockedtext,
      sectionMap.label,
    ],
  })
  // 媒体Section
  const media = [
    sectionMap.website,
    // sectionMap.onlinedoc,
    sectionMap.localdoc,
    sectionMap.video,
    sectionMap.youku,
  ]

  groups.push({
    title: locale.section.embed,
    items: media,
  })
  return groups
}

export const setToolbarHotkey = (customList, keyList) => {
  const hotkeyMap = {}
  const hotkeyGroupMap = {}
  if (!keyList) {
    keyList = hotkey()
  }
  keyList.forEach((item) => {
    item.keyText = getHotkeyText(item.keys)
    item.keyValue = item.keys.join('')
      .toLowerCase()
    hotkeyMap[item.name] = item
    if (item.group) {
      if (hotkeyGroupMap[item.group]) {
        hotkeyGroupMap[item.group].push(item.name)
      } else {
        hotkeyGroupMap[item.group] = [item.name]
      }
    }
  })

  return customList.map((group) => {
    return group.map((item) => {
      if (typeof item === 'object') {
        if (typeof item.items === 'object' && item.items.length > 0) {
          item.items = item.items.map((childItem) => {
            const childName = typeof childItem === 'object' ? childItem.name : childItem
            const childConfig = hotkeyMap[childName]
            if (!childItem.hotkey && childConfig && childConfig.keyValue) {
              if (typeof childItem === 'object') {
                childItem.hotkey = childConfig.keyValue
              } else {
                childItem = {
                  name: childName,
                  hotkey: childConfig.keyValue,
                }
              }
            }
            return childItem
          })
        } else if (hotkeyGroupMap[item.name]) {
          item.items = []
          hotkeyGroupMap[item.name].forEach((child) => {
            const config = hotkeyMap[child]
            const childObj = { name: child }
            if (config && config.keyValue) {
              childObj.hotkey = config.keyValue
            }
            item.items.push(childObj)
          })
        } else if (!item.hotkey && hotkeyMap[item.name]) {
          item.hotkey = hotkeyMap[item.name].keyValue
        }
      } else if (hotkeyGroupMap[item]) {
        item = {
          name: item,
          items: [],
        }
        hotkeyGroupMap[item.name].forEach((child) => {
          const config = hotkeyMap[child]
          const childObj = { name: child }
          if (config && config.keyValue) {
            childObj.hotkey = config.keyValue
          }
          item.items.push(childObj)
        })
      } else {
        const config = hotkeyMap[item]
        if (config && config.keyValue) {
          item = {
            name: item,
            hotkey: config.keyValue,
          }
        }
      }
      return item
    })
  })
}

const getToolbarConfig = (engine) => {
  const locale = engine.locale
  // 快捷键

  const hotkeyMap = {}
  hotkey(locale)
    .forEach((item) => {
      item.keyText = getHotkeyText(item.keys)
      item.keyValue = item.keys.join('')
        .toLowerCase()
      hotkeyMap[item.name] = item
    })
  // 标题
  const headingMap = {
    p: locale.heading.normal,
    h1: locale.heading.heading_1,
    h2: locale.heading.heading_2,
    h3: locale.heading.heading_3,
    h4: locale.heading.heading_4,
    h5: locale.heading.heading_5,
    h6: locale.heading.heading_6,
  }
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
  ]
  const fontsizeMap = {}
  fontsizeArray.forEach((fontsize) => {
    fontsizeMap[fontsize.key] = fontsize.value
  })
  return [
    {
      name: 'section',
      title: <span dangerouslySetInnerHTML={{ __html: locale.section.buttonTitle }} />,
      type: 'collapse',
      icon: '<span class="lake-icon lake-icon-section" />',
      data: getSections(engine),
      description: locale.section.description,
      onClick: (name) => {
        engine.command.execute(name)
      },
    },
    {
      name: 'save',
      title: locale.editor.save,
      hotkey: hotkeyMap.save.keyText,
      hotkeyVal: hotkeyMap.save.keyValue,
      icon: '<span class="lake-icon lake-icon-save" />',
      onClick: () => {
        engine.command.execute('save')
      },
    },
    {
      name: 'undo',
      title: locale.history.undo,
      hotkey: hotkeyMap.undo.keyText,
      hotkeyVal: hotkeyMap.undo.keyValue,
      icon: '<span class="lake-icon lake-icon-undo" />',
      getDisabled: () => {
        return !engine.command.queryState('undo')
      },
      onClick: () => {
        engine.command.execute('undo')
      },
    },
    {
      name: 'redo',
      title: locale.history.redo,
      hotkey: hotkeyMap.redo.keyText,
      hotkeyVal: hotkeyMap.redo.keyValue,
      icon: '<span class="lake-icon lake-icon-redo" />',
      getDisabled: () => {
        return !engine.command.queryState('redo')
      },
      onClick: () => {
        engine.command.execute('redo')
      },
    },
    {
      name: 'paintformat',
      title: locale.paintformat.buttonTitle,
      icon: '<span class="lake-icon lake-icon-paintformat" />',
      getActive: () => {
        return engine.command.queryState('paintformat')
      },
      onClick: () => {
        engine.command.execute('paintformat')
      },
    },
    {
      name: 'removeformat',
      title: locale.clearFormat.buttonTitle,
      icon: '<span class="lake-icon lake-icon-clean" />',
      onClick: () => {
        engine.command.execute('removeformat')
      },
    },
    {
      name: 'heading',
      type: 'dropdown',
      title: locale.heading.buttonTitle,
      className: 'lake-button-heading',
      data: [
        {
          key: 'p',
          value: headingMap.p,
          className: '',
        },
        {
          key: 'h1',
          value: headingMap.h1,
          className: 'lake-button-set-list-item-heading1',
        },
        {
          key: 'h2',
          value: headingMap.h2,
          className: 'lake-button-set-list-item-heading2',
        },
        {
          key: 'h3',
          value: headingMap.h3,
          className: 'lake-button-set-list-item-heading3',
        },
        {
          key: 'h4',
          value: headingMap.h4,
          className: 'lake-button-set-list-item-heading4',
        },
        {
          key: 'h5',
          value: headingMap.h5,
          className: 'lake-button-set-list-item-heading5',
        },
        {
          key: 'h6',
          value: headingMap.h6,
          className: 'lake-button-set-list-item-heading6',
        },
      ],
      getActive: () => {
        return engine.command.queryState('heading') || 'p'
      },
      getCurrentText: (active) => {
        return headingMap[active] || locale.heading.normal
      },
      onClick: (value) => {
        engine.command.execute('heading', value)
      },
    },
    {
      name: 'h1',
      title: headingMap.h1,
      hotkey: hotkeyMap.h1.keyText,
      hotkeyVal: hotkeyMap.h1.keyValue,
      icon: '<span class="lake-icon lake-icon-h1" />',
      getActive: () => {
        return engine.command.queryState('heading') === 'h1'
      },
      onClick: () => {
        engine.command.execute('heading', 'h1')
      },
    },
    {
      name: 'h2',
      title: headingMap.h2,
      hotkey: hotkeyMap.h2.keyText,
      hotkeyVal: hotkeyMap.h2.keyValue,
      icon: '<span class="lake-icon lake-icon-h2" />',
      getActive: () => {
        return engine.command.queryState('heading') === 'h2'
      },
      onClick: () => {
        engine.command.execute('heading', 'h2')
      },
    },
    {
      name: 'h3',
      title: headingMap.h3,
      hotkey: hotkeyMap.h3.keyText,
      hotkeyVal: hotkeyMap.h3.keyValue,
      icon: '<span class="lake-icon lake-icon-h3" />',
      getActive: () => {
        return engine.command.queryState('heading') === 'h3'
      },
      onClick: () => {
        engine.command.execute('heading', 'h3')
      },
    },
    {
      name: 'h4',
      title: headingMap.h4,
      hotkey: hotkeyMap.h4.keyText,
      hotkeyVal: hotkeyMap.h4.keyValue,
      icon: '<span class="lake-icon lake-icon-h4" />',
      getActive: () => {
        return engine.command.queryState('heading') === 'h4'
      },
      onClick: () => {
        engine.command.execute('heading', 'h4')
      },
    },
    {
      name: 'h5',
      title: headingMap.h5,
      hotkey: hotkeyMap.h5.keyText,
      hotkeyVal: hotkeyMap.h5.keyValue,
      icon: '<span class="lake-icon lake-icon-h5" />',
      getActive: () => {
        return engine.command.queryState('heading') === 'h5'
      },
      onClick: () => {
        engine.command.execute('heading', 'h5')
      },
    },
    {
      name: 'h6',
      title: headingMap.h6,
      hotkey: hotkeyMap.h6.keyText,
      hotkeyVal: hotkeyMap.h6.keyValue,
      icon: '<span class="lake-icon lake-icon-h6" />',
      getActive: () => {
        return engine.command.queryState('heading') === 'h6'
      },
      onClick: () => {
        engine.command.execute('heading', 'h6')
      },
    },
    {
      name: 'bold',
      title: locale.bold.text,
      hotkey: hotkeyMap.bold.keyText,
      hotkeyVal: hotkeyMap.bold.keyValue,
      icon: '<span class="lake-icon lake-icon-bold" />',
      getActive: () => {
        return engine.command.queryState('bold')
      },
      getDisabled: () => {
        const tag = engine.command.queryState('heading') || 'p'
        const isCodeblock = engine.command.queryState('codeblock') === 'codeblock'
        return /^h\d$/.test(tag) || isCodeblock
      },
      onClick: () => {
        engine.command.execute('bold')
      },
    },
    {
      name: 'italic',
      title: locale.italic.text,
      hotkey: hotkeyMap.italic.keyText,
      hotkeyVal: hotkeyMap.italic.keyValue,
      icon: '<span class="lake-icon lake-icon-italic" />',
      getActive: () => {
        return engine.command.queryState('italic')
      },
      onClick: () => {
        engine.command.execute('italic')
      },
    },
    {
      name: 'strikethrough',
      title: locale.strikethrough.text,
      hotkey: hotkeyMap.strikethrough.keyText,
      hotkeyVal: hotkeyMap.strikethrough.keyValue,
      icon: '<span class="lake-icon lake-icon-strikethrough" />',
      getActive: () => {
        return engine.command.queryState('strikethrough')
      },
      onClick: () => {
        engine.command.execute('strikethrough')
      },
    },
    {
      name: 'underline',
      title: locale.underline.text,
      hotkey: hotkeyMap.underline.keyText,
      hotkeyVal: hotkeyMap.underline.keyValue,
      icon: '<span class="lake-icon lake-icon-underline" />',
      getActive: () => {
        return engine.command.queryState('underline')
      },
      onClick: () => {
        engine.command.execute('underline')
      },
    },
    {
      name: 'fontsize',
      type: 'dropdown',
      title: locale.fontsize.buttonTitle,
      className: 'lake-button-fontsize',
      data: fontsizeArray,
      getActive: () => {
        const tag = engine.command.queryState('heading') || 'p'
        const isCodeblock = engine.command.queryState('codeblock') === 'codeblock'
        if (/^h\d$/.test(tag) || isCodeblock) {
          return '11'
        }
        return engine.command.queryState('fontsize') || '11'
      },
      getDisabled: () => {
        const tag = engine.command.queryState('heading') || 'p'
        const isCodeblock = engine.command.queryState('codeblock') === 'codeblock'
        return /^h\d$/.test(tag) || isCodeblock
      },
      getCurrentText: (active) => {
        return fontsizeMap[active || '11']
      },
      onClick: (value) => {
        engine.command.execute('fontsize', value)
      },
    },
    {
      name: 'fontcolor',
      type: 'color',
      title: locale.color.fontColor,
      moreTitle: locale.color.moreColor,
      defaultColor: '#262626',
      currentColor: '#F5222D',
      getActive: () => {
        return engine.command.queryState('fontcolor') || ''
      },
      onClick: (value) => {
        engine.command.execute('fontcolor', value, '#262626')
      },
    },
    {
      name: 'highlight',
      type: 'color',
      title: locale.color.bgColor,
      moreTitle: locale.color.moreColor,
      defaultColor: '#FFFFFF',
      currentColor: '#FADB14',
      getActive: () => {
        return engine.command.queryState('backcolor') || ''
      },
      onClick: (value) => {
        engine.command.execute('backcolor', value, '#FFFFFF')
      },
    },
    {
      name: 'moremark',
      type: 'dropdown',
      title: locale.moremark.buttonTitle,
      icon: '<span class="lake-icon lake-icon-moremark" />',
      className: 'lake-button-icon-list',
      data: [
        {
          key: 'sup',
          icon: '<span class="lake-icon lake-icon-sup" />',
          title: locale.sup.text,
          className: 'lake-button-set-list-item-icon',
        },
        {
          key: 'sub',
          icon: '<span class="lake-icon lake-icon-sub" />',
          title: locale.sub.text,
          className: 'lake-button-set-list-item-icon',
        },
        {
          key: 'code',
          icon: '<span class="lake-icon lake-icon-code" />',
          title: locale.code.text,
          className: 'lake-button-set-list-item-icon',
        },
      ],
      getActive: () => {
        return engine.command.queryState('moremark')
      },
      onClick: (value) => {
        engine.command.execute('moremark', value)
      },
    },
    {
      name: 'sup',
      title: locale.sup.text,
      hotkey: hotkeyMap.sup.keyText,
      hotkeyVal: hotkeyMap.sup.keyValue,
      icon: '<span class="lake-icon lake-icon-sup" />',
      getActive: () => {
        return engine.command.queryState('sup')
      },
      getDisabled: () => {
        const tag = engine.command.queryState('heading') || 'p'
        return /^h\d$/.test(tag)
      },
      onClick: () => {
        engine.command.execute('moremark', 'sup')
      },
    },
    {
      name: 'sub',
      title: locale.sub.text,
      hotkey: hotkeyMap.sub.keyText,
      hotkeyVal: hotkeyMap.sub.keyValue,
      icon: '<span class="lake-icon lake-icon-sub" />',
      getActive: () => {
        return engine.command.queryState('sub')
      },
      getDisabled: () => {
        const tag = engine.command.queryState('heading') || 'p'
        return /^h\d$/.test(tag)
      },
      onClick: () => {
        engine.command.execute('moremark', 'sub')
      },
    },
    {
      name: 'code',
      title: locale.code.text,
      hotkey: hotkeyMap.code.keyText,
      hotkeyVal: hotkeyMap.code.keyValue,
      icon: '<span class="lake-icon lake-icon-code" />',
      getActive: () => {
        return engine.command.queryState('code')
      },
      getDisabled: () => {
        const tag = engine.command.queryState('heading') || 'p'
        return /^h\d$/.test(tag)
      },
      onClick: () => {
        engine.command.execute('moremark', 'code')
      },
    },
    {
      name: 'alignment',
      type: 'dropdown',
      title: locale.alignment.buttonTitle,
      icon: '<span class="lake-icon lake-icon-align-left" />',
      className: 'lake-button-icon-list',
      data: [
        {
          key: 'left',
          icon: '<span class="lake-icon lake-icon-align-left" />',
          title: locale.alignment.alignLeft,
          className: 'lake-button-set-list-item-icon',
          shortcut: hotkeyMap.left.keyText,
          hotkeyVal: hotkeyMap.left.keyValue,
        },
        {
          key: 'center',
          icon: '<span class="lake-icon lake-icon-align-center" />',
          title: locale.alignment.alignCenter,
          className: 'lake-button-set-list-item-icon',
          shortcut: hotkeyMap.center.keyText,
          hotkeyVal: hotkeyMap.center.keyValue,
        },
        {
          key: 'right',
          icon: '<span class="lake-icon lake-icon-align-right" />',
          title: locale.alignment.alignRight,
          className: 'lake-button-set-list-item-icon',
          shortcut: hotkeyMap.right.keyText,
          hotkeyVal: hotkeyMap.right.keyValue,
        },
        {
          key: 'justify',
          icon: '<span class="lake-icon lake-icon-align-justify" />',
          title: locale.alignment.alignJustify,
          className: 'lake-button-set-list-item-icon',
          shortcut: hotkeyMap.justify.keyText,
          hotkeyVal: hotkeyMap.justify.keyValue,
        },
      ],
      getActive: () => {
        return engine.command.queryState('alignment')
      },
      onClick: (value) => {
        engine.command.execute('alignment', value)
      },
    },
    {
      name: 'left',
      title: locale.alignment.alignLeft,
      hotkey: hotkeyMap.left.keyText,
      hotkeyVal: hotkeyMap.left.keyValue,
      icon: '<span class="lake-icon lake-icon-align-left" />',
      getActive: () => {
        return engine.command.queryState('alignment') === 'left'
      },
      onClick: () => {
        engine.command.execute('alignment', 'left')
      },
    },
    {
      name: 'center',
      title: locale.alignment.alignCenter,
      hotkey: hotkeyMap.center.keyText,
      hotkeyVal: hotkeyMap.center.keyValue,
      icon: '<span class="lake-icon lake-icon-align-center" />',
      getActive: () => {
        return engine.command.queryState('alignment') === 'center'
      },
      onClick: () => {
        engine.command.execute('alignment', 'center')
      },
    },
    {
      name: 'right',
      title: locale.alignment.alignRight,
      hotkey: hotkeyMap.right.keyText,
      hotkeyVal: hotkeyMap.right.keyValue,
      icon: '<span class="lake-icon lake-icon-align-right" />',
      getActive: () => {
        return engine.command.queryState('alignment') === 'right'
      },
      onClick: () => {
        engine.command.execute('alignment', 'right')
      },
    },
    {
      name: 'justify',
      title: locale.alignment.alignJustify,
      hotkey: hotkeyMap.justify.keyText,
      hotkeyVal: hotkeyMap.justify.keyValue,
      icon: '<span class="lake-icon lake-icon-align-justify" />',
      getActive: () => {
        return engine.command.queryState('alignment') === 'justify'
      },
      onClick: () => {
        engine.command.execute('alignment', 'justify')
      },
    },
    {
      name: 'list',
      type: 'dropdown',
      title: locale.list.buttonTitle,
      icon: '<span class="lake-icon lake-icon-ordered-list" />',
      className: 'lake-button-icon-list',
      data: [
        {
          key: 'orderedlist',
          icon: '<span class="lake-icon lake-icon-ordered-list" />',
          title: locale.list.orderedList,
          className: 'lake-button-set-list-item-icon',
        },
        {
          key: 'unorderedlist',
          icon: '<span class="lake-icon lake-icon-unordered-list" />',
          title: locale.list.unorderedList,
          className: 'lake-button-set-list-item-icon',
        },
      ],
      getActive: () => {
        return engine.command.queryState('tasklist')
      },
      onClick: (value) => {
        engine.command.execute('tasklist', value)
      },
    },
    {
      name: 'orderedlist',
      title: locale.list.orderedList,
      hotkey: hotkeyMap.orderedlist.keyText,
      hotkeyVal: hotkeyMap.orderedlist.keyValue,
      icon: '<span class="lake-icon lake-icon-ordered-list" />',
      getActive: () => {
        return engine.command.queryState('tasklist') === 'orderedlist'
      },
      onClick: () => {
        engine.command.execute('tasklist', 'orderedlist')
      },
    },
    {
      name: 'unorderedlist',
      title: locale.list.unorderedList,
      hotkey: hotkeyMap.unorderedlist.keyText,
      hotkeyVal: hotkeyMap.unorderedlist.keyValue,
      icon: '<span class="lake-icon lake-icon-unordered-list" />',
      getActive: () => {
        return engine.command.queryState('tasklist') === 'unorderedlist'
      },
      onClick: () => {
        engine.command.execute('tasklist', 'unorderedlist')
      },
    },
    {
      name: 'indent-list',
      type: 'dropdown',
      title: locale.indent.buttonTitle,
      icon: '<span class="lake-icon lake-icon-indent" />',
      className: 'lake-button-icon-list',
      data: [
        {
          key: 'indent',
          icon: '<span class="lake-icon lake-icon-indent" />',
          title: locale.indent.increase,
          className: 'lake-button-set-list-item-icon',
          shortcut: hotkeyMap.indent.keyText,
        },
        {
          key: 'outdent',
          icon: '<span class="lake-icon lake-icon-outdent" />',
          title: locale.indent.decrease,
          className: 'lake-button-set-list-item-icon',
          shortcut: hotkeyMap.outdent.keyText,
        },
      ],
      onClick: (value) => {
        engine.command.execute(value)
      },
    },
    {
      name: 'indent',
      title: locale.indent.increase,
      icon: '<span class="lake-icon lake-icon-indent" />',
      onClick: () => {
        engine.command.execute('indent')
      },
    },
    {
      name: 'outdent',
      title: locale.indent.decrease,
      icon: '<span class="lake-icon lake-icon-outdent" />',
      onClick: () => {
        engine.command.execute('outdent')
      },
    },
    {
      name: 'tasklist',
      title: locale.list.taskList,
      icon: '<span class="lake-icon lake-icon-task-list" />',
      getActive: () => {
        return engine.command.queryState('tasklist') === 'tasklist'
      },
      onClick: () => {
        engine.command.execute('tasklist', 'tasklist')
      },
    },
    {
      name: 'link',
      title: locale.link.buttonTitle,
      type: 'link',
      className: 'lake-button-link',
      hotkey: hotkeyMap.link.keyText,
      hotkeyVal: hotkeyMap.link.keyValue,
      icon: '<span class="lake-icon lake-icon-link" />',
      onClick: () => {
        engine.command.execute('link', '', '链接', true)
      },
    },
    {
      name: 'codeblock',
      icon: '<span class="lake-icon lake-icon-codeblock" />',
      title: locale.section.codeblock,
      onClick: () => {
        engine.command.execute('codeblock', '')
      },
    },
    {
      name: 'table',
      icon: '<span class="lake-icon lake-icon-table" />',
      title: locale.section.table,
      onClick: (opts) => {
        opts = opts !== undefined
          ? opts
          : {
            rows: 3,
            cols: 3,
          }
        engine.command.execute('table', opts)
      },
    },
    {
      name: 'math',
      icon: '<span class="lake-icon lake-icon-math" />',
      title: locale.section.math,
      onClick: () => {
        engine.command.execute('math')
      },
    },
    {
      name: 'image',
      type: 'upload',
      title: locale.image.buttonTitle,
      icon: '<span class="lake-icon lake-icon-image" />',
    },
    {
      name: 'video',
      type: 'video',
      title: locale.section.video,
      icon: '<span class="lake-icon lake-icon-video" />',
      setOnline: (value) => {
        addIframeSection(engine, 'youku', value)
      },
    },
    {
      name: 'file',
      type: 'upload',
      title: locale.file.buttonTitle,
      icon: '<span class="lake-icon lake-icon-attachment" />',
    },
    {
      name: 'quote',
      title: locale.blockquote.buttonTitle,
      icon: '<span class="lake-icon lake-icon-quote" />',
      getActive: () => {
        return engine.command.queryState('quote')
      },
      onClick: () => {
        engine.command.execute('quote')
      },
    },
    {
      name: 'hr',
      title: locale.hr.buttonTitle,
      icon: '<span class="lake-icon lake-icon-hr" />',
      onClick: () => {
        engine.command.execute('hr')
      },
    },
    {
      name: 'toc',
      title: locale.toc.title,
      icon: '<span class="lake-icon lake-icon-toc" accessbilityid="toc-button" />',
      getActive: () => {
        return engine.command.queryState('toc')
      },
      onClick: () => {
        engine.command.execute('toc')
      },
    },
    {
      name: 'search',
      title: `${locale.search.search} & ${locale.search.replace}`,
      icon:
        '<span class="lake-icon lake-icon-searchreplace" accessbilityid="searchreplace-button" />',
      getActive: () => {
        return engine.command.queryState('search')
      },
      onClick: () => {
        engine.command.execute('search')
      },
    },
    {
      name: 'translate',
      title: locale.translate.title,
      icon:
        '<span class="lake-icon lake-icon-translate" accessbilityid="translate-button" />',
      getActive: () => {
        return engine.command.queryState('translate')
      },
      onClick: () => {
        engine.command.execute('translate')
      },
    },
    {
      name: 'label',
      icon: '<span class="lake-icon lake-icon-label" />',
      title: locale.section.label,
      onClick: () => {
        engine.command.execute('label')
      },
    },
  ]
}
export default getToolbarConfig
