import G6 from '@antv/g6';
import Page from '../base';
import Util from './util';

const Mixins = [];

class Mind extends Page {
  constructor(inputCfg) {
    const cfg = {
      /**
       * 是否显示交互热区
       * showHotArea
       * @type {boolean}
       */
      showHotArea: false,

      /**
       * 默认数据
       * default data
       * @type {object}
       */
      defaultData: {
        roots: [{
          label: '思维导图',
          children: [{
            label: '新建节点',
          }, {
            label: '新建节点',
          }, {
            label: '新建节点',
          }],
        }],
      },

      /**
       * 快捷键列表
       * shortcut list
       * @type {object}
       */
      shortcut: {
        append: true,
        appendChild: true,
        collapseExpand: true,
      },

      /**
       * 是否支持标签文本编辑
       * label editable
       * @type {boolean}
       */
      labelEditable: true,

      /**
       * 图配置项
       * graph cfg
       * @type {object|undefined}
       */
      graph: {
        modes: {
          default: ['clickNodeSelected', 'keydownMoveSelection', 'clickCanvasSelected', 'hoverMindExpandButton', 'keydownEditLabel', 'panBlank', 'wheelChangeViewport', 'panMindNode', 'clickCollapsedButton', 'clickExpandedButton', 'hoverButton', 'hoverNodeActived', 'dblclickItemEditLabel'],
          readOnly: ['clickNodeSelected', 'wheelChangeViewport', 'keydownMoveSelection', 'hoverNodeActived', 'panCanvas', 'clickExpandedButton', 'hoverButton', 'clickCanvasSelected'],
          none: ['clickCanvasSelected'],
        },
        layout: new G6.Layouts.Mindmap({
          direction: 'H',
          getSubTreeSep(node) {
            if (node.children && node.children.length > 0) {
              if (node.hierarchy <= 2) {
                return 8;
              }
              return 2;
            }
            return 0;
          },
          getHGap(node) {
            if (node.hierarchy === 1) {
              return 8;
            }

            if (node.hierarchy === 2) {
              return 24;
            }

            return 18;
          },
          getVGap(node) {
            if (node.hierarchy === 1) {
              return 8;
            }

            if (node.hierarchy === 2) {
              return 12;
            }

            return 2;
          },
          getSide(node) {
            if (node.data.side) {
              return node.data.side;
            }

            return 'right';
          },
        }),
        mode: 'default',
        defaultIntersectBox: 'rect',
        nodeDefaultShape: 'mind-base',
        edgeDefaultShape: 'mind-edge',
        minZoom: 0.2,
        maxZoom: 2,
      },

      /**
       * 是否展示对齐线
       * is show align line
       * @type {object}
       */
      align: {
        item: false,
      },

      /**
       * 根节点图形
       * root shape
       * @type {string}
       */
      rootShape: 'mind-root',

      /**
       * 第一层子节点图形
       * first sub child shape
       * @type {string}
       */
      firstSubShape: 'mind-first-sub',

      /**
       * 第二层子节点图形
       * second sub child shape
       * @type {string}
       */
      secondSubShape: 'mind-second-sub',

      /**
       * 子节点图形
       * sub child shape
       * @type {string}
       */
      subShape: 'mind-base',

      /**
       * 默认节点图形
       * default node shape
       * @type {boolean}
       */
      nodeDefaultShape: 'mind-base',

      /**
       * 图类构造函数
       * graph constructor
       * @type {string}
       */
      graphConstructor: G6.Tree,

      /**
       * 默认边旁
       * default first class side
       * @type {string}
       */
      defaultSide: 'right',
    };
    const mixinCfg = {};
    Util.each(Mixins, (Mixin) => {
      Util.mix(mixinCfg, Mixin.CFG);
    });
    Util.mix(true, cfg, mixinCfg, inputCfg);
    super(cfg);
    this.isMind = true;
  }

