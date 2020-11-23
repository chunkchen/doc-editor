import Mind from '../../mind'

Mind.registerEdge('mind-edge', {
  getEdetal(targetModel) {
    if (targetModel.children && targetModel.children.length > 0 && !targetModel.collapsed) {
      return targetModel.hierarchy === 2 ? 24 : 18
    }
    return 0
  },
  getPath(item) {
    const points = item.getPoints()
    const source = item.getSource()
    const target = item.getTarget()
    const sourceBox = source.getBBox()
    const targetBox = target.getBBox()
    const targetModel = target.getModel()
    let controlPointDetal1 = 14
    let controlPointDetal2 = 4

    if (targetModel.hierarchy === 2) {
      controlPointDetal1 = 66
      controlPointDetal2 = 30
    }

    if (points[0].y === points[1].y) {
      const sDetal = targetModel.hierarchy === 3 ? 24 : 18
      const _eDetal = this.getEdetal(targetModel)
      if (sourceBox.centerX < targetBox.centerX) {
        return [['M', points[0].x + sDetal, points[0].y], ['L', targetBox.maxX + _eDetal, targetBox.maxY]]
      }
      return [['M', points[0].x + 2, points[0].y], ['L', targetBox.minX - _eDetal, targetBox.maxY]]
    }

    if (targetModel.hierarchy >= 3) {
      const _sDetal = targetModel.hierarchy === 3 ? 24 : 18
      const _eDetal2 = this.getEdetal(targetModel)
      if (sourceBox.centerX < targetBox.centerX) {
        const _dpx = points[0].x + _sDetal
        return [['M', points[0].x, points[0].y], ['M', _dpx, points[0].y], ['C', _dpx + controlPointDetal2, points[0].y, targetBox.minX - controlPointDetal1, targetBox.maxY, targetBox.minX, targetBox.maxY], ['L', targetBox.maxX + _eDetal2, targetBox.maxY]]
      }
      const dpx = points[0].x - _sDetal
      return [['M', points[0].x, points[0].y], ['M', dpx, points[0].y], ['C', dpx - controlPointDetal2, points[0].y, targetBox.maxX + controlPointDetal1, targetBox.maxY, targetBox.maxX, targetBox.maxY], ['L', targetBox.minX - _eDetal2, targetBox.maxY]]
    }

    const eDetal = this.getEdetal(targetModel)
    if (sourceBox.centerX < targetBox.centerX) {
      return [['M', points[0].x, points[0].y], ['C', points[0].x + controlPointDetal2, points[0].y, targetBox.minX - controlPointDetal1, targetBox.maxY, targetBox.minX, targetBox.maxY], ['L', targetBox.maxX + eDetal, targetBox.maxY]]
    }
    return [['M', points[0].x, points[0].y], ['C', points[0].x - controlPointDetal2, points[0].y, targetBox.maxX + controlPointDetal1, targetBox.maxY, targetBox.maxX, targetBox.maxY], ['L', targetBox.minX - eDetal, targetBox.maxY]]
  },
  getStyle(item) {
    const target = item.getTarget()
    let lineWidth = 1

    if (target) {
      const targetModel = target.getModel()

      if (targetModel.hierarchy <= 3) {
        lineWidth = 3
      } else if (targetModel.hierarchy <= 5) {
        lineWidth = 2
      } else {
        lineWidth = 1
      }
    }

    return {
      stroke: '#959EA6',
      lineWidth,
    }
  },
})
