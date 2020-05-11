import React from 'react';
import { Menu, Icon } from 'antd';
import styles from './index.less';

const SwitchApp = ({ currentOption, options, valueField, labelField, iconField = 'resource', onSwitch, ...otherProps }) => (
  <Menu
    onClick={({ key }) => onSwitch(key, otherProps)}
    selectedKeys={[currentOption && currentOption[valueField]]}
    mode="horizontal"
    className={styles.appSwitch}
  >
    {
      _.map(options, opt => (
        <Menu.Item key={opt[valueField]}>
          <Icon style={{ fontSize: 15 }} type={opt[iconField]} /> {opt[labelField]}
        </Menu.Item>
      ))
    }
  </Menu>
);

export default SwitchApp;
