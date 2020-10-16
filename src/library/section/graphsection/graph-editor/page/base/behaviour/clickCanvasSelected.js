import Page from '../page';

Page.registerBehaviour('clickCanvasSelected', (page) => {
  const graph = page.getGraph();
  graph.behaviourOn('click', (ev) => {
    if (!ev.shape) {
      page.clearSelected();
      page.clearActived();
      page.updateStatus();
    }
  });
  graph.behaviourOn('contextmenu', (ev) => {
    if (!ev.shape) {
      page.clearSelected();
      page.clearActived();
      page.updateStatus();
    }
  });
});
