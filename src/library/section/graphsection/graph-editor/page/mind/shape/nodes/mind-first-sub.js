import Mind from '../../mind';

Mind.registerNode('mind-first-sub', {
  dy: 0,
  getPadding() {
    return [6, 12, 8, 12];
  },
  getLabelStyle() {
    return {
      fill: 'rgba(38,38,38,0.85)',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 20,
    };
  },
});
