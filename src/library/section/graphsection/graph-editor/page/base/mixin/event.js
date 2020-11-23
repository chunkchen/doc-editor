/**
 * @fileOverview grid
 */
const Mixin = {}

function bindBaseGraphEvent(graph, flow, eventName) {
  graph.on(eventName, (ev) => {
    flow.emit(eventName, ev)
  })
  graph.on(`node:${eventName}`, (ev) => {
    flow.emit(`node:${eventName}`, ev)
  })
  graph.on(`edge:${eventName}`, (ev) => {
    flow.emit(`edge:${eventName}`, ev)
  })
  graph.on(`group:${eventName}`, (ev) => {
    flow.emit(`group:${eventName}`, ev)
  })
  graph.on(`anchor:${eventName}`, (ev) => {
    flow.emit(`anchor:${eventName}`, ev)
  })
}

Mixin.INIT = '_initEvent'
Mixin.AUGMENT = {
  _initEvent() {
    const graph = this.get('_graph')
    bindBaseGraphEvent(graph, this, 'click')
    bindBaseGraphEvent(graph, this, 'dblclick')
    bindBaseGraphEvent(graph, this, 'mouseenter')
    bindBaseGraphEvent(graph, this, 'mouseleave')
    bindBaseGraphEvent(graph, this, 'mousedown')
    bindBaseGraphEvent(graph, this, 'mouseup')
    bindBaseGraphEvent(graph, this, 'contextmenu')
    graph.on('keydown', (ev) => {
      this.emit('keydown', ev)
    })
    graph.on('keyup', (ev) => {
      this.emit('keyup', ev)
    })
    graph.on('beforechange', (ev) => {
      this.emit('beforechange', ev)
    })
    graph.on('afterchange', (ev) => {
      this.emit('afterchange', ev)
    })
    graph.on('afterviewportchange', (ev) => {
      this.emit('afterviewportchange', ev)

      if (ev.updateMatrix[0] !== ev.originMatrix[0]) {
        this.emit('afterzoom', ev)
      }
    })
    graph.on('beforeviewportchange', (ev) => {
      this.emit('beforeviewportchange', ev)

      if (ev.updateMatrix[0] !== ev.originMatrix[0]) {
        this.emit('beforezoom', ev)
      }
    })
  },
}
export default Mixin
