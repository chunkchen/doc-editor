import Page from '../page'

Page.registerBehaviour('endPanItem', (page) => {
  const graph = page.getGraph()
  graph.behaviourOn('panitemend', () => {
    const delegation = page.get('panItemDelegation')

    if (delegation) {
      delegation.remove()
      graph.draw()
    }

    page.setSignal('panningItem', false)
    page.set('panItemDelegation', undefined)
    page.set('panItemStartPoint', undefined)
    page.set('panItemStartBox', undefined)
    page.set('panItems', undefined)
  })
  graph.behaviourOn('canvas:mouseleave', () => {
    const panItems = page.get('panItems')
    if (!panItems) {
      return
    }

    page.clearAlignLine()
    graph.emit('panitemend')
  })
})
