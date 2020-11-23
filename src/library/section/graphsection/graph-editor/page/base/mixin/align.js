import AlignController from '../controller/align'

const Mixin = {}
Mixin.CFG = {
  /**
   * align cfg
   * @type {object|undefined}
   */
  align: {},
}
Mixin.INIT = '_initAlign'
Mixin.AUGMENT = {
  _initAlign() {
    const alignCfg = this.get('align')
    const graph = this.get('_graph')
    const alignController = new AlignController({
      flow: this,
      graph,
      ...alignCfg,
    })
    this.setController('align', alignController)
  },
  align(point, bbox, id) {
    const alignController = this.getController('align')
    return alignController.align(point, bbox, id)
  },
  clearAlignLine() {
    const alignController = this.getController('align')
    return alignController.clearAlignLine()
  },
}
export default Mixin
