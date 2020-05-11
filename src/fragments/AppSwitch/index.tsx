import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { App } from '../../classes/App.interface';
import config from '../../config';
import DropDownSwitch from './DropDownSwitch';
import HorizontalMenuSwitch from './HorizontalMenuSwitch';

const selectPropsFromState = (state) => {
  const options: App[] = _.get(state, 'global.apps');
  const currentApp = _.get(state, 'global.app');
  const currentOption = _.find(options, { code: currentApp });

  const onSwitch = (key, props) => {
    return props.dispatch({
      type: 'permissions/switchApp',
      payload: _.find(options, { code: key }),
    });
  }

  return {
    options,
    currentOption,
    onSwitch,
  };
};

export default connect(selectPropsFromState)((props) => {
  const Comp = config.get('appSwitchType') === 'dropDown' ? DropDownSwitch : HorizontalMenuSwitch;

  return (
    <Comp
      {...props}
      valueField="code"
      labelField="name"
      iconField="icon"
    />
  );
});
