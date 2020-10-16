import Page from '../page';

Page.registerBehaviour('keydownCmdWheelZoom', (page) => {
  const graph = page.getGraph();
  graph.behaviourOn('keydown', (ev) => {
    const domEvent = ev.domEvent;

    if (domEvent.keyCode === 91) {
      page.setSignal('wheelZoom', true);
    }
  });
  graph.behaviourOn('keyup', (ev) => {
    const domEvent = ev.domEvent;

    if (domEvent.keyCode === 91) {
      page.setSignal('wheelZoom', false);
    }
  });
});
