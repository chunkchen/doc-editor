/**
 * @fileOverview util
 */
import Base from '../../base/util'

const Util = {
  ...Base,
  getMindNodeSide: (item) => {
    const model = item.getModel()

    if (model.side) {
      return model.side
    }

    const parent = item.getParent()
    if (parent) {
      if (parent.getModel().side) {
        return parent.getModel().side
      }
      return Util.getMindNodeSide(parent)
    }
    return undefined
  },
}
export default Util
