import Page from '../page'
import Global from '../global'
import Util from '../util'

Page.registerBehaviour('wheelChangeViewport', (page) => {
  const graph = page.getGraph()
  let timeout
  graph.behaviourOn('wheel', (ev) => {
    ev.domEvent.preventDefault()
  })
  graph.behaviourOn('wheel', Util.throttle(update, 16))

  function update(ev) {
    if (page.getSignal('preventWheelPan') || page.destroyed) {
      return
    }

    const domEvent = ev.domEvent
    const wheelZoom = page.getSignal('wheelZoom')

    if (!timeout) {
      page.setCapture(false)
    }

    if (wheelZoom) {
      const delta = domEvent.deltaY
      const times = 1.05

      if (Math.abs(delta) > 10) {
        // 控制灵敏度
        const originScale = graph.getMatrix()[0]

        if (delta > 0) {
          graph.zoom({
            x: ev.x,
            y: ev.y,
          }, originScale * times)
        } else {
          graph.zoom({
            x: ev.x,
            y: ev.y,
          }, originScale * (1 / times))
        }
      }
    } else {
      const matrix = []
      const startMatrix = graph.getMatrix()
      Util.mat3.translate(matrix, startMatrix, [-domEvent.deltaX * Global.wheelPanRatio, -domEvent.deltaY * Global.wheelPanRatio])
      page.translateLimt(matrix) && graph.updateMatrix(matrix)
    }

    timeout && clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (page.destroyed) {
        return
      }

      page.setCapture(true)
      timeout = undefined
    }, 50)
  }
})
