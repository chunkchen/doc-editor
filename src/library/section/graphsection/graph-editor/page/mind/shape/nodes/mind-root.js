import Mind from '../../mind'
import Util from '../../util'

Mind.registerNode('mind-root', {
  adjustLabelPosition(item, labelShape) {
    const box = labelShape.getBBox()
    labelShape.attr({
      x: -box.width / 2,
      y: -box.height / 2 - 1,
    })
  },
  getPath(item) {
    const size = this.getSize(item)
    const style = this.getStyle(item)
    return Util.getRectPath(-size[0] / 2, -size[1] / 2, size[0], size[1], style.radius)
  },
  getButtonPositon(keyShapeBox, buttonBox, side) {
    if (side === 'right') {
      return {
        x: keyShapeBox.maxX + 2,
        y: (keyShapeBox.maxY + keyShapeBox.minY) / 2 - (buttonBox.maxY - buttonBox.minY) / 2,
      }
    }

    return {
      x: keyShapeBox.minX - (buttonBox.maxX - buttonBox.minX) - 2,
      y: (keyShapeBox.maxY + keyShapeBox.minY) / 2 - (buttonBox.maxY - buttonBox.minY) / 2,
    }
  },
  getPadding() {
    return Util.toAllPadding([12, 24])
  },
  getStyle() {
    return {
      fill: '#587EF7',
      stroke: '#587EF7',
      fillOpacity: 1,
      radius: 4,
    }
  },
  getLabelStyle() {
    return {
      fontSize: 20,
      fill: 'white',
      lineHeight: 28,
    }
  },
  drawExpandedButton() {
  },
  drawCollapsedButton() {
  },
  panAble: false,
  anchor: [[0.45, 0.5], [0.55, 0.5]],
}, 'mind-first-sub')
