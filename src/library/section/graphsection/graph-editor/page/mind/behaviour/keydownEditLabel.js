import Page from '../../base';

Page.registerBehaviour('keydownEditLabel', (mind) => {
  const graph = mind.getGraph();
  graph.behaviourOn('keydown', (ev) => {
    mind.showLabelEditor(ev);
  });
});
