import Command from '../../../command'
import Util from '../util'

function enable(editor) {
  const page = editor.getCurrentPage()
  const items = page.getSelected()
  return page.isMind && items.length > 0
}

function addRootChild(page, selectedItem, addItemId) {
  const graph = page.getGraph()
  const selectedModel = selectedItem.getModel()
  const firstLefts = page.getFirstChildrenBySide('left')
  const firstLeftItem = firstLefts[0] && graph.find(firstLefts[0].id)
  return graph.add('node', {
    id: addItemId,
    parent: selectedItem.id,
    label: '新建节点',
    side: selectedModel.children.length > 2 ? 'left' : 'right',
    nth: firstLeftItem ? graph.getNth(firstLeftItem) : undefined,
  })
}

// 添加相邻节点
Command.registerCommand('append', {
  enable(editor) {
    const page = editor.getCurrentPage()
    const items = page.getSelected()
    return page.isMind && items.length === 1
  },
  getItem(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()

    if (this.selectedItemId) {
      return graph.find(this.selectedItemId)
    }
    return page.getSelected()[0]
  },
  execute(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const root = page.getRoot()
    const selectedItem = this.getItem(editor)
    const selectedModel = selectedItem.getModel()
    const hierarchy = selectedModel.hierarchy
    const selectedParent = selectedItem.getParent()
    let addNode

    if (selectedItem.isRoot) {
      addNode = addRootChild(page, selectedItem, this.addItemId)
    } else {
      const nth = graph.getNth(selectedItem)
      addNode = graph.add('node', {
        id: this.addItemId,
        parent: selectedParent.id,
        side: hierarchy === 2 && root.children.length === 3 ? 'left' : selectedModel.side,
        label: '新建节点',
        nth: selectedModel.side === 'left' && hierarchy === 2 ? nth : nth + 1,
      })
    }

    page.clearSelected()
    page.clearActived()
    page.setSelected(addNode, true)

    if (this.executeTimes === 1) {
      this.selectedItemId = selectedItem.id
      this.addItemId = addNode.id
      page.beginEditLabel(addNode)
    }
  },
  back(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    graph.remove(this.addItemId)
    page.clearSelected()
    page.clearActived()
    page.setSelected(this.selectedItemId, true)
  },
  shortcutCodes: ['Enter'],
})
// 添加子节点
Command.registerCommand('appendChild', {
  enable,
  getItem(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()

    if (this.selectedItemId) {
      return graph.find(this.selectedItemId)
    }
    return page.getSelected()[0]
  },
  execute(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const selectedItem = this.getItem(editor)
    let addNode

    if (selectedItem.isRoot) {
      addNode = addRootChild(page, selectedItem, this.addItemId)
    } else {
      addNode = graph.add('node', {
        id: this.addItemId,
        parent: selectedItem.id,
        label: '新建节点',
      })
    }

    page.clearSelected()
    page.clearActived()
    page.setSelected(addNode, true)

    if (this.executeTimes === 1) {
      this.selectedItemId = selectedItem.id
      this.addItemId = addNode.id
      page.beginEditLabel(addNode)
    }
  },
  back(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    graph.remove(this.addItemId)
    page.clearSelected()
    page.clearActived()
    page.setSelected(this.selectedItemId, true)
  },
  shortcutCodes: ['Tab'],
})
// 移动节点
Command.registerCommand('moveMindNode', {
  enable(editor) {
    const page = editor.getCurrentPage()
    const panItems = page.get('panItems')
    return page.isMind && panItems && panItems.length > 0
  },
  execute(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const newParentId = this.newParentId
    const newNth = this.newNth
    const newSide = this.newSide
    const model = Util.clone(this.model)
    delete model.shape
    delete model.side
    graph.remove(model.id)
    Util.mix(model, {
      parent: newParentId,
      nth: newNth,
      side: newSide,
    })
    const node = graph.add('node', model)
    page.clearSelected()
    page.setSelected(node, true)
  },
  back(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const originParentId = this.originParentId
    const originNth = this.originNth
    const originSide = this.originSide
    const model = Util.clone(this.model)
    delete model.shape
    delete model.side
    graph.remove(model.id)
    Util.mix(model, {
      parent: originParentId,
      nth: originNth,
      side: originSide,
    })
    const node = graph.add('node', model)
    page.clearSelected()
    page.setSelected(node, true)
  },
})
