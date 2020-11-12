import ReactDOM from 'react-dom';
import Engine from '@hicooper/doc-engine/lib';

const template = (data) => {
  return '\n  <div class="lake-image-editor">\n    <img data-role="image-bg" class="lake-image-editor-bg lake-image-editor-bg-active" src="'.concat(data.src, '">\n    <div data-role="holder-45" class="lake-image-editor-holder lake-image-editor-holder-45"></div>\n    <div data-role="holder-135" class="lake-image-editor-holder lake-image-editor-holder-135"></div>\n    <div data-role="holder-225" class="lake-image-editor-holder lake-image-editor-holder-225"></div>\n    <div data-role="holder-315" class="lake-image-editor-holder lake-image-editor-holder-315"></div>\n    <span data-role="number" class="lake-image-editor-number"></span>\n  </div>\n  '); //    <span data-role="maximize" class="lake-image-editor-maximize"><span class="lake-icon lake-icon-full-screen"></span></span>
};

class Resizer {
  constructor(config) {
    this.onMouseDown = (e, angle) => {
      e.preventDefault();
      e.stopPropagation();
      this.root.css('top', angle === 45 || angle === 315 ? 'auto' : 0);
      this.root.css('left', angle === 225 || angle === 315 ? 'auto' : 0);
      this.root.css('bottom', angle === 225 || angle === 135 ? 'auto' : 0);
      this.root.css('right', angle === 45 || angle === 135 ? 'auto' : 0);
      this.mouse = {
        x: e.clientX,
        y: e.clientY,
      };
      this.angle = angle;
      this.resizing = true;
      this.find('number')[0].className = 'lake-image-editor-number lake-image-editor-number-'.concat(angle, ' lake-image-editor-number-active');
      this.image.show();
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    };

    this.onMouseMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const X = e.clientX;
      const Y = e.clientY;

      if (X !== this.mouse.x || Y !== this.mouse.y) {
        const x = this.mouse.x - X;
        const y = this.mouse.y - Y;
        this.updateImageSize(x, y);
      }
      this.resizing = true;
    };

    this.onMouseUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.width = this.root[0].clientWidth;
      this.height = this.root[0].clientHeight;
      this.angle = 0;
      this.resizing = false;
      this.find('number')[0].className = 'lake-image-editor-number';
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);

      this.config.onChange(this.width, this.height);
      this.image.hide();
    };

    this.updateImageSize = (x) => {
      let width;

      if (this.angle < 180) {
        width = this.width - x;
      } else {
        width = this.width + x;
      }
      if (width < 24) {
        width = 24;
      }

      if (width > this.maxWidth) {
        width = this.maxWidth;
      }

      let height = width * this.config.rate;
      if (height < 24) {
        height = 24;
        width = height / this.config.rate;
      }
      width = Math.round(width);
      height = Math.round(height);
      this.setSize(width, height);
    };

    this.setSize = (width, height) => {
      this.root.css({
        width: `${width}px`,
        height: `${height}px`,
      });
      this.find('number')
        .html(''.concat(width, '\xB7')
          .concat(height));
    };

    this.closeZoom = () => {
      const container = Engine.$('#lake-image-zoom-container');
      if (container[0]) {
        ReactDOM.unmountComponentAtNode(container[0]);
      }
      container.remove();
      this.config.onClose();
    };

    this.config = config;
    this.root = Engine.$(template(config));
    this.image = this.find('image-bg');
    // 默认状态
    this.resizing = false;
    this.width = config.width;
    this.height = config.height;
    this.maxWidth = config.maxWidth;
    this.openZoom = config.openZoom;
  }

  find(role) {
    const expr = '[data-role='.concat(role, ']');
    return this.root.find(expr);
  }

  destroy() {
    this.root.remove();
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  render(container) {
    const { width, height } = this.config;
    this.root.css({
      width: ''.concat(width, 'px'),
      height: ''.concat(height, 'px'),
    });
    container.append(this.root);
    this.image.on('dblclick', this.openZoom);
    // this.find('maximize').on('click', this.openZoom);
    this.find('holder-45')
      .on('mousedown', (e) => {
        return this.onMouseDown(e, 45);
      });
    this.find('holder-135')
      .on('mousedown', (e) => {
        return this.onMouseDown(e, 135);
      });
    this.find('holder-225')
      .on('mousedown', (e) => {
        return this.onMouseDown(e, 225);
      });
    this.find('holder-315')
      .on('mousedown', (e) => {
        return this.onMouseDown(e, 315);
      });
  }
}

export default Resizer;
