import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import classnames from 'classnames';
import dataTransform from 'services/dataTransform';
import SuperInput from '../../../SuperInput';
import styles from './index.less';

class WithClear extends React.Component {

  handleClear = () => {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange(null);
  }

  render() {
    const {
      type,
      clearText = '不限',
      compType,
      value,
      extraInput,
      ...inputProps
    } = this.props;
    const Comp = compType ? SuperInput.CompMap[compType] : SuperInput.DefaultComp;
    let extraInputElt = null;
    if (extraInput) {
      let extraInputValue = value;
      if (extraInput.valueDataType) {
        extraInputValue = typeof value === extraInput.valueDataType ? value : null;
      }
      extraInputElt = (
        <span>
          {extraInput.label ? `${extraInput.label}:` : ''} <SuperInput value={extraInputValue} {...inputProps} {...extraInput} />
        </span>
      );
    }

    return (
      <div className={styles.clearBtnContainer}>
        <span type="primary" onClick={this.handleClear} className={classnames(styles.clearBtn, { [styles.selected]: _.isEmpty(value) })}>{clearText}</span>
        <Comp {...inputProps} value={value} />
        {extraInputElt}
      </div>
    );
  }
}

WithClear.info = {
  name: '含清除按钮',
  category: '特殊',
};

WithClear.validatorRules = [];

WithClear.structure = {
  type: 'any',
};

export default WithClear;
