import Engine from '@hicooper/doc-engine'
import { loadImage } from '../../utils/dom'

const URL = window.URL || window.webkitURL

class ImageCompress {
  constructor(options) {
    this.options = {
      ratio: 0.8,
      isOverSize: () => {
      },
      ...options,
    }
  }

  _canvasToFile(canvas, name) {
    const dataURI = canvas.toDataURL('image/jpeg', this.options.ratio)
    const file = Engine.ImageUtils.dataURIToFile(dataURI)
    return new File([file], name)
  }

  async compress(files) {
    const { isOverSize } = this.options
    const fileArray = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (isOverSize(file)) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const image = await loadImage(URL.createObjectURL(file))
        canvas.width = image.width
        canvas.height = image.height
        canvas.style.width = `${image.width}px`
        canvas.style.height = `${image.height}px`
        context.drawImage(image, 0, 0, image.width, image.height)
        fileArray.push(this._canvasToFile(canvas, file.name))
      } else {
        fileArray.push(file)
      }
    }
    return fileArray
  }
}

export default ImageCompress
