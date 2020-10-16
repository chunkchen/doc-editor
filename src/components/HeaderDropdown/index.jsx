import { Dropdown } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const HeaderDropdown = ({ ...restProps }) => (
  <Dropdown overlayClassName={classNames(styles.container)} {...restProps} />
);

export default HeaderDropdown;
