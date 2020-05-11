import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Menu, Dropdown, Icon, Avatar, Spin } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

const SwitchMenu = ({ options, currentOption = {}, valueField, labelField, iconField, renderOpt, ...otherProps }) => (
  <Menu className={styles.menu} selectedKeys={[]} {...otherProps}>
    {
      _.map(options, opt => (
        <Menu.Item key={opt[valueField]} disabled={currentOption[valueField] === opt[valueField]}>
          {renderOpt ? renderOpt(opt[labelField], opt) : (
            <span>
              {(iconField && opt[iconField]) ? <Icon type={opt[iconField]} /> : null}
              {opt[labelField]}
            </span>
          )}
        </Menu.Item>
      ))
    }
  </Menu>
);

class HeaderSwitchMenu extends React.Component {
  handleMenuItemClick = ({ key: optKey }) => {
    if (this.props.onSwitch) {
      this.props.onSwitch(optKey, this.props);
    }
  }

  render() {
    const { icon, options, currentOption = {}, valueField, labelField, avatarField, iconField, renderOpt } = this.props;
    const menu = <SwitchMenu currentOption={currentOption} options={options} onClick={this.handleMenuItemClick} valueField={valueField} labelField={labelField} iconField={iconField} renderOpt={renderOpt} />;

    return currentOption
      ? (
        <Dropdown overlay={menu}>
          <span className={classnames('header-right-action', styles.account)}>
            {
              currentOption[avatarField]
                ? <Avatar size="small" className={styles.avatar} src={currentOption[avatarField]} />
                : <Icon style={{ fontSize: 15 }} type={icon} />
            }
            <span className={styles.name}>{currentOption[labelField]}</span>
          </span>
        </Dropdown>
      ) : (
        <Spin size="small" style={{ marginLeft: 8 }} />
      );
  }
}

export default HeaderSwitchMenu;
