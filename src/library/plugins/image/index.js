import Engine from '@hicooper/doc-engine'
import { post } from '../../network/request'
import { isBase64Image, isRemoteImage } from '../../utils/string'
import ImageCompress from './compress'

// 上传图片 URL
function uploadUrl(sectionRoot, url) {
  const locale = this.locale.image || {}
  const imageConfig = this.options.image || {}
  const uploadAction = imageConfig.action || ''
  post(uploadAction, {
    url,
  })
    .then((res) => {
      const data = res.data
      const params = {
        status: 'done',
        src: data.url,
      }
      // 如果返回了大小，也更新一下
      if (data.size) {
        params.size = data.size
      }

      if (data.width) {
        params.width = data.width
      }

      if (data.height) {
        params.height = data.height
      }

      Engine.UploadUtils.updateSection(this, sectionRoot, params, true)
    })
    .catch(() => {
      Engine.UploadUtils.updateSection(this, sectionRoot, {
        status: 'error',
        message: locale.copyFailedTips,
      }, true)
    })
}

// 自己页面
function fromSelfPage(node) {
  const value = this.section.getValue(node)
  const src = value.src || ''

  if (!isRemoteImage(src)) {
    if (value.status === 'uploading') {
      delete value.status
      this.section.setValue(node, value)
    }
    return
  }

  value.status = 'uploading'
  value.percent = 0
  this.section.replaceNode(node, 'image', value)
}

// 查看页面
function fromView(node) {
  let linkNode
  let linkUrl

  if (node.name === 'a') {
    linkUrl = node.attr('href')
    linkNode = node
    node = linkNode.find('[data-type=image]')
  }

  const img = node.find('img')
  const src = img.attr('src')
  let width = node.attr('data-width') || img.css('width') || img.attr('width') || ''
  let height = node.attr('data-height') || img.css('height') || img.attr('height') || ''

  if (!/%/.test(width)) {
    width = parseInt(width, 10)
  }

  if (!/%/.test(height)) {
    height = parseInt(height, 10)
  }

  const display = node.attr('data-display')
  const align = node.attr('data-align')
  const value = {
    src,
    display,
    align,
  }

  if (width) {
    value.width = width
  }

  if (height) {
    value.height = height
  }

  if (linkUrl !== undefined) {
    value.link = linkUrl
  }

  if (isBase64Image(src) || isRemoteImage(src)) {
    value.status = 'uploading'
    value.percent = 0
  }
  this.section.replaceNode(linkNode || node, 'image', value)
}

// 普通页面
function fromOtherPage(node) {
  let linkNode
  let linkUrl

  if (node.name === 'a') {
    linkUrl = node.attr('href')
    linkNode = node
    node = linkNode.find('img')
  }

  const src = node.attr('src')
  let width = node.css('width') || node.attr('width') || ''
  let height = node.css('height') || node.attr('height') || ''

  if (!/%/.test(width)) {
    width = parseInt(width, 10)
  }

  if (!/%/.test(height)) {
    height = parseInt(height, 10)
  }

  const value = {
    src,
  }

  if (width) {
    value.width = width
  }

  if (height) {
    value.height = height
  }

  if (linkUrl !== undefined) {
    value.link = linkUrl
  }

  if (isBase64Image(src) || isRemoteImage(src)) {
    value.status = 'uploading'
    value.percent = 0
  }
  this.section.replaceNode(linkNode || node, 'image', value)
}

function handleKeydownEnter(e) {
  const range = this.change.getRange()
  if (!range.collapsed) {
    return
  }
  const block = Engine.ChangeUtils.getClosestBlock(range.startContainer)
  if (block.name !== 'p') {
    return
  }
  const chars = Engine.ChangeUtils.getBlockLeftText(block, range) // ![](url)
  // ![name|center|250x200](url)
  // ![|center](url)

  const match = /^!\[([^\]]{0,})\\]\(([http|https]?:\/\/[^\\)]{5,})\)$/.exec(chars)
  if (!match) return
  e.preventDefault()
  Engine.ChangeUtils.removeBlockLeftText(block, range)
  this.history.save()
  const splits = match[1].split('|')
  const src = match[2]
  const value = {
    src,
    name: splits[0],
    progress: {
      percent: 0,
    },
  }
  const alignment = splits[1]

  if (alignment === 'center' || alignment === 'right') {
    this.command.execute('alignment', alignment)
  }
  if (!isRemoteImage(src)) {
    value.status = 'done'
    delete value.progress
    this.change.insertSection('image', value)
    return
  }
  const sectionRoot = Engine.UploadUtils.insertSection(this, 'image', value)
  uploadUrl.call(this, sectionRoot, src)
}