  _init() {
    super._init.call(this);
    Util.each(Mixins, (Mixin) => {
      Mixin.INIT && this[Mixin.INIT]();
    });
    const graph = this.getGraph();
    const defaultData = this.get('defaultData');
    const mode = graph.get('mode');
    const rootGroup = graph.getRootGroup();
    const hotAreaGroup = rootGroup.addGroup();
    this.set('hotAreaGroup', hotAreaGroup);
    graph.edge().shape((model) => {
      const target = graph.find(model.target);
      if (target.getModel().isPlaceholder) {
        return 'mind-placeholder-edge';
      }
    });
    defaultData && this.read(defaultData);

    if (mode === 'default') {
      if (defaultData) {
        const root = this.getRoot();
        const rootItem = graph.find(root.id);
        this.setSelected(rootItem, true);
      }
    } else if (mode === 'readOnly') {
      const shortcut = this.get('shortcut');
      shortcut.append = false;
      shortcut.appendChild = false;
      shortcut.selectAll = false;
      shortcut.delete = false;
    }

    if (defaultData) {
      const _root = this.getRoot();
      this.focus(_root.id);
    }
  }

  bindEvent() {
    super.bindEvent.call(this);
    const graph = this.get('_graph');
    graph.on('keydown', (ev) => {
      ev.domEvent.preventDefault();
    });
    graph.on('beforechange', (ev) => {
      if (ev.action === 'add') {
        this._beforeAdd(ev);
      } else if (ev.action === 'changeData') {
        this._beforeChangeData(ev);
      }
      this.cancelEditLabel();
    });
    graph.on('aftersource', () => {
      this._setHierarchy();
    });
    graph.on('afterchange', () => {
      this._setHotArea();
    });
    graph.on('afteritemdraw', (ev) => {
      const item = ev.item;
      const model = item.getModel();

      if (item.isEdge) {
        const group = item.getGraphicGroup();
        Util.toBack(group, group.getParent());
        group.setSilent('capture', false);
      }

      if (!model.parent) {
        item.isRoot = true;
        item.deleteable = false;
        item.collapseExpand = false;
        item.appendable = false;
        item.dragable = false;
      }
    });
    this.on('beforedelete', (ev) => {
      const item = ev.items[0];

      const brothers = this._getBrothers(item);

      const nth = this._getNth(item);

      if (brothers[nth - 1]) {
        this.setSelected(brothers[nth - 1].id, true);
      } else if (brothers[nth + 1]) {
        this.setSelected(brothers[nth + 1].id, true);
      } else {
        this.setSelected(item.getParent(), true);
      }
    });
    this.on('afteritemselected', (ev) => {
      this._tryAdjustViewport(ev.item);
    });
  }

  getRoot() {
    const graph = this.getGraph();
    return graph.getSource().roots[0];
  }

  /**
   * 获取拖拽节点时的委托图形
   * get delegation when drag node
   * @type {function}
   * @param  {array} items source data
   * @param  {G.Group} group graphic group
   * @return {G.Shape} shape
   */
  // getDelegation(items, group) {
  //   const item = items[0];
  //   const keyShape = item.getKeyShape();
  //   const canvas = keyShape.get('canvas');
  //   const ctx = canvas.get('context');
  //   const itemBox = item.getBBox();
  //   const totalMatrix = keyShape.get('totalMatrix');
  //   const itemCanvasBox = Util.getBBox(keyShape, totalMatrix ? totalMatrix : canvas);
  //   const virtualCanvas = Util.createDOM('<canvas>');
  //   const virtualCtx = virtualCanvas.getContext('2d');
  //   const itemCanvasWidth = itemCanvasBox.maxX - itemCanvasBox.minX;
  //   const itemCanvasHeight = itemCanvasBox.maxY - itemCanvasBox.minY;
  //   const padding = [ 2.5, 2.5, 2.5, 4 ];
  //   virtualCanvas.setAttribute('width', itemCanvasWidth);
  //   virtualCanvas.setAttribute('height', itemCanvasHeight);
  //   const imgData = ctx.getImageData(
  //     itemCanvasBox.minX + padding[3],
  //     itemCanvasBox.minY + padding[0],
  //     itemCanvasWidth - padding[1] - padding[3],
  //     itemCanvasHeight - padding[0] - padding[2]
  //   );
  //   virtualCtx.putImageData(imgData, 0, 0);
  //   return group.addShape('image', {
  //     attrs: {
  //       x: itemBox.minX,
  //       y: itemBox.minY,
  //       width: itemBox.width,
  //       height: itemBox.height,
  //       swidth: itemCanvasWidth,
  //       sheight: itemCanvasHeight,
  //       img: virtualCanvas,
  //       opacity: 0.5
  //     }
  //   });
  // }

