import {EventEmitter2} from 'eventemitter2';
import {firefox, mobile} from '@hicooper/doc-engine/lib/utils/user-agent';
import Engine from '@hicooper/doc-engine/lib';

class Scrollbar extends EventEmitter2 {
  /**
   * @param {nativeNode} container 需要添加滚动条的容器元素
   * @param {boolean} x 横向滚动条
   * @param {boolean} y 竖向滚动条
   * @param {boolean} needShadow 是否显示阴影
   */
  constructor(container, x, y, needShadow) {
    super();

    this.scrollX = (event) => {
      if (this.slideX.dragging) {
        let left = this.slideX.startScrollLeft + (event.clientX - this.slideX.startX);
        left = Math.max(0, Math.min(left, this.oWidth - this.xWidth));
        this.slideX.css('left', `${left}px`);
        let min = left / (this.oWidth - this.xWidth);
        min = Math.min(1, min);
        this.container[0].scrollLeft = (this.sWidth - this.oWidth) * min;
      }
    };

    this.scrollY = (event) => {
      if (this.slideY.dragging) {
        let top = this.slideY.startScrollTop + (event.clientY - this.slideY.startY);
        top = Math.max(0, Math.min(top, this.oHeight - this.yHeight));
        this.slideY.css('top', `${top}px`);
        let min = top / (this.oHeight - this.yHeight);
        min = Math.min(1, min);
        this.container[0].scrollTop = (this.sHeight - this.oHeight) * min;
      }
    };

    this.scrollXEnd = () => {
      this.slideX.dragging = false;
      document.body.removeEventListener('mousemove', this.scrollX);
      document.body.removeEventListener('mouseup', this.scrollXEnd);
      this.container.removeClass('scrolling');
    };

    this.scrollYEnd = () => {
      this.slideY.dragging = false;
      document.body.removeEventListener('mousemove', this.scrollY);
      document.body.removeEventListener('mouseup', this.scrollYEnd);
      this.container.removeClass('scrolling');
    };

    this.bindXScrollEvent = () => {
      if (this.option.x) {
        this.slideX.on('mousedown', (event) => {
          this.container.addClass('scrolling');
          this.slideX.dragging = true;
          this.slideX.startX = event.clientX;
          this.slideX.startScrollLeft = parseInt(this.slideX.css('left'));
          document.body.addEventListener('mousemove', this.scrollX);
          document.body.addEventListener('mouseup', this.scrollXEnd);
        });
      }
    };

    this.bindYScrollEvent = () => {
      if (this.option.y) {
        this.slideY.on('mousedown', (event) => {
          this.container.addClass('scrolling');
          this.slideY.dragging = true;
          this.slideY.startY = event.clientY;
          this.slideY.startScrollTop = parseInt(this.slideY.css('top'));
          document.body.addEventListener('mousemove', this.scrollY);
          document.body.addEventListener('mouseup', this.scrollYEnd);
        });
      }
    };

    this.reRenderShadow = (width) => {
      if (this.option.needShadow) {
        this.shadowLeft.css('left', `${width}px`);
        this.shadowRight.css('left', `${width + this.oWidth - 4}px`);
        this.shadowLeft.css('display', 'none');
        this.shadowRight.css('display', 'none');
        this.shadowTimer && clearTimeout(this.shadowTimer);
        this.shadowTimer = setTimeout(() => {
          if (width !== 0) {
            this.shadowLeft.css('display', 'block');
          }
          if (width !== this.maxScrollLeft) {
            this.shadowRight.css('display', 'block');
          }
        }, 100);
      }
    };

    this.reRenderX = (left) => {
      if (this.option.x) {
        this.scrollBarX.css('left', `${left}px`);
        let min = left / (this.sWidth - this.oWidth);
        min = Math.min(1, min);
        this.slideX.css('left', `${(this.oWidth - this.xWidth) * min}px`);
        this.reRenderShadow(left);
      }
    };

    this.reRenderY = (top) => {
      if (this.option.y) {
        this.scrollBarY.css('top', `${top}px`);
        let min = top / (this.sHeight - this.oHeight);
        min = Math.min(1, min);
        this.slideY.css('top', `${(this.oHeight - this.yHeight) * min}px`);
      }
    };

    this.bindEvents = () => {
      this.container.on('scroll', (event) => {
        const {target} = event;
        const {scrollTop, scrollLeft} = target;
        this.reRenderX(scrollLeft);
        this.reRenderY(scrollTop);
      });
      this.bindXScrollEvent();
      this.bindYScrollEvent();
    };

    this.refresh = () => {
      if (!firefox && !mobile) {
        const {offsetWidth, offsetHeight, scrollWidth, scrollHeight, scrollLeft, scrollTop} = this.container[0];

        this.oWidth = offsetWidth;
        this.oHeight = offsetHeight;
        this.sWidth = scrollWidth;
        this.sHeight = scrollHeight;
        // x滑块的宽度
        this.xWidth = Math.floor(offsetWidth * offsetWidth / scrollWidth);
        this.yHeight = Math.floor(offsetHeight * offsetHeight / scrollHeight);
        this.maxScrollLeft = scrollWidth - offsetWidth;
        if (this.option.x) {
          this.slideX.css('width', `${this.xWidth}px`);
          this.slideX.css('display', this.oWidth >= this.sWidth ? 'none' : 'block');
        }
        if (this.option.y) {
          this.slideY.css('height', `${this.yHeight}px`);
          this.slideY.css('display', this.oHeight >= this.sHeight ? 'none' : 'block');
        }
        this.reRenderX(scrollLeft);
        this.reRenderY(scrollTop);
      }
    };

    this.container = Engine.$(container);
    this.option = {
      x,
      y,
      needShadow,
    };
    this.init();
  }

  init = () => {
    if (!firefox && !mobile) {
      const children = this.container.children();
      let hasScrollbar = false;
      children.each((child) => {
        if (Engine.$(child).hasClass('lake-scrollbar')) {
          hasScrollbar = true;
        }
      });
      if (!hasScrollbar) {
        this.container.css('position', 'relative');
        this.container.addClass('lake-scrollable');
        if (this.option.x) {
          this.scrollBarX = Engine.$('<div class="lake-scrollbar lake-scrollbar-x "><div class="lake-scrollbar-trigger"></div></div>');
          this.slideX = this.scrollBarX.find('.lake-scrollbar-trigger');
          this.container.append(this.scrollBarX);
          this.container.addClass('scroll-x');
        }
        if (this.option.y) {
          this.scrollBarY = Engine.$('<div class="lake-scrollbar lake-scrollbar-y "><div class="lake-scrollbar-trigger"></div></div>');
          this.slideY = this.scrollBarY.find('.lake-scrollbar-trigger');
          this.container.append(this.scrollBarY);
          this.container.addClass('scroll-y');
        }
        if (this.option.needShadow) {
          this.shadowLeft = Engine.$('<div class="scrollbar-shadow-left"></div>');
          this.shadowRight = Engine.$('<div class="scrollbar-shadow-right"></div>');
          this.container.append(this.shadowLeft);
          this.container.append(this.shadowRight);
        }
        this.refresh();
        this.bindEvents();
      }
    }
  }
}

export default Scrollbar;
