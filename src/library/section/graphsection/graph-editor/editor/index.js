import Base from '../base'
import Util from '../util'
import Command from '../command'

class Editor extends Base {
  getDefaultCfg() {
    return {
      _components: [],
      _command: {
        zoomDelta: 0.1,
        // 缩放步长
        queue: [],
        // 回退堆栈
        current: 0,
        // 不是索引，是第 N 个数组元素
        clipboard: [], // 剪贴板
      },
    }
  }

  commandEnable(name) {
    return Command.enable(name, this)
  }

  _getComponentsBy(callback) {
    const components = this.get('_components')
    return components.filter(callback)
  }

  executeCommand(param, cfg) {
    if (Util.isString(param)) {
      Command.execute(param, this, cfg)
    } else {
      Command.execute('common', this, {
        method: param,
      }, cfg)
    }
  }

  _afterAddPage(page) {
    this._bindShortcut(page)
  }

  getComponentsByType(type) {
    return this._getComponentsBy((component) => {
      return component.type === type
    })
  }

  /**
   * 获取激活的页面
   * @return  {Page} page
   */
  getCurrentPage() {
    const pages = this.getComponentsByType('page')
    let rst
    pages.every((page) => {
      if (page.isActived) {
        rst = page
        return false
      }
      return true
    })

    if (!rst) {
      rst = pages[0]
    }

    return rst
  }

  // 判断该快捷键下命令是否执行
  _shortcutEnable(command, domEvent) {
    const shortcutCodes = command.shortcutCodes
    const key = Util.getKeyboradKey(domEvent)
    let bool = false
    for (let i = 0; i < shortcutCodes.length; i++) {
      const shortcutCode = shortcutCodes[i]
      if (Util.isArray(shortcutCode)) {
        const l = shortcutCode.length
        let subBool = true

        for (let j = 0; j < l - 1; j++) {
          if (!domEvent[shortcutCode[j]]) {
            subBool = false
            break
          }
        }

        if ((shortcutCode[l - 1] === key || shortcutCode[l - 1] === Util.lowerFirst(key)) && subBool) {
          bool = true
        }
      } else if (shortcutCode === key) {
        bool = true
      }

      if (bool) {
        break
      }
    }
    return bool
  }

  /**
   * 绑定快捷键
   * @param  {object} page page or array
   */
  _bindShortcut(page) {
    const shortcut = page.get('shortcut')
    const graph = page.getGraph()
    graph.on('keydown', (ev) => {
      const domEvent = ev.domEvent
      domEvent.preventDefault()
      domEvent.stopPropagation()
      const commandList = Command.list.filter((item) => {
        return item.shortcutCodes && shortcut[item.name]
      })
      for (let i = 0; i < commandList.length; i++) {
        const command = commandList[i]
        if (this._shortcutEnable(command, domEvent)) {
          this.executeCommand(command.name)
          return false
        }
      }
    })
  }

  add(component) {
    const components = this.get('_components')
    const type = Util.upperFirst(component.type)
    component.editor = this
    this[`_beforeAdd${type}`] && this[`_beforeAdd${type}`](component)
    components.push(component)
    this[`_afterAdd${type}`] && this[`_afterAdd${type}`](component)
  }

  destroy() {
    const components = this.get('_components')
    components.forEach((component) => {
      component.destroy()
    })
    super.destroy.call(this)
  }
}

export default Editor
