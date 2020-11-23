/**
 * @fileOverview hover tree ExpandButton
 */
import Page from '../../base'

Page.registerBehaviour('hoverMindExpandButton', (mind) => {
  const graph = mind.getGraph()
  graph.behaviourOn('mouseenter', (ev) => {
    const shape = ev.shape
    if (shape && shape.isExpandedButton) {
      shape.attr('fillOpacity', 0.8)
      graph.draw()
    }
  })
  graph.behaviourOn('mouseleave', (ev) => {
    const shape = ev.shape
    if (shape && !shape.get('destroyed') && shape.isExpandedButton) {
      shape.attr('fillOpacity', 1)
      graph.draw()
    }
  })
})
