import Page from '../../base'

Page.registerBehaviour('keydownMoveSelection', (page) => {
  const graph = page.getGraph()
  graph.behaviourOn('keydown', (ev) => {
    page._moveItemSelection(ev)
  })
})
