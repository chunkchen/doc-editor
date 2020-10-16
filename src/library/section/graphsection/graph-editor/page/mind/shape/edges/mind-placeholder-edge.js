import Mind from '../../mind';

Mind.registerEdge('mind-placeholder-edge', {
  getOriginShapeObject(item) {
    const tree = item.getGraph();
    const shapeObj = tree.getShapeObj('edge', {
      shape: 'mind-edge',
    });
    return shapeObj;
  },
  getPath(item) {
    const shapeObj = this.getOriginShapeObject(item);
    return shapeObj.getPath(item);
  },
  getStyle(item) {
    const shapeObj = this.getOriginShapeObject(item);
    const style = shapeObj.getStyle(item);
    return {
      ...style,
      stroke: '#91D5FF',
    };
  },
});
