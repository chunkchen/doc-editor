import Util from '../util';

const Mixin = {};
Mixin.INIT = '_initGraph';
Mixin.AUGMENT = {
  // graph
  _initGraph() {
    const graphCfg = this.get('graph');
    const GraphConstructor = this.get('graphConstructor');
    const graph = new GraphConstructor({
      page: this,
      ...graphCfg,
    });
    graph.draw();
    this.set('_graph', graph);
  },
  setMaxZoom(zoom) {
    const graph = this.get('_graph');
    graph.set('maxZoom', zoom);
  },
  setMinZoom(zoom) {
    const graph = this.get('_graph');
    graph.set('minZoom', zoom);
  },
  setFitView(fitView) {
    const graph = this.get('_graph');
    graph.setFitView(fitView);
  },
  getGraphContainer() {
    const graph = this.get('_graph');
    return graph.getGraphContainer();
  },
  getMouseEventWrapper() {
    const graph = this.get('_graph');
    return graph.getMouseEventWrapper();
  },
  getCanvas() {
    const graph = this.get('_graph');
    return graph.getCanvas();
  },
  changeMode(mode) {
    const graph = this.get('_graph');
    graph.changeMode(mode);
  },
  updateMatrix(matrix) {
    const graph = this.get('_graph');
    graph.updateMatrix(matrix);
  },
  getMode() {
    const graph = this.get('_graph');
    return graph.get('mode');
  },
  getMatrix() {
    const graph = this.get('_graph');
    const matrix = graph.getMatrix();
    return matrix;
  },
  getZoom() {
    const graph = this.get('_graph');
    const matrix = graph.getMatrix();
    return matrix[0];
  },
  getMaxZoom() {
    const graph = this.get('_graph');
    return graph.get('maxZoom');
  },
  getMinZoom() {
    const graph = this.get('_graph');
    return graph.get('minZoom');
  },
  getGraph() {
    return this.get('_graph');
  },
  getItems() {
    const graph = this.get('_graph');
    return graph.getItems();
  },
  getNodes() {
    const graph = this.get('_graph');
    return graph.getNodes();
  },
  translate(dx, dy) {
    const graph = this.get('_graph');
    return graph.translate(dx, dy);
  },
  getEdges() {
    const graph = this.get('_graph');
    return graph.getEdges();
  },
  getGroups() {
    const graph = this.get('_graph');
    return graph.getGroups();
  },
  render() {
    const graph = this.get('_graph');
    graph.render();
    return this;
  },
  add(type, model) {
    const graph = this.get('_graph');
    graph.add(type, model);
    return this;
  },
  forceFit(type) {
    const graph = this.get('_graph');
    graph.forceFit(type);
  },
  focusPointByDom(domPoint) {
    const graph = this.get('_graph');
    graph.focusPointByDom(domPoint);
    return this;
  },
  focusPoint(graphPoint) {
    const graph = this.get('_graph');
    graph.focusPoint(graphPoint);
    return this;
  },
  find(id) {
    const graph = this.get('_graph');
    return graph.find(id);
  },
  focus(id) {
    const graph = this.get('_graph');
    const item = graph.find(id);

    if (item) {
      const point = item.getCenter();
      graph.focusPoint(point);
    }

    return this;
  },
  save() {
    const graph = this.get('_graph');
    return graph.save();
  },
  read(data) {
    const graph = this.get('_graph');
    graph.read(data);
  },
  clear() {
    const graph = this.get('_graph');
    graph.clear();
  },
  remove(item) {
    const graph = this.get('_graph');
    graph.remove(item);
    return this;
  },
  update(item, model) {
    const graph = this.get('_graph');
    graph.update(item, model);
    return this;
  },
  zoom(point, ratio) {
    const graph = this.get('_graph');
    graph.zoom(point, ratio);
    return this;
  },
  getDomPoint(graphPoint) {
    const graph = this.get('_graph');
    return graph.getDomPoint(graphPoint);
  },
  getPoint(domPoint) {
    const graph = this.get('_graph');
    return graph.getPoint(domPoint);
  },
  zoomByDom(domPoint, ratio) {
    const graph = this.get('_graph');
    const point = graph.getPoint(domPoint);
    graph.zoom(point, ratio);
    return this;
  },
  autoZoom() {
    const graph = this.get('_graph');
    graph.autoZoom();
    return this;
  },
  resetZoom() {
    const graph = this.get('_graph');
    const width = graph.getWidth();
    const height = graph.getHeight();
    graph.zoomByDom({
      x: width / 2,
      y: height / 2,
    }, 1);
    return this;
  },
  css(style) {
    const graph = this.get('_graph');
    const mouseEventWarrper = graph.getMouseEventWrapper();
    Util.modifyCSS(mouseEventWarrper, style);
  },
  setCapture(bool) {
    const graph = this.get('_graph');
    const rootGroup = graph.getRootGroup();
    rootGroup.set('capture', bool);
  },
  changeSize(width, height) {
    const graph = this.get('_graph');
    graph.changeSize(width, height);
  },
  getWidth() {
    const graph = this.get('_graph');
    return graph.getWidth();
  },
  getHeight() {
    const graph = this.get('_graph');
    return graph.getHeight();
  },
  delete() {
    const selectedItems = this.getSelected();
    const graph = this.get('_graph');
    Util.each(selectedItems, (item) => {
      graph.remove(item);
    });
  },
};
export default Mixin;
