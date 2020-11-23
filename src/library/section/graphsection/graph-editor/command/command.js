import Util from '../util'

const Command = {}

// 执行命令前存储快照
function snapShotexecute(editor) {
  const page = editor.getCurrentPage()
  this.snapShot = page.save()
  this.selectedItems = page.getSelected()
    .map((item) => {
      return item.id
    })
  if (this.method) {
    if (Util.isString(this.method)) {
      page[this.method]()
    } else {
      this.method(editor)
    }
  }
}

// 通过快照回滚
function snapShotBack(editor) {
  const page = editor.getCurrentPage()
  page.read(this.snapShot)
  page.setSelected(this.selectedItems, true)
}

// 变更模型判断是否可用
function changeModeEnable(editor) {
  const page = editor.getCurrentPage()
  return page.getMode() !== this.toMode
}

// 切换模式类执行方法
function changeModeexecute(editor) {
  const page = editor.getCurrentPage()
  this.fromMode = page.getMode()
  page.changeMode(this.toMode)
}

// 模式回滚
function changeModeBack(editor) {
  const page = editor.getCurrentPage()
  page.changeMode(this.fromMode)
}

Command.list = []
Command.registerCommand = function (name, cfg, extend) {
  if (Command[name]) {
    Util.mix(Command[name], cfg)
  } else {
    let command = {
      enable() {
        return true
      },
      init() {
      },
      execute: snapShotexecute,
      back: snapShotBack,
      shortcutCodes: undefined,
      executeTimes: 1,
      name,
      queue: true,
      ...cfg,
    }

    if (extend && Command[extend]) {
      command = Util.mix({}, Command[extend], cfg)
    }

    Command[name] = command
    Command.list.push(command)
  }
}

Command.execute = function (name, editor, obj) {
  const command = Util.mix(true, {}, Command[name], obj)
  const cfg = editor.get('_command')

  if (command.enable(editor)) {
    command.init()
    if (command.queue) {
      cfg.queue.splice(cfg.current, cfg.queue.length - cfg.current, command)
      cfg.current += 1
    }

    editor.emit('beforecommandexecute', {
      command,
    })
    command.execute(editor)
    editor.emit('aftercommandexecute', {
      command,
    })
  }
  return command
}

Command.enable = function (name, editor) {
  return Command[name].enable(editor)
}

Command.registerCommand('common', {
  back: snapShotBack,
})
// 添加命令
Command.registerCommand('add', {
  enable() {
    return this.type && this.addModel
  },
  execute(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const addItem = graph.add(this.type, this.addModel)

    if (this.executeTimes === 1) {
      this.addId = addItem.id
      this.page = page
    }
  },
  back() {
    const page = this.page
    const graph = page.getGraph()
    graph.remove(this.addId)
  },
})
// 更新命令
Command.registerCommand('update', {
  enable() {
    return this.itemId && this.updateModel
  },
  execute(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const item = graph.find(this.itemId)

    if (this.executeTimes === 1) {
      this.originModel = Util.getContrast(item.getModel(), this.updateModel)
      this.page = page
    }

    graph.update(item, this.updateModel)
  },
  back() {
    const page = this.page
    const graph = page.getGraph()
    const item = graph.find(this.itemId)
    graph.update(item, this.originModel)
  },
})
// 重做
Command.registerCommand('redo', {
  queue: false,
  enable(editor) {
    const cfg = editor.get('_command')
    const queue = cfg.queue
    return cfg.current < queue.length
  },
  execute(editor) {
    const cfg = editor.get('_command')
    const queue = cfg.queue
    const current = cfg.current
    queue[current].execute(editor)
    cfg.current += 1
  },
  shortcutCodes: [['metaKey', 'shiftKey', 'z'], ['ctrlKey', 'shiftKey', 'z']],
})
// 撤销
Command.registerCommand('undo', {
  queue: false,
  enable(editor) {
    const cfg = editor.get('_command')
    return cfg.current > 0
  },
  execute(editor) {
    const cfg = editor.get('_command')
    const queue = cfg.queue
    const current = cfg.current
    const command = queue[current - 1]
    command.executeTimes++
    command.back(editor)
    cfg.current -= 1
  },
  shortcutCodes: [['metaKey', 'z'], ['ctrlKey', 'z']],
})

Command.registerCommand('delete', {
  getDeleteItems(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    let items = this.itemIds ? this.itemIds.map((itemId) => {
      return graph.find(itemId)
    }) : page.getSelected()
    items = items.filter((item) => {
      return item.deleteable !== false
    })
    return items
  },
  enable(editor) {
    const items = this.getDeleteItems(editor)
    return items.length > 0
  },
  method(editor) {
    const page = editor.getCurrentPage()
    const items = this.getDeleteItems(editor)
    const graph = page.getGraph()
    page.emit('beforedelete', {
      items,
    })
    Util.each(items, (item) => {
      graph.remove(item)
    })
    page.emit('afterdelete', {
      items,
    })
    this.itemIds = items.map((item) => {
      return item.getModel().id
    })
  },
  back: snapShotBack,
  shortcutCodes: ['Delete', 'Backspace'],
})
Command.registerCommand('selectAll', {
  method(editor) {
    const page = editor.getCurrentPage()
    const graph = page.getGraph()
    const items = graph.getItems()
    items.forEach((item) => {
      page.setSelected(item, true)
    })
  },
  back: snapShotBack,
  shortcutCodes: [['metaKey', 'a']],
})
Command.registerCommand('clear', {
  enable(editor) {
    const page = editor.getCurrentPage()
    const items = page.getItems()
    return items.length > 0
  },
  method: 'clear',
  back: snapShotBack,
})
Command.registerCommand('multiSelect', {
  enable: changeModeEnable,
  toMode: 'multiSelect',
  execute: changeModeexecute,
  back: changeModeBack,
})
Command.registerCommand('move', {
  enable: changeModeEnable,
  toMode: 'move',
  execute: changeModeexecute,
  back: changeModeBack,
})

export default Command
