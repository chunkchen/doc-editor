const PLUGIN_NAME = 'mxgraph'

export default {
  initialize() {
    // 创建命令
    this.command.add(PLUGIN_NAME, {
      execute: () => {
        this.change.insertSection(PLUGIN_NAME, {})
      },
    })
  },
}
