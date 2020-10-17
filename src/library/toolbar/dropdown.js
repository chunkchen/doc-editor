import React from 'react';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import 'antd/lib/tooltip/style';

class Dropdown extends React.Component {
  constructor() {
    super();
    this.onSelect = (e, value) => {
      e.preventDefault();
      e.stopPropagation();
      this.props.onSelect(value);
    };
  }

  render() {
    let { name, data, active, currentValue, className, engine } = this.props;
    const withDot = name !== 'emoji' && name !== 'table:emoji';
    const emoji = name === 'emoji' || name === 'table:emoji';
    const isIconList = className === 'lake-button-icon-list';

    const options = engine.options.emoji || {};
    const emojiUrl = options.action || '/emoji/';

    if (!Array.isArray(currentValue)) {
      currentValue = [currentValue];
    }

    return (
      <div className={classnames('lake-button-set-list', {
        'lake-button-set-list-active': active,
        'lake-button-set-list-with-dot': withDot,
        'lake-button-set-list-emoji-mini': emoji,
      })}
      >
        {
          data.map((row, index) => {
            if (emoji) {
              return (
                <a
                  key={index}
                  className={classnames('lake-button-set-list-item', row.className)}
                  onClick={(e) => {
                    return this.onSelect(e, row.point);
                  }}
                >
                  <img src={`${emojiUrl + row.point}.svg`} />
                </a>
              );
            }

            if (isIconList) {
              return (
                <Tooltip
                  key={index}
                  title={row.shortcut}
                  placement="right"
                >
                  <a
                    className={classnames('lake-button-set-list-item', row.className)}
                    onClick={(e) => {
                      return this.onSelect(e, row.key);
                    }}
                  >
                    {currentValue.indexOf(row.key) >= 0 && <span className="lake-icon lake-icon-dot" />}
                    <span dangerouslySetInnerHTML={{ __html: row.icon }} />
                    <span style={{ fontSize: 12 }}>{row.title}</span>
                  </a>
                </Tooltip>
              );
            }

            return (
              <a
                key={index}
                className={classnames('lake-button-set-list-item', row.className)}
                onClick={(e) => {
                  return this.onSelect(e, row.key);
                }}
              >
                {currentValue.indexOf(row.key) >= 0 && <span className="lake-icon lake-icon-dot" />}
                <span>{row.value}</span>
              </a>
            );
          })
        }
      </div>
    );
  }
}

export default Dropdown;
