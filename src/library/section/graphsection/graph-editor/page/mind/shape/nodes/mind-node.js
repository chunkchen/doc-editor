import Mind from '../../mind'
import Util from '../../util'

const defaultLabelStyle = {
  fill: '#000',
  textAlign: 'left',
  textBaseline: 'top',
}
const expandedButtonStyle = {
  stroke: '#959EA6',
  strokeOpacity: 0,
  fill: '#959EA6',
  cursor: 'pointer',
}

Mind.registerNode('mind-base', {
  dy: 4,
  afterDraw(item) {
    const model = item.getModel()

    if (model.children && model.children.length > 0) {
      if (model.collapsed) {
        this.drawExpandedButton(item)
      }
    }
  },
  debugDrawLayoutPoint(item) {
    const model = item.getModel()
    const group = item.getGraphicGroup()
    group.addShape('circle', {
      attrs: {
        x: model.x,
        y: model.y,
        r: 5,
        fill: 'red',
      },
    })
  },
  drawExpandedButton(item) {
    const w = 16
    const h = 7
    const s = w / 4
    const keyShape = item.getKeyShape()
    const keyShapeBox = keyShape.getBBox()
    const group = item.getGraphicGroup()
    const buttonGroup = group.addGroup()
    const buttonPath = buttonGroup.addShape('path', {
      attrs: {
        path: Util.getRectPath(0, 0, w, h, 3),
        ...expandedButtonStyle,
      },
    })
    const buttonBox = buttonPath.getBBox()
    const side = Util.getMindNodeSide(item)
    const positon = this.getButtonPositon(keyShapeBox, buttonBox, side)
    const dotStyle = {
      fill: 'white',
      r: 1,
    }
    buttonGroup.addShape('circle', {
      attrs: {
        ...dotStyle,
        x: s,
        y: h / 2,
      },
      capture: false,
    })
    buttonGroup.addShape('circle', {
      attrs: {
        ...dotStyle,
        x: s * 2,
        y: h / 2,
      },
      capture: false,
    })
    buttonGroup.addShape('circle', {
      attrs: {
        ...dotStyle,
        x: s * 3,
        y: h / 2,
      },
      capture: false,
    })
    buttonPath.attr('lineAppendWidth', 20)
    buttonGroup.translate(positon.x, positon.y)
    buttonPath.isExpandedButton = true
    buttonPath.isButton = true
  },
  getButtonPositon(keyShapeBox, buttonBox, side) {
    if (side === 'right') {
      return {
        x: keyShapeBox.maxX + 2,
        y: keyShapeBox.maxY - (buttonBox.maxY - buttonBox.minY) / 2,
      }
    }

    return {
      x: keyShapeBox.minX - (buttonBox.maxX - buttonBox.minX) - 2,
      y: keyShapeBox.maxY - (buttonBox.maxY - buttonBox.minY) / 2,
    }
  },
  getLabel(item) {
    const model = item.getModel()
    return model.label
  },
  getPadding() {
    return [4, 8, 4, 8]
  },
  getSize(item) {
    const model = item.getModel()
    const group = item.getGraphicGroup()
    const size = model.size

    if (model.size) {
      if (Util.isArray(size)) {
        return size
      }
      if (Util.isNumber(size)) {
        return [size, size]
      }
    }

    const label = group.findByClass('label')[0]
    const padding = this.getPadding(item)
    const labelBox = label.getBBox()
    return [labelBox.width + padding[1] + padding[3], labelBox.height + padding[0] + padding[2]]
  },
  getPath(item) {
    const size = this.getSize(item)
    const style = this.getStyle(item)
    return Util.getRectPath(-size[0] / 2, -size[1] / 2 + this.dy, size[0], size[1], style.radius)
  },
  drawLabel(item) {
    const group = item.getGraphicGroup()
    let label = this.getLabel(item)
    const labelStyle = this.getLabelStyle(item)

    if (!label) {
      label = ' '
    }

    const attrs = Util.mix(true, {}, defaultLabelStyle, labelStyle, {
      x: 0,
      y: 0,
    })

    if (!Util.isObject(label)) {
      attrs.text = label
    } else {
      Util.mix(attrs, label)
    }

    const shape = group.addShape('text', {
      class: 'label',
      attrs,
    })
    this.adjustLabelText(shape)
    this.adjustLabelPosition(item, shape)
    return shape
  },
  adjustLabelText(labelShape) {
    let labelText = labelShape.attr('text')
    const labelBox = labelShape.getBBox()

    if (labelBox.maxX - labelBox.minX > 400) {
      const font = labelShape.attr('font')
      labelText = Util.getLabelTextByTextLineWidth(labelText, font)
      labelShape.attr('text', labelText)
    }
  },
  adjustLabelPosition(item, labelShape) {
    const size = this.getSize(item)
    const padding = this.getPadding()
    const width = size[0]
    const labelBox = labelShape.getBBox()
    labelShape.attr({
      x: -width / 2 + padding[3],
      y: -labelBox.height / 2 + this.dy, // - padding[2]/2

    })
  },
  getLabelStyle()
  /* item */ {
    return {
      fill: 'rgba(38,38,38,0.85)',
      lineHeight: 18,
      fontSize: 12,
    }
  },
  getStyle()
  /* item */ {
    return {
      fill: '#ccc',
      fillOpacity: 0,
      radius: 4,
      lineWidth: 2,
    }
  },
  getActivedStyle()
  /* item */ {
    return {
      stroke: '#44C0FF',
      lineWidth: 2,
    }
  },
  getSelectedStyle()
  /* item */ {
    return {
      stroke: '#1AA7EE',
      lineWidth: 2,
    }
  },
  anchor: [[0, 1], [1, 1]],
})
