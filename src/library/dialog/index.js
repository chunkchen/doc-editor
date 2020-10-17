import React from 'react';
import Engine from 'doc-engine/lib';
import Search from './search';

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.onEsc = (e) => {
      if (Engine.isHotkey('esc', e)) {
        this.close();
      }
    };

    this.extends = () => {
      this.props.engine.dialog = {
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
      const { engine } = this.props;
      this.setState(state);
      localStorage.setItem('lake-dialog', state.name);
      engine.toolbar.updateState();
    };

    this.close = () => {
      this.setState({
        name: 'none',
      });
      localStorage.setItem('lake-dialog', 'none');
    };

    this.store = (config) => {
      const { engine } = this.props;
      this.storeConfig = config;
      engine.dialog.storeConfig = config;
    };

    this.restore = () => {
      this.set(this.storeConfig);
    };

    this.state = {
      name: 'none',
    };
  }

  componentDidMount() {
    Engine.$(document).on('keydown', this.onEsc);
    this.extends();
  }

  componentWillUnmount() {
    Engine.$(document).off('keydown', this.onEsc);
  }

  render() {
    const { name } = this.state;
    return name === 'none' ? null
      : (
        <div
          className="lake-dialog"
        >
          {name === 'search' && <Search {...this.props} onClose={this.close} />}
        </div>
      );
  }
}

export default Dialog;
