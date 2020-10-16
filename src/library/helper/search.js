import { EventEmitter2 } from 'eventemitter2';
import Engine from 'doc-engine/lib';
import TinyCanvas from './tiny-canvas';
import { getHeight, getRangesByText, getStyle, getTextNodes, getWidth, isInViewport } from '../utils/dom';
import { isFunction, isNil, isNumber, isString } from '../utils/type';

/**
 * @fileOverview 查找 && 替换
 */

class Search extends EventEmitter2 {
  constructor(options) {
    super(options);
    this._filter = (e) => {
      return !(e.getAttribute('data-section-key') && !this.engine.section.getComponent(Engine.$(e)).constructor.canSearch);
    };
    if (!options.target) throw new Error('please set a dom element as target!');
    this.options = {
      /**
       * dom element
       * @type {Object}
       */
      target: null,

      /**
       * style
       * @type {Object}
       */
      style:
        {
          highlight: {
            fill: 'rgba(255, 230, 0, 0.5)',
          },
          select: {
            fill: 'rgba(255, 140, 0, 0.5)',
          },
        },

      /**
       * filter
       * @type {Function|Null}
       */
      filter: null,
      ...options,
    };
    this.ranges = []; // cache finded ranges

    this._initTarget();

    this._createCanvas();
    this.engine = options.engine;
  }


  _saveSectionValue(range) {
    const root = this.engine.section.closest(range.commonAncestorContainer);
    if (root) {
      this.engine.section.getComponent(root).saveValue();
    }
  }

  _initTarget() {
    const target = this.options.target;
    if (getStyle(target, 'position') === 'static') {
      target.style.position = 'relative';
    }
  }

  _createCanvas() {
    const target = this.options.target;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = 0;
    container.style.left = 0;
    container.style['pointer-events'] = 'none';
    target.appendChild(container);

    const canvas = new TinyCanvas({
      container,
    });
    this.container = container;
    this.canvas = canvas;
  }

  _resizeCanvas() {
    const target = this.options.target;
    this.canvas.resize(getWidth(target), getHeight(target));
  }

  _getRelativeRect(range) {
    const container = this.container;
    const rangeBoundingClientRect = range.getBoundingClientRect();
    const containerBoundingClientRect = container.getBoundingClientRect();
    return {
      x: rangeBoundingClientRect.left - containerBoundingClientRect.left,
      y: rangeBoundingClientRect.top - containerBoundingClientRect.top,
      width: rangeBoundingClientRect.right - rangeBoundingClientRect.left,
      height: rangeBoundingClientRect.bottom - rangeBoundingClientRect.top,
    };
  }

  _cacheRange(range) {
    return {
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      startContainer: range.startContainer,
      endContainer: range.endContainer,
      commonAncestorContainer: range.commonAncestorContainer,
    };
  }

  _isRangeWrap(range) {
    const cache = this._cacheRange(range);

    range.setEnd(cache.startContainer, cache.startOffset + 1);
    const startBox = range.getBoundingClientRect();
    range.setEnd(cache.startContainer, cache.endOffset - 1);
    range.setStart(cache.endContainer, cache.endOffset);
    const endBox = range.getBoundingClientRect();
    range.setStart(cache.startContainer, cache.startOffset);
    range.setEnd(cache.endContainer, cache.endOffset);
    return startBox.bottom !== endBox.bottom;
  }

  _drawOneByOne(range, options) {
    const cache = this._cacheRange(range);
    let cursor = cache.startOffset;
    while (cursor < cache.endOffset) {
      range.setStart(cache.commonAncestorContainer, cursor);
      range.setEnd(cache.commonAncestorContainer, cursor + 1);

      const rect = this._getRelativeRect(range);
      this.canvas.clearRect(rect);
      this.canvas.draw('Rect', Object.assign({}, rect, options));
      cursor++;
    }

    range.setStart(cache.startContainer, cache.startOffset);
    range.setEnd(cache.endContainer, cache.endOffset);
  }

  _drawRangeBackground(range, _ref) {
    const isWrap = this._isRangeWrap(range);
    if (isWrap) return this._drawOneByOne(range, _ref);
    const rect = this._getRelativeRect(range);
    this.canvas.clearRect(rect);
    this.canvas.draw('Rect', Object.assign({}, rect, _ref));
  }

  _highlightRanges(ranges) {
    ranges.forEach((range) => {
      this._highlightRange(range);
    });
  }

  _clearRange(range) {
    const rect = this._getRelativeRect(range);
    this.canvas.clearRect(rect);
  }

