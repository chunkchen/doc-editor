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
    let { data, active, currentValue, className } = this.props;
    const isIconList = className === 'lake-button-icon-list';

    if (!Array.isArray(currentValue)) {
      currentValue = [currentValue];
    }

    return (
      <div className={classnames('lake-button-set-list', {
        'lake-button-set-list-active': active,
        'lake-button-set-list-with-dot': true,
      })}
      >
        {
          data.map((row, index) => {
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
                    {currentValue.indexOf(row.key) >= 0 && <span className="lake-icon lake-icon-dot"/>}
                    <span dangerouslySetInnerHTML={{ __html: row.icon }}/>
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
                {currentValue.indexOf(row.key) >= 0 && <span className="lake-icon lake-icon-dot"/>}
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
