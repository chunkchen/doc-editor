import React from 'react';
import Engine from 'doc-engine/lib';
import { Tooltip } from 'antd';
import 'antd/lib/tooltip/style';

class Toolbar extends React.Component {
  render() {
    const { locale, onChange, onFocus, onBlur, code, options } = this.props;
    return (
      <div>
        <textarea
          onFocus={onFocus}
          onBlur={onBlur}
          defaultValue={code}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        />
        <div className="itellyou-math-editor-toolbar">
          <div className="itellyou-math-editor-toolbar-tips">
            {
              options && options.help && (
                <a
                  className="text"
                  href={options.help.href}
                  target="_blank"
                >
                  <span className="itellyou-icon itellyou-icon-question" />
                  {Engine.StringUtils.escape(options.help.text)}
                </a>
              )
            }

          </div>
          <div className="itellyou-embed-toolbar itellyou-embed-toolbar-inline itellyou-embed-toolbar-active">
            <Tooltip title={locale.enterTooltips}>
              <a className="itellyou-embed-toolbar-btn" data-role="save">
                <span className="text">
                  {Engine.StringUtils.escape(locale.save)}
                </span>
              </a>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default Toolbar;
