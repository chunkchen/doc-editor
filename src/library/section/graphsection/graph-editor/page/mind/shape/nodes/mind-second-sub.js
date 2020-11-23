import Mind from '../../mind'

Mind.registerNode('mind-second-sub', {
  dy: 0,
  getPadding() {
    return [8, 4, 8, 4]
  },
  getLabelStyle() {
    return {
      fill: 'rgba(38,38,38,0.85)',
      fontSize: 12,
      lineHeight: 20,
    }
  },
})
