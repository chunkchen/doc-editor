import Page from '../page';

Page.registerBehaviour('hoverNodeActived', (page) => {
  const graph = page.getGraph();
  let hoverItem;
  graph.behaviourOn('node:mouseenter', (ev) => {
    if (page.getSignal('panningItem') || page.getSignal('dragEdge') || ev.item && ev.item.isSelected) {
      return;
    }

    hoverItem = ev.item;
    page.setActived(hoverItem, true);
  });
  graph.behaviourOn('node:mouseleave', (ev) => {
    const toShape = ev.toShape;

    if (!hoverItem) {
      return;
    }

    if (toShape && toShape.isAnchor && toShape.getItem() === hoverItem || page.getSignal('dragEdge')) {
      return;
    }

    if (!hoverItem.isSelected) {
      page.setActived(hoverItem, false);
    }

    resetStatus();
  });

  function resetStatus() {
    hoverItem = undefined;
  }
});
