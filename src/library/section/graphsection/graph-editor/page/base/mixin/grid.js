import GridController from '../controller/grid'
import Util from '../util'

const Mixin = {}
Mixin.CFG = {
  /**
   * grid cfg
   * @type {object|undefined}
   */
  grid: undefined,
}
Mixin.INIT = '_initGrid'
Mixin.AUGMENT = {
  _initGrid() {
    const gridCfg = this.get('grid')
    const graph = this.get('_graph')

    if (gridCfg) {
      const gridController = new GridController({
        page: this,
        graph,
        ...gridCfg,
      })
      this.setController('grid', gridController)
    }
  },
  showGrid(cfg) {
    const graph = this.get('_graph')
    let gridController = this.getController('grid')
    if (!gridController) {
      if (!cfg) {
        this.set('grid', true)
      } else if (Util.isObject(cfg)) {
        this.set('grid', cfg)
      }
      this._initGrid()
    }

    gridController = this.getController('grid')
    gridController.update()
    gridController.show(cfg)
    graph.draw()
  },
  hideGrid() {
    const graph = this.get('_graph')
    const gridController = this.getController('grid')
    gridController && gridController.hide()
    graph.draw()
  },
  getGridCell() {
    const gridController = this.getController('grid')
    return gridController.getCell()
  },
}
export default Mixin
