import ExportParser from './export'

class HtmlParser extends ExportParser {
  after(element) {
    return element.find('[data-section-key]')
      .each((section) => {
        section.removeAttribute('data-section-value')
      })
  }
}

export default HtmlParser
