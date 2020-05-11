import React from 'react';
import { update } from 'lodash/fp';
import { Input } from 'antd';
import styles from './index.less';

class Ip extends React.PureComponent {
  state = {
    inputArr: new Array(4)
  };

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setState({
        inputArr: value.split('.'),
      })
    } else {
      this['input0'].focus(); // ip第一个input聚焦
    }
  }

  handleInputChange = (e,value, key) => {
    const { id, form: { setFieldsValue, validateFields } } = this.props;
    const { inputArr } = this.state;
    
    let finalValue = '';
    finalValue = value.replace(/\D/g, '');

    if (key === this.state.inputArr.length - 1 || value.length > 3) {
      finalValue = finalValue.substr(0, 3);
    }

    const updateInput = update(key)(() => finalValue);

    const newInputArr = updateInput(inputArr);

    this.setState({
      inputArr: newInputArr,
    });

    setFieldsValue && setFieldsValue({
      [id]: newInputArr.join('.'),
    });

    validateFields();
    
  }

  handleInputKeyUp = (e, value, key) => {
    const { inputArr } = this.state;
    // ">", ".", "space"
    const keyCodeArr = [190, 110, 32];

    const codeIsClick = _.chain(keyCodeArr)
                          .map(key => e.keyCode === key)
                          .some()
                          .value();

    if ((key !== inputArr.length - 1) && ((codeIsClick && value.length > 0) || (inputArr[key] && inputArr[key].length >= 3))) {
      this[`input${key + 1}`].focus();
    }

    // "backspace"
    if (e.keyCode === 8 && (key !== 0) && value.length === 0) {
      this[`input${key - 1}`].focus();
    }
  }

  render() {
    return (
      <div>
        {
          _.map(this.state.inputArr, (value, key) => {
            return (
              <span className={styles.dot}>
                <Input
                  disabled={this.props.disabled}
                  ref={ (ref) =>  this[`input${key}`] = ref }
                  value={value}
                  onChange={ (e)=> this.handleInputChange(e, e.target.value, key)} 
                  style={{ width: '21%' }}
                  onKeyUp={ (e) => this.handleInputKeyUp(e, e.target.value, key)}
                />
              </span>
            )
          })
        }
      </div>
    );
  }
}

Ip.properties = {
  rules: {
    showName: '验证规则',
    type: 'optionArray',
  },
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
};

Ip.info = {
  name: 'IP地址',
  category: '文本',
};

Ip.structure = {
  type: 'string',
};

export default Ip;
