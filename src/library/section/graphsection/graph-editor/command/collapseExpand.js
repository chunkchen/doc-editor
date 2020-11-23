import Command from './command'

Command.registerCommand('collapseExpand', {
  getItem(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    if (this.itemId) {
      return graph.find(this.itemId)
    }
    return page.getSelected()[0]
  },
  enable(editor) {
    const item = this.getItem(editor)
    return item && item.collapseExpand !== false && item.getChildren().length > 0
  },
  execute(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const item = this.getItem(editor)
    const selectedModel = item.getModel()

    if (selectedModel.collapsed) {
      graph.update(item, {
        collapsed: false,
      })
      this.toCollapsed = false
    } else {
      graph.update(item, {
        collapsed: true,
      })
      this.toCollapsed = true
    }

    page.clearSelected()
    page.setSelected(item, true)

    if (this.executeTimes === 1) {
      this.itemId = item.id
    }
  },
  back(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const item = this.getItem(editor)
    if (this.toCollapsed) {
      graph.update(item, {
        collapsed: false,
      })
    } else {
      graph.update(item, {
        collapsed: true,
      })
    }
    page.clearSelected()
    page.setSelected(item, true)
  },
  shortcutCodes: [['metaKey', '/'], ['ctrlKey', '/']],
})
Command.registerCommand('collapse', {
  enable(editor) {
    const item = this.getItem(editor)
    return item && item.collapseExpand !== false && item.getChildren().length > 0 && !item.getModel().collapsed
  },
}, 'collapseExpand')
Command.registerCommand('expand', {
  enable(editor) {
    const item = this.getItem(editor)
    return item && item.collapseExpand !== false && item.getChildren().length > 0 && item.getModel().collapsed
  },
}, 'collapseExpand')
