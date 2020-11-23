class TinyCanvas {
  constructor(config) {
    if (!config.container) throw new Error('please set a dom cantainer!')
    this.options = { container: null,
      limitHeight: 5e3,
      canvasCache: [],
      canvasCount: 0,
      ...config }
    config.container.style['line-height'] = '0px'
  }

  _removeCanvas() {
    this.options.canvasCache.forEach((item) => {
      item.parentElement.removeChild(item)
    })
    this.options.canvasCache = []
  }

  _getCanvas(index) {
    index = index > 0 ? index - 1 : index
    return this.options.canvasCache[index]
  }

  resize(width, height) {
    let {
      limitHeight,
      canvasCount,
      container,
      canvasCache,
    } = this.options
    const count = Math.ceil(height / limitHeight)
    if (count !== canvasCount) {
      this._removeCanvas()
      canvasCache = []
      for (let l = 0; l < count; l++) {
        const canvas = document.createElement('canvas')
        canvas.style['vertical-align'] = 'bottom'
        canvas.setAttribute('width', width)
        if (l === count - 1) {
          canvas.setAttribute('height', height % limitHeight)
        } else {
          canvas.setAttribute('height', limitHeight)
        }
        container.appendChild(canvas)
        canvasCache.push(canvas)
      }
      this.options.canvasCache = canvasCache
    } else {
      const lastCanvas = this._getCanvas(count)
      canvasCache.forEach((canvas) => {
        canvas.setAttribute('width', width)
      })
      if (lastCanvas) {
        lastCanvas.setAttribute('height', height % limitHeight)
      }
    }
  }

  _handleSingleRect(options) {
    const { x, y, index, width, height, callback } = options
    const { limitHeight } = this.options
    const canvas = this._getCanvas(index)
    if (canvas) {
      const context = canvas.getContext('2d')
      callback({
        x,
        y: y - limitHeight * (index - 1),
        width,
        height,
        context,
      })
    }
  }

  _drawRect(options) {
    const { x, y, fill, width, height, stroke } = options
    const callback = (opt) => {
      opt.context.fillStyle = fill === undefined ? '#FFEC3D' : fill
      opt.context.strokeStyle = stroke === undefined ? '#FFEC3D' : stroke
      opt.context.fillRect(opt.x, opt.y, opt.width, opt.height)
    }
    this._handleRect({
      x,
      y,
      width,
      height,
      callback,
    })
  }

  _handleRect(options) {
    const { x, y, width, height, callback } = options

    const { limitHeight } = this.options
    const min = {
      x,
      y,
    }
    const max = {
      x: x + width,
      y: y + height,
    }
    const minCount = Math.ceil(min.y / limitHeight)
    const maxCount = Math.ceil(max.y / limitHeight)
    if (minCount === maxCount) {
      this._handleSingleRect({ ...min,
        index: minCount,
        width,
        height,
        callback })
    } else {
      this._handleSingleRect({ ...min,
        index: minCount,
        width,
        height,
        callback })

      this._handleSingleRect({ ...min,
        index: maxCount,
        width,
        height,
        callback })
    }
  }

  getImageData(options) {
    const { x, y, width, height } = options
    const { limitHeight } = this.options
    const count = Math.ceil(y / limitHeight)
    const lastCanvas = this._getCanvas(count)
    const context = lastCanvas.getContext('2d')
    return context.getImageData(x, y, width, height)
  }

  draw(name, options) {
    this[`_draw${name}`](options)
  }

  clearRect(options) {
    const { x, y, width, height } = options
    const callback = (opt) => {
      opt.context.clearRect(opt.x, opt.y, opt.width, opt.height)
    }
    this._handleRect({
      x,
      y,
      width,
      height,
      callback,
    })
  }

  clear() {
    this.options.canvasCache.forEach((canvas) => {
      const context = canvas.getContext('2d')
      const width = Number(canvas.getAttribute('width'))
      const height = Number(canvas.getAttribute('height'))
      context.clearRect(0, 0, width, height)
    })
  }

  destroy() {
    this._removeCanvas()
  }
}

export default TinyCanvas
