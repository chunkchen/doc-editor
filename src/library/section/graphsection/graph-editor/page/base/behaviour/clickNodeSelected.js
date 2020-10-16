import Page from '../page';

Page.registerBehaviour('clickNodeSelected', (page) => {
  const graph = page.getGraph();
  graph.behaviourOn('node:click', (ev) => {
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
