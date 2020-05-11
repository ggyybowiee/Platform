/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';
import JsonForm from 'components/JsonForm';
import gridFormSetting from './gridFormSetting';

import {
  Switch,
} from 'antd';

class GridRowInput extends React.Component {

  render() {
    const { value, onChange } = this.props;

    return (
      <JsonForm
        {...gridFormSetting}
        data={value || {}}
        onSubmit={onChange}
      />
    );
  }
}

GridRowInput.properties = {
};

GridRowInput.info = {
  name: '网格行输入器',
  category: '网格',
};

GridRowInput.validatorRules = [{
  type: 'object',
}];

GridRowInput.structure = {
  type: 'object',
};

export default GridRowInput;
