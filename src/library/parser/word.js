import Engine from '@hicooper/doc-engine/lib';
import ExportParser from './export';
import { loadImage } from '../utils/dom';
import { lists } from './utils';

class WordParser extends ExportParser {
  async after(element) {
    const tables = element.find('table');
    const images = element.find('img');
    tables.css('width', ''.concat(560, 'px'));
    const widthArray = [];
    tables.each((table) => {
      table = Engine.$(table);
      const colgroup = table.find('colgroup');
      const colgroupChildren = colgroup.children();
      let colgroupWidth = 0;
      colgroupChildren.each((child) => {
        const width = parseInt(child.getAttribute('width'));
        colgroupWidth += width;
      });
      for (let i = 0; i < colgroupChildren.length; i++) {
        const width = parseInt(colgroupChildren[i].getAttribute('width'));
        widthArray.push(parseInt(width / colgroupWidth * 560));
      }
      table.find('tr')
        .each((tr) => {
          Engine.$(tr)
            .children()
            .each((td, index) => {
              td.setAttribute('width', widthArray[index]);
            });
        });
      colgroup.remove();
    });
    images.each((img) => {
      if (img.style.width && img.style.height) {
        img.width = parseInt(img.style.width);
        img.height = parseInt(img.style.height);
        img.style['background-color'] = '';
        img.style['background-repeat'] = '';
        img.style['background-position'] = '';
        img.style['background-image'] = '';
      }
    });
    for (let i = 0; i <= images.length; i++) {
      const img = images[i];
      const src = img.getAttribute('src');
      if (src && src.endsWith('.svg')) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = await loadImage(src);
        canvas.width = 2 * image.width;
        canvas.height = 2 * image.height;
        canvas.style.width = `${image.width}px`;
        canvas.style.height = `${image.height}px`;
        context.drawImage(image, 0, 0, 2 * image.width, 2 * image.height);
        img.src = canvas.toDataURL();
        if (!img.style.width) {
          img.style.width = `${image.width}px`;
        }
        if (!img.style.height) {
          img.style.height = `${image.height}px`;
        }
      }
    }
    this.done();
  }

  done() {
  }

  parseLists(element) {
    return lists(element);
  }
}

export default WordParser;
