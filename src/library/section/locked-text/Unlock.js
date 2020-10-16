import React from 'react';
import { Input } from 'antd';
import 'antd/lib/input/style';
import 'antd/lib/icon/style';
import { UnlockOutlined } from '@ant-design/icons';

class Unlock extends React.Component {
  changeUnlockPassword = (e) => {
    this.password = e.target.value;
  };

  unLock = () => {
    this.props.onUnlock(this.password);
  };

  onPressEnter = (e) => {
    this.props.onUnlock(e.target.value);
  };

  render() {
    return (
      <div className="unlock-panel">
        <div className="lock-icon" />
        <p>
          <Input
            type="password"
            placeholder={this.props.locale.unlockInputPlaceholder}
            onChange={this.changeUnlockPassword}
            onPressEnter={this.onPressEnter}
            addonAfter={(
              <span className="unlock-btn" onClick={this.unLock}>
                <UnlockOutlined />
                {this.props.locale.unlock}
              </span>
            )}
          />
        </p>
        <p className="error-info">{this.props.locale.errorFeedback}</p>
        <p className="lock-info">{this.props.locale.lockedFeedback}</p>
      </div>
    );
  }
}

export default Unlock;
