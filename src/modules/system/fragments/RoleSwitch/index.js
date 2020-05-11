import React from 'react';
import { connect } from 'dva';
import HeaderSwitchMenu from 'components/HeaderSwitchMenu';
import config from '../../config';

export default connect(state => ({
  options: _.get(state, 'auth.roles'),
  currentOption: _.get(state, 'auth.currentRole'),
  onSwitch: (key, props) => {
    return props.dispatch({
      type: 'roles/switchRole',
      payload: key,
    });
  },
}))(HeaderSwitchMenu);
