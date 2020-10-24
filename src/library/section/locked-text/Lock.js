import React from 'react';
import { Button, Input, message } from 'antd';

const w = /[^a-zA-Z0-9`~!@#$%\\^&*()_+-={}|\\[\\]\\:";'<>?,\.\/]/;

class Lock extends React.Component {
  changeLockPassword = (e) => {
    this.password = e.target.value;
  }

  lock = () => {
    if (!this.password) {
      message.error(this.props.locale.noPassword);
      return;
    }
    if (this.password.match(w)) {
      message.error(this.props.locale.passwordPattern);
    } else this.props.onLock(this.password);
  }

  render() {
    return (
      <div className="lock-panel">
        <div className="lock-icon" />
        <p className="lock-title">{this.props.locale.lockInputTitle}</p>
        <p>
          <Input
            placeholder={this.props.locale.lockInputPlaceholder}
            onChange={this.changeLockPassword}
          />
        </p>
        <p>
          <Button
            type="primary"
            onClick={this.lock}
          >
            {this.props.locale.ok}
          </Button>
          <Button
            onClick={this.props.onCancelLock}
          >
            {this.props.locale.cancel}
          </Button>
        </p>
      </div>
    );
  }
}

export default Lock;
