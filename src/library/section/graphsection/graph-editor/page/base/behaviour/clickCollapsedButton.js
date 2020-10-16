import Page from '../page';

Page.registerBehaviour('clickCollapsedButton', (page) => {
  const graph = page.getGraph();
  graph.behaviourOn('click', (ev) => {
    const item = ev.item;
    const shape = ev.shape;

    if (item && shape && shape.isCollapsedButton) {
      const editor = page.editor;
      if (editor) {
        editor.executeCommand('collapseExpand', {
          itemId: item.id,
        });
      } else {
        graph.update(item, {
          collapsed: true,
        });
      }
    }
  });
});