  _highlightRange(range) {
    const highlight = this.options.style.highlight;
    this._drawRangeBackground(range, highlight);
  }

  _selectRange(range) {
    const select = this.options.style.select;
    this._drawRangeBackground(range, select);
  }

  _clearCanvas() {
    this.canvas.clear();
  }

  _move(offset) {
    const { selectedRange, ranges } = this;

    if (!selectedRange) {
      return;
    }

    const selectedRangeIndex = ranges.indexOf(selectedRange);
    let nextRange = ranges[selectedRangeIndex + offset];
    if (!nextRange) {
      if (offset > 0) {
        nextRange = ranges[offset - 1];
      } else {
        nextRange = ranges[ranges.length + offset];
      }
    }
    this._highlightRange(selectedRange);
    this.select(nextRange);
    this.scrollIntoView();
  }

  _replace(range, replacement) {
    const node = range.commonAncestorContainer;
    const parentNode = node.parentNode;
    const textNode = document.createTextNode(replacement);

    if (parentNode.tagName === 'A') {
      const href = parentNode.getAttribute('href');
      const text = parentNode.innerText;
      if (href === text) parentNode.setAttribute('href', replacement);
    }
    range.deleteContents();
    range.insertNode(textNode);
  }

  replace(replacement) {
    if (isNil(replacement)) {
      return;
    }

    const { selectedRange, ranges } = this;

    if (ranges.length > 0) {
      const evObj = {
        range: selectedRange,
      };
      this.emit('before:replace', evObj);
      this._replace(selectedRange, replacement);
      this._clearRange(selectedRange);
      this.emit('after:replace', evObj);
      this._saveSectionValue(selectedRange);
      this.engine.history.save();
    }
  }

  replaceAll(replacement) {
    if (isNil(replacement)) {
      return;
    }

    const ranges = this.ranges;
    const evObj = {
      ranges,
    };
    this.emit('before:replaceAll', evObj);
    ranges.forEach((range) => {
      this._replace(range, replacement);
    });
    this.emit('after:replaceAll', evObj);
    ranges.forEach((range) => {
      this._saveSectionValue(range);
    });
    this.engine.history.save();
    this.clear();
  }

  show() {
    this.container.style.display = '';
  }

  hide() {
    this.container.style.display = 'none';
  }

  /**
   * set aim text in target dom
   * @param  {String} keyword - search key word
   * @param  {String} filter - filter need search child element
   * @return {Array} ranges
   */
  find(keyword, filter) {
    let ranges = [];
    this.clear();

    if (keyword && isString(keyword) && keyword.length > 0) {
      filter = isFunction(filter) ? filter : this._filter;

      this._resizeCanvas();
      const target = this.options.target;
      const textNodes = getTextNodes(target, filter);

      if (textNodes.length > 0) {
        ranges = getRangesByText(textNodes, keyword);
        this._highlightRanges(ranges);
        this.ranges = ranges;
        this.keyword = keyword;
      }
    }

    this.ranges = ranges;
    return ranges;
  }

  reFind() {
    const selectedRangeIndex = this.selectedRangeIndex;
    const ranges = this.find(this.keyword);

    if (ranges.length > 0) {
      if (!isNil(selectedRangeIndex)) {
        const range = ranges[selectedRangeIndex] ? ranges[selectedRangeIndex] : ranges[0];
        this.select(range);
      }
    }
    return ranges;
  }

  scrollIntoView() {
    if (this.selectedRange) {
      const element = this.selectedRange.commonAncestorContainer.parentElement;
      if (!isInViewport(element)) element.scrollIntoView({ block: 'center' });
    }
  }

  select(param) {
    if (isNil(param)) {
      return;
    }
    const ranges = this.ranges;
    let range = param;

    if (isNumber(param)) {
      range = ranges[param];
    }

    const evObj = {
      range,
    };
    this.emit('before:select', evObj);
    this._selectRange(range);
    this.selectedRange = range;
    this.selectedRangeIndex = ranges.indexOf(range);
    this.emit('after:select', evObj);
  }

  next() {
    this._move(1);
  }

  prev() {
    this._move(-1);
  }

  clear() {
    this._clearCanvas();
    this.selectedRange = undefined;
    this.ranges = [];
    this.keyword = undefined;
  }

  count() {
    const ranges = this.ranges;
    if (ranges.length === 0) {
      return 0;
    }
    const selectedRange = this.selectedRange;
    return [ranges.indexOf(selectedRange) + 1, ranges.length];
  }

  destroy() {
    this.options = null;
    this.container.parentElement.removeChild(this.container);
  }
}

export default Search;
