import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import throttle from 'lodash/throttle';
import ToolbarMore from './toolbar-more';

class ToolbarPlugins extends React.Component {
  constructor() {
    super();
    this.onResize = () => {
      const setContainerWidth = throttle(() => {
        this.setState({
          menuContainerWidth: this.getMenuContainerWidth(),
        });
      }, 200, {
        leading: false,
      });
      setContainerWidth();
    };
    this.rootRef = React.createRef();
    this.calcWidthTimeout = null;
  }

  state = {
    elementWidths: null,
    menuContainerWidth: null,
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false);
    this.calcWidthTimeout = setTimeout(() => {
      this.updateContainerWidth();
    }, 200);
  }

  componentDidUpdate(prevProps) {
    if (this.props.toolbarLength !== prevProps.toolbarLength) {
      this.setState({
        elementWidths: null,
      }, () => {
        this.updateContainerWidth();
      });
    }
  }

  updateContainerWidth() {
    let elementWidths = this.state.elementWidths;
    if (!elementWidths) {
      const domNode = ReactDOM.findDOMNode(this);
      const menuContainerWidth = this.getMenuContainerWidth();
      elementWidths = Array.prototype.map.call(domNode.children, (childDomNode) => {
        return childDomNode.clientWidth;
      });
      this.setState({
        elementWidths,
        menuContainerWidth,
      });
    }
  }

  getMenuContainerWidth() {
    const width = this.rootRef.current.parentElement.clientWidth;
    const moreWidth = 50;
    return width - moreWidth;
  }

  componentWillUnmount() {
    if (this.calcWidthTimeout) {
      clearTimeout(this.calcWidthTimeout);
    }
    window.removeEventListener('resize', this.onResize, false);
  }

  findMoreBoundary() {
    const { elementWidths, menuContainerWidth } = this.state;
    const length = Object.keys(elementWidths).length;
    let index = -1;
    let width = 0;
    for (let o = 0; length - 1 > o; o++) {
      width += elementWidths[o];
      if (width + elementWidths[o + 1] > menuContainerWidth) {
        index = o;
        break;
      }
    }
    return index;
  }

  render() {
    const { children, hasMore } = this.props;
    const { elementWidths } = this.state;
    let pluginItems = [];
    const morePluginItems = [];

    if (hasMore && elementWidths) {
      const boundary = this.findMoreBoundary();
      if (boundary === -1) {
        pluginItems = children;
      } else {
        React.Children.map(children, (element, index) => {
          if (React.isValidElement(element)) {
            if (index > boundary) {
              morePluginItems.push(element);
            } else {
              pluginItems.push(element);
            }
          }
        });
      }
    } else {
      pluginItems = children;
    }

    return (
      <div className={classnames('lake-toolbar-content-plugins', {
        'lake-toolbar-content-plugins-hide': !this.state.elementWidths,
      })}
        ref={this.rootRef}
      >
        {pluginItems}
        <ToolbarMore>{morePluginItems}</ToolbarMore>
      </div>
    );
  }
}

export default ToolbarPlugins;
