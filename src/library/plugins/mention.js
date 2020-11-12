import Engine from '@hicooper/doc-engine';

function handleKeydownAt(e) {
  const range = this.change.getRange();
  if (!range.collapsed) {
    return;
  }

  const bookmark = Engine.RangeUtils.createBookmark(range);
  const prevNode = Engine.$(bookmark.anchor)
    .prev();
  const prevText = prevNode && prevNode.isText() ? prevNode[0].nodeValue : '';
  Engine.RangeUtils.moveToBookmark(range, bookmark);
  // 前面有非空格文本时，应该要输入普通 at 字符

  if (/[^\s@]$/.test(prevText)) {
    return;
  }

  e.preventDefault(); // 插入 @，并弹出选择器

  this.history.stop();
  const sectionRoot = this.change.insertSection('mention');
  const component = this.section.getComponent(sectionRoot);
  component.renderSuggestion();
  this.history.start(); // 焦点移动到 A 标签输入区域，用于继续输入搜索关键词

  const input = sectionRoot.find('.lake-mention-at');
  range.selectNodeContents(input[0]);
  range.collapse(false);
  this.change.select(range);
}

export default {
  initialize() {
    this.on('keydown:at', (e) => {
      handleKeydownAt.call(this, e);
    });
  },
};

export {
  handleKeydownAt,
};
