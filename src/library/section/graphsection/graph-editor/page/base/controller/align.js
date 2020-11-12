/**
 * @fileOverview align controller
 */
import Base from '../../../simpleBase';
import Global from '../global';
import Util from '../util';

function getLineDisObject(line, point) {
  return {
    line,
    point,
    dis: Util.pointLineDistance(line[0], line[1], line[2], line[3], point.x, point.y),
  };
}

class Controller extends Base {
  getDefaultCfg() {
    return {
      /**
       * align line style shoule set g attrs
       * @type {object}
       */
      line: Global.alignLineStyle,

      /**
       * item align type
       * @type {String|True|False}
       */
      item: true,
      // true || false || 'horizontal' || 'vertical' || 'center',

      /**
       * align type could be true || false || 'cc' || 'tl',
       * @type {String|Boolean}
       */
      grid: false,

      /**
       * tolerance to item force align
       * @type {String|True|False}
       */
      tolerance: 5,
      _horizontalLines: {},
      _verticalLines: {},
      _alignLines: [],
    };
  }

  init() {
    this.item && this._cacheBoxLine();
  }

  _cacheBoxLine() {
    const graph = this.graph;
    const horizontalLines = this._horizontalLines;
    const verticalLines = this._verticalLines;
    const itemAlignType = this.item;
    graph.on('afteritemdraw', (ev) => {
      const item = ev.item;
      if (!Util.isEdge(item)) {
        const bbox = item.getBBox(); // set horizontal lines

        if (itemAlignType === true || itemAlignType === 'horizontal') {
          horizontalLines[`${item.id}tltr`] = [bbox.minX, bbox.minY, bbox.maxX, bbox.minY, item];
          horizontalLines[`${item.id}lcrc`] = [bbox.minX, bbox.centerY, bbox.maxX, bbox.centerY, item];
          horizontalLines[`${item.id}blbr`] = [bbox.minX, bbox.maxY, bbox.maxX, bbox.maxY, item];
        } else if (itemAlignType === 'center') {
          horizontalLines[`${item.id}lcrc`] = [bbox.minX, bbox.centerY, bbox.maxX, bbox.centerY, item];
        } // set vertical lines

        if (itemAlignType === true || itemAlignType === 'vertical') {
          verticalLines[`${item.id}tlbl`] = [bbox.minX, bbox.minY, bbox.minX, bbox.maxY, item];
          verticalLines[`${item.id}tcbc`] = [bbox.centerX, bbox.minY, bbox.centerX, bbox.maxY, item];
          verticalLines[`${item.id}trbr`] = [bbox.maxX, bbox.minY, bbox.maxX, bbox.maxY, item];
        } else if (itemAlignType === 'center') {
          verticalLines[`${item.id}tcbc`] = [bbox.centerX, bbox.minY, bbox.centerX, bbox.maxY, item];
        }
      }
    });
    graph.on('beforeitemdestroy', (ev) => {
      const item = ev.item;
      delete horizontalLines[`${item.id}tltr`];
      delete horizontalLines[`${item.id}lcrc`];
      delete horizontalLines[`${item.id}blbr`];
      delete verticalLines[`${item.id}tlbl`];
      delete verticalLines[`${item.id}tcbc`];
      delete verticalLines[`${item.id}trbr`];
    });
  }

  align(point, bbox) {
    const originPoint = Util.mix({}, point);
    const flow = this.flow;
    const gridController = flow.getController('grid');
    this.grid && gridController && gridController.visible && this._gridAlign(point, bbox);
    this.item && this._itemAlign(point, bbox, originPoint);
    return point;
  }

  _gridAlign(point, bbox) {
    const flow = this.flow;
    const grid = this.grid;
    const cell = flow.getGridCell();

    if (grid === 'cc') {
      const centerX = Math.round((point.x + bbox.width / 2) / cell) * cell;
      const centerY = Math.round((point.y + bbox.height / 2) / cell) * cell;
      point.x = centerX - bbox.width / 2;
      point.y = centerY - bbox.height / 2;
    } else {
      point.x = Math.round(point.x / cell) * cell;
      point.y = Math.round(point.y / cell) * cell;
    }
  }

