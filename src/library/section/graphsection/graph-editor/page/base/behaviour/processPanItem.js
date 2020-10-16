import Page from '../page';

Page.registerBehaviour('processPanItem', (page) => {
  const graph = page.getGraph();
  graph.behaviourOn('mousemove', (ev) => {
    const delegation = page.get('panItemDelegation');
    if (delegation) {
      const startPoint = page.get('panItemStartPoint');
      const startBox = page.get('panItemStartBox');
      const dx = ev.x - startPoint.x;
      const dy = ev.y - startPoint.y;
      const point = page.align({
        x: startBox.minX + dx,
        y: startBox.minY + dy,
      }, {
        width: startBox.width,
        height: startBox.height,
      });
      delegation.attr({
        x: point.x,
        y: point.y,
      });
      graph.emit('itempanning', ev);
      graph.draw();
    }
  });
});
