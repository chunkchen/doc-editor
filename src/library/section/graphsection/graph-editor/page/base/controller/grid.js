import Base from '../../../simpleBase';
import Global from '../global';
import Util from '../util';

class Controller extends Base {
  constructor() {
    super(arguments);
  }

  getDefaultCfg() {
    return {
      /**
       * grid cell
       * @type {number}
       */
      cell: 16,

      /**
       * grid line style
       * @type {object}
       */
      line: Global.gridStyle,

      /**
       * grid line style
       * @type {string}
       */
      type: 'point',

      /**
       * visible
       * @type {boolean}
       */
      visible: true,
    };
  }

  init() {
    this._draw();
    this._onViewPortChange();
    !this.visible && this.hide();
  }

  _onViewPortChange() {
    const graph = this.graph;
    graph.on('afterviewportchange', () => {
      this.update();
    });
    graph.on('beforechangesize', () => {
      this.update();
    });
  }

  _draw() {
    const graph = this.graph;
    const path = this._getPath();
    const group = graph.getRootGroup();
    const attrs = Util.mix({}, this.line);
    const matrix = graph.getMatrix();
    const type = this.type;
    const lineWidth = type === 'line' ? 1 / matrix[0] : 2 / matrix[0];

    if (type === 'point') {
      attrs.lineDash = null;
    }

    attrs.lineWidth = lineWidth;
    attrs.path = path;
    const gridEl = group.addShape('path', {
      attrs,
      capture: false,
      zIndex: 0,
    });
    Util.toBack(gridEl, group);
    this.gridEl = gridEl;
  }

  show() {
    this.gridEl.show();
    this.visible = true;
  }

  hide() {
    this.gridEl.hide();
    this.visible = false;
  }

  _getLinePath() {
    const graph = this.graph;
    const width = graph.get('width');
    const height = graph.get('height');
    const tl = graph.getPoint({
      x: 0,
      y: 0,
    });
    const br = graph.getPoint({
      x: width,
      y: height,
    });
    const cell = this.cell;
    const flooX = Math.ceil(tl.x / cell) * cell;
    const flooY = Math.ceil(tl.y / cell) * cell;
    const path = [];

    for (let i = 0; i <= br.x - tl.x; i += cell) {
      const x = flooX + i;
      path.push(['M', x, tl.y]);
      path.push(['L', x, br.y]);
    }

    for (let j = 0; j <= br.y - tl.y; j += cell) {
      const y = flooY + j;
      path.push(['M', tl.x, y]);
      path.push(['L', br.x, y]);
    }
    return path;
  }

  _getPointPath() {
    const graph = this.graph;
    const width = graph.get('width');
    const height = graph.get('height');
    const tl = graph.getPoint({
      x: 0,
      y: 0,
    });
    const matrix = graph.getMatrix();
    const detalx = 2 / matrix[0];
    const br = graph.getPoint({
      x: width,
      y: height,
    });
    const cell = this.getCell();
    const flooX = Math.ceil(tl.x / cell) * cell;
    const flooY = Math.ceil(tl.y / cell) * cell;
    const path = [];

    for (let i = 0; i <= br.x - tl.x; i += cell) {
      const x = flooX + i;
      for (let j = 0; j <= br.y - tl.y; j += cell) {
        const y = flooY + j;
        path.push(['M', x, y]);
        path.push(['L', x + detalx, y]);
      }
    }
    return path;
  }

  getCell() {
    const cell = this.cell;
    const graph = this.graph;
    const matrix = graph.getMatrix();
    const scale = matrix[0];
    if (cell * scale < 9.6) {
      return 9.6 / scale;
    }

    return cell;
  }

  _getPath() {
    const type = this.type;
    return this[`_get${Util.upperFirst(type)}Path`]();
  }

  update(cfg) {
    Util.mix(this, cfg);
    const path = this._getPath();
    const gridEl = this.gridEl;
    const graph = this.graph;
    const matrix = graph.getMatrix();
    const type = this.type;
    const lineWidth = type === 'line' ? 1 / matrix[0] : 2 / matrix[0];
    gridEl.attr('lineWidth', lineWidth);
    gridEl.attr('path', path);
  }

  destroy() {
    const gridEl = this.gridEl;
    gridEl && gridEl.remove();
  }
}

export default Controller;
