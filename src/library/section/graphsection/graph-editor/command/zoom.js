import Command from './command';

function zoomexecute(editor) {
  const page = editor.getCurrentPage();
  this.matrixCache = page.getMatrix().slice(0);
  this._zoom(editor);
  page.updateStatus();
}

// 视口缩放类回滚
function zoomBack(editor) {
  const page = editor.getCurrentPage();
  page.updateMatrix(this.matrixCache);
}

Command.registerCommand('zoomTo', {
  _zoom(editor) {
    const page = editor.getCurrentPage();
    page.zoom(Number(this.zoom));
  },
  queue: false,
  execute: zoomexecute,
  back: zoomBack,
});
Command.registerCommand('zoomIn', {
  enable(editor) {
    const page = editor.getCurrentPage();
    const maxZoom = page.getMaxZoom();
    const minZoom = page.getMinZoom();
    const zoom = page.getZoom();
    return zoom < maxZoom || zoom === minZoom;
  },
  _zoom(editor) {
    const page = editor.getCurrentPage();
    const cfg = editor.get('_command');
    const zoom = page.getZoom();
    const maxZoom = page.getMaxZoom();
    let toZoom = zoom + cfg.zoomDelta;

    if (toZoom >= maxZoom) {
      toZoom = maxZoom;
    }
    page.zoom(toZoom);
  },
  queue: false,
  execute: zoomexecute,
  back: zoomBack,
  shortcutCodes: [['metaKey', '='], ['ctrlKey', '=']],
});
Command.registerCommand('zoomOut', {
  enable(editor) {
    const page = editor.getCurrentPage();
    const maxZoom = page.getMaxZoom();
    const minZoom = page.getMinZoom();
    const zoom = page.getZoom();
    return zoom > minZoom || zoom === maxZoom;
  },
  _zoom(editor) {
    const page = editor.getCurrentPage();
    const zoom = page.getZoom();
    const minZoom = page.getMinZoom();
    const cfg = editor.get('_command');
    let toZoom = zoom - cfg.zoomDelta;

    if (toZoom <= minZoom) {
      toZoom = minZoom;
    }

    page.zoom(toZoom);
  },
  queue: false,
  execute: zoomexecute,
  back: zoomBack,
  shortcutCodes: [['metaKey', '-'], ['ctrlKey', '-']],
});
Command.registerCommand('autoZoom', {
  enable() {
    return true;
  },
  _zoom(editor) {
    const page = editor.getCurrentPage();
    page.autoZoom();
  },
  queue: false,
  execute: zoomexecute,
  back: zoomBack,
});
Command.registerCommand('resetZoom', {
  enable() {
    return true;
  },
  _zoom(editor) {
    const page = editor.getCurrentPage();
    page.resetZoom();
  },
  queue: false,
  execute: zoomexecute,
  back: zoomBack,
  shortcutCodes: [['metaKey', '0'], ['ctrlKey', '0']],
});
