export default {
  initialize() {
    this.command.add('diagram', {
      execute: (t, code) => {
        const section = this.change.insertSection('diagram', {
          code: code || '',
          type: 'puml',
        })
        this.change.focusSection(section)
      },
    })
  },
}
