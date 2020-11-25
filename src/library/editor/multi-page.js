import React from 'react'
import { Dropdown, Menu } from 'antd'
import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons'
import helper from '../helper'
import Engine from './engine'
import Dialog from '../dialog'
import Toolbar from '../toolbar'
import Editor from './editor'

class MultiPageEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toolbar: props.toolbar,
      engine: null,
      activePageNum: 1,
      pageListData: this.props.pageList || [{
        pageName: '无标题',
        pageNum: 1,
        row: false,
        content: '<p><br /></p>',
      }],
    }
    this.pageEngine = {}
  }

  onEngineReady(engine, pageNum) {
    const { activePageNum } = this.state
    if (activePageNum === pageNum) {
      this.setState({
        engine,
      })
    }
    this.pageEngine[pageNum] = engine
    helper(engine, 'search', {
      target: Engine.$(`.activate-page-${pageNum}`)[0],
    })

    helper(engine, 'translate')
    const { image, file } = engine.options
    helper(engine, 'uploader', {
      actions: {
        image: image ? image.action : '',
        file: file ? file.action : '',
      },
    })

    helper(engine, 'iframeHelper')

    engine.on('change', this.engineChange)
    engine.on('select', this.engineSelect)

    engine.on('maximizesection', () => {
      engine.container.closest('.lake-editor')
        .addClass('lake-maximize-section')
    })

    engine.on('restoresection', () => {
      engine.container.closest('.lake-editor')
        .removeClass('lake-maximize-section')
    })
  }

  engineSelect = () => {
    // console.log('select')
  }

  engineChange = async () => {
    const { engine, activePageNum, pageListData } = this.state
    const currentPage = pageListData.find((s) => s.pageNum === activePageNum)
    let pageContentHeight = 0
    const overflowNodes = []
    let needSkipToNextPage = false
    for (let i = 0; i < engine.container[0].childNodes.length;) {
      const node = engine.container[0].childNodes[i]
      pageContentHeight += node.offsetHeight
      const maxHeight = currentPage.row ? 542 : 919
      if (pageContentHeight > maxHeight) {
        if (needSkipToNextPage || node.offsetHeight/2 > (maxHeight - (pageContentHeight - node.offsetHeight))) {
          console.log('分页')
          // 一个node节点一半超过当前页 才分页
          overflowNodes.push(node)
          engine.container[0].removeChild(node)
        } else {
          i++
        }
        // 无论当前节点是否分页，下一个节点一定开始分页
        needSkipToNextPage = true
      } else {
        i++
      }
    }
    if (needSkipToNextPage) {
      let nextPageContent = ''
      if (overflowNodes.length) {
        overflowNodes.forEach((s) => nextPageContent += s.outerHTML)
      } else {
        nextPageContent = '<p><br /></p>'
      }
      let createNewPage = false
      const nextPageNum = activePageNum + 1
      if (activePageNum === pageListData.length) {
        pageListData.push({
          pageName: '',
          pageNum: nextPageNum,
          row: false,
          content: nextPageContent,
        })
        await this.setState({
          pageListData,
        })
        createNewPage = true
      }

      // 聚焦到下一页开始
      setTimeout(() => {
        const nextEngine = this.pageEngine[nextPageNum]
        if (!createNewPage) {
          // 将溢出的节点插到下一页开始，
          nextEngine.setValue(nextPageContent + nextEngine.getValue())
        }
        this.setState({
          engine: nextEngine,
          activePageNum: nextPageNum,
        })
        // 如果光标在最后一个节点，聚焦到下一页开始
        nextEngine.focusToStart()
      }, 0)
    }
  }

  handleScroll = () => {
    if (this.lakeFullEditorWrapperContent[0].scrollTop > 16) {
      Engine.$('.lake-toolbar')
        .addClass('lake-toolbar-active')
    } else {
      Engine.$('.lake-toolbar')
        .removeClass('lake-toolbar-active')
    }
  }

  componentDidMount() {
    this.bindScrollEvent()
  }

  componentWillUnmount() {
    Engine.$(document.body)
      .css({
        'overscroll-behavior-x': '',
        'overflow-y': '',
      })
  }

  bindScrollEvent = () => {
    this.lakeFullEditorWrapperContent = Engine.$('.lake-max-editor-wrapper-content')
    this.lakeFullEditorWrapperContent.on('scroll', this.handleScroll)
    Engine.$(document.body)
      .css({
        'overscroll-behavior-x': 'none',
        'overflow-y': 'hidden',
      })
  }

  setPageFormat = (page, type) => {
    page.row = type === 'row'
    const { pageListData } = this.state
    this.setState({ pageListData })
  }

  editorClick = async (pageNum, e) => {
    e.preventDefault()
    const { activePageNum, engine } = this.state
    if (activePageNum !== pageNum) {
      engine.change.activateSection(engine.container[0], 'click')
      await this.setState({
        engine: this.pageEngine[pageNum],
        activePageNum: pageNum,
      })
    }
  }

  render() {
    const { engine, toolbar, pageListData } = this.state
    const { type, header } = this.props
    const toolbarOptions = {
      type,
      engine,
      toolbar,
    }

    const editorOptions = () => {
      const options = { ...this.props }
      const { onLoad, header, type, toolbar, ...editorOptions } = options
      return editorOptions
    }

    const menu = (page) => {
      return (
        <Menu className="page-setting-menu">
          <Menu.ItemGroup key="0" title="页面版式">
            <Menu.Item selectedKeys="0-1" onClick={() => this.setPageFormat(page, 'col')}>
              {
                !page.row && (<div className="checked"><CheckOutlined /></div>)
              }
              <div className="option-item">
                <p className="title">纵向</p>
                <p className="desc">适合文本显示</p>
              </div>
            </Menu.Item>
            <Menu.Item selectedKeys="0-2" onClick={() => this.setPageFormat(page, 'row')}>
              {
                page.row && (<div className="checked"><CheckOutlined /></div>)
              }
              <div className="option-item">
                <p className="title">横向</p>
                <p className="desc">适合超宽表格</p>
              </div>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.Divider />
          <Menu.ItemGroup key="1" title="排版风格">
            <Menu.Item selectedKeys="1-1">
              <div className="checked"><CheckOutlined /></div>
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
    return (
      <section className="lake-editor lake-multi-page-editor">
        <div className="lake-multi-page-editor-wrapper">
          {engine && <Dialog engine={engine} />}
          {engine && <Toolbar {...({ hasMore: false, ...toolbarOptions })} />}
          <main className="lake-multi-page-editor-wrapper-content">
            <div className="lake-multi-page-editor-content">
              <div className="lake-content-editor">
                {
                  pageListData.map((page, index) => {
                    let className = `page-wrapper show-return-tag activate-page-${page.pageNum}`
                    if (page.row) {
                      className += ' lake-typography-a4_row'
                    } else {
                      className += ' lake-typography-a4'
                    }
                    return (
                      <div className={className} key={index} onClick={(e) => this.editorClick(page.pageNum, e)}>
                        {
                          header && (
                            <div className="lake-content-editor-extra">
                              <Dropdown overlay={menu(page)}
                                trigger={['click']}
                                className="drop-menu"
                              >
                                <span className="ant-dropdown-link">
                                  页面设置
                                  <CaretDownOutlined />
                                </span>
                              </Dropdown>
                            </div>
                          )
                        }
                        <div className="left-top" />
                        <div className="right-top" />
                        <div className="left-btn" />
                        <div className="right-btn" />
                        <div className="btn-page-num">
                          <span>{page.pageNum}</span>
                        </div>
                        <Editor
                          {...({ onEngineReady: (engine) => this.onEngineReady(engine, page.pageNum), ...editorOptions() })}
                          value={page.content}
                          defaultValue={page.content}
                        />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </main>
        </div>
      </section>
    )
  }
}

MultiPageEditor.defaultProps = {
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
  ],
  onLoad() {
  },
  ot: true
}
export default MultiPageEditor