  _setHierarchy(root) {
    const graph = this.getGraph();
    const firstSubShape = this.get('firstSubShape');
    const secondSubShape = this.get('secondSubShape');
    const defaultSide = this.get('defaultSide');

    if (!root) {
      root = this.getRoot();
      root.hierarchy = 1;
    } else {
      const parent = graph.find(root.parent);
      if (parent) {
        const parentModel = parent.getModel();
        root.hierarchy = parentModel.hierarchy + 1;
        if (root.shape !== 'mind-placeholder') {
          if (root.hierarchy === 2) {
            root.shape = firstSubShape;
            if (!root.side) {
              root.side = defaultSide;
            }
          }

          if (root.hierarchy === 3) {
            root.shape = secondSubShape;
          }
        }
      }
    }

    Util.traverseTree(root, (child, parent) => {
      child.hierarchy = parent.hierarchy + 1;
      if (!child.side) {
        child.side = defaultSide;
      }
      if (parent.side) {
        child.side = parent.side;
      }
      if (child.hierarchy === 2) {
        child.shape = firstSubShape;
      } else if (child.hierarchy === 3) {
        child.shape = secondSubShape;
      }
    }, (parent) => {
      return parent.children;
    });
  }

  getFirstChildrenBySide(side) {
    const root = this.getRoot();
    const rst = [];
    root.children.forEach((child) => {
      if (child.side === side) {
        rst.push(child);
      }
    });
    return rst;
  }

  _getNth(item) {
    const graph = this.getGraph();
    return graph.getNth(item);
  }

  _getBrothers(item) {
    const parent = item.getParent();
    return parent.getModel().children;
  }

  _getMoveChildModel(children) {
    if (children && children.length > 0) {
      const l = children.length;
      return children[parseInt(l / 2)];
    }
  }

  _getVerticalMoveItem(item, condition, getLong) {
    const graph = this.getGraph();
    const nodes = graph.getNodes();
    const bbox = item.getBBox();
    const checkXs = [bbox.minX, bbox.maxX];
    const inserts = [];
    let toItem;

    for (let i = 0; i < checkXs.length; i++) {
      const checkX = checkXs[i];
      for (let j = 0; j < nodes.length; j++) {
        const node = nodes[j];
        const nodeBox = node.getBBox();

        if (condition(nodeBox, bbox, checkX)) {
          inserts.push({
            long: getLong(nodeBox, bbox),
            node,
          });
        }
      }
    }

    if (inserts.length > 0) {
      inserts.sort((a, b) => {
        return a.long - b.long;
      });
      toItem = inserts[0].node;
    }
    return toItem;
  }

  _arrowTopItem(item) {
    const brothers = this._getBrothers(item);
    const curNth = this._getNth(item);

    if (brothers[curNth - 1]) {
      return brothers[curNth - 1];
    }

    return this._getVerticalMoveItem(item, (nodeBox, bbox, checkX) => {
      return nodeBox.centerY < bbox.centerY && checkX <= nodeBox.maxX && checkX >= nodeBox.minX;
    }, (nodeBox, bbox) => {
      return bbox.centerY - nodeBox.centerY;
    });
  }

  _arrowBottomItem(item) {
    const brothers = this._getBrothers(item);
    const curNth = this._getNth(item);
    if (brothers[curNth + 1]) {
      return brothers[curNth + 1];
    }

    return this._getVerticalMoveItem(item, (nodeBox, bbox, checkX) => {
      return nodeBox.centerY > bbox.centerY && checkX <= nodeBox.maxX && checkX >= nodeBox.minX;
    }, (nodeBox, bbox) => {
      return nodeBox.centerY - bbox.centerY;
    });
  }

  _arrowLeftItem(item) {
    const side = Util.getMindNodeSide(item);

    if (item.isRoot) {
      const children = this.getFirstChildrenBySide('left');
      return this._getMoveChildModel(children);
    }

    if (side === 'left') {
      const _children = item.getModel().children;
      return this._getMoveChildModel(_children);
    }

    const parent = item.getParent();
    return parent;
  }

