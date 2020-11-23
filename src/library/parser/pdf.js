import ExportParser from './export'
import { lists } from './utils'

class PdfParser extends ExportParser {
  getDefaultSectionParsers() {
    return {

      ...super.getDefaultSectionParsers.call(this),
      checkbox: () => {
      },
    }
  }

  parseLists(element) {
    return lists(element)
  }
}

export default PdfParser
