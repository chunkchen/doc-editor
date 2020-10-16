import React from 'react';
import { Button, Select } from 'antd';
import 'antd/lib/select/style';
import 'antd/lib/button/style';

class Translate extends React.Component {
  state = {
    targetPlainText: '',
    errorMsg: null,
  }

  constructor() {
    super();
    this.source = 'auto';
    this.target = 'en';
    this.events = [];
  }

  /**
   * 用于收敛 DOM 事件，便于插件销毁时，解除事件
   * @param  {object} element - 用 $ 包装过的虚拟 DOM
   * @param  {string} type - 事件类型
   * @param  {function} callback - 回掉函数
   */
  _bindEvent(element, type, callback) {
    element.on(type, callback);
    this.events.push({
      element,
      callback,
      type,
    });
  }

  // 移除事件
  _removeEvent() {
    this.events.forEach((_ref) => {
      const { element, type, callback } = _ref;
      element.off(type, callback);
    });
  }

  _translate() {
    const engine = this.props.engine;
    const translate = engine.translate;
    const range = engine.change.getRange();

    if (!range) {
      return;
    }
    translate.translate(range, this.source, this.target);
  }

  componentWillMount() {
    const engine = this.props.engine;
    const lang = engine.options.lang;
    if (lang === 'en') this.target = 'zh';
  }

  componentDidMount() {
    const engine = this.props.engine;
    const translate = engine.translate;

    this._translate();

    this._bindEvent(engine, 'select', () => {
      this._translate();
    });

    this._bindEvent(translate, 'success', (_ref) => {
      const { targetPlainText, fragment } = _ref;
      this.fragment = fragment;

      this.setState({
        errorMsg: null,
        targetPlainText,
      });
    });

    this._bindEvent(translate, 'fail', (_ref) => {
      this.setState({
        errorMsg: _ref.errorMsg,
      });
    });
  }

  componentWillUnmount() {
    this._removeEvent();
  }

  render() {
    const engine = this.props.engine;
    let targetPlainText = this.state.targetPlainText;
    const errorMsg = this.state.errorMsg;
    const Option = Select.Option;
    const locale = engine.locale.translate;
    const isTargetPlainTextEmpty = !targetPlainText;
    const zhOption = <Option value="zh">{locale.zh}</Option>;
    const enOption = <Option value="en">{locale.en}</Option>;
    targetPlainText = isTargetPlainTextEmpty ? locale.placeholder : targetPlainText;
    return (
      <div>
        <span>{locale.subTitle}</span>
        <br />
        <Select
          style={{
            width: '100%',
            marginTop: '14px',
          }}
          defaultValue={this.source}
          onChange={(e) => {
            this.source = e;
            this._translate();
          }}
        >
          <Option value="auto">{locale.automaticDetection}</Option>
          {zhOption}
          {enOption}
        </Select>
        <br />
        <Select
          style={{
            width: '100%',
            marginTop: '14px',
          }}
          defaultValue={this.target}
          onChange={(e) => {
            this.target = e;
            this._translate();
          }}
        >
          {zhOption}
          {enOption}
        </Select>
        <p style={{ margin: '14px 0px' }}>
          {locale.translation}
          ：
        </p>
        <pre style={{ color: isTargetPlainTextEmpty ? 'rgba(0,0,0,0.25)' : 'inherit' }}>{targetPlainText}</pre>
        {errorMsg && <p style={{ marginBottom: '8px', color: '#CF1322' }}>{errorMsg}</p>}
        <Button
          onClick={() => {
            this.fragment && engine.change.insertFragment(this.fragment.cloneNode(true));
          }}
        >
          {locale.insertDoc}
        </Button>
      </div>
    );
  }
}

export default Translate;