  _arrowRightItem(item) {
    const side = Util.getMindNodeSide(item);
    if (item.isRoot) {
      const children = this.getFirstChildrenBySide('right');
      return this._getMoveChildModel(children);
    }

    if (side === 'right') {
      const children = item.getModel().children;
      return this._getMoveChildModel(children);
    }

    const parent = item.getParent();
    return parent;
  }

  _moveItemSelection(ev) {
    const graph = this.getGraph();
    const item = this.getSelected()[0];

    if (!item) {
      return;
    }

    const domEvent = ev.domEvent;
    const key = Util.getKeyboradKey(domEvent);
    let toItem;

    if (key === 'ArrowUp' && !item.isRoot) {
      toItem = this._arrowTopItem(item);
    } else if (key === 'ArrowDown' && !item.isRoot) {
      toItem = this._arrowBottomItem(item);
    } else if (key === 'ArrowLeft') {
      toItem = this._arrowLeftItem(item);
    } else if (key === 'ArrowRight') {
      toItem = this._arrowRightItem(item);
    }

    if (toItem) {
      toItem = graph.find(toItem.id);
      if (toItem.isVisible()) {
        this.clearSelected();
        this.setSelected(toItem, true);
      }
    }
  }

  showLabelEditor(ev) {
    const domEvent = ev.domEvent;
    const item = this.getSelected()[0];
    const key = Util.getKeyboradKey(domEvent);
    if (item && key.length === 1 && !domEvent.metaKey && !domEvent.ctrlKey) {
      const labelTextArea = this.get('labelTextArea');
      if (item) {
        this.beginEditLabel(item);
        labelTextArea.innerHTML = '';
        Util.setEndOfContenteditable(labelTextArea);
      }
    }
  }

  _tryAdjustViewport(selectedItem) {
    const graph = this.get('_graph');
    const box = selectedItem.getBBox();
    const tl = {
      x: box.minX,
      y: box.minY,
    };
    const br = {
      x: box.maxX,
      y: box.maxY,
    };
    const domTl = graph.getDomPoint(tl);
    const domBr = graph.getDomPoint(br);
    const width = graph.getWidth();
    const height = graph.getHeight();
    const padding = 16;

    if (domTl.x < 0) {
      graph.translate(-domTl.x + padding, 0);
    }

    if (domTl.y < 0) {
      graph.translate(0, -domTl.y + padding);
    }

    if (domBr.x > width) {
      graph.translate(width - domBr.x - padding, 0);
    }

    if (domBr.y > height) {
      graph.translate(0, height - domBr.y - padding);
    }
  }

  _beforeChangeData(ev) {
    const root = ev.data.roots[0];
    const rootShape = this.get('rootShape');
    root.shape = rootShape;
    this._setHierarchy(root);
  }

  _beforeAdd(ev) {
    const graph = this.get('_graph');
    const model = ev.model;
    const parent = graph.find(model.parent);
    const parentModel = parent.getModel();
    if (parentModel.collapsed) {
      graph.update(parent, {
        collapsed: false,
      });
    }

    this._setHierarchy(model);
  }

  // 绘制交互热区（调试用）
  _drawHotAreaShape() {
    const graph = this.get('_graph');
    const hotAreaGroup = this.get('hotAreaGroup');
    const hotAreas = this.get('hotAreas');
    hotAreaGroup.clear();
    hotAreas.forEach((hotArea) => {
      hotAreaGroup.addShape('rect', {
        attrs: {
          x: hotArea.minX,
          y: hotArea.minY,
          width: hotArea.maxX - hotArea.minX,
          height: hotArea.maxY - hotArea.minY,
          fill: hotArea.color,
          fillOpacity: 0.4,
        },
        capture: false,
      });
    });
    graph.draw();
  }

