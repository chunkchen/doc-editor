import Page from '../page'

Page.registerBehaviour('startPanItem', (page) => {
  const graph = page.getGraph()
  const rootGroup = graph.getRootGroup()
  graph.behaviourOn('mouseenter', (_ref) => {
    const item = _ref.item
    if (item && (item.isGroup || item.isNode)) {
      const shapeObj = item.getShapeObj()

      if (shapeObj.panAble !== false) {
        page.css({
          cursor: 'move',
        })
      }
    }
  })
  graph.behaviourOn('dragstart', (ev) => {
    if (ev.button === 2 || !ev.item || (!ev.item.isNode && !ev.item.isGroup)) {
      return
    }

    const panItem = ev.item
    let panItems

    if (panItem.isSelected) {
      panItems = page.getSelected()
    } else {
      panItems = [panItem]
    }

    panItems = panItems.filter((item) => {
      return item.isNode || item.isGroup
    })

    if (panItems[0] && panItems[0].dragable !== false) {
      graph.emit('beforepanitem', {
        items: panItems,
      })
      graph.emit('beforeshowdelegation', {
        items: panItems,
      })
      const delegation = page.getDelegation(panItems, rootGroup)
      const startBox = delegation.getBBox()
      page.setSignal('panningItem', true)
      page.set('panItems', panItems)
      page.set('panItemDelegation', delegation)
      page.set('panItemStartBox', startBox)
      page.set('panItemStartPoint', {
        x: ev.x,
        y: ev.y,
      })
      graph.draw()
    }
  })
})
