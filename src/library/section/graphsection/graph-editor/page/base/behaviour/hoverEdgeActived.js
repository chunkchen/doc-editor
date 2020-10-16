import Page from '../page';

Page.registerBehaviour('hoverEdgeActived', (page) => {
  const graph = page.getGraph();
  graph.behaviourOn('edge:mouseenter', (ev) => {
    if (page.getSignal('panningItem') || ev.item && ev.item.isSelected || page.getSignal('dragEdge')) {
      return;
    }

    page.setActived(ev.item, true);
  });
  graph.behaviourOn('edge:mouseleave', (ev) => {
    page.setActived(ev.item, false);
  });
});
