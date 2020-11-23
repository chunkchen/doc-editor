const PLUGIN_NAME = 'localdoc'
export default {
  initialize() {
    this.command.add(PLUGIN_NAME, {
      execute: (value) => {
        this.change.insertSection(PLUGIN_NAME, value || {})
      },
    })
  },
}
