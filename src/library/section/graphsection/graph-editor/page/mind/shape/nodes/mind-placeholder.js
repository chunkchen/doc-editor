import Mind from '../../mind';
import Util from '../../util';

Mind.registerNode('mind-placeholder', {
  afterDraw(item) {
    const keyShape = item.getKeyShape();
    keyShape.isPlaceholder = true;
  },
  getPath(item) {
    const model = item.getModel();
    const parentModel = model.parentModel;
    const style = this.getStyle(item);
    const width = 55;
    let height;
    let Edetal = 0;

    if (parentModel.hierarchy <= 2) {
      height = 28;
    } else {
      height = 20;
      Edetal = 4;
    }

    return Util.getRectPath(-width / 2, -height / 2 + Edetal, width, height, style.radius);
  },
  getStyle() {
    return {
      fill: '#91D5FF',
      radius: 4,
      lineWidth: 3,
    };
  },
  drawExpandedButton() {
  },
  drawCollapsedButton() {
  },
  anchor() {
    return [[0, 1], [1, 1]];
  },
});
