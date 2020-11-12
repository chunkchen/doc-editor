import React from 'react';
import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine';
import { EventEmitter2 } from 'eventemitter2';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default';
import Zoom from './zoom';
import './pswp.css';
import 'photoswipe/dist/photoswipe.css';

const { mobile } = Engine.userAgent;

class Pswp extends EventEmitter2 {
  constructor(options) {
    super();
    this.options = Object.assign({
      pswpOptions: {
        shareEl: false,
        fullscreenEl: false,
        zoomEl: false,
        history: false,
        dragging: mobile,
        closeOnScroll: false,
        preloaderEl: false,
        captionEl: false,
        counterEl: false,
        clickToCloseNonZoomable: false,
        showAnimationDuration: 0,
        hideAnimationDuration: 0,
        closeOnVerticalDrag: mobile,
        tapToClose: true,
        barsSize: {
          top: 44,
          bottom: 80,
        },
      },
    }, options);
    this.images = [];
    this.pswpDestroy = true;
    this.timeouts = {};
    this._initRoot();
  }

  _initRoot() {
    const root = Engine.$('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">' +
      '<div class="pswp__bg"></div><div class="pswp__scroll-wrap">' +
      '<div class="pswp__container">' +
      '<div class="pswp__item"></div>' +
      '<div class="pswp__item"></div>' +
      '<div class="pswp__item"></div></div>' +
      '<div class="pswp__ui pswp__ui--hidden">' +
      '<button class="pswp__button lake-pswp-button-close" title="Close (Esc)" />' +
      '<div class="lake-pswp-custom-top-bar"></div>' +
      '</div></div></div>');
    const toolbarContainer = root.find('.lake-pswp-custom-top-bar');
    const closeBtnContainer = root.find('.lake-pswp-button-close');
    this.root = root;
    this.toolbarContainer = toolbarContainer;
    this.closeBtnContainer = closeBtnContainer;
    root.addClass(mobile ? 'lake-pswp-mobile' : 'lake-pswp-pc');
    Engine.$(document.body)
      .append(root);
    ReactDOM.render(<Zoom
      imageBrowser={this}
    />, toolbarContainer[0], () => {
      if (!mobile) {
        this.bindKeyboardEvnet();
        this.bindClickEvent();
        this.hoverControllerFadeInAndOut(toolbarContainer);
      }
    });
  }

  hoverControllerFadeInAndOut() {
    const { toolbarContainer, closeBtnContainer } = this;

    toolbarContainer.on('mouseenter', () => {
      this.removeFadeOut(toolbarContainer, 'toolbarFadeInAndOut');
      this.removeFadeOut(closeBtnContainer, 'closeFadeInAndOut');
    });

    toolbarContainer.on('mouseleave', () => {
      this.fadeOut(toolbarContainer, 'toolbarFadeInAndOut');
      this.fadeOut(closeBtnContainer, 'closeFadeInAndOut');
    });

    closeBtnContainer.on('mouseenter', () => {
      this.removeFadeOut(toolbarContainer, 'toolbarFadeInAndOut');
      this.removeFadeOut(closeBtnContainer, 'closeFadeInAndOut');
    });

    closeBtnContainer.on('mouseleave', () => {
      this.fadeOut(toolbarContainer, 'toolbarFadeInAndOut');
      this.fadeOut(closeBtnContainer, 'closeFadeInAndOut');
    });
  }

  removeFadeOut(node, id) {
    const { timeouts } = this;
    if (timeouts[id]) {
      clearTimeout(timeouts[id]);
    }
    node.removeClass('pswp-fade-out');
  }

  fadeOut(node, id) {
    const { timeouts } = this;
    if (timeouts[id]) {
      clearTimeout(timeouts[id]);
    }
    timeouts[id] = setTimeout(() => {
      node.addClass('pswp-fade-out');
    }, 3e3);
  }

  bindClickEvent() {
    const { closeBtnContainer } = this;
    this.root.on('click', (event) => {
      let { target } = event;
      target = Engine.$(target);
      if (target.hasClass('pswp__img')) {
        setTimeout(() => {
          this.currentZoom = null;
          this.afterZoom();
        }, 366);
      }
      if (target.hasClass('pswp__bg') || target.hasClass('lake-pswp-tool-bar')) {
        this.close();
      }
    });
    closeBtnContainer.on('click', () => {
      this.close();
    });
  }

  prev() {
    this.pswp.prev();
  }

  next() {
    this.pswp.next();
  }

