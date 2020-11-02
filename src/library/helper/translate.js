import {EventEmitter2} from 'eventemitter2';
import Engine from '@hicooper/doc-engine/lib';
import ajax from '@itellyou/itellyou-ajax';

const {NodeUtils, $} = Engine;

class Translate extends EventEmitter2 {
  constructor({engine}) {
    super();
    this.engine = engine;
  }

  // 获取能保持段落格式的最小段落元素
  // <p></p> : <p></p>
  // <ul><li></li></ul> : <li></li>
  _getMiniParagraphElements(childNodes) {
    const rst = [];
    childNodes.forEach((p) => {
      if (p.tagName === 'UL') {
        p.childNodes.forEach((li) => {
          rst.push(li);
        });
      } else {
        rst.push(p);
      }
    });
    return rst;
  }

  _getSourceText(_ref) {
    const {childNodes, isCrossRow} = _ref;
    let rst = '';

    if (isCrossRow) {
      const paragraphElements = this._getMiniParagraphElements(childNodes);
      paragraphElements.forEach((node) => {
        rst += `${node.innerText}\n`;
      });
    } else {
      const div = document.createElement('div');
      childNodes.forEach((node) => {
        div.append(node);
      });
      rst = div.innerText;
    }
    return rst;
  }

  _translateFragment(_ref) {
    const {isCrossRow, targetPlainText, fragment} = _ref;

    if (isCrossRow) {
      const textSplit = targetPlainText.split('\n');
      const paragraphElements = this._getMiniParagraphElements(fragment.childNodes);

      paragraphElements.forEach((node, index) => {
        node.innerHTML = Engine.StringUtils.escape(textSplit[index]);
      });
    } else {
      fragment.append(document.createTextNode(targetPlainText));
    }
  }

  _getChildNodes(fragment) {
    const childNodes = Array.from(fragment.childNodes).filter((node) => {
      // 只取非Section内的元素
      return !this.engine.section.closest(node);
    });
    childNodes.forEach((node) => {
      // 删除里面的Section元素
      NodeUtils.walkTree(node, (sub) => {
        if (this.engine.section.closest(sub)) {
          sub.parentNode.removeChild(sub);
        }
      });
    });
    return childNodes;
  }

  translate(range, source, target) {
    if (!range || !source || !target || this.engine.section.closest(range.commonAncestorContainer) // 在Section里的内容不翻译
      || $(range.commonAncestorContainer).closest('.sub-editor-content')[0] // TODO：在表格子编辑器的内容暂时不翻译
    ) {
      return;
    }

    const fragment = range.cloneContents();
    const isCrossRow = $(range.commonAncestorContainer).isRoot() || range.commonAncestorContainer.tagName === 'UL';
    const childNodes = this._getChildNodes(fragment);
    const q = this._getSourceText({
      childNodes,
      isCrossRow,
    });

    if (!q || q === '\n\n' || q === ' ') {
      // 双击行尾会触发换行，过滤双换行符
      return;
    }

    const options = this.engine.options.translate;
    ajax({
      url: options.action,
      dataType: 'json',
      data: {
        text: q,
        source,
        target,
      },
      success: (res) => {
        if (res.result) {
          const targetPlainText = res.data;
          this._translateFragment({
            isCrossRow,
            targetPlainText,
            fragment,
          });

          this.emit('success', {
            targetPlainText,
            // 翻文
            fragment,
          });
        } else {
          this.emit('fail', {
            errorMsg: res.message,
          });
        }
      },
      error: (err) => {
        this.emit('fail', {
          errorMsg: err.message,
        });
      },
      method: 'POST',
    });
  }
}

export default Translate;
