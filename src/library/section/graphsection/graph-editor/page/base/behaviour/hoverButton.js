import Page from '../page'

Page.registerBehaviour('hoverButton', (flow) => {
  const graph = flow.getGraph()
  graph.behaviourOn('mouseenter', (ev) => {
    if (flow.getSignal('panningItem')) {
      return
    }

    if (ev.shape && ev.shape.isButton) {
      flow.css({
        cursor: 'pointer',
      })
    }
  })
})