  // 设置交互热区
  _setHotArea() {
    const hotAreas = [];
    const graph = this.get('_graph');
    const root = this.getRoot();
    const postFix = 'placeholder';
    const showHotArea = this.get('showHotArea');
    // 设置根节点热区
    const rootNode = graph.find(root.id);
    const rootBox = rootNode.getBBox();
    const rootDx = 90;
    const rootDy = 60;
    hotAreas.push({
      minX: rootBox.minX - rootDx,
      minY: rootBox.minY - rootDy,
      maxX: (rootBox.minX + rootBox.maxX) / 2,
      maxY: rootBox.maxY + rootDy,
      parent: root,
      current: root,
      id: `${root.id}left${postFix}`,
      nth: root.children.length,
      side: 'left',
      color: 'orange',
    });
    hotAreas.push({
      minX: (rootBox.minX + rootBox.maxX) / 2,
      minY: rootBox.minY - rootDy,
      maxX: rootBox.maxX + rootDx,
      maxY: rootBox.maxY + rootDy,
      parent: root,
      current: root,
      id: `${root.id}right${postFix}`,
      nth: root.children.length,
      side: 'right',
      color: 'pink',
    });

    function getNext(initNextIndex, child, parent) {
      const children = parent.children;
      // 所在节点
      let nextIndex = initNextIndex;

      if (!parent.parent) {
        while (children[nextIndex] && children[nextIndex].side !== child.side) {
          nextIndex++;
        }
      }

      while (children[nextIndex] && children[nextIndex].isPlaceholder) {
        nextIndex++;
      }

      if (children[nextIndex] && children[nextIndex].side === child.side) {
        return children[nextIndex];
      }
    }

    function getLast(initNextIndex, child, parent) {
      const children = parent.children;
      // 所在节点
      let lastIndex = initNextIndex;

      if (!parent.parent) {
        while (children[lastIndex] && children[lastIndex].side !== child.side) {
          lastIndex--;
        }
      }

      while (children[lastIndex] && children[lastIndex].isPlaceholder) {
        lastIndex--;
      }

      if (children[lastIndex] && children[lastIndex].side === child.side) {
        return children[lastIndex];
      }
    }

    // 设置子节点热区
    Util.traverseTree(root, (child, parent, index) => {
      const childItem = graph.find(child.id);
      if (child.isPlaceholder || !childItem || !childItem.isVisible()) {
        return;
      }

      const next = getNext(index + 1, child, parent);
      const last = getLast(index - 1, child, parent);
      const childBox = graph.find(child.id).getBBox();
      const children = parent.children;
      // 所在节点
      const firstSubDx = 90;
      const dy = 16;
      const isFirstRight = child.hierarchy === 2 && child.side === 'right';
      const isFirstLeft = child.hierarchy === 2 && child.side === 'left';

      if (!last) {
        hotAreas.push({
          minX: isFirstRight ? childBox.minX - firstSubDx : childBox.minX,
          minY: (function () {
            let minY = last ? childBox.minY : childBox.minY - dy;

            if (children[index - 1] && children[index - 1].isPlaceholder && children[index - 1].side === child.side) {
              const placeholderBox = graph.find(children[index - 1].id).getBBox();
              minY = placeholderBox.minY;
            }

            return minY;
          }()),
          maxX: isFirstLeft ? childBox.maxX + firstSubDx : childBox.maxX,
          maxY: (childBox.minY + childBox.maxY) / 2,
          parent,
          id: (last ? last.id : undefined) + child.id + parent.id + postFix,
          side: child.side,
          color: 'yellow',
          nth: index,
        });
      }

      if (next) {
        const nextBox = graph.find(next.id).getBBox();
        hotAreas.push({
          minX: (function () {
            if (child.side === 'left') {
              return Math.max(childBox.minX, nextBox.minX);
            }
            return isFirstRight ? childBox.minX - firstSubDx : childBox.minX;
          }()),
          minY: (childBox.minY + childBox.maxY) / 2,
          maxX: (function () {
            if (child.side === 'right') {
              return Math.min(childBox.maxX, nextBox.maxX);
            }
            return isFirstLeft ? childBox.maxX + firstSubDx : childBox.maxX;
          }()),
          maxY: (nextBox.minY + nextBox.maxY) / 2,
          parent,
          id: child.id + (next ? next.id : undefined) + parent.id + postFix,
          side: child.side,
          color: 'blue',
          nth: index + 1,
        });
      } else {
        hotAreas.push({
          minX: isFirstRight ? childBox.minX - firstSubDx : childBox.minX,
          minY: (childBox.minY + childBox.maxY) / 2,
          maxX: isFirstLeft ? childBox.maxX + firstSubDx : childBox.maxX,
          maxY: (function () {
            let maxY = childBox.maxY + dy;
            if (children[index + 1] && children[index + 1].isPlaceholder && children[index + 1].side === child.side) {
              const placeholderBox = graph.find(children[index + 1].id).getBBox();
              maxY = placeholderBox.maxY;
            }
            return maxY;
          }()),
          parent,
          id: child.id + undefined + parent.id + postFix,
          color: 'red',
          nth: index + 1,
          addOrder: 'push',
          side: child.side,
        });
      }

      if (!child.children || child.children.length === 0 || child.children.length === 1 && child.children[0].isPlaceholder) {
        const dx = 100;
        const _dy = 0;
        let box;

        if (child.x > parent.x) {
          box = {
            minX: childBox.maxX,
            minY: childBox.minY - _dy,
            maxX: childBox.maxX + dx,
            maxY: childBox.maxY + _dy,
          };
        } else {
          box = {
            minX: childBox.minX - dx,
            minY: childBox.minY - _dy,
            maxX: childBox.minX,
            maxY: childBox.maxY + _dy,
          };
        }

        hotAreas.push({
          ...box,
          parent: child,
          id: undefined + undefined + child.id + postFix,
          nth: 0,
          color: 'green',
          side: child.side,
          addOrder: 'push',
        });
      }
    }, (parent) => {
      return parent.children;
    });
    this.set('hotAreas', hotAreas);
    showHotArea && this._drawHotAreaShape();
  }

