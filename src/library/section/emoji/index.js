import Engine from 'doc-engine/lib';
import SectionBase from '../base';

class Emoji extends SectionBase {
  constructor(engine) {
    super();
    this.engine = engine;
    this.readonly = !engine;
  }

  handleClick = () => {
    this.engine.change.focusSection(this.sectionRoot);
  }

  select() {
  }

  render(container, value) {
    value = Engine.StringUtils.sanitizeUrl(value);
    const img = '<img class="lake-emoji" src="'.concat(Engine.StringUtils.escape(value), '" />');
    container.append(img);

    if (this.readonly) {
      return;
    }

    this.container.on('click', this.handleClick);
  }
}

Emoji.type = 'inline';
Emoji.selectStyleType = 'background';
Emoji.singleSelectable = false;
Emoji.canCollab = true;
export default Emoji;
