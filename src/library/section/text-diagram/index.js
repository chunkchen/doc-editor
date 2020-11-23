import React from 'react'
import ReactDOM from 'react-dom'
import Engine from '@hicooper/doc-engine'
import TextDiagramEditor from './text-diagram-editor'
import TextDiagramViewer from './text-diagram-render'
import { preview } from '../../utils/image-generator'
import SectionBase from '../base'
import constants from './constants'
import './index.css'

const { EDITOR_LAYOUT, TEXT_DIAGRAM_TYPES } = constants
const { $ } = Engine
const template = () => {
  return '<div class="lake-text-diagram lake-text-diagram-root"></div>'
}

/**
 * 文本图Section
 */
class TextDiagram extends SectionBase {
  constructor(engine, contentView) {
    super()

    this.focusToCodeEditor = () => {
      if (this.editor) {
        this.editor.focus()
      }
    }

    this.onEditorChange = (code) => {
      if (code !== this.value.code) {
        this.value.code = code
        // 编辑区域有变更时，清除 src 属性
        this.value.src = null
      }
    }

    this.changeDiagramType = (type) => {
      this.diagramType = type
      this.prevValue = {
        src: null,
        code: null,
      }
    }

    this.onEditorBlur = () => {
      // 激活工具栏
      this.engine.toolbar.disable(false)
      // 保存代码内容
      this.saveDiagram()
    }

    this.onEditorFocus = () => {
      // debug('editor focus');
      // 置灰工具栏
      this.engine.toolbar.disable(true)
    }

    this.needConvertToImage = () => {
      // 有用户输入时，没有 src 时不需要重新生成图片
      if (this.value.code) {
        return !this.value.src
      }
      // 没有用户输入时，判断 prevValue 是否需要生成 src，兼容断网等情况下导致的 src 生成失败
      return this.prevValue.code && !this.prevValue.src
    }

    this.saveDiagram = () => {
      // tests 中执行 engine.destroy 时会触发 Error: Uncaught TypeError: Cannot read property 'code' of undefined
      // 疑似执行过快导致相关回调执行时 value 已经销毁了，故先判断 value 是否存在
      if (this.value && this.value.code !== null) {
        this.setValue({
          code: this.value.code,
          url: this.value.url,
          type: this.diagramType,
        })
      }
    }

    this.genImage = (code) => {
      return preview(this.diagramType, code)
        .then((res) => {
          // 图片成功生成，设置 src 属性
          const src = `data:image/svg+xml,${
            encodeURIComponent(res.svg)
              .replace(/'/g, '%27')
              .replace(/"/g, '%22')}`
          if (res.success) {
            this.value.src = src
          }
          this.saveDiagram()
          this.prevValue = this.value
          this.engine.history.update(true)
        })
    }

    this.onBeforeSave = () => {
      // 有编辑过并且没有生成 src 时生成图片
      if (this.value.code && !this.value.src) {
        return this.genImage(this.value.code)
      }
      return null
    }

    this.getDiagramType = (value) => {
      return this.name === 'diagram' ? value.type || TEXT_DIAGRAM_TYPES.PUML : this.name
    }

    this.engine = engine
    this.contentView = contentView // 编辑状态中的 section 数据
    this.value = {
      // 文本图对应的图片地址
      src: null,
      // 文本图源代码
      code: null,
    }
    // section 正式生效的数据
    this.prevValue = {
      src: null,
      code: null,
    }
    // 根节点，React 的宿主节点
    this.root = null // 图的类别
    this.diagramType = null // 编辑区域 Editor 实例
    this.editor = null
  }

  embedToolbar() {
    const config = (this.engine ? this.engine.options.diagram : this.contentView.options.diagram) || {}
    const embed = [
      {
        type: 'dnd',
      },
      {
        type: 'maximize',
      },
      {
        type: 'separator',
      },
      {
        type: 'copy',
      },
      {
        type: 'delete',
      },
    ]
    if (Array.isArray(config.embed)) {
      return config.embed
    }
    if (typeof config.embed === 'object') {
      const embedArray = []
      embed.forEach((item) => {
        if (config.embed[item.type] !== false) {
          embedArray.push(item)
        }
      })
      return embedArray
    }
    return embed
  }

  destroy() {
    this.engine.asyncEvent.off('save:before', this.onBeforeSave)
  }

  // 最大化
  maximize() {
    if (this.state.readonly) return
    this.editor.switchLayout(EDITOR_LAYOUT.TWO_COLUMN)
    this.editor.doPreview()
    this.engine.toolbar.hide()
  }

  // 还原
  restore() {
    if (this.state.readonly) return
    this.editor.switchLayout(EDITOR_LAYOUT.DEFAULT)
    this.engine.toolbar.show()
  }

  activate() {
    if (this.state.readonly) return
    if (this.resizeController) {
      this.resizeController.show()
    }
  }

  unactivate() {
    this.saveDiagram()
    this.engine.history.save()
    if (this.needConvertToImage()) {
      this.genImage(this.value.code)
    }
    if (this.state.readonly) return
    if (this.resizeController) {
      this.resizeController.hide()
    }
  }

  didInsert() {
    window.setTimeout(() => {
      this.focusToCodeEditor()
    }, 10)
  }

  /**
   * 渲染编辑器
   * @param {object} value section 的取值
   */
  renderEditor(value) {
    ReactDOM.render(
      <TextDiagramEditor
        canChangeType={this.name === 'diagram'}
        type={this.diagramType}
        code={value.code || ''}
        onFocus={this.onEditorFocus}
        onBlur={this.onEditorBlur}
        onChange={this.onEditorChange}
        onDiagramTypeChange={this.changeDiagramType}
        onBeforeRenderImage={this.onBeforeRenderImage}
        isMaximize={() => {
          return this.state.maximize
        }}
        onLoad={(ref) => {
          this.editor = ref.editor
          this.container.on('click', (e) => {
            const hasSelect = $(e.target)
              .closest('.ant-select')
            if (!hasSelect || hasSelect.length === 0) this.focusToCodeEditor()
          })
        }}
        locale={this.locale}
      />,
      this.root[0],
      () => {
        const diagram = this.root.find('.lake-text-diagram-editor')
        const { height } = this.value
        this.addResizeController(diagram)
        if (height) {
          diagram.css('height', `${height}px`)
        }
      },
    )
  }

  /**
   * 渲染阅读界面
   * @param {object} value section 的取值
   */
  renderViewer(value) {
    ReactDOM.render(
      <div className="lake-text-diagram-viewer">
        <TextDiagramViewer
          type={this.diagramType}
          code={value.code}
          onBeforeRenderImage={this.onBeforeRenderImage}
          src={value.src}
        />
      </div>,
      this.root[0],
    )
  }

  render(container, value) {
    if (value) {
      this.prevValue = value
    }

    container.append(template())
    this.root = this.container.find('.lake-text-diagram-root')
    // section name 即为图的类别
    this.diagramType = this.getDiagramType(value)
    if (this.engine) {
      this.locale = this.engine.locale.textDiagram
      // 执行 save:before 时保存内容，保证输入内容能被及时存储
      this.engine.on('save:before', this.saveDiagram)
      // 异步执行 save:before 执行生成图片操作
      this.engine.asyncEvent.on('save:before', this.onBeforeSave)
      this.renderEditor(this.prevValue)
    } else {
      this.renderViewer(this.prevValue)
    }
  }
}

TextDiagram.type = 'block'
TextDiagram.uid = true
export default TextDiagram
