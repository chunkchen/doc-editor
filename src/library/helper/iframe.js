class IFrame {
  constructor(cfg) {
    this.options = {
      limit: 100,
      ...cfg,
    }
    this.iframeItems = []
  }

  add(item) {
    if (this.canAdd()) {
      this.iframeItems.push(item)
      return true
    }
    console.warn('can not add embed section more than '.concat(this.options.limit))
    return false
  }

  setSrc(iframe, src, isLozad) {
    if (isLozad) {
      const lozad = window.lozad_observer
      iframe.addClass('lozad')
      iframe.attr('data-src', src)
      if (lozad) {
        lozad.observe()
      }
    } else {
      iframe.attr('src', src)
    }
  }

  render(cfg, delay, lozad) {
    const { iframe, url } = cfg
    if (delay) {
      setTimeout(() => {
        this.setSrc(iframe, url, lozad)
      }, delay)
    } else {
      this.setSrc(iframe, url, lozad)
    }
  }

  remove(item) {
    const index = this.iframeItems.indexOf(item)
    if (index > -1) {
      this.iframeItems.splice(index, 1)
    }
  }

  canAdd() {
    return this.iframeItems.length < this.options.limit
  }

  clear() {
    this.iframeItems = []
  }

  destroy() {
    this.options = undefined
    this.iframeItems = undefined
  }
}

export default IFrame