  hideHotArea() {
    const graph = this.get('_graph');
    const hotAreaGroup = this.get('hotAreaGroup');
    hotAreaGroup.clear();
    graph.draw();
    this.set('showHotArea', false);
  }

  // 显示交互热区
  showHotArea() {
    this._drawHotAreaShape();
    this.set('showHotArea', true);
  }

  // 热区击中
  getHotArea(point) {
    const hotAreas = this.get('hotAreas');
    let rst;
    hotAreas.forEach((hotArea) => {
      if (point.x > hotArea.minX && point.x < hotArea.maxX && point.y > hotArea.minY && point.y < hotArea.maxY) {
        rst = hotArea;
        return false;
      }
    });
    return rst;
  }

  saveExpandImage(options) {
    const graph = this.getGraph();
    const box = graph.getBBox();
    const padding = graph.getFitViewPadding();
    let collapsedIds;
    let seletedIds;
    let activedIds;
    return graph.saveImage({
      width: box.width + padding[1] + padding[3],
      height: box.height + padding[0] + padding[2],
      beforeTransform: () => {
        const nodes = graph.getNodes();
        collapsedIds = nodes.filter((node) => {
          return node.getModel().collapsed;
        }).map((node) => {
          return node.getModel().id;
        });
        collapsedIds.forEach((collapsedId) => {
          graph.update(collapsedId, {
            collapsed: false,
          });
        });
        graph.layout();
        seletedIds = this.getSelected().map((item) => {
          return item.id;
        });
        activedIds = this.getSelected().map((item) => {
          return item.id;
        });

        this.clearSelected();

        this.clearActived();
      },
      afterTransform: () => {
        collapsedIds.forEach((collapsedId) => {
          graph.update(collapsedId, {
            collapsed: true,
          });
        });
        this.setSelected(seletedIds, true);
        this.setActived(activedIds, true);
      },
      ...options,
    });
  }

  save() {
    const graph = this.get('_graph');
    const data = graph.save();
    data.roots.forEach((root) => {
      Util.traverseTree(root, (child) => {
        delete child.x;
        delete child.y;
        delete child.width;
        delete child.height;
        delete child.parent;
        delete child.nth;
        delete child.hierarchy;
        delete child.index;
        delete child.shape;
      }, (parent) => {
        return parent.children;
      }, true);
    });
    return data;
  }
}

Util.each(Mixins, (Mixin) => {
  Util.mix(Mind.prototype, Mixin.AUGMENT);
});
Page.setRegister(Mind, 'mind', 'page');
export default Mind;
