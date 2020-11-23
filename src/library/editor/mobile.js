import React from 'react'
import lang_en from '../lang/en'
import lang_cn from '../lang/zh-cn'
import Editor from './editor'
import helper from '../helper'
import Toolbar from '../toolbar'

const language = {
  en: lang_en,
  'zh-cn': lang_cn,
}

class MobileEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      engine: null,
      toolbar: props.toolbar,
    }
    this.locale = language[props.lang]
    this.contentEditor = React.createRef()
  }

  onEngineReady = (engine) => {
    this.engine = engine
    this.setState(
      {
        engine,
      },
      () => {
        const { image, file } = engine.options
        helper(engine, 'uploader', {
          actions: {
            image: image ? image.action : '',
            file: file ? file.action : '',
          },
        })
        helper(engine, 'iframeHelper')

        this.props.onLoad(engine)
      },
    )
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { engine, toolbar } = this.state
    const { type, header } = this.props
    const toolbarOptions = {
      type,
      engine,
      toolbar,
      locale: this.locale,
    }

    const editorOptions = (function (props) {
      const options = { ...props }
      const { onLoad, header, toolbar, ...editorOptions } = options
      return editorOptions
    }(this.props))

    return (
      <div className="lake-editor lake-mobile-editor">
        {engine && (
          <Toolbar {...({ hasMore: true, ...toolbarOptions, mobile: true })} />
        )}
        <div className="lake-content-editor" ref={this.contentEditor}>
          <div className="lake-content-editor-extra">{header}</div>
          <Editor
            {...({
              onEngineReady: this.onEngineReady,
              ...editorOptions,
            })}
          />
        </div>
      </div>
    )
  }
}

MobileEditor.defaultProps = {
  lang: 'zh-cn',
  type: 'mobile',
  tabIndex: 2,
  toolbar: [
    ['heading'],
    ['bold'],
    ['indent'],
    ['alignment'],
    ['list'],
    ['tasklist'],
    ['image'],
    ['quote'],
  ],
  markdown: {
    action: '/api/document/convert',
    items: [
      'bold',
      'strikethrough',
      'orderedlist',
      'unorderedlist',
      'tasklist',
      'checkedtasklist',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'quote',
      'link',
    ],
  },
  save: false,
  search: false,
  sectionselect: false,
  heading: {
    showAnchor: false,
  },
  onChange: () => {
  },
  onLoad: () => {
  },
  onBeforeRenderImage: (url) => {
    return url
  },
}
export default MobileEditor
