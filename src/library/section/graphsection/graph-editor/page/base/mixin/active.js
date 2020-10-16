import Util from '../util';

const Mixin = {};
Mixin.CFG = {
  /**
   * @type {boolean}
   */
  activeable: true,

  /**
   * @type {object}
   */
  _activedCache: {},
};
Mixin.INIT = '_initActived';
Mixin.AUGMENT = {
  _initActived() {
    const graph = this.get('_graph');
    graph.on('afteritemdraw', (_ref) => {
      const item = _ref.item;
      item.isActived && this.setItemActived(item);
    });
    graph.on('beforeitemdestroy', (ev) => {
      this.clearItemActived(ev.item);
    });
  },

  /**
   * @param {object} item g6 item
   */
  setItemActived(item) {
    const graph = this.get('_graph');
    const shapeObj = graph.getShapeObj(item);
    const activedCache = this.get('_activedCache');
    const activedStyle = shapeObj.getActivedStyle(item);
    const keyShape = item.getKeyShape();
    activedCache[item.id] = item;
    activedStyle && keyShape.attr(activedStyle);

    if (item.isEdge) {
      item.startArrow && item.startArrow.attr({
        fill: activedStyle.stroke,
      });
      item.endArrow && item.endArrow.attr({
        fill: activedStyle.stroke,
      });
    }
  },

  /**
   * @param {object} item g6 item
   */
  clearItemActived(item) {
    const graph = this.get('_graph');
    const keyShape = item.getKeyShape();
    const shapeObj = graph.getShapeObj(item);
    const initAttrs = shapeObj.getStyle(item);
    const activedCache = this.get('_activedCache');
    const activedStyle = shapeObj.getActivedStyle(item);
    const contrastAttrs = Util.getContrast(initAttrs, activedStyle);
    keyShape.attr(contrastAttrs);

    if (item.isEdge) {
      item.startArrow && item.startArrow.attr({
        fill: contrastAttrs.stroke,
      });
      item.endArrow && item.endArrow.attr({
        fill: contrastAttrs.stroke,
      });
    }

    delete activedCache[item.id];
  },

  /**
   * @param {object|string|array} param item || itemId || items
   * @param {boolean} bool true || false
   */
  setActived(param, bool) {
    const activeable = this.get('activeable');
    const graph = this.get('_graph');

    if (!activeable) {
      return;
    }

    let items;

    if (Util.isArray(param)) {
      items = param;
    } else {
      items = [param];
    }

    Util.each(items, (item) => {
      if (Util.isString(item)) {
        item = graph.find(item);
      }

      if (!item || item.destroyed) {
        return;
      }

      if (bool) {
        this.emit('beforeitemactived', {
          item,
        });
        this.setItemActived(item);
        this.emit('afteritemactived', {
          item,
        });
      } else {
        this.emit('beforeitemunactived', {
          item,
        });
        this.clearItemActived(item);
        this.emit('afteritemunactived', {
          item,
        });
      }
      item.isActived = bool;
    });
    graph.draw();
  },

  /**
   * get all actived items
   * @return {array} items
   */
  getActived() {
    const activedCache = this.get('_activedCache');
    return Util.objectToValues(activedCache);
  },

  /**
   * clear all actived items
   */
  clearActived() {
    const graph = this.get('_graph');
    const items = this.get('_activedCache');
    Util.each(items, (item) => {
      item.isActived && this.setActived(item, false);
    });
    graph.draw();
  },
};
export default Mixin;
