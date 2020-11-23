const PLUGIN_NAME = 'mindmap'

export default {
  initialize() {
    // 创建命令
    this.command.add(PLUGIN_NAME, {
      execute: () => {
        this.change.insertSection('mindmap', {})
      },
    })
  },
}