export {
  handleKeydownEnter,
}
const imageCompress = new ImageCompress({
  isOverSize: (file) => {
    const ext = typeof file.ext === 'string' ? file.ext.toLowerCase() : undefined
    return (ext === 'jpg' || ext === 'jpeg') && !Engine.UploadUtils.isSizeLimit('image', file.size)
  },
})
export default {
  initialize() {
    // 拖拽上传图片
    this.on('drop:files', (files) => {
      if (this.uploader.post('image', files)) return false
    })
    // 上传粘贴板里的图片
    this.on('paste:files', (files) => {
      debugger
      imageCompress.compress(files)
        .then((files) => {
          this.uploader.post('image', files, {
            onBeforeInsertSection: (file, options) => {
              if (!file.ext) {
                options.scaleByPixelRatio = true
              }
            },
          })
        })
    })

    // 转换粘贴过来的图片
    this.on('paste:schema', (schema) => {
      schema.add({
        p: {
          'data-type': '*',
          'data-src': '*',
          'data-align': '*',
          'data-display': '*',
          'data-width': '*',
          'data-height': '*',
        },
      })
    })
    this.on('paste:each', (node) => {
      // 自己页面
      if (node.isSection() && node.attr('data-ready-section') === 'image') {
        fromSelfPage.call(this, node)
        return
      }
      // 阅读页面
      if (node.attr('data-type') === 'image' && node.find('img').length > 0) {
        fromView.call(this, node)
        return
      }
      // 阅读页面，带链接
      if (node.name === 'a' && node.find('[data-type=image]').length > 0 && node.find('img').length > 0) {
        fromView.call(this, node)
        return
      }
      // 外部页面，带链接
      if (node.name === 'a' && node.find('img').length > 0) {
        fromOtherPage.call(this, node)
        return
      }
      // 外部页面，纯图片
      if (node.name === 'img' && node.attr('src')) {
        fromOtherPage.call(this, node)
      }
    })
    this.on('paste:after', () => {
      // 转存 base64 图片、第三方图片
      const options = this.options.image || {}
      this.container.find('[data-section-key=image]')
        .each((node, key) => {
          const sectionRoot = Engine.$(node)
          const component = this.section.getComponent(sectionRoot)
          const value = component.value
          if (value.status !== 'uploading') {
            return
          }

          const src = component.imageNode.src || ''
          // 转存 base64 图片

          if (isBase64Image(src)) {
            const file = Engine.ImageUtils.dataURIToFile(src)
            const ext = Engine.UploadUtils.getFileExtname(file)
            const name = ext ? 'image.'.concat(ext) : 'image'
            const fileObject = new File([file], name)
            component.value = {
              status: 'uploading',
              src,
              name,
              size: file.size,
              type: file.type,
              percent: 0,
            }
            this.section.updateNode(sectionRoot, component)
            fileObject.uid = this.uploader.getUid(key)
            this.uploader.addUploadingSection(fileObject.uid, sectionRoot)
            this.uploader.post('image', [fileObject])
            return
          }
          // 转存第三方图片
          if (options.domain) {
            options.domain.forEach((domain) => {
              if (src.indexOf(domain) > -1) {

              }
            })
          }
          if (isRemoteImage(src)) {
            this.section.updateNode(sectionRoot, component)
            uploadUrl.call(this, sectionRoot, src)
          }
        })
    })
    // markdown 快捷方式
    this.on('keydown:enter', (e) => {
      handleKeydownEnter.call(this, e)
    })
  },
}
