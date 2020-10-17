import Engine from 'doc-engine/lib';

const { userAgent: { safari } } = Engine;

function handleKeydownSlash(e) {
  let range = this.change.getRange();
  const block = Engine.ChangeUtils.getClosestBlock(range.startContainer);
  const chars = block.text().trim();
  if (chars === '/' && safari) {
    block.empty();
  }

  if (chars === '' || (chars === '/' && safari) || e.ctrlKey || e.metaKey) {
    range = this.change.getRange();
    if (range.collapsed) {
      e.preventDefault();
      this.history.stop();
      const section = this.change.insertSection('sectionselect');
      this.change.activateSection(section);
      range = this.change.getRange();
      this.history.start();
      const node = section.find('.lake-sectionselect-keyword');
      range.selectNodeContents(node[0]);
      range.collapse(false);
      this.change.select(range);
    }
  }
}

export default {
  initialize() {
    this.on('keydown:slash', (e) => {
      handleKeydownSlash.call(this, e);
    });
  },
};

export {
  handleKeydownSlash,
};
