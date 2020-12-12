import React from 'react'
import lang_en from '../lang/en'
import lang_cn from '../lang/zh-cn'
import helper from '../helper'
import Engine from './engine'
import Dialog from '../dialog'
import Toolbar from '../toolbar'
import Sidebar from '../sidebar'
import Editor from './editor'
import { Dropdown, Menu } from 'antd'
import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons'

const language = {
  en: lang_en,
  'zh-cn': lang_cn,
}

class FullEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      engine: null,
      toolbar: props.toolbar,
      row: false
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
        helper(engine, 'search', {
          target: this.contentEditor.current,
        })

        helper(engine, 'translate')
        const {
          image,
          file,
        } = engine.options
        helper(engine, 'uploader', {
          actions: {
            image: image ? image.action : '',
            file: file ? file.action : '',
          },
        })

        helper(engine, 'iframeHelper')

        this.bindScrollEvent()

        engine.on('maximizesection', () => {
          engine.container.closest('.lake-editor')
            .addClass('lake-maximize-section')
        })

        engine.on('restoresection', () => {
          engine.container.closest('.lake-editor')
            .removeClass('lake-maximize-section')
        })

        this.props.onLoad(engine)
      },
    )
  }

  handleScroll = () => {
    if (this.lakeFullEditorWrapperContent[0].scrollTop > 16) {
      this.lakeToolbar.addClass('lake-toolbar-active')
    } else {
      this.lakeToolbar.removeClass('lake-toolbar-active')
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    Engine.$(document.body)
      .css({
        'overscroll-behavior-x': '',
        'overflow-y': '',
      })
  }

  bindScrollEvent() {
    this.lakeToolbar = Engine.$('.lake-toolbar')
    this.lakeFullEditorWrapperContent = Engine.$('.lake-max-editor-wrapper-content')
    this.lakeFullEditorWrapperContent.on('scroll', this.handleScroll)
    Engine.$(document.body)
      .css({
        'overscroll-behavior-x': 'none',
        'overflow-y': 'hidden',
      })
  }

  setPageFormat = (val) => {
    this.setState({ row: val})
  }

  render() {
    const {
      engine,
      toolbar,
    } = this.state
    const {
      type,
      header,
    } = this.props
    const toolbarOptions = {
      type,
      engine,
      toolbar,
      locale: this.locale,
    }

    const editorOptions = () => {
      const options = { ...this.props }
      const {
        onLoad,
        header,
        type,
        toolbar,
        ...editorOptions
      } = options
      return editorOptions
    }

    const menu = () => {
      const { row } = this.state
      return (
        <Menu className="page-setting-menu">
          <Menu.ItemGroup key="0" title="页面版式">
            <Menu.Item selectedKeys="0-1" onClick={() => this.setPageFormat(false)}>
              {
                !row && (<div className="checked"><CheckOutlined/></div>)
              }
              <div className="option-item">
                <p className="title">纵向</p>
                <p className="desc">适合文本显示</p>
              </div>
            </Menu.Item>
            <Menu.Item selectedKeys="0-2" onClick={() => this.setPageFormat(true)}>
              {
                row && (<div className="checked"><CheckOutlined/></div>)
              }
              <div className="option-item">
                <p className="title">横向</p>
                <p className="desc">适合超宽表格</p>
              </div>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.Divider/>
          <Menu.ItemGroup key="1" title="排版风格">
            <Menu.Item selectedKeys="1-1">
              <div className="checked"><CheckOutlined/></div>
              <div className="option-item">
                <p className="title">经典优雅</p>
                <p className="desc">疏密有度</p>
              </div>
            </Menu.Item>
            <Menu.Item selectedKeys="1-2">
              <div className="option-item">
                <p className="title">传统紧凑</p>
                <p className="desc">排版紧密</p>
              </div>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      )
    }

    let className = 'lake-content-editor show-return-tag ';
    if (this.state.row) {
      className += ' lake-typography-a4_row'
    } else {
      className += ' lake-typography-a4'
    }

    return (
      <section className="lake-editor lake-max-editor">
        <div className="lake-max-editor-wrapper">
          {engine && <Dialog engine={engine}/>}
          {engine && <Toolbar {...({ hasMore: false, ...toolbarOptions })} />}
          <main className="lake-max-editor-wrapper-content">
            <div className="lake-max-editor-content">
              {engine && <Sidebar engine={engine} />}
              <div className={className} ref={this.contentEditor}>
                {
                  header && (
                    <div className="lake-content-editor-extra">
                      <Dropdown
                        overlay={menu()}
                        trigger={['click']}
                        className="drop-menu"
                      >
                        <span className="ant-dropdown-link">
                          页面设置
                          <CaretDownOutlined/>
                        </span>
                      </Dropdown>
                    </div>
                  )
                }
                <div className="left-top" />
                <div className="right-top" />
                <div className="left-btn" />
                <div className="right-btn" />
                <Editor
                  {...({
                    onEngineReady: this.onEngineReady,
                    ...editorOptions(),
                  })}
                />
              </div>
            </div>
          </main>
        </div>
      </section>
    )
  }
}

FullEditor.defaultProps = {
  lang: 'zh-cn',
  type: 'max',
  tabIndex: 2,
  toolbar: [
    ['section'],
    ['save', 'undo', 'redo', 'paintformat', 'removeformat'],
    ['heading', 'fontsize'],
    ['bold', 'italic', 'strikethrough', 'underline', 'moremark'],
    ['fontcolor', 'highlight'],
    ['alignment'],
    ['unorderedlist', 'orderedlist', 'tasklist', 'indent-list'],
    ['link', 'quote', 'hr'],
    ['search', 'toc'],
  ],
  onLoad() {
  },
}
export default FullEditor