  renderCounter() {
    const { pswp } = this;
    this.toolbarContainer.find('.lake-pswp-counter')
      .html(''.concat(pswp.getCurrentIndex() + 1, ' / ')
        .concat(pswp.items.length));
  }

  getCurrentZoomLevel() {
    return (this.currentZoom && +this.currentZoom.toFixed(2)) || (this.pswp && +this.pswp.getZoomLevel()
      .toFixed(2));
  }

  zoomTo(zoom) {
    const { pswp } = this;
    pswp.zoomTo(zoom, {
      x: pswp.viewportSize.x / 2,
      y: pswp.viewportSize.y / 2,
    }, 100);
    this.currentZoom = zoom;
    this.afterZoom();
  }

  zoomIn() {
    const zoom = this.getCurrentZoomLevel();
    let newZoom = zoom + 0.2;
    if (zoom !== 5) {
      if (newZoom > 5) newZoom = 5;
      this.zoomTo(newZoom);
    }
  }

  zoomOut() {
    const zoom = this.getCurrentZoomLevel();
    if (zoom !== 0.05) {
      let newZoom = zoom - 0.2;
      if (newZoom < 0.05) {
        newZoom = 0.05;
      }
      this.zoomTo(newZoom);
    }
  }

  bindKeyboardEvnet() {
    this.root.on('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.keyCode === 187) {
        event.preventDefault();
        this.zoomIn();
      }
      if (Engine.isHotkey('mod+-', event)) {
        event.preventDefault();
        this.zoomOut();
      }
    });
  }

  zoomToOriginSize() {
    this.zoomTo(1);
  }

  zoomToBestSize() {
    const zoom = this.getInitialZoomLevel();
    this.zoomTo(zoom);
  }

  updateCursor() {
    const { root } = this;
    const currentZoomLevel = this.getCurrentZoomLevel();
    const initialZoomLevel = this.getInitialZoomLevel();
    if (currentZoomLevel === 1) {
      root.addClass('pswp--zoomed-in');
    } else if (currentZoomLevel === initialZoomLevel) {
      root.removeClass('pswp--zoomed-in');
    }
  }

  getInitialZoomLevel() {
    return +this.pswp.currItem.initialZoomLevel.toFixed(2);
  }

  afterZoom() {
    this.updateCursor();
    this.emit('afterzoom');
  }

  getCount() {
    return this.pswp.items.length;
  }

  afterChange() {
    if (!mobile) {
      const initialZoomLevel = this.getInitialZoomLevel();
      this.renderCounter();
      this.currentZoom = initialZoomLevel;
      setTimeout(() => {
        this.afterZoom();
      }, 100);
      this.emit('afterchange');
      this.currentZoom = this.getInitialZoomLevel();
    }
    this.setWhiteBackground();
  }

  bindPswpEvent() {
    const { pswp } = this;
    pswp.listen('afterChange', () => {
      this.afterChange();
    });
    pswp.listen('destroy', () => {
      this.pswpDestroy = true;
    });
    pswp.listen('resize', () => {
      this.emit('resize');
    });
    pswp.listen('imageLoadComplete', () => {
      this.setWhiteBackground();
    });
  }

  setWhiteBackground() {
    this.root.find('.pswp__img')
      .each((img) => {
        if (img.complete) {
          img.style.background = 'white';
          img.style['box-shadow'] = '0 0 10px rgba(0, 0, 0, 0.5)';
        } else {
          img.onload = () => {
            img.style.background = 'white';
            img.style['box-shadow'] = '0 0 10px rgba(0, 0, 0, 0.5)';
          };
        }
      });
  }

  open(items, index) {
    if (this.pswpDestroy === true) {
      const { root } = this;
      const pswp = new PhotoSwipe(root[0], PhotoSwipeUI, items, Object.assign({
        index,
      }, this.options.pswpOptions));
      pswp.items = items;
      pswp.init();
      this.pswp = pswp;
      this.pswpDestroy = false;
      if (!mobile) {
        this.toolbarContainer.removeClass('pswp-fade-out');
        this.fadeOut(this.toolbarContainer, 'toolbarFadeInAndOut');
        this.closeBtnContainer.removeClass('pswp-fade-out');
        this.fadeOut(this.closeBtnContainer, 'closeFadeInAndOut');
      }
      root.removeClass('pswp-fade-in');
      root.addClass('pswp-fade-in');
      this.afterChange();
      this.bindPswpEvent();
    }
  }

  close() {
    this.pswp.close();
  }

  destroy() {
    this.close();
    this.options = null;
  }
}

export default Pswp;
