/**
 * Created by Simon on 2017/6/27 0027.
 */
import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import _ from 'lodash';

import 'brace/mode/typescript';
import 'brace/theme/ambiance';

class Javascript extends React.Component {
  // handleChange = v => {
  //   this.props.onChange && this.props.onChange(v ? JSON.parse(v) : null)
  // }

  render() {
    const { value, onChange, height = 300, ...props } = this.props;
    return (
      <AceEditor
        mode="typescript"
        theme="ambiance"
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{
          height,
          width: '100%',
        }}
        onChange={onChange}
        name={props.id}
        value={value || props.defaultValue}
        editorProps={{$blockScrolling: true}}
      />
    );
  }
}

Javascript.validatorRules = [{ type: 'string' }];

Javascript.properties = {
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

Javascript.info = {
  name: 'Javascript',
  category: '代码',
};

Javascript.structure = {
  type: 'string',
};

export default Javascript;
