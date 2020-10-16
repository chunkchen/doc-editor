import React from 'react';
import classnames from 'classnames';
import Engine from '../editor/engine';

class TocSidebar extends React.Component {
  constructor() {
    super();

    this.handleClick = (e, id) => {
      const engine = this.props.engine;
      e.preventDefault();
      const root = Engine.$(this.root.current);
      const currentItem = Engine.$(e.target).closest('.itellyou-toc-item');
      const itemList = root.find('a[href="#'.concat(id, '"]'));
      let itemIndex = 0;
      itemList.each((item, index) => {
        if (item === currentItem[0]) {
          itemIndex = index;
          return false;
        }
      });
      root.find('.itellyou-toc-item-active').removeClass('itellyou-toc-item-active');
      itemList.eq(itemIndex).addClass('itellyou-toc-item-active');
      const block = engine.container.find('[id="'.concat(id, '"]')).eq(itemIndex);
      const contentArea = engine.container.closest('.itellyou-max-editor-wrapper-content');
      const toolbarArea = engine.container.closest('.itellyou-max-editor').find('.itellyou-toolbar');
      // 需要减掉工具栏和上面元素的高度
      contentArea[0].scrollTop += block.offset().top - toolbarArea.offset().top - toolbarArea[0].clientHeight;
    };

    this.root = React.createRef();
  }

  render() {
    return (
      <div className="itellyou-toc" ref={this.root}>
        {
          this.props.data.map((data, index) => {
            return (
              <a
                key={index}
                href={`#${data.id}`}
                className={classnames('itellyou-toc-item', 'itellyou-toc-item-'.concat(data.depth))}
                onClick={(e) => {
                  return this.handleClick(e, data.id);
                }}
              >
                {data.text}
              </a>
            );
          })
        }
      </div>
    );
  }
}

export default TocSidebar;
