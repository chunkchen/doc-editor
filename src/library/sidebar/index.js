import React from 'react';
import classnames from 'classnames';
import Engine from '../editor/engine';
import Toc from './toc';
import Image from './image';
import Translate from './translate';
import LocalDoc from './localdoc';
import Video from './video';

class Sidebar extends React.Component {
  constructor() {
    super();
    this.extends = () => {
      this.props.engine.sidebar = {
        set: this.set,
        close: this.close,
        store: this.store,
        restore: this.restore,
      };
    };

    this.set = (state) => {
      if (!state) {
        this.close();
      }
      const {engine} = this.props;
      this.setState(state);
      localStorage.setItem('lake-sidebar', state.name);
      engine.toolbar.updateState();
      engine.sidebar.activate = state.name;
    };

    this.close = () => {
      this.setState({
        name: 'none',
      });
      localStorage.setItem('lake-sidebar', 'none');
    };

    this.store = (config) => {
      const {engine} = this.props;
      this.storeConfig = config;
      engine.sidebar.storeConfig = config;
    };

    this.restore = () => {
      this.set(this.storeConfig);
    };

    this.contentNode = React.createRef();
    this.state = {
      name: 'none',
    };
  }

  componentDidMount() {
    const {engine} = this.props;
    this.extends();
    engine.command.execute('toc', true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.name !== prevState.name && this.state.name === 'toc') {
      new Engine.Scrollbar(Engine.$(this.contentNode.current), false, true);
    }
  }

  render() {
    const {name, title, data, className, showCloseBtn} = this.state;
    const {engine} = this.props;
    const contentProps = {
      engine,
      data,
    };
    return name === 'none' ? null : (
      <div
        className={classnames('lake-sidebar', 'lake-sidebar-active', 'lake-common-sidebar', className)}
        data-lake-element="sidebar"
        ref={e => this.current = e}
      >
        <div className="lake-sidebar-title">
          {title}
          {
            showCloseBtn !== false
            && (
              <div
                className="lake-sidebar-close"
                onClick={this.close}
              >
                <span className="lake-icon lake-icon-close"/>
              </div>
            )
          }
        </div>
        <div
          className="lake-sidebar-content"
          ref={this.contentNode}
        >
          {name === 'toc' && <Toc {...contentProps} />}
          {name === 'image' && <Image {...contentProps} />}
          {name === 'translate' && <Translate {...contentProps} />}
          {name === 'localdoc' && <LocalDoc {...contentProps} />}
          {name === 'video' && <Video {...contentProps} />}
        </div>
      </div>
    );
  }
}

export default Sidebar;
