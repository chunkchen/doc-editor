import Page from '../page'

Page.registerBehaviour('dblclickItemEditLabel', (page) => {
  const graph = page.getGraph()
  graph.behaviourOn('node:dblclick', (ev) => {
    if (ev.shape && !ev.shape.isButton) {
      page.beginEditLabel(ev.item)
    }
  })
})
