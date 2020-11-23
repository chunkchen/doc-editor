import BaseUtil from '../../../util'
import Global from '../global'

const canvas = BaseUtil.createDOM('<canvas>')
const ctx = canvas.getContext('2d')

export default {
  ...BaseUtil,
  // 移动画布
  getPanCanvasBehaviour(bool) {
    return function (page) {
      const graph = page.getGraph()
      let startPoint
      let startMatrix
      graph.behaviourOn('canvas:mouseenter', () => {
        page.css({
          cursor: Global.cursor.beforePanCanvas,
        })
      })
      graph.behaviourOn('mouseleave', (ev) => {
        if (!ev.toShape) {
          page.css({
            cursor: Global.cursor.beforePanCanvas,
          })
        }
      })
      graph.behaviourOn('dragstart', (ev) => {
        if ((ev.button !== 2 && !bool) || !ev.shape || (ev.item && ev.item.dragable === false && !page.getSignal('dragEdge'))) {
          startPoint = {
            x: ev.domX,
            y: ev.domY,
          }
          page.css({
            cursor: Global.cursor.panningCanvas,
          })
          startMatrix = graph.getMatrix()
          page.setCapture(false)
        }
      })
      graph.behaviourOn('drag', (ev) => {
        if (startPoint) {
          const dx = ev.domX - startPoint.x
          const dy = ev.domY - startPoint.y
          const matrix = []
          BaseUtil.mat3.translate(matrix, startMatrix, [dx, dy])
          if (page.translateLimt(matrix)) {
            graph.updateMatrix(matrix)
            graph.draw()
          }
        }
      })
      graph.behaviourOn('mouseup', () => {
        if (startPoint) {
          resetStatus()
          page.css({
            cursor: Global.cursor.beforePanCanvas,
          })
          page.emit('afterpancanvas')
        }
      })

      function resetStatus() {
        startPoint = undefined
        startMatrix = undefined
        page.setCapture(true)
      }
    }
  },
  getLabelTextByTextLineWidth(labelText, font) {
    const maxTextLineWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 320
    ctx.font = font
    let lineWidth = ctx.measureText(labelText).width

    if (lineWidth > maxTextLineWidth) {
      lineWidth = 0
      for (let i = 1; i < labelText.length; i++) {
        lineWidth += ctx.measureText(labelText[i]).width

        if (lineWidth >= maxTextLineWidth) {
          labelText = `${labelText.substring(0, i)}\n${labelText.substring(i, labelText.length)}`
          i += 1
          lineWidth = 0
        }
      }
    }

    return labelText
  },
}
