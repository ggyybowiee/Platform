/**
 * Created by Simon on 2017/6/27 0027.
 */
import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import _ from 'lodash';
import { debounce } from 'lodash-decorators';
import { postApi } from 'utils/request';

import 'brace/mode/typescript';
import 'brace/theme/ambiance';

import Javascript from '../javascript';

const createModuleDefineCode = code => `(
  function () {
    const exports = {};
    const module = { exports };
    (function (module, exports) {
      ${code}
    })(module, exports);

    return module.exports;
  }
)()`;

class CmdModuleDefine extends React.Component {
  state = {
    error: null,
  }

  componentDidMount() {
    this.transformCode();
  }

  componentDidUpdate(nextProps) {
    if ((this.props.value && this.props.value.source) !== (nextProps.value && nextProps.value.source)) {
      this.transformCode();
    }
  }

  @debounce(300)
  async transformCode() {
    const { value } = this.props;
    if (!value) {
      return;
    }
    const sourceCode = value && value.source;
    this.lastSourceCode = sourceCode;

    try {
      const resp = await postApi('/transformEsCode', { code: createModuleDefineCode(sourceCode) });
      if (this.lastSourceCode === sourceCode) {
        return;
      }

      this.props.onChange && this.props.onChange({
        source: sourceCode,
        code: resp.code,
      });
    } catch (err) {
      // TODO: 错误校验提示，做在Func.validatorRules中（添加自定义校验）
      this.setState({
        error: err,
      });
    }
  }

  handleSourceCodeChange = (sourceCode) => {
    this.props.onChange && this.props.onChange({
      source: sourceCode,
      code: this.props.value && this.props.value.code,
    });
  }

  render() {
    const { value, onChange, ...props } = this.props;
    const { error } = this.state;

    return (
      <Javascript
        {...props}
        value={(value && value.source) ? value.source : ''}
        onChange={this.handleSourceCodeChange}
      />
    );
  }
}

CmdModuleDefine.validatorRules = [{ type: 'string' }];

CmdModuleDefine.properties = {
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },

  style: {
    showName: '样式',
    type: 'json',
    defaultValue: JSON.stringify({ height: 100 }, null, '\t'),
  },
};

CmdModuleDefine.info = {
  name: 'CMD模块',
  category: '代码',
};

CmdModuleDefine.structure = {
  type: 'string',
};

export default CmdModuleDefine;
