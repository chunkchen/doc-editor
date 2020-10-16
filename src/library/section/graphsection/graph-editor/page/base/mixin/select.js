import Util from '../util';

const Mixin = {};
Mixin.CFG = {
  /**
   * @type {boolean}
   */
  selectable: true,

  /**
   * @type {boolean}
   */
  multiSelectable: true,

  /**
   * @type {object}
   */
  _selectedCache: {},
};
Mixin.INIT = '_initSelected';
Mixin.AUGMENT = {
  _initSelected() {
    const graph = this.get('_graph');
    graph.on('afteritemdraw', (_ref) => {
      const item = _ref.item;
      item.isSelected && this.setItemSelected(item);
    });
    graph.on('beforeitemdestroy', (ev) => {
      this.clearItemSelected(ev.item);
    });
  },

  /**
   * @param {object} item g6 item
   */
  setItemSelected(item) {
    const graph = this.get('_graph');
    const shapeObj = graph.getShapeObj(item);
    const selectedStyle = shapeObj.getSelectedStyle(item);
    const keyShape = item.getKeyShape();
    const selectedCache = this.get('_selectedCache');
    selectedCache[item.id] = item;
    selectedStyle && keyShape.attr(selectedStyle);

    if (item.isEdge) {
      item.startArrow && item.startArrow.attr({
        fill: selectedStyle.stroke,
      });
      item.endArrow && item.endArrow.attr({
        fill: selectedStyle.stroke,
      });
    }
  },

  /**
   * @param {object} item g6 item
   */
  clearItemSelected(item) {
    const graph = this.get('_graph');
    const keyShape = item.getKeyShape();
    const shapeObj = graph.getShapeObj(item);
    const initAttrs = shapeObj.getStyle(item);
    const selectedStyle = shapeObj.getSelectedStyle(item);
    const selectedCache = this.get('_selectedCache');
    const contrastAttrs = Util.getContrast(initAttrs, selectedStyle);
    keyShape.attr(contrastAttrs);

    if (item.isEdge) {
      item.startArrow && item.startArrow.attr({
        fill: contrastAttrs.stroke,
      });
      item.endArrow && item.endArrow.attr({
        fill: contrastAttrs.stroke,
      });
    }
    delete selectedCache[item.id];
  },

  /**
   * @param {object|string|array} param item || itemId || items
   * @param {boolean} bool true || false
   */
  setSelected(param, bool) {
    const selectable = this.get('selectable');
    const graph = this.get('_graph');

    if (!selectable) {
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
      // if (bool && item.isSelected) {
      //   return;
      // }
      // if (!bool && !item.isSelected) {
      //   return;
      // }
      if (bool) {
        this.emit('beforeitemselected', {
          item,
        });
        this.setItemSelected(item);
        this.emit('afteritemselected', {
          item,
        });
      } else {
        this.emit('beforeitemunselected', {
          item,
        });
        this.clearItemSelected(item);
        this.emit('afteritemunselected', {
          item,
        });
      }
      item.isSelected = bool;
      this.updateStatus();
      graph.draw();
    });
  },

  /**
   * get all selected items
   * @return {array} items
   */
  getSelected() {
    const selectedCache = this.get('_selectedCache');
    return Util.objectToValues(selectedCache);
  },

  /**
   * clear all selected items
   */
  clearSelected() {
    const graph = this.get('_graph');
    const items = this.get('_selectedCache');
    Util.each(items, (item) => {
      item.isSelected && this.setSelected(item, false);
    });
    graph.draw();
  },
};
export default Mixin;
