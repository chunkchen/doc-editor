/**
 * @fileOverview page
 * abstract class
 */
import G6 from '@antv/g6'
import Base from '../../base'
import Util from './util'
import Global from './global'
import GraphMixin from './mixin/graph'
import GridMixin from './mixin/grid'
import EventMixin from './mixin/event'
import SelectMixin from './mixin/select'
import ActiveMixin from './mixin/active'
import AlignMixin from './mixin/align'
import LabelEditor from './mixin/edit-label'
import StatusMixin from './mixin/status'

const Mixins = [GraphMixin, SelectMixin, ActiveMixin, GridMixin, EventMixin, AlignMixin, LabelEditor, StatusMixin]

class Page extends Base {
  constructor(inputCfg) {
    const cfg = {
      /**
       * 图类构造函数
       * graph constructor
       * @type {string}
       */
      graphConstructor: G6.Graph,
      defaultData: null,
      shortcut: {
        redo: true,
        undo: true,
        delete: true,
        resetZoom: true,
        autoZoom: true,
        zoomIn: true,
        zoomOut: true,
      },
      _controllers: {},
      _signals: {},
    }
    Util.each(Mixins, (Mixin) => {
      Util.mix(cfg, Mixin.CFG)
    })
    Util.mix(true, cfg, inputCfg)
    super(cfg)
    this.isPage = true
    this.type = 'page'
    this._init()
  }

  getTextDomLactions() {
    const graph = this.getGraph()
    const rootGroup = graph.getRootGroup()
    const canvas = graph.getCanvas()
    const data = []
    Util.traverseTree(canvas, (child) => {
      if (child.type === 'text') {
        const box = Util.getBBox(child, rootGroup)
        const point = [box.minX, box.minY, 1]
        data.push({
          text: child.attr('text'),
          x: point[0],
          y: point[1],
          fontSize: +child.attr('fontSize'),
        })
      }
    }, (e) => {
      return e.get('children')
    })
    return data
  }

  getDelegation(items, group) {
    if (!group) {
      const graph = this.getGraph()
      group = graph.getRootGroup()
    }

    let delegation
    if (items.length === 1 && !items[0].isNode && !items[0].isGroup) {
      if (items[0].isEdge) {
        // 边的委托图形
        delegation = group.addShape('path', {
          attrs: {
            path: 'M0 0L 1 1',
            ...Global.edgeDelegationStyle,
          },
          capture: false,
        })
      } else {
        // 新拖出节点委托图形
        delegation = Util.getRectByBox(items[0], group, Global.nodeDelegationStyle)
        delegation.set('capture', false)
      }
    } else {
      // 移动节点委托图形
      const startBox = Util.getTotalBBox(items.map((item) => {
        return item.getBBox()
      }))
      delegation = Util.getRectByBox(startBox, group, Global.nodeDelegationStyle)
      delegation.set('capture', false)
    }

    return delegation
  }

  focusGraphWrapper() {
    const graph = this.getGraph()
    graph.getKeyboardEventWrapper()
      .focus()
  }

  saveImage(options) {
    const graph = this.getGraph()
    const box = graph.getBBox()
    const padding = graph.getFitViewPadding()
    let seletedIds
    let activedIds
    return graph.saveImage({
      width: box.width + padding[1] + padding[3],
      height: box.height + padding[0] + padding[2],
      beforeTransform: () => {
        seletedIds = this.getSelected()
          .map((item) => {
            return item.id
          })
        activedIds = this.getSelected()
          .map((item) => {
            return item.id
          })
        this.clearSelected()
        this.clearActived()
      },
      afterTransform: () => {
        this.setSelected(seletedIds, true)
        this.setActived(activedIds, true)
      },
      ...options,
    })
  }

  _init() {
    Util.each(Mixins, (Mixin) => {
      Mixin.INIT && this[Mixin.INIT]()
    })
    this.bindEvent()
    this._cacheBBox()
  }

  /**
   * 执行命令
   * @param  {string|funciton} callback 回调函数
   * @param  {obj|undefined} cfg 配置项
   */
  executeCommand(callback, cfg) {
    const eidtor = this.editor
    if (eidtor) {
      eidtor.executeCommand(callback, cfg)
    } else {
      callback()
    }
  }

  // cache graph box
  _cacheBBox() {
    const graph = this.getGraph()
    this.set('bboxCache', graph.getBBox())
  }

  bindEvent() {
    const graph = this.getGraph()
    graph.on('afterchange', () => {
      this._cacheBBox()
    })
    graph.on('mouseenter', (shape) => {
      if (shape && shape.isKeyShape) {
        this.css({
          cursor: 'default',
        })
      }
    })
  }

  /**
   * 限制画布滚动、拖拽区域
   * Limit the canvas scroll, drag and drop area
   * @param  {object} matrix to matrix
   * @return {boolean} shape
   */
  translateLimt(matrix) {
    const graph = this.getGraph()
    const bboxCache = this.get('bboxCache')
    const width = graph.getWidth()
    const height = graph.getHeight()
    const horizontal = width / 2
    const vertical = height / 2
    const tl = [bboxCache.minX, bboxCache.minY, 1]
    const br = [bboxCache.maxX, bboxCache.maxY, 1]
    Util.vec3.transformMat3(tl, tl, matrix)
    Util.vec3.transformMat3(br, br, matrix)

    if (br[0] < horizontal) {
      Util.mat3.translate(matrix, matrix, [horizontal - br[0], 0])
    }
    if (br[1] < vertical) {
      Util.mat3.translate(matrix, matrix, [0, vertical - br[1]])
    }
    if (tl[1] > height - vertical) {
      Util.mat3.translate(matrix, matrix, [0, height - vertical - tl[1]])
    }
    if (tl[0] > width - horizontal) {
      Util.mat3.translate(matrix, matrix, [width - horizontal - tl[0], 0])
    }
    return true
  }

  /**
   * @param  {String} name signal name
   * @param  {Boolean} value set value
   */
  setSignal(name, value) {
    const signals = this.get('_signals')
    signals[name] = value
  }

  /**
   * @param  {object} name signal name
   * @return {Boolean} signal value
   */
  getSignal(name) {
    const signals = this.get('_signals')
    return signals[name]
  }

  /**
   * @param  {String} name controller name
   * @param  {object} controller controller object
   */
  setController(name, controller) {
    const controllers = this.get('_controllers')
    controllers[name] = controller
  }

  /**
   * @param  {String} name controller name
   * @return {object} controller controller object
   */
  getController(name) {
    const controllers = this.get('_controllers')
    return controllers[name]
  }

  destroy() {
    const graph = this.get('_graph')
    const controllers = this.get('_controllers')
    Util.each(controllers, (controller) => {
      controller.destroy()
    })
    graph.destroy()
    this.destroyed = true
  }
}

Util.each(Mixins, (Mixin) => {
  Util.mix(Page.prototype, Mixin.AUGMENT)
})
export default Page
