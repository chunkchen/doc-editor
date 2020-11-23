import Page from '../page'
import Util from '../util'

Page.registerBehaviour('panItem', (diagram) => {
  const graph = diagram.getGraph()
  graph.behaviourOn('drop', () => {
    const panItems = diagram.get('panItems')
    if (!panItems) {
      return
    }

    const panItem = panItems[0]
    const panItemIds = panItems.map((panItem) => {
      return panItem.id
    })
    const delegation = diagram.get('panItemDelegation')
    const startBox = diagram.get('panItemStartBox')
    const panItemId = panItem.id
    const dx = delegation.attr('x') - startBox.minX
    const dy = delegation.attr('y') - startBox.minY
    graph.emit('afterpanitemdrop', {
      panItems,
    })

    const method = () => {
      panItemIds.forEach((itemId) => {
        const item = graph.find(itemId)
        const model = item.getModel()

        if (item.isGroup) {
          Util.panGroup(item, dx, dy, graph)
        } else {
          graph.update(item, {
            x: model.x + dx,
            y: model.y + dy,
          })
          graph.toFront(item)
        }
      })

      if (panItemIds.length === 1) {
        diagram.clearSelected()
        diagram.setSelected(panItemId, true)
      }
    }

    diagram.clearAlignLine()
    const editor = diagram.editor
    graph.emit('panitemend')

    if (!editor || diagram.getSignal('dragaddnodetogroup')) {
      method()
    } else {
      editor.executeCommand(method)
    }
  })
}, ['startPanItem', 'processPanItem', 'endPanItem'])
