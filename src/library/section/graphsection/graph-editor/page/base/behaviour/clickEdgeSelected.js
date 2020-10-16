import Page from '../page';

Page.registerBehaviour('clickEdgeSelected', (page) => {
  const graph = page.getGraph();
  graph.behaviourOn('edge:click', (ev) => {
    const multiSelectable = page.get('multiSelectable');

    if (multiSelectable && page.getSignal('shiftKeyDown') === true) {
      page.setSelected(ev.item.id, true);
    } else {
      page.clearActived();
      page.clearSelected();
      page.setSelected(ev.item.id, true);
    }
  });
});
