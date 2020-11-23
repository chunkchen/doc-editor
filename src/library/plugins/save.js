import Engine from '@hicooper/doc-engine'

const PLUGIN_NAME = 'save'
export default {
  initialize() {
    // 创建命令
    this.command.add(PLUGIN_NAME, {
      execute: () => {
        this.event.trigger('save:before')
        this.asyncEvent.emitAsync('save:before')
          .then(() => {
            this.options.onSave && this.options.onSave()
          })
          .catch((error) => {
            this.messageError(error)
          })
      },
    })
    // save 快捷键，所有插件都统一用，所以绑定在 document
    this.domEvent.onDocument('keydown', (e) => {
      if (Engine.isHotkey('mod+s', e)) {
        e.preventDefault()
        this.command.execute('save')
      }
    })
  },
}