  _itemAlign(point, bbox, originPoint) {
    const horizontalLines = this._horizontalLines;
    const verticalLines = this._verticalLines;
    const tolerance = this.tolerance;
    const tc = {
      x: originPoint.x + bbox.width / 2,
      y: originPoint.y,
    };
    const cc = {
      x: originPoint.x + bbox.width / 2,
      y: originPoint.y + bbox.height / 2,
    };
    const bc = {
      x: originPoint.x + bbox.width / 2,
      y: originPoint.y + bbox.height,
    };
    const lc = {
      x: originPoint.x,
      y: originPoint.y + bbox.height / 2,
    };
    const rc = {
      x: originPoint.x + bbox.width,
      y: originPoint.y + bbox.height / 2,
    };
    const horizontalDis = [];
    const verticalDis = [];
    let alignCfg = null;
    this.clearAlignLine();
    Util.each(horizontalLines, (line) => {
      if (line[4].isVisible()) {
        horizontalDis.push(getLineDisObject(line, tc));
        horizontalDis.push(getLineDisObject(line, cc));
        horizontalDis.push(getLineDisObject(line, bc));
      }
    });
    Util.each(verticalLines, (line) => {
      if (line[4].isVisible()) {
        verticalDis.push(getLineDisObject(line, lc));
        verticalDis.push(getLineDisObject(line, cc));
        verticalDis.push(getLineDisObject(line, rc));
      }
    });
    horizontalDis.sort((a, b) => {
      return a.dis - b.dis;
    });
    verticalDis.sort((a, b) => {
      return a.dis - b.dis;
    });

    if (horizontalDis.length !== 0 && horizontalDis[0].dis < tolerance) {
      point.y = horizontalDis[0].line[1] - horizontalDis[0].point.y + originPoint.y;
      alignCfg = {
        type: 'item',
        horizontals: [horizontalDis[0]],
      };

      for (let i = 1; i < 3; i++) {
        if (horizontalDis[0].dis === horizontalDis[i].dis) {
          alignCfg.horizontals.push(horizontalDis[i]);
        }
      }
    }

    if (verticalDis.length !== 0 && verticalDis[0].dis < tolerance) {
      point.x = verticalDis[0].line[0] - verticalDis[0].point.x + originPoint.x;
      if (!alignCfg) {
        alignCfg = {
          type: 'item',
          verticals: [verticalDis[0]],
        };
      } else {
        alignCfg.verticals = [verticalDis[0]];
      }

      for (let _i = 1; _i < 3; _i++) {
        if (verticalDis[0].dis === verticalDis[_i].dis) {
          alignCfg.verticals.push(verticalDis[_i]);
        }
      }
    }

    if (alignCfg) {
      alignCfg.bbox = bbox;

      this._addAlignLine(alignCfg);
    }
  }

  clearAlignLine() {
    const alignLines = this._alignLines;
    Util.each(alignLines, (line) => {
      line.remove();
    });
    this._alignLines = [];
  }

  _addAlignLine(cfg) {
    const bbox = cfg.bbox;
    const graph = this.graph;
    const rootGroup = graph.getRootGroup();
    const lineStyle = this.line;
    const alignLines = this._alignLines;

    if (cfg.type === 'item') {
      if (cfg.horizontals) {
        Util.each(cfg.horizontals, (horizontal) => {
          const refLine = horizontal.line;
          const refPoint = horizontal.point;
          const lineCenterX = (refLine[0] + refLine[2]) / 2;
          let x1;
          let x2;

          if (refPoint.x < lineCenterX) {
            x1 = refPoint.x - bbox.width / 2;
            x2 = Math.max(refLine[0], refLine[2]);
          } else {
            x1 = refPoint.x + bbox.width / 2;
            x2 = Math.min(refLine[0], refLine[2]);
          }

          const line = rootGroup.addShape('line', {
            attrs: Util.mix({
              x1,
              y1: refLine[1],
              x2,
              y2: refLine[1],
            }, lineStyle),
            capture: false,
          });
          alignLines.push(line);
        });
      }

      if (cfg.verticals) {
        Util.each(cfg.verticals, (vertical) => {
          const refLine = vertical.line;
          const refPoint = vertical.point;
          const lineCenterY = (refLine[1] + refLine[3]) / 2;
          let y1;
          let y2;

          if (refPoint.y < lineCenterY) {
            y1 = refPoint.y - bbox.height / 2;
            y2 = Math.max(refLine[1], refLine[3]);
          } else {
            y1 = refPoint.y + bbox.height / 2;
            y2 = Math.min(refLine[1], refLine[3]);
          }

          const line = rootGroup.addShape('line', {
            attrs: Util.mix({
              x1: refLine[0],
              y1,
              x2: refLine[0],
              y2,
            }, lineStyle),
            capture: false,
          });
          alignLines.push(line);
        });
      }
    }
  }
}

export default Controller;
