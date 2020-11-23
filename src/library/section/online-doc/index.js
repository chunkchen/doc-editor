import EmbedUrl from '../embed/url'

class OnlineDoc extends EmbedUrl {
  getPlaceHolder() {
    const lang = this.getLang()
    return lang === 'en' ? 'Please enter a link to the document or a link to the content in the document' : '请输入文档链接，或文档中的内容链接'
  }

  hitBlack(url) {
    return false
  }

  getDocEmbedURL(url) {
    return `${url + (url.indexOf('?') > 0 ? '&' : '?')}view=doc_embed`
  }

  renderEmbedEmbedView() {
    const lang = this.getLang()
    const tips = lang === 'en' ? 'Displaying online documents is not supported in embedded sections' : '嵌入Section中暂不支持展示在线文档'
    this.container.append('<div style="background: #fafafa; height: 80px; padding-top: 28px; text-align: center; color: rgba(0,0,0,0.45);">'.concat(tips, '</div>'))
  }

  render() {
    this.value = this.value || {}
    if (window.location.search.indexOf('view=doc_embed') > 0) {
      this.renderEmbedEmbedView()
    } else {
      super.render.call(this)
    }
  }
}

export default OnlineDoc
