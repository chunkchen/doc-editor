import Upload from '../embed/upload'

const local = {
  en: {
    preferences: 'Local File Preferences',
  },
  'zh-cn': {
    preferences: '\u672c\u5730\u6587\u4ef6\u8bbe\u7f6e',
  },
}

class LocalDoc extends Upload {
  setSidebar() {
    const lang = local[this.getLang()]
    this.engine.sidebar.set({
      name: 'localdoc',
      title: lang.preferences,
      className: 'lake-localdoc-sidebar',
      data: this.value,
    })
  }
}

export default LocalDoc
