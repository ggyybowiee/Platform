/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';
import JsonForm from 'components/JsonForm';
import gridFormSetting from './gridFormSetting';

import {
  Switch,
} from 'antd';

class FormItemGridLayoutInput extends React.Component {
  handleSubmit = (value) => {
    if (!this.props.onChange) {
      return;
    }
    const deleteInvaliValue = (obj) => {
      _.forEach(obj, (v, k) => {
        if (_.isNil(v)) {
          delete obj[k];
        }
        if (_.isObjectLike(v)) {
          deleteInvaliValue(v);
          if (_.isEmpty(v)) {
            delete obj[k];
          }
        }
      });
    };
    deleteInvaliValue(value);
    this.props.onChange(value);
  }

  render() {
    const { value } = this.props;

    return (
      <JsonForm
        {...gridFormSetting}
        data={value || {}}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

FormItemGridLayoutInput.properties = {
};

FormItemGridLayoutInput.info = {
  name: '表单网格配置器',
  category: '网格',
};

FormItemGridLayoutInput.validatorRules = [{
  type: 'object',
}];

FormItemGridLayoutInput.structure = {
  type: 'object',
};

export default FormItemGridLayoutInput;
