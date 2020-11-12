export const addScrollAndResizeEventListener = (instance) => {
  const callback = () => {
    instance.updateEditorPosition();
  };
  instance.scrollAndResizeCallback = callback;
  window.addEventListener('scroll', callback, true);
  window.addEventListener('resize', callback, true);
};

export const removeScrollAndResizeEventListener = (instance) => {
  const callback = instance.scrollAndResizeCallback;
  window.removeEventListener('scroll', callback, true);
  window.removeEventListener('resize', callback, true);
};

export const setCursor = (instance) => {
  instance.css('cursor', 'pointer');
  instance.attr('draggable', !0);
  instance.css('user-select', 'none');
};

export const bindKeydownEvent = (instance) => {
  const { editorContainer, engine, sectionRoot } = instance;
  const callback = instance.callback === undefined ? (event) => {
    return [13, 27].indexOf(event.keyCode) !== -1;
  } : instance.callback;
  editorContainer.attr('tabIndex', 0);
  editorContainer.on('keydown', (event) => {
    if (engine && callback(event)) {
      event.preventDefault();
      engine.change.activateSection(document.body, 'manual');
      engine.change.focusSection(sectionRoot);
    }
  });
  editorContainer.hide();
};
